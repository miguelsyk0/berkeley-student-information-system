const express = require("express");
const db = require("../db");

const router = express.Router();

// Get Subjects
// GET /api/subjects
router.get("/subjects", async (req, res) => {
  try {
    const result = await db.manyOrNone("SELECT * FROM get_subjects()");
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

// Create Subject
// POST /api/subjects
router.post("/subjects", async (req, res) => {
  try {
    const { name, code, grade_level, description } = req.body;
    const result = await db.one(
      "SELECT create_subject($1, $2, $3, $4) AS result",
      [name, code, grade_level, description]
    );
    res.status(201).json(result);
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
    const { name, code, grade_level, description } = req.body;
    const result = await db.one(
      "SELECT update_subject($1, $2, $3, $4, $5) AS result",
      [id, name, code, grade_level, description]
    );
    res.json(result);
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