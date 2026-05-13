const express = require("express");
const Busboy = require("busboy");
const db = require("../db");
const importService = require("../services/importService");

const router = express.Router();

/**
 * Custom multipart parser to handle Firebase Functions pre-parsing (req.rawBody)
 */
const parseMultipart = (req) => {
  return new Promise((resolve, reject) => {
    try {
      const busboy = Busboy({ headers: req.headers });
      const result = { fields: {}, file: null };

      busboy.on("file", (fieldname, file, info) => {
        const { filename, encoding, mimeType } = info;
        const chunks = [];
        file.on("data", (data) => chunks.push(data));
        file.on("end", () => {
          if (chunks.length > 0) {
            result.file = {
              buffer: Buffer.concat(chunks),
              originalname: filename,
              mimetype: mimeType,
              fieldname
            };
          }
        });
      });

      busboy.on("field", (fieldname, val) => {
        result.fields[fieldname] = val;
      });

      busboy.on("finish", () => resolve(result));
      busboy.on("error", (err) => reject(err));

      if (req.rawBody) {
        busboy.end(req.rawBody);
      } else {
        req.pipe(busboy);
      }
    } catch (err) {
      reject(err);
    }
  });
};

// 1. Analyze Import (Pre-fetch headers and sample rows)
// POST /api/imports/analyze
router.post("/analyze", async (req, res) => {
  try {
    const isMultipart = req.headers["content-type"]?.includes("multipart/form-data");
    let fields = req.body;
    let file = req.file;

    if (isMultipart) {
      const parsed = await parseMultipart(req);
      fields = parsed.fields;
      file = parsed.file;
    }

    const { url, sourceMethod, headerRow, sheetName } = fields;
    console.log(`[Import] Analyzing ${sourceMethod} from ${url || 'local file'}`);
    
    const hRow = parseInt(headerRow) || 1;
    let buffer;

    if (sourceMethod === "local" && file) {
      buffer = file.buffer;
    } else if (sourceMethod === "url" && url) {
      buffer = await importService.downloadFromDrive(url);
    } else {
      return res.status(400).json({ error: "Missing file or URL for analysis" });
    }

    const { headers, rows, sheetNames, currentSheet } = importService.parseSpreadsheet(buffer, hRow, sheetName);
    
    // Return a sample of rows for the mapping step
    res.json({
      headers,
      sampleRows: rows.slice(0, 15),
      totalRows: rows.length,
      sheetNames,
      currentSheet,
      fileId: Date.now().toString(), // Temporary reference for the session
      rawData: rows 
    });
  } catch (error) {
    console.error("Analysis Error:", error.message);
    res.status(500).json({ error: error.message || "Failed to analyze file" });
  }
});

// 2. Validate Mapping (Cross-reference with students)
// POST /api/imports/validate
router.post("/validate", async (req, res) => {
  try {
    const { rows, mapping, section, gradeLevel } = req.body;
    const analysis = await importService.analyzeImport(rows, mapping, section, gradeLevel);
    res.json(analysis);
  } catch (error) {
    console.error("Validation Error:", error.message);
    res.status(500).json({ error: "Failed to validate import data" });
  }
});

