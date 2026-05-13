const express = require("express");
const db = require("../db");

const router = express.Router();

// Get Class Grade Sheet
// GET /api/grades/class?section=&schoolYear=&quarter=
router.get("/grades/class", async (req, res) => {
  try {
    const { section, schoolYear, quarter } = req.query;
    // Note: section is name (string), schoolYear is label (string), quarter is number
    const result = await db.manyOrNone(`
      SELECT 
        student_id AS "studentId", 
        lrn, 
        full_name AS "fullName", 
        subject_id AS "subjectId", 
        subject_name AS "subjectName", 
        q1_grade AS "q1Grade", 
        q2_grade AS "q2Grade", 
        q3_grade AS "q3Grade", 
        q4_grade AS "q4Grade", 
        final_grade AS "finalGrade", 
        remarks 
      FROM get_class_grade_sheet($1, $2, $3)
    `, [section, schoolYear, quarter]
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch class grade sheet" });
  }
});

// Save Class Grades (Bulk Upsert)
// PUT /api/grades/class
router.put("/grades/class", async (req, res) => {
  try {
    const gradesData = req.body;
    const result = await db.one("SELECT save_class_grades($1::jsonb) AS result", [JSON.stringify(gradesData)]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save class grades" });
  }
});

// Get Student Grades
// GET /api/grades/student/:studentId
router.get("/grades/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await db.manyOrNone(`
      SELECT * FROM public.get_student_sf10_data($1)
    `, [studentId]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch student grades" });
  }
});

// Get General Average
// GET /api/grades/general-average?section=&quarter=
router.get("/grades/general-average", async (req, res) => {
  try {
    const { section, quarter } = req.query;
    // Note: section is name (string), quarter can be "all" or number
    const result = await db.manyOrNone(
      "SELECT * FROM get_general_average($1, $2)",
      [section, quarter]
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch general average" });
  }
});

// Get Encoding Progress
// GET /api/grades/encoding-progress?schoolYearId=&quarter=
router.get("/grades/encoding-progress", async (req, res) => {
  try {
    const { schoolYearId, quarter } = req.query;
    const result = await db.manyOrNone(
      "SELECT * FROM get_encoding_progress($1, $2)",
      [Number(schoolYearId), Number(quarter)]
    );
    res.json(result.map(r => ({
      id: r.section_id,
      name: r.section_name,
      gradeLevel: r.grade_level,
      total: Number(r.total_students),
      encoded: Number(r.encoded_students)
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch encoding progress" });
  }
});

module.exports = router;