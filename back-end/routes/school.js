const express = require("express");
const db = require("../db");

const router = express.Router();

// ── School Profile ────────────────────────────────────────

// GET /api/school/profile
router.get("/school/profile", async (req, res) => {
  try {
    const school = await db.oneOrNone("SELECT * FROM get_school_profile()");
    res.json(school || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// PUT /api/school/profile
router.put("/school/profile", async (req, res) => {
  try {
    const { name, depedId, district, division, region, address } = req.body;
    const result = await db.one(
      "SELECT * FROM update_school_profile($1,$2,$3,$4,$5,$6)",
      [name, depedId || null, district || null, division || null, region || null, address || null]
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// ── School Years ──────────────────────────────────────────

// GET /api/school/years
router.get("/years", async (req, res) => {
  try {
    const years = await db.any("SELECT * FROM get_school_years()");
    res.json(years.map(y => ({
      id: y.id,
      label: y.label,
      startDate: y.startDate || y.start_date,
      endDate: y.endDate || y.end_date,
      isActive: y.isActive !== undefined ? y.isActive : y.is_active,
      quarters: y.quarters || y.quarters_json || []
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/school/years/:id
router.get("/years/:id", async (req, res) => {
  try {
    const year = await db.oneOrNone(
      "SELECT * FROM get_school_year_by_id($1)",
      [req.params.id]
    );
    if (!year) return res.status(404).json({ error: "School year not found" });
    res.json(year);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// POST /api/school/years
router.post("/years", async (req, res) => {
  try {
    const { label, startDate, endDate, isActive, quarters } = req.body;
    const result = await db.one(
      "SELECT * FROM create_school_year($1,$2,$3,$4,$5)",
      [label, startDate, endDate, isActive || false, JSON.stringify(quarters || [])]
    );
    res.status(201).json({
      id: result.id,
      label: result.label || label,
      startDate: startDate,
      endDate: endDate,
      isActive: isActive || false,
      quarters: quarters || []
    });
  } catch (err) {
    console.error(err);
    if (err.code === "23505") return res.status(409).json({ error: "School year label already exists" });
    res.status(500).json({ error: "server error" });
  }
});

// PUT /api/school/years/:id
router.put("/years/:id", async (req, res) => {
  try {
    const { label, startDate, endDate, isActive, quarters } = req.body;
    const result = await db.oneOrNone(
      "SELECT * FROM update_school_year($1,$2,$3,$4,$5,$6)",
      [req.params.id, label, startDate, endDate, isActive || false, JSON.stringify(quarters || [])]
    );
    if (!result) return res.status(404).json({ error: "School year not found" });
    res.json({
      id: result.id,
      label: result.label || label,
      startDate: startDate,
      endDate: endDate,
      isActive: isActive || false,
      quarters: quarters || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// DELETE /api/school/years/:id
router.delete("/years/:id", async (req, res) => {
  try {
    await db.any("SELECT delete_school_year($1)", [req.params.id]);
    res.json({ result: "deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// ── Sections ──────────────────────────────────────────────

// GET /api/school/sections
// Query params: schoolYearId, gradeLevel
router.get("/sections", async (req, res) => {
  try {
    const { schoolYearId, gradeLevel } = req.query;
    let sections;
    if (schoolYearId || gradeLevel) {
      sections = await db.any(
        "SELECT * FROM get_sections($1,$2)",
        [schoolYearId || null, gradeLevel || null]
      );
    } else {
      sections = await db.any("SELECT * FROM get_sections()");
    }
    res.json(sections.map(s => {
      // Format name if it's "Last, First" or from raw columns
      const adviserName = s.adviser_name && s.adviser_name.includes(",") 
        ? s.adviser_name.split(",").map(part => part.trim()).reverse().join(" ")
        : s.adviser_name;

      return {
        id: s.id,
        name: s.name,
        gradeLevel: s.grade_level,
        schoolYearId: s.school_year_id,
        schoolYear: s.school_year || null,
        adviserId: s.adviser_id,
        adviserName: adviserName || null,
        studentCount: s.student_count || 0,
        roomNumber: s.room_number || null,
        capacity: s.capacity || 0,
        enrolledCount: s.enrolled_count || s.student_count || 0
      };
    }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/school/sections/:id
router.get("/sections/:id", async (req, res) => {
  try {
    const section = await db.oneOrNone(
      "SELECT * FROM get_section_by_id($1)",
      [req.params.id]
    );
    if (!section) return res.status(404).json({ error: "Section not found" });
    res.json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/school/sections/:id
router.get("/sections/:id", async (req, res) => {
  try {
    const section = await db.oneOrNone(
      "SELECT * FROM get_section_by_id($1)",
      [req.params.id]
    );
    if (!section) return res.status(404).json({ error: "Section not found" });
    res.json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// POST /api/school/sections
router.post("/sections", async (req, res) => {
  try {
    const { schoolYearId, gradeLevel, name, adviserId, roomNumber } = req.body;
    
    if (adviserId) {
      // Validation: One class per teacher per school year
      const existing = await db.oneOrNone(
        "SELECT id, name FROM sections WHERE adviser_id = $1 AND school_year_id = $2",
        [adviserId, schoolYearId]
      );
      if (existing) {
        return res.status(409).json({ error: `Teacher is already assigned to section ${existing.name}` });
      }
    }

    const result = await db.one(
      "SELECT * FROM create_section($1::integer, $2::smallint, $3::varchar, $4::integer, $5::varchar)",
      [schoolYearId, gradeLevel, name, adviserId || null, roomNumber || null]
    );
    // Fetch hydrated section for immediate UI update
    const full = await db.one(`
      SELECT s.*, sy.label as school_year_label, t.first_name, t.last_name
      FROM sections s
      LEFT JOIN school_years sy ON s.school_year_id = sy.id
      LEFT JOIN teachers t ON s.adviser_id = t.id
      WHERE s.id = $1
    `, [result.id]);

    res.status(201).json({
      id: full.id,
      name: full.name,
      gradeLevel: full.grade_level,
      schoolYearId: full.school_year_id,
      schoolYear: full.school_year_label,
      roomNumber: full.room_number,
      adviserId: full.adviser_id,
      adviserName: full.first_name ? `${full.first_name} ${full.last_name}` : null,
      studentCount: 0,
      enrolledCount: 0
    });
  } catch (err) {
    console.error(err);
    if (err.code === "23505") return res.status(409).json({ error: "Section already exists for this school year and grade" });
    res.status(500).json({ error: "server error" });
  }
});

// PUT /api/school/sections/:id
router.put("/sections/:id", async (req, res) => {
  try {
    const { name, gradeLevel, schoolYearId, adviserId, roomNumber } = req.body;
    const result = await db.oneOrNone(
      "UPDATE sections SET name = COALESCE($2, name), grade_level = COALESCE($3, grade_level), school_year_id = COALESCE($4, school_year_id), room_number = COALESCE($5, room_number) WHERE id = $1 RETURNING *",
      [req.params.id, name || null, gradeLevel || null, schoolYearId || null, roomNumber || null]
    );

    if (adviserId !== undefined && result) {
      if (adviserId) {
        // Validation: One class per teacher per school year
        const currentSy = schoolYearId || result.school_year_id;
        const existing = await db.oneOrNone(
          "SELECT id, name FROM sections WHERE adviser_id = $1 AND school_year_id = $2 AND id != $3",
          [adviserId, currentSy, req.params.id]
        );
        if (existing) {
          return res.status(409).json({ error: `Teacher is already assigned to section ${existing.name}` });
        }
      }
      await db.any("SELECT assign_section_adviser($1, $2)", [req.params.id, adviserId || null]);
    }
    if (!result) return res.status(404).json({ error: "Section not found" });
    
    // Fetch hydrated section
    const full = await db.one(`
      SELECT s.*, sy.label as school_year_label, t.first_name, t.last_name
      FROM sections s
      LEFT JOIN school_years sy ON s.school_year_id = sy.id
      LEFT JOIN teachers t ON s.adviser_id = t.id
      WHERE s.id = $1
    `, [req.params.id]);

    res.json({
      id: full.id,
      name: full.name,
      gradeLevel: full.grade_level,
      schoolYearId: full.school_year_id,
      schoolYear: full.school_year_label,
      roomNumber: full.room_number,
      adviserId: full.adviser_id,
      adviserName: full.first_name ? `${full.first_name} ${full.last_name}` : null,
      studentCount: 0 // Will be updated on refresh
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// DELETE /api/school/sections/:id
router.delete("/sections/:id", async (req, res) => {
  try {
    await db.any("SELECT delete_section($1)", [req.params.id]);
    res.json({ result: "deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// ── Adviser Assignment ────────────────────────────────────

// PUT /api/school/sections/:id/adviser
// Body: { adviserId: number | null }
router.put("/sections/:id/adviser", async (req, res) => {
  try {
    const { adviserId } = req.body;
    
    // Fetch current section to get school_year_id
    const section = await db.oneOrNone("SELECT school_year_id, name FROM sections WHERE id = $1", [req.params.id]);
    if (!section) return res.status(404).json({ error: "Section not found" });

    if (adviserId) {
      // Validation: One class per teacher per school year
      const existing = await db.oneOrNone(
        "SELECT id, name FROM sections WHERE adviser_id = $1 AND school_year_id = $2 AND id != $3",
        [adviserId, section.school_year_id, req.params.id]
      );
      if (existing) {
        return res.status(409).json({ error: `Teacher is already assigned to section ${existing.name}` });
      }
    }

    await db.any("SELECT assign_section_adviser($1,$2)", [req.params.id, adviserId || null]);
    
    // Fetch hydrated section for immediate UI update
    const full = await db.one(`
      SELECT s.*, sy.label as school_year_label, t.first_name, t.last_name
      FROM sections s
      LEFT JOIN school_years sy ON s.school_year_id = sy.id
      LEFT JOIN teachers t ON s.adviser_id = t.id
      WHERE s.id = $1
    `, [req.params.id]);

    res.json({
      id: full.id,
      name: full.name,
      gradeLevel: full.grade_level,
      schoolYearId: full.school_year_id,
      schoolYear: full.school_year_label,
      roomNumber: full.room_number,
      adviserId: full.adviser_id,
      adviserName: full.first_name ? `${full.first_name} ${full.last_name}` : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/school/teachers
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await db.any("SELECT * FROM teachers ORDER BY last_name, first_name");
    const mapped = teachers.map(t => ({
      id: t.id,
      employeeId: t.employee_id,
      firstName: t.first_name,
      middleName: t.middle_name,
      lastName: t.last_name,
      suffix: t.suffix,
      gender: t.gender,
      birthdate: t.birthdate,
      contactNumber: t.contact_number,
      email: t.email,
      specialization: t.specialization,
      isActive: t.is_active,
      userId: t.user_id,
      name: `${t.first_name} ${t.last_name}`.trim()
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// POST /api/school/teachers
router.post("/teachers", async (req, res) => {
  try {
    const {
      employeeId, firstName, middleName, lastName, suffix,
      gender, birthdate, contactNumber, email, specialization, isActive, userId
    } = req.body;
    
    // gender might be "Male" or "Female" or empty
    const result = await db.one(`
      INSERT INTO teachers (
        employee_id, first_name, middle_name, last_name, 
        suffix, gender, birthdate, contact_number, 
        email, specialization, is_active, user_id
      ) VALUES (
        $1, $2, $3, $4, 
        $5, $6, $7, $8, 
        $9, $10, $11, $12
      ) RETURNING *
    `, [
      employeeId, firstName, middleName || null, lastName,
      suffix || null, gender || null, birthdate || null, contactNumber || null,
      email || null, specialization || null, isActive !== undefined ? isActive : true, userId || null
    ]);
    
    // Map snake_case to camelCase
    res.status(201).json({
      id: result.id,
      employeeId: result.employee_id,
      firstName: result.first_name,
      middleName: result.middle_name,
      lastName: result.last_name,
      suffix: result.suffix,
      gender: result.gender,
      birthdate: result.birthdate,
      contactNumber: result.contact_number,
      email: result.email,
      specialization: result.specialization,
      isActive: result.is_active,
      userId: result.user_id
    });
  } catch (err) {
    console.error(err);
    if (err.code === "23505") return res.status(409).json({ error: "Employee ID already exists" });
    res.status(500).json({ error: "server error" });
  }
});

// PUT /api/school/teachers/:id
router.put("/teachers/:id", async (req, res) => {
  try {
    const {
      employeeId, firstName, middleName, lastName, suffix,
      gender, birthdate, contactNumber, email, specialization, isActive, userId
    } = req.body;
    
    const result = await db.oneOrNone(`
      UPDATE teachers SET 
        employee_id = COALESCE($2, employee_id),
        first_name = COALESCE($3, first_name),
        middle_name = $4,
        last_name = COALESCE($5, last_name),
        suffix = $6,
        gender = COALESCE($7, gender),
        birthdate = $8,
        contact_number = $9,
        email = $10,
        specialization = $11,
        is_active = COALESCE($12, is_active),
        user_id = $13,
        updated_at = NOW()
      WHERE id = $1 RETURNING *
    `, [
      req.params.id, employeeId || null, firstName || null, middleName || null, lastName || null,
      suffix || null, gender || null, birthdate || null, contactNumber || null,
      email || null, specialization || null, isActive, userId || null
    ]);
    
    if (!result) return res.status(404).json({ error: "Teacher not found" });
    
    res.json({
      id: result.id,
      employeeId: result.employee_id,
      firstName: result.first_name,
      middleName: result.middle_name,
      lastName: result.last_name,
      suffix: result.suffix,
      gender: result.gender,
      birthdate: result.birthdate,
      contactNumber: result.contact_number,
      email: result.email,
      specialization: result.specialization,
      isActive: result.is_active
    });
  } catch (err) {
    console.error(err);
    if (err.code === "23505") return res.status(409).json({ error: "Employee ID already exists" });
    res.status(500).json({ error: "server error" });
  }
});

// DELETE /api/school/teachers/:id
router.delete("/teachers/:id", async (req, res) => {
  try {
    // Instead of completely deleting, we usually deactivate a teacher if they have related records
    // Let's first check if we should do a soft delete
    await db.none("UPDATE teachers SET is_active = false WHERE id = $1", [req.params.id]);
    res.json({ result: "deactivated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;