// 3. Confirm and Save
// POST /confirm
router.post("/confirm", async (req, res) => {
  try {
    const { rows, mapping, section, gradeLevel, schoolYear, quarter, skipErrors, overwrite } = req.body;
    
    let successCount = 0;
    let skipCount = 0;

    await db.tx(async t => {
      // 1. Log the import start
      const sectionRow = await t.oneOrNone("SELECT id FROM sections WHERE name = $1", [section]);
      const syRow = await t.oneOrNone("SELECT id FROM school_years WHERE label = $1", [schoolYear]);
      
      if (!sectionRow) throw new Error("Section not found");
      if (!syRow) throw new Error("School year not found");

      const logRecord = await t.one(
        "INSERT INTO import_logs (school_year_id, section_id, quarter_number, source_url, status) VALUES ($1, $2, $3, $4, 'processing') RETURNING id",
        [syRow.id, sectionRow.id, quarter, "imported"]
      );
      const logId = logRecord.id;

      for (const [target, source] of Object.entries(mapping)) {
        await t.none(
          "INSERT INTO column_mappings (import_log_id, source_column, target_field) VALUES ($1, $2, $3)",
          [logId, source, target]
        );
      }

      // 2. Perform Validation again to ensure latest student data
      const analysis = await importService.analyzeImport(rows, mapping, section, gradeLevel);

      // 3. Process Rows
      for (const item of analysis) {
        if (item.status === "error" && !skipErrors) {
          skipCount++;
          continue;
        }
        if (item.status === "error") {
          skipCount++;
          continue;
        }

        // Get or create academic_record first
        let arId = null;
        const enroll = await t.oneOrNone(`
          SELECT e.id, ar.id as ar_id FROM enrollments e
          JOIN school_years sy ON e.school_year_id = sy.id
          JOIN sections sec ON e.section_id = sec.id
          LEFT JOIN academic_records ar ON ar.enrollment_id = e.id
          WHERE e.student_id = $1 AND sy.label = $2 AND sec.name = $3
        `, [item.studentId, schoolYear, section]);

        if (enroll) {
          if (enroll.ar_id) {
            arId = enroll.ar_id;
          } else {
            const newAr = await t.one(`
              INSERT INTO academic_records (enrollment_id) VALUES ($1)
              ON CONFLICT (enrollment_id) DO UPDATE SET updated_at = NOW() RETURNING id
            `, [enroll.id]);
            arId = newAr.id;
          }

          // Save quarterly average and letter grade if present
          const avgCol = `q${quarter}_average`;
          const letterCol = `q${quarter}_letter`;
          const avgVal = item.grades["averageGrade"];
          const letterVal = item.grades["letterGrade"];

          if (avgVal !== undefined || letterVal !== undefined) {
            const updateFields = [];
            const updateValues = [arId];
            let valIdx = 2;

            if (avgVal !== undefined) {
              updateFields.push(`${avgCol} = $${valIdx++}`);
              updateValues.push(avgVal);
            }
            if (letterVal !== undefined) {
              updateFields.push(`${letterCol} = $${valIdx++}`);
              updateValues.push(letterVal);
            }
            updateFields.push(`updated_at = NOW()`);

            await t.none(`
              UPDATE academic_records SET ${updateFields.join(", ")} WHERE id = $1
            `, updateValues);
          }
        }

        // Encode each grade
        for (const [subjCode, grade] of Object.entries(item.grades)) {
          if (subjCode === "averageGrade" || subjCode === "letterGrade") continue;
          
          // Find subject ID by code and grade level
          const subj = await t.oneOrNone("SELECT id FROM subjects WHERE code = $1 AND grade_level = $2", [subjCode, gradeLevel]);
          if (!subj) continue;

          const qCol = `q${quarter}_grade`;

          if (arId) {
            // Atomic UPSERT for the grade
            await t.none(`
              INSERT INTO subject_grades (academic_record_id, subject_id, ${qCol}, updated_at)
              VALUES ($1, $2, $3, NOW())
              ON CONFLICT (academic_record_id, subject_id) DO UPDATE SET
                ${qCol} = CASE 
                  WHEN $4 = true OR subject_grades.${qCol} IS NULL THEN EXCLUDED.${qCol}
                  ELSE subject_grades.${qCol}
                END,
                updated_at = NOW()
            `, [arId, subj.id, grade, overwrite]);
          }
        }
        successCount++;
      }

      // 4. Update Log Status
      await t.none("UPDATE import_logs SET status = 'success', total_rows = $1, success_rows = $2 WHERE id = $3", [rows.length, successCount, logId]);
    });

    res.json({ message: "Import completed successfully", successCount, skipCount });
  } catch (error) {
    console.error("Confirm Import Error:", error);
    res.status(500).json({ error: "Failed to process import" });
  }
});
const IMPORT_HISTORY_QUERY = `
  SELECT
    il.id,
    il.source_url       AS "fileUrl",
    COALESCE(il.source_url, 'Unknown File') AS "fileName",
    sec.name            AS section,
    sec.grade_level     AS "gradeLevel",
    sy.label            AS "schoolYear",
    il.quarter_number   AS quarter,
    il.status,
    il.total_rows       AS "rowsTotal",
    il.success_rows     AS "rowsEncoded",
    COALESCE(il.total_rows - il.success_rows, 0) AS "rowsSkipped",
    il.imported_at      AS "importedAt",
    il.error_summary    AS "errors"
  FROM import_logs il
  LEFT JOIN sections sec ON sec.id = il.section_id
  LEFT JOIN school_years sy ON sy.id = il.school_year_id
  ORDER BY il.imported_at DESC
`;

// GET /api/imports (Alias for history or general list)
router.get("/", async (req, res) => {
  try {
    const result = await db.manyOrNone(IMPORT_HISTORY_QUERY);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch imports" });
  }
});

// GET /api/imports/history
router.get("/history", async (req, res) => {
  try {
    const result = await db.manyOrNone(IMPORT_HISTORY_QUERY);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch import history" });
  }
});

// GET /api/imports/:id (Get details of a specific import)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: "Invalid import ID" });
    }
    const result = await db.oneOrNone(`
      SELECT
        il.id,
        il.source_url       AS "fileUrl",
        COALESCE(il.source_url, 'Unknown File') AS "fileName",
        sec.name            AS section,
        sec.grade_level     AS "gradeLevel",
        sy.label            AS "schoolYear",
        il.quarter_number   AS quarter,
        il.status,
        il.total_rows       AS "rowsTotal",
        il.success_rows     AS "rowsEncoded",
        COALESCE(il.total_rows - il.success_rows, 0) AS "rowsSkipped",
        il.imported_at      AS "importedAt",
        il.error_summary    AS "errors"
      FROM import_logs il
      LEFT JOIN sections sec ON sec.id = il.section_id
      LEFT JOIN school_years sy ON sy.id = il.school_year_id
      WHERE il.id = $1
    `, [id]);
    if (!result) return res.status(404).json({ error: "Import log not found" });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch import details" });
  }
});

module.exports = router;