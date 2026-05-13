const express = require("express");
const db = require("../db");

const router = express.Router();

const mapStudent = (s) => {
  if (!s) return s;
  return {
    ...s,
    firstName: s.first_name,
    middleName: s.middle_name,
    lastName: s.last_name,
    nameExtension: s.name_extension,
    birthPlace: s.birth_place,
    motherTongue: s.mother_tongue,
    fatherName: s.father_name,
    motherName: s.mother_name,
    guardianName: s.guardian_name,
    guardianRelationship: s.guardian_relationship,
    contactNumber: s.contact_number,
    elemSchoolName: s.elem_school_name,
    elemSchoolId: s.elem_school_id,
    elemSchoolAddress: s.elem_school_address,
    elemPeptPasser: s.elem_pept_passer,
    elemPeptDate: s.elem_pept_date,
    elemAlsAePasser: s.elem_als_ae_passer,
    elemAlsAeDate: s.elem_als_ae_date,
    elemCompletionDate: s.elem_completion_date,
    elemGenAverage: s.elem_gen_average,
    elemCitation: s.elem_citation,
    altCredentialType: s.alt_credential_type,
    altCredentialRating: s.alt_credential_rating,
    altCredentialExamDate: s.alt_credential_exam_date,
    altCredentialCenter: s.alt_credential_center,
    // Joint enrollment fields
    enrollmentId: s.enrollment_id,
    schoolYear: s.school_year,
    gradeLevel: s.grade_level,
    section: s.section_name,
  };
};

const mapEnrollment = (e) => {
  if (!e) return e;
  return {
    ...e,
    schoolYear: e.school_year,
    gradeLevel: e.grade_level,
    section: e.section_name,
    adviserName: e.adviser_name,
    enrollmentDate: e.enrollment_date,
  };
};

// GET /api/students
// Query params: search, gradeLevel, section, schoolYear, sex, page, limit
router.get("/students", async (req, res) => {
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
      "SELECT * FROM get_students_with_enrollments($1, $2, $3, $4, $5)",
      [gradeLevel || null, section || null, schoolYear || null, sex || null, search || null]
    );
    res.json(students.map(mapStudent));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/students/stats
router.get("/students/stats", async (req, res) => {
  try {
    const stats = await db.one("SELECT * FROM get_student_management_stats()");
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/students/incomplete
router.get("/students/incomplete", async (req, res) => {
  try {
    const students = await db.any("SELECT * FROM get_students_with_incomplete_data()");
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// POST /api/students/bulk
router.post("/students/bulk", async (req, res) => {
  try {
    const { students, schoolYearId, sectionId, gradeLevel } = req.body;
    const result = await db.one(
      "SELECT * FROM bulk_create_students($1::jsonb, $2::int, $3::int, $4::smallint)",
      [
        JSON.stringify(students),
        schoolYearId || null,
        sectionId || null,
        gradeLevel || null
      ]
    );
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/students/:id
router.get("/students/:id", async (req, res) => {
  try {
    const student = await db.oneOrNone(
      "SELECT * FROM get_student_by_id($1)",
      [req.params.id]
    );
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(mapStudent(student));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// POST /api/students
router.post("/students", async (req, res) => {
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
    res.status(201).json(mapStudent(result));
  } catch (err) {
    console.error(err);
    if (err.code === "23505") return res.status(409).json({ error: "LRN already exists" });
    res.status(500).json({ error: "server error" });
  }
});

// PUT /api/students/:id
router.put("/students/:id", async (req, res) => {
  try {
    const result = await db.oneOrNone(
      "SELECT * FROM update_student($1,$2)",
      [req.params.id, req.body]
    );
    if (!result) return res.status(404).json({ error: "Student not found" });
    res.json(mapStudent(result));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// DELETE /api/students/:id
router.delete("/students/:id", async (req, res) => {
  try {
    await db.any("SELECT delete_student($1)", [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/students/:id/enrollments
router.get("/students/:id/enrollments", async (req, res) => {
  try {
    const enrollments = await db.any(
      "SELECT * FROM get_student_enrollments($1)",
      [req.params.id]
    );
    res.json(enrollments.map(mapEnrollment));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/students/:id/academic-records
router.get("/students/:id/academic-records", async (req, res) => {
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
router.post("/students/:id/enroll", async (req, res) => {
  try {
    const { schoolYearId, sectionId, gradeLevel, enrollmentDate } = req.body;
    const enrollmentId = await db.one(
      "SELECT enroll_student($1::int,$2::int,$3::int,$4::smallint,COALESCE($5::date, CURRENT_DATE)) AS enrollment_id",
      [req.params.id, schoolYearId, sectionId, gradeLevel, enrollmentDate || null]
    );
    res.status(201).json(enrollmentId);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/students/:id/sf10
router.get("/students/:id/sf10", async (req, res) => {
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

// POST /api/students/:id/transcript
router.post("/students/:id/transcript", async (req, res) => {
  try {
    const { records } = req.body;
    const result = await db.one(
      "SELECT save_student_transcript_history($1, $2) AS result",
      [req.params.id, JSON.stringify(records)]
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;