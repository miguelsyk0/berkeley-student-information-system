const express = require("express");
const db = require("../db");

const router = express.Router();

// ── School Profile ────────────────────────────────────────

// GET /api/school
router.get("/", async (req, res) => {
  try {
    const school = await db.oneOrNone("SELECT * FROM get_school_profile()");
    res.json(school || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// PUT /api/school
router.put("/", async (req, res) => {
  try {
    const { name, depedId, district, division, region, address, contactNumber, email, principalName } = req.body;
    const result = await db.one(
      "SELECT * FROM upsert_school_profile($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [name, depedId || null, district || null, division || null, region || null,
       address || null, contactNumber || null, email || null, principalName || null]
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
    res.json(years);
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
    res.status(201).json(result);
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
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// DELETE /api/school/years/:id
router.delete("/years/:id", async (req, res) => {
  try {
    await db.none("SELECT delete_school_year($1)", [req.params.id]);
    res.status(204).send();
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
    const sections = await db.any(
      "SELECT * FROM get_sections($1,$2)",
      [schoolYearId || null, gradeLevel || null]
    );
    res.json(sections);
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
    const result = await db.one(
      "SELECT * FROM create_section($1,$2,$3,$4,$5)",
      [schoolYearId, gradeLevel, name, adviserId || null, roomNumber || null]
    );
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    if (err.code === "23505") return res.status(409).json({ error: "Section already exists for this school year and grade" });
    res.status(500).json({ error: "server error" });
  }
});

// PUT /api/school/sections/:id
router.put("/sections/:id", async (req, res) => {
  try {
    const { name, adviserId, roomNumber } = req.body;
    const result = await db.oneOrNone(
      "SELECT * FROM update_section($1,$2,$3,$4)",
      [req.params.id, name, adviserId || null, roomNumber || null]
    );
    if (!result) return res.status(404).json({ error: "Section not found" });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// DELETE /api/school/sections/:id
router.delete("/sections/:id", async (req, res) => {
  try {
    await db.none("SELECT delete_section($1)", [req.params.id]);
    res.status(204).send();
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
    const result = await db.one(
      "SELECT * FROM assign_adviser($1,$2)",
      [req.params.id, adviserId || null]
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/school/teachers
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await db.any("SELECT * FROM get_teachers()");
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;