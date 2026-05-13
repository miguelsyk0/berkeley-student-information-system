const express = require("express");
const db = require("../db");

const router = express.Router();

// Get SF10 for Single Student
// GET /api/sf10/:studentId
router.get("/sf10/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const history = await db.any("SELECT * FROM get_sf10_full_history($1)", [studentId]);
    const records = await db.any("SELECT * FROM get_student_academic_records($1)", [studentId]);
    res.json({ history, records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch SF10 data" });
  }
});

// Generate Bulk SF10 (ZIP)
// POST /api/sf10/bulk
router.post("/sf10/bulk", async (req, res) => {
  try {
    const { studentIds, options } = req.body;
    const result = await db.one("SELECT generate_bulk_sf10($1, $2) AS result", [studentIds, options]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate bulk SF10" });
  }
});

// Export SF10 as PDF
// GET /api/sf10/:studentId/export
router.get("/sf10/:studentId/export", async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await db.one("SELECT * FROM export_sf10_pdf($1)", [studentId]);

    // Assuming result contains PDF buffer or path
    // Set appropriate headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="SF10_${studentId}.pdf"`);

    // Send the PDF data
    res.send(result.pdf_data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to export SF10 PDF" });
  }
});

module.exports = router;