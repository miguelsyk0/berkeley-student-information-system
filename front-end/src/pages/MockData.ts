import type { ImportLog, ValidationError } from "./types";

// ── Mock Import Logs ───────────────────────────────────────────────────────────

export const MOCK_IMPORT_LOGS: ImportLog[] = [
  {
    id: 1,
    fileId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    fileName: "Grade_Sheet_8_Diligence_Q1.xlsx",
    fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    section: "Diligence", gradeLevel: 8, schoolYear: "2025-2026", quarter: 1,
    importedBy: "R. Dela Cruz", importedAt: "2025-06-10T09:23:00",
    status: "success", rowsTotal: 40, rowsEncoded: 40, rowsSkipped: 0, errors: [],
  },
  {
    id: 2,
    fileId: "2CyiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2abcd",
    fileName: "Grade_Sheet_7_Integrity_Q1.xlsx",
    fileUrl: "https://drive.google.com/file/d/2CyiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2abcd",
    section: "Integrity", gradeLevel: 7, schoolYear: "2025-2026", quarter: 1,
    importedBy: "M. Santos", importedAt: "2025-06-09T14:10:00",
    status: "success", rowsTotal: 38, rowsEncoded: 38, rowsSkipped: 0, errors: [],
  },
  {
    id: 3,
    fileId: "3DziMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2efgh",
    fileName: "Grade_Sheet_8_Humility_Q1.xlsx",
    fileUrl: "https://drive.google.com/file/d/3DziMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2efgh",
    section: "Humility", gradeLevel: 8, schoolYear: "2025-2026", quarter: 1,
    importedBy: "M. Santos", importedAt: "2025-06-09T11:45:00",
    status: "partial", rowsTotal: 38, rowsEncoded: 35, rowsSkipped: 3,
    errors: [
      { row: 12, lrn: "105012300011", studentName: "Torres, Liam", field: "q1_MATH", message: "Grade value 105 is out of range (0–100).", severity: "error" },
      { row: 18, lrn: "105012300017", studentName: "Cruz, Anna",   field: "lrn",     message: "LRN not found in the system.",             severity: "error" },
      { row: 27, lrn: "105012300026", studentName: "Reyes, Marco", field: "q1_SCI",  message: "Missing grade value.",                     severity: "warning" },
    ],
  },
  {
    id: 4,
    fileId: "4EziMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2ijkl",
    fileName: "Grade_Sheet_9_Wisdom_Q1.xlsx",
    fileUrl: "https://drive.google.com/file/d/4EziMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2ijkl",
    section: "Wisdom", gradeLevel: 9, schoolYear: "2025-2026", quarter: 1,
    importedBy: "R. Dela Cruz", importedAt: "2025-06-08T16:30:00",
    status: "success", rowsTotal: 35, rowsEncoded: 35, rowsSkipped: 0, errors: [],
  },
  {
    id: 5,
    fileId: "5FziMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2mnop",
    fileName: "Grade_Sheet_10_Excellence_Q1.xlsx",
    fileUrl: "https://drive.google.com/file/d/5FziMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2mnop",
    section: "Excellence", gradeLevel: 10, schoolYear: "2025-2026", quarter: 1,
    importedBy: "R. Dela Cruz", importedAt: "2025-06-07T10:15:00",
    status: "success", rowsTotal: 37, rowsEncoded: 37, rowsSkipped: 0, errors: [],
  },
  {
    id: 6,
    fileId: "6GziMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2qrst",
    fileName: "Grade_Sheet_7_Honesty_Q1_v2.xlsx",
    fileUrl: "https://drive.google.com/file/d/6GziMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2qrst",
    section: "Honesty", gradeLevel: 7, schoolYear: "2025-2026", quarter: 1,
    importedBy: "M. Santos", importedAt: "2025-06-06T09:00:00",
    status: "failed", rowsTotal: 36, rowsEncoded: 0, rowsSkipped: 36,
    errors: [
      { row: 0, field: "sheet", message: "Could not detect LRN column. Please check file format.", severity: "error" },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Less than an hour ago";
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return formatDateTime(iso);
}

export const STATUS_STYLES = {
  success:    { bg: "bg-emerald-100", text: "text-emerald-700", label: "Success"    },
  partial:    { bg: "bg-amber-100",   text: "text-amber-700",   label: "Partial"    },
  failed:     { bg: "bg-red-100",     text: "text-red-700",     label: "Failed"     },
  processing: { bg: "bg-blue-100",    text: "text-blue-700",    label: "Processing" },
};

export const QUARTER_LABELS: Record<number, string> = {
  1: "1st Quarter", 2: "2nd Quarter", 3: "3rd Quarter", 4: "4th Quarter",
};

export const GRADE_COLORS: Record<number, string> = {
  7: "bg-teal-100 text-teal-800",
  8: "bg-violet-100 text-violet-700",
  9: "bg-blue-100   text-blue-700",
  10: "bg-cyan-100  text-cyan-700",
};