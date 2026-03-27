const express = require("express");
const db = require("../db");

const router = express.Router();

// GET /api/students
// Query params: search, gradeLevel, section, schoolYear, sex, page, limit
router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      gradeLevel,
      section,
      schoolYear,
      sex,
      page = 1,
      limit = 50,
    } = req.query;

    const students = await db.any(
      "SELECT * FROM get_students($1, $2, $3, $4, $5, $6, $7)",
      [search, gradeLevel || null, section || null, schoolYear || null, sex || null, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)]
    );
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/students/:id
router.get("/:id", async (req, res) => {
  try {
    const student = await db.oneOrNone(
      "SELECT * FROM get_student_by_id($1)",
      [req.params.id]
    );
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// POST /api/students
router.post("/", async (req, res) => {
  try {
    const {
      lrn, firstName, middleName, lastName, suffix, gender, birthdate,
      birthPlace, nationality, religion, motherTongue,
      address, barangay, municipality, province,
      fatherName, motherName, guardianName, guardianRelationship, contactNumber,
      elemSchoolName, elemSchoolId, elemSchoolAddress,
      elemPeptPasser, elemPeptDate, elemAlsAePasser, elemAlsAeDate,
      elemCompletionDate, elemGenAverage, elemCitation,
      altCredentialType, altCredentialRating, altCredentialExamDate, altCredentialCenter,
    } = req.body;

    const result = await db.one(
      "SELECT * FROM create_student($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32)",
      [
        lrn, firstName, middleName || null, lastName, suffix || null,
        gender, birthdate, birthPlace || null, nationality || "Filipino",
        religion || null, motherTongue || null,
        address || null, barangay || null, municipality || null, province || null,
        fatherName || null, motherName || null,
        guardianName || null, guardianRelationship || null, contactNumber || null,
        elemSchoolName || null, elemSchoolId || null, elemSchoolAddress || null,
        elemPeptPasser || false, elemPeptDate || null,
        elemAlsAePasser || false, elemAlsAeDate || null,
        elemCompletionDate || null, elemGenAverage || null, elemCitation || null,
        altCredentialType || null, altCredentialRating || null,
      ]
    );
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    if (err.code === "23505") return res.status(409).json({ error: "LRN already exists" });
    res.status(500).json({ error: "server error" });
  }
});

// PUT /api/students/:id
router.put("/:id", async (req, res) => {
  try {
    const result = await db.oneOrNone(
      "SELECT * FROM update_student($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33)",
      [
        req.params.id,
        req.body.lrn, req.body.firstName, req.body.middleName || null,
        req.body.lastName, req.body.suffix || null, req.body.gender, req.body.birthdate,
        req.body.birthPlace || null, req.body.nationality || "Filipino",
        req.body.religion || null, req.body.motherTongue || null,
        req.body.address || null, req.body.barangay || null,
        req.body.municipality || null, req.body.province || null,
        req.body.fatherName || null, req.body.motherName || null,
        req.body.guardianName || null, req.body.guardianRelationship || null,
        req.body.contactNumber || null,
        req.body.elemSchoolName || null, req.body.elemSchoolId || null,
        req.body.elemSchoolAddress || null,
        req.body.elemPeptPasser || false, req.body.elemPeptDate || null,
        req.body.elemAlsAePasser || false, req.body.elemAlsAeDate || null,
        req.body.elemCompletionDate || null, req.body.elemGenAverage || null,
        req.body.elemCitation || null,
        req.body.altCredentialType || null, req.body.altCredentialRating || null,
      ]
    );
    if (!result) return res.status(404).json({ error: "Student not found" });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// DELETE /api/students/:id
router.delete("/:id", async (req, res) => {
  try {
    await db.none("SELECT delete_student($1)", [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/students/:id/enrollments
router.get("/:id/enrollments", async (req, res) => {
  try {
    const enrollments = await db.any(
      "SELECT * FROM get_student_enrollments($1)",
      [req.params.id]
    );
    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/students/:id/academic-records
router.get("/:id/academic-records", async (req, res) => {
  try {
    const records = await db.any(
      "SELECT * FROM get_student_sf10_data($1)",
      [req.params.id]
    );
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// POST /api/students/:id/enroll
router.post("/:id/enroll", async (req, res) => {
  try {
    const { schoolYearId, sectionId, gradeLevel, enrollmentDate } = req.body;
    const enrollmentId = await db.one(
      "SELECT enroll_student($1,$2,$3,$4,$5) AS enrollment_id",
      [req.params.id, schoolYearId, sectionId, gradeLevel, enrollmentDate || null]
    );
    res.status(201).json(enrollmentId);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/students/:id/sf10
router.get("/:id/sf10", async (req, res) => {
  try {
    const history = await db.any(
      "SELECT * FROM get_sf10_full_history($1)",
      [req.params.id]
    );
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;