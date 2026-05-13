const express = require("express");
const db = require("../db");
const router = express.Router();

// GET /api/dashboard/summary
router.get("/dashboard/summary", async (req, res) => {
  try {
    const { schoolYearId, quarter } = req.query;
    
    const syId = Number(schoolYearId);
    const qtr = Number(quarter);

    // 1. Basic Stats from stored functions
    const studentStats = await db.one("SELECT * FROM get_student_management_stats()");
    const sectionsCount = await db.one("SELECT get_active_sections_count($1) as count", [syId]);
    
    // 2. Encoding Progress (Pending vs Completed)
    const progress = await db.any("SELECT * FROM get_encoding_progress($1, $2)", [syId, qtr]);
    const completedSections = progress.filter(p => Number(p.encoded_students) === Number(p.total_students) && Number(p.total_students) > 0).length;
    
    // 3. Students per Grade Level
    const studentsPerGrade = await db.any("SELECT * FROM get_students_per_grade($1)", [syId]);
    
    // 4. Grade Distribution
    const gradeDistribution = await db.any("SELECT * FROM get_grade_distribution($1, $2)", [syId, qtr]);

    // 5. Recent Activity
    const recentStudents = await db.any("SELECT * FROM get_recent_students_summary($1)", [syId]);
    const recentImports = await db.any("SELECT * FROM get_recent_imports_summary()");

    // 6. Alerts
    const alerts = [];
    if (progress.length - completedSections > 0) {
      alerts.push({ type: "warning", message: `${progress.length - completedSections} sections haven't fully encoded grades yet`, link: "View Progress" });
    }
    if (studentStats.incomplete_students > 0) {
      alerts.push({ type: "info", message: `${studentStats.incomplete_students} students have incomplete personal profiles`, link: "Review" });
    }
    if (studentStats.g10_missing_transcripts > 0) {
      alerts.push({ type: "error", message: `${studentStats.g10_missing_transcripts} Grade 10 students missing transcript history`, link: "View SF10" });
    }

    res.json({
      stats: {
        totalStudents: Number(studentStats.total_students),
        activeSections: Number(sectionsCount.count),
        pendingImports: progress.length - completedSections,
        completedImports: completedSections,
        totalSections: progress.length,
        incompleteStudents: Number(studentStats.incomplete_students)
      },
      charts: {
        studentsPerGrade: studentsPerGrade.map(g => ({ grade: `Grade ${g.grade_level}`, students: g.count })),
        gradeDistribution: gradeDistribution.map(d => ({ 
          label: d.label, 
          count: d.count,
          color: d.label.startsWith('A') ? '#22c55e' : d.label.startsWith('B') ? '#fbbf24' : '#ef4444'
        }))
      },
      recentStudents: recentStudents.map(s => ({
        id: s.id,
        name: `${s.first_name} ${s.last_name}`,
        lrn: s.lrn,
        section: s.section_name || 'Unassigned',
        addedAt: new Date(s.created_at).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : 'Recently'
      })),
      recentImports: recentImports.map(i => ({
        id: i.id,
        section: i.section_name || i.filename,
        status: i.status === 'success' ? 'success' : 'partial',
        time: formatTimeAgo(i.created_at),
        quarter: `Q${qtr}`
      })),
      alerts
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "server error" });
  }
});

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return new Date(date).toLocaleDateString();
}

module.exports = router;
