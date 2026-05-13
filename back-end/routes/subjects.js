const express = require("express");
const db = require("../db");

const router = express.Router();

const mapSubject = (s) => {
  if (!s) return s;
  return {
    ...s,
    displayName: s.display_name,
    gradeLevel: s.grade_level,
    cluster: s.cluster,
    isActive: s.is_active,
    order: s.sort_order,
  };
};

// Get Subjects
// GET /api/subjects
router.get("/subjects", async (req, res) => {
  try {
    const result = await db.manyOrNone("SELECT * FROM get_subjects()");
    res.json(result.map(mapSubject));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

// Create Subject
// POST /api/subjects
router.post("/subjects", async (req, res) => {
  try {
    const { 
      name, code, gradeLevel, description, 
      cluster, isActive, displayName 
    } = req.body;

    const result = await db.one(
      "SELECT create_subject($1::varchar, $2::varchar, $3::smallint, $4::text, $5::varchar, $6::boolean, $7::varchar) AS result",
      [
        name, code, gradeLevel, description || null,
        cluster || null,
        isActive !== undefined ? isActive : true,
        displayName || null
      ]
    );
    res.status(201).json(mapSubject(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create subject" });
  }
});

// Update Subject
// PUT /api/subjects/:id
router.put("/subjects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, code, gradeLevel, description, 
      cluster, isActive, displayName 
    } = req.body;

    const result = await db.one(
      "SELECT update_subject($1::integer, $2::varchar, $3::varchar, $4::smallint, $5::text, $6::varchar, $7::boolean, $8::varchar) AS result",
      [
        id, name, code, gradeLevel, description || null,
        cluster || null,
        isActive !== undefined ? isActive : true,
        displayName || null
      ]
    );
    res.json(mapSubject(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update subject" });
  }
});

// Delete Subject
// DELETE /api/subjects/:id
router.delete("/subjects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.one("SELECT delete_subject($1) AS result", [id]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete subject" });
  }
});

// Reorder Subjects (Move Up/Down)
// PATCH /api/subjects/:id/order?direction=up|down
router.patch("/subjects/:id/order", async (req, res) => {
  try {
    const { id } = req.params;
    const { direction } = req.query; // "up" or "down"
    const result = await db.one("SELECT reorder_subject($1, $2) AS result", [id, direction]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reorder subject" });
  }
});

module.exports = router;