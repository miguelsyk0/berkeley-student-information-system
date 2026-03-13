import type { Subject, StudentGrade } from "../types";

// ── Subjects ───────────────────────────────────────────────────────────────────

export const SUBJECTS: Subject[] = [
  { id: 1, code: "LA",   name: "Logical Analysis" },
  { id: 2, code: "SCI",  name: "Science Lab" },
  { id: 3, code: "MATH", name: "Math Lab" },
  { id: 4, code: "SL",   name: "Social Literacy" },
  { id: 5, code: "EL",   name: "English Lab" },
  { id: 6, code: "WP",   name: "Wika at Pagpapakatao" },
  { id: 7, code: "MAP",  name: "Psychomotor" },
  { id: 8, code: "TLE",  name: "TLE" },
  { id: 9, code: "MSE",  name: "MSE" },
  { id: 10, code: "COD", name: "Coding" },
];

export const SECTIONS = [
  "Integrity", "Honesty", "Loyalty", "Diligence",
  "Humility", "Wisdom", "Courage", "Excellence",
];

export const GRADE_COLORS: Record<number, string> = {
  7:  "bg-violet-100 text-violet-800",
  8:  "bg-teal-100 text-teal-800",
  9:  "bg-amber-100 text-amber-800",
  10: "bg-rose-100 text-rose-800",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeGrades(base: number): Record<string, number | null> {
  const obj: Record<string, number | null> = {};
  SUBJECTS.forEach((s) => {
    obj[s.code] = Math.min(100, Math.max(70, base + Math.round((Math.random() - 0.5) * 14)));
  });
  return obj;
}

export function computeAvg(grades: Record<string, number | null>): number | null {
  const vals = Object.values(grades).filter((v): v is number => v !== null);
  if (vals.length === 0) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
}

export function gradeColor(g?: number | null): string {
  if (g === null || g === undefined) return "text-slate-300";
  if (g >= 90) return "text-emerald-600 font-bold";
  if (g >= 85) return "text-teal-600 font-semibold";
  if (g >= 80) return "text-blue-600 font-semibold";
  if (g >= 75) return "text-slate-700 font-semibold";
  return "text-red-600 font-bold";
}

export function letterGrade(avg: number | null): string {
  if (!avg) return "—";
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

// ── Mock Students ──────────────────────────────────────────────────────────────

export const MOCK_STUDENTS: StudentGrade[] = [
  { studentId: 1,  lrn: "105012300001", name: "Santos, Miguel A.",    grades: makeGrades(92) },
  { studentId: 2,  lrn: "105012300002", name: "Reyes, Sofia L.",      grades: makeGrades(87) },
  { studentId: 3,  lrn: "105012300003", name: "Villanueva, Lara M.",  grades: makeGrades(95) },
  { studentId: 4,  lrn: "105012300004", name: "Cruz, Nathan B.",      grades: makeGrades(79) },
  { studentId: 5,  lrn: "105012300005", name: "Lim, Andrea C.",       grades: makeGrades(88) },
  { studentId: 6,  lrn: "105012300006", name: "Dela Cruz, John P.",   grades: makeGrades(83) },
  { studentId: 7,  lrn: "105012300007", name: "Garcia, Maria T.",     grades: makeGrades(91) },
  { studentId: 8,  lrn: "105012300008", name: "Mendoza, Nico R.",     grades: { ...makeGrades(85), SCI: null, EL: null } },
  { studentId: 9,  lrn: "105012300009", name: "Torres, Ana F.",       grades: makeGrades(74) },
  { studentId: 10, lrn: "105012300010", name: "Bautista, Luis G.",    grades: makeGrades(90) },
  { studentId: 11, lrn: "105012300011", name: "Fernandez, Clara D.",  grades: makeGrades(86) },
  { studentId: 12, lrn: "105012300012", name: "Aquino, Marco E.",     grades: makeGrades(93) },
];

// ── Per-quarter mock grades (used in student detail & SF10) ───────────────────

export const QUARTERLY_MOCK: Record<string, Record<number, number | null>> = Object.fromEntries(
  SUBJECTS.map((s) => [
    s.code,
    {
      1: Math.random() > 0.1  ? Math.round(75 + Math.random() * 25) : null,
      2: Math.random() > 0.15 ? Math.round(75 + Math.random() * 25) : null,
      3: Math.random() > 0.2  ? Math.round(75 + Math.random() * 25) : null,
      4: Math.random() > 0.25 ? Math.round(75 + Math.random() * 25) : null,
    },
  ])
);