const express = require("express");
const db = require("../db");

const router = express.Router();

// Start Import (Upload file and get initial preview)
// POST /api/imports
router.post("/imports", async (req, res) => {
  try {
    const { fileUrl, section, gradeLevel, schoolYear, quarter, columnMappings } = req.body;
    const result = await db.one("SELECT start_import($1, $2, $3, $4, $5, $6) AS result",
      [fileUrl, section, gradeLevel, schoolYear, quarter, columnMappings]);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to start import" });
  }
});

// Get Import Preview (with validation errors)
// GET /api/imports/:logId/preview
router.get("/imports/:logId/preview", async (req, res) => {
  try {
    const { logId } = req.params;
    const result = await db.one("SELECT * FROM get_import_preview($1)", [logId]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch import preview" });
  }
});

// Update Column Mappings
// PUT /api/imports/:logId/mappings
router.put("/imports/:logId/mappings", async (req, res) => {
  try {
    const { logId } = req.params;
    const { columnMappings } = req.body;
    const result = await db.one("SELECT update_import_mappings($1, $2) AS result", [logId, columnMappings]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update column mappings" });
  }
});

// Get Imports Dashboard
// GET /api/imports
router.get("/imports", async (req, res) => {
  try {
    const result = await db.manyOrNone("SELECT * FROM get_imports_dashboard()");
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch imports" });
  }
});

// Get Import History
// GET /api/imports/history
router.get("/imports/history", async (req, res) => {
  try {
    const result = await db.manyOrNone("SELECT * FROM get_import_history()");
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch import history" });
  }
});

// Get Import Log Details
// GET /api/imports/:logId
router.get("/imports/:logId", async (req, res) => {
  try {
    const { logId } = req.params;
    const result = await db.one("SELECT * FROM get_import_log_details($1)", [logId]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch import log details" });
  }
});

// Confirm and Encode Import
// POST /api/imports/:logId/confirm
router.post("/imports/:logId/confirm", async (req, res) => {
  try {
    const { logId } = req.params;
    const { skipErrors } = req.body; // optional: whether to skip validation errors
    const result = await db.one("SELECT confirm_import($1, $2) AS result", [logId, skipErrors]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to confirm import" });
  }
});

module.exports = router;