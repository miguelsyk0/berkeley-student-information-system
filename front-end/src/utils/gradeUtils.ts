/**
 * Utility functions and constants for grade management.
 * Moved from MockData.ts to a shared utility file.
 */

/**
 * Computes the average of a grades record (subjectCode -> grade).
 */
export function computeAvg(grades: Record<string, number | null>): number | null {
  const vals = Object.values(grades).filter((v): v is number => v !== null);
  if (vals.length === 0) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
}

/**
 * Returns a CSS class name for a grade value based on pass/fail thresholds.
 */
export function gradeColor(g?: number | null): string {
  if (g === null || g === undefined) return "text-slate-300";
  if (g >= 90) return "text-emerald-600 font-bold";
  if (g >= 85) return "text-teal-600 font-semibold";
  if (g >= 80) return "text-blue-600 font-semibold";
  if (g >= 75) return "text-slate-700 font-semibold";
  return "text-red-600 font-bold";
}

/**
 * Converts a numerical average to a letter grade (E.g. 95 -> A).
 */
export function letterGrade(avg: number | null): string {
  if (avg === null || avg === undefined) return "—";
  if (avg >= 97) return "A+";
  if (avg >= 93) return "A";
  if (avg >= 90) return "A-";
  if (avg >= 87) return "B+";
  if (avg >= 83) return "B";
  if (avg >= 80) return "B-";
  if (avg >= 77) return "C+";
  if (avg >= 75) return "C";
  return "F";
}

/**
 * Color backgrounds for grade level badges.
 */
export const GRADE_COLORS: Record<number, string> = {
  7:  "bg-teal-100 text-teal-800",
  8:  "bg-violet-100 text-violet-700",
  9:  "bg-blue-100   text-blue-700",
  10: "bg-cyan-100   text-cyan-700",
};

/**
 * CSS styles for various status badges.
 */
export const STATUS_STYLES: Record<string, string> = {
  // Enrollment statuses
  Enrolled:    "bg-emerald-100 text-emerald-700",
  Promoted:    "bg-blue-100    text-blue-700",
  Retained:    "bg-amber-100   text-amber-700",
  Transferred: "bg-slate-100   text-slate-600",
  Dropped:     "bg-red-100     text-red-700",
  
  // Import statuses
  success:    "bg-emerald-100 text-emerald-700",
  partial:    "bg-amber-100   text-amber-700",
  failed:     "bg-red-100     text-red-700",
  processing: "bg-blue-100    text-blue-700",
};

/**
 * Labels for academic quarters.
 */
export const QUARTER_LABELS: Record<number, string> = {
  1: "1st Quarter",
  2: "2nd Quarter",
  3: "3rd Quarter",
  4: "4th Quarter",
};
