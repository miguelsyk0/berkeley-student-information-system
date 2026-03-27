const express = require("express");
const db = require("../db");

const router = express.Router();

// GET /api/enrollments
// Query params: schoolYearId, sectionId, gradeLevel, status
router.get("/", async (req, res) => {
  try {
    const { schoolYearId, sectionId, gradeLevel, status } = req.query;
    const enrollments = await db.any(
      "SELECT * FROM get_enrollments($1,$2,$3,$4)",
      [schoolYearId || null, sectionId || null, gradeLevel || null, status || null]
    );
    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/enrollments/:id
router.get("/:id", async (req, res) => {
  try {
    const enrollment = await db.oneOrNone(
      "SELECT * FROM get_enrollment_by_id($1)",
      [req.params.id]
    );
    if (!enrollment) return res.status(404).json({ error: "Enrollment not found" });
    res.json(enrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// PUT /api/enrollments/:id/status
// Body: { status: "Promoted" | "Retained" | "Transferred" | "Dropped" }
// Note: Updating to a terminal status auto-triggers snapshot_enrollment_to_transcript
router.put("/:id/status", async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const result = await db.one(
      "SELECT * FROM update_enrollment_status($1,$2,$3)",
      [req.params.id, status, remarks || null]
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// POST /api/enrollments/:id/snapshot
// Manually trigger SF10 transcript snapshot for an enrollment
router.post("/:id/snapshot", async (req, res) => {
  try {
    const { headerId } = await db.one(
      "SELECT snapshot_enrollment_to_transcript($1) AS header_id",
      [req.params.id]
    );
    res.json({ headerId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;