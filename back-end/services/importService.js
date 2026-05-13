const xlsx = require('xlsx');
const axios = require('axios');
const db = require('../db');

/**
 * Parses an Excel or CSV file from a buffer and returns headers and preview rows.
 * @param {Buffer} buffer - File buffer
 * @param {number} headerRow - 1-indexed row number where headers are located
 * @param {string} [sheetName] - Name of the sheet to parse
 */
function parseSpreadsheet(buffer, headerRow = 1, sheetName = null) {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetNames = workbook.SheetNames;
  
  // Use provided sheetName or default to first sheet
  const targetSheetName = sheetName && sheetNames.includes(sheetName) 
    ? sheetName 
    : sheetNames[0];
    
  const worksheet = workbook.Sheets[targetSheetName];
  
  // xlsx 'range' option skips top rows. 0 skips nothing, 1 skips the first row, etc.
  // If the user says row 1 is headers, we skip 0 rows (range: 0).
  const skipRows = Math.max(0, headerRow - 1);
  
  // Get all rows as objects
  const rows = xlsx.utils.sheet_to_json(worksheet, { 
    defval: "", 
    range: skipRows 
  });
  
  if (rows.length === 0) return { headers: [], rows: [], sheetNames, currentSheet: targetSheetName };
  
  // Extract headers from the first row's keys
  const headers = Object.keys(rows[0]);
  
  return { headers, rows, sheetNames, currentSheet: targetSheetName };
}

/**
 * Downloads a file from a Google Drive URL.
 * Supports standard shareable links by converting them to export links.
 */
async function downloadFromDrive(url) {
  // Extract file ID from various GDrive URL formats
  const fileIdMatch = url.match(/\/d\/([\w-]+)/) || url.match(/id=([\w-]+)/);
  if (!fileIdMatch) throw new Error("Invalid Google Drive URL. Please ensure it's a standard shareable link.");
  
  const fileId = fileIdMatch[1];
  // Export as XLSX (best for formatting)
  const downloadUrl = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`;
  
  try {
    const response = await axios.get(downloadUrl, { 
      responseType: 'arraybuffer',
      // We might need to handle private files if user provides a token later
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error("GDrive Download Error:", error.message);
    throw new Error("Failed to download file from Google Drive. Ensure the link is public or has 'Anyone with the link' access.");
  }
}

/**
 * Analyzes the parsed rows and attempts to map them to students and subjects.
 */
async function analyzeImport(rows, mapping, sectionName, gradeLevel) {
  // 1. Get all students in the target section
  const sectionStudents = await db.any(
    `SELECT s.id, s.lrn, s.first_name, s.last_name 
     FROM students s 
     JOIN enrollments e ON s.id = e.student_id 
     JOIN sections sec ON e.section_id = sec.id 
     WHERE sec.name = $1 AND sec.grade_level = $2`,
    [sectionName, gradeLevel]
  );

  // 1b. Get all subjects for this grade level to resolve cluster mappings
  const allSubjects = await db.any(
    `SELECT code, cluster FROM subjects WHERE grade_level = $1`,
    [gradeLevel]
  );

  // Build an expanded mapping: cluster keys become multiple subject keys
  const expandedMapping = {};
  for (const [target, source] of Object.entries(mapping)) {
    if (target.startsWith('cluster:')) {
      const clusterName = target.replace('cluster:', '');
      const clusterSubjects = allSubjects.filter(s => s.cluster === clusterName);
      for (const subj of clusterSubjects) {
        expandedMapping[subj.code] = source; // same source column for all subjects in cluster
      }
    } else {
      expandedMapping[target] = source;
    }
  }

  // 2. Map results
  const analysis = rows.map((row, index) => {
    const lrn = String(row[expandedMapping.lrn || mapping.lrn] || "").trim();
    const student = sectionStudents.find(s => s.lrn === lrn);
    
    let status = "ready";
    let errors = [];

    if (!lrn) {
      status = "error";
      errors.push({ field: "lrn", message: "Missing LRN", severity: "error" });
    } else if (!student) {
      status = "error";
      errors.push({ field: "lrn", message: "LRN not found in this section", severity: "error" });
    }

    // Check grades (numeric 0-100) — using expanded mapping
    const grades = {};
    Object.entries(expandedMapping).forEach(([subjCode, colName]) => {
      if (subjCode === "lrn" || subjCode === "lastName" || subjCode === "firstName" || subjCode === "middleName") return;
      
      const val = row[colName];
      if (val === "" || val === undefined || val === null) {
        return;
      }

      if (subjCode === "letterGrade") {
        grades[subjCode] = val;
        return;
      }

      const num = Number(val);
      if (isNaN(num) || num < 0 || num > 100) {
        status = status === "error" ? "error" : "warning";
        errors.push({ field: subjCode, message: `Invalid grade in ${subjCode}: ${val}`, severity: "error" });
      } else {
        grades[subjCode] = num;
      }
    });

    return {
      rowId: index + 1,
      lrn: lrn,
      studentName: student ? `${student.last_name}, ${student.first_name}` : (row[expandedMapping.lastName || mapping.lastName] ? `${row[expandedMapping.lastName || mapping.lastName]}, ${row[expandedMapping.firstName || mapping.firstName]}` : "Unknown"),
      studentId: student?.id,
      grades,
      errors,
      status: errors.some(e => e.severity === "error") ? "error" : (errors.some(e => e.severity === "warning") ? "warning" : "ready")
    };
  });

  return analysis;
}

module.exports = {
  parseSpreadsheet,
  downloadFromDrive,
  analyzeImport
};
