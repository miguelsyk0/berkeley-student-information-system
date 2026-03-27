const express = require("express");
const db = require("../db");

const router = express.Router();

// Get Class Grade Sheet
// GET /api/grades/class?section=&schoolYear=&quarter=
router.get("/grades/class", async (req, res) => {
  try {
    const { section, schoolYear, quarter } = req.query;
    // Note: section is name (string), schoolYear is label (string), quarter is number
    const result = await db.manyOrNone(
      "SELECT * FROM get_class_grade_sheet($1, $2, $3)",
      [section, schoolYear, quarter]
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
    const result = await db.one("SELECT save_class_grades($1) AS result", [gradesData]);
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
    const result = await db.manyOrNone("SELECT * FROM get_student_grades($1)", [studentId]);
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

module.exports = router;