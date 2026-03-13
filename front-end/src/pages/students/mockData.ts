import type { Student, Enrollment, AcademicRecord } from "../types";

// ── Students ───────────────────────────────────────────────────────────────────

export const MOCK_STUDENTS: Student[] = [
  {
    id: 1, lrn: "105012300001",
    lastName: "Santos",    firstName: "Miguel",   middleName: "Dela Cruz",
    sex: "Male",   birthdate: "2012-03-15",
    elementarySchoolName: "Quezon City Elementary School", elementarySchoolId: "105001", elementaryGeneralAvg: 92.5,
  },
  {
    id: 2, lrn: "105012300002",
    lastName: "Reyes",     firstName: "Sofia",    middleName: "Mendoza",
    sex: "Female", birthdate: "2012-07-22",
    elementarySchoolName: "Commonwealth Elementary School", elementarySchoolId: "105002", elementaryGeneralAvg: 95.0,
  },
  {
    id: 3, lrn: "105012300003",
    lastName: "Dizon",     firstName: "Carlo",    middleName: "Navarro",
    sex: "Male",   birthdate: "2012-01-08",
    elementarySchoolName: "Batasan Hills Elementary School", elementarySchoolId: "105003", elementaryGeneralAvg: 88.0,
  },
  {
    id: 4, lrn: "105012300004",
    lastName: "Villanueva", firstName: "Lara",    middleName: "Bautista",
    sex: "Female", birthdate: "2012-11-30",
    elementarySchoolName: "Fairview Elementary School", elementarySchoolId: "105004", elementaryGeneralAvg: 90.5,
  },
  {
    id: 5, lrn: "105012300005",
    lastName: "Cruz",      firstName: "Nathan",   middleName: "Lim",
    sex: "Male",   birthdate: "2012-05-17",
    elementarySchoolName: "Batasan Hills Elementary School", elementarySchoolId: "105003", elementaryGeneralAvg: 91.0,
  },
  {
    id: 6, lrn: "105012300006",
    lastName: "Lim",       firstName: "Andrea",   middleName: "Uy",
    sex: "Female", birthdate: "2011-09-04",
    elementarySchoolName: "Commonwealth Elementary School", elementarySchoolId: "105002", elementaryGeneralAvg: 87.5,
    otherCredential: "PEPT", otherCredentialRating: "85.0",
  },
  {
    id: 7, lrn: "105012300007",
    lastName: "Mendoza",   firstName: "John",     middleName: "Villarin",
    sex: "Male",   birthdate: "2012-06-12",
    elementarySchoolName: "Quezon City Elementary School", elementarySchoolId: "105001", elementaryGeneralAvg: 89.0,
  },
  {
    id: 8, lrn: "105012300008",
    lastName: "Flores",    firstName: "Mia",      middleName: "Ramos",
    sex: "Female", birthdate: "2012-02-28",
    elementarySchoolName: "Fairview Elementary School", elementarySchoolId: "105004", elementaryGeneralAvg: 96.5,
  },
  {
    id: 9, lrn: "105012300009",
    lastName: "Ramos",     firstName: "Kevin",    middleName: "Ocampo",
    sex: "Male",   birthdate: "2012-08-19",
    elementarySchoolName: "Batasan Hills Elementary School", elementarySchoolId: "105003", elementaryGeneralAvg: 83.0,
  },
  {
    id: 10, lrn: "105012300010",
    lastName: "Bautista",  firstName: "Ella",     middleName: "Domingo",
    sex: "Female", birthdate: "2013-04-05",
    elementarySchoolName: "Commonwealth Elementary School", elementarySchoolId: "105002", elementaryGeneralAvg: 85.0,
  },
  {
    id: 11, lrn: "105012300011",
    lastName: "Torres",    firstName: "Liam",     middleName: "Santos",
    sex: "Male",   birthdate: "2011-12-20",
    elementarySchoolName: "Quezon City Elementary School", elementarySchoolId: "105001", elementaryGeneralAvg: 80.5,
  },
  {
    id: 12, lrn: "105012300012",
    lastName: "Garcia",    firstName: "Chloe",    middleName: "Rivera",
    sex: "Female", birthdate: "2012-10-11",
    elementarySchoolName: "Fairview Elementary School", elementarySchoolId: "105004", elementaryGeneralAvg: 93.0,
  },
];

// ── Enrollments ────────────────────────────────────────────────────────────────

export const MOCK_ENROLLMENTS: Enrollment[] = [
  { id: 1,  studentId: 1,  schoolYear: "2025-2026", gradeLevel: 7,  section: "Integrity",  adviserName: "Ms. A. Reyes",  status: "Enrolled" },
  { id: 2,  studentId: 2,  schoolYear: "2025-2026", gradeLevel: 7,  section: "Integrity",  adviserName: "Ms. A. Reyes",  status: "Enrolled" },
  { id: 3,  studentId: 3,  schoolYear: "2025-2026", gradeLevel: 8,  section: "Diligence",  adviserName: "Ms. C. Cruz",   status: "Enrolled" },
  { id: 4,  studentId: 4,  schoolYear: "2025-2026", gradeLevel: 8,  section: "Diligence",  adviserName: "Ms. C. Cruz",   status: "Enrolled" },
  { id: 5,  studentId: 5,  schoolYear: "2025-2026", gradeLevel: 9,  section: "Wisdom",     adviserName: "Ms. E. Garcia", status: "Enrolled" },
  { id: 6,  studentId: 6,  schoolYear: "2025-2026", gradeLevel: 9,  section: "Wisdom",     adviserName: "Ms. E. Garcia", status: "Enrolled" },
  { id: 7,  studentId: 7,  schoolYear: "2025-2026", gradeLevel: 10, section: "Excellence", adviserName: "Mr. F. Torres", status: "Enrolled" },
  { id: 8,  studentId: 8,  schoolYear: "2025-2026", gradeLevel: 10, section: "Excellence", adviserName: "Mr. F. Torres", status: "Enrolled" },
  { id: 9,  studentId: 9,  schoolYear: "2025-2026", gradeLevel: 7,  section: "Honesty",    adviserName: "Mr. B. Santos", status: "Enrolled" },
  { id: 10, studentId: 10, schoolYear: "2025-2026", gradeLevel: 7,  section: "Honesty",    adviserName: "Mr. B. Santos", status: "Enrolled" },
  { id: 11, studentId: 11, schoolYear: "2025-2026", gradeLevel: 8,  section: "Humility",   adviserName: "Mr. D. Lim",    status: "Enrolled" },
  { id: 12, studentId: 12, schoolYear: "2025-2026", gradeLevel: 8,  section: "Humility",   adviserName: "Mr. D. Lim",    status: "Enrolled" },
  // Past enrollments for profile history
  { id: 13, studentId: 3,  schoolYear: "2024-2025", gradeLevel: 7,  section: "Integrity",  adviserName: "Ms. A. Reyes",  status: "Promoted" },
  { id: 14, studentId: 4,  schoolYear: "2024-2025", gradeLevel: 7,  section: "Honesty",    adviserName: "Mr. B. Santos", status: "Promoted" },
  { id: 15, studentId: 5,  schoolYear: "2024-2025", gradeLevel: 8,  section: "Diligence",  adviserName: "Ms. C. Cruz",   status: "Promoted" },
];

// ── Academic Records ───────────────────────────────────────────────────────────

export const MOCK_ACADEMIC_RECORDS: AcademicRecord[] = [
  {
    enrollmentId: 13,
    schoolYear: "2024-2025",
    gradeLevel: 7,
    section: "Integrity",
    generalAverage: 93.05,
    finalLetterGrade: "A",
    grades: [
      { subjectCode: "LA",  subjectName: "Logical Analysis",      q1: 94, q2: 95, q3: 90, q4: 97, final: 94.00, letterGrade: "A",  remarks: "Passed" },
      { subjectCode: "SCL", subjectName: "Science Lab",            q1: 95, q2: 92, q3: 94, q4: 95, final: 94.00, letterGrade: "A",  remarks: "Passed" },
      { subjectCode: "ML",  subjectName: "Math Lab",               q1: 91, q2: 88, q3: 96, q4: 91, final: 91.50, letterGrade: "A-", remarks: "Passed" },
      { subjectCode: "SL",  subjectName: "Social Literacy",        q1: 90, q2: 90, q3: 94, q4: 93, final: 91.75, letterGrade: "A-", remarks: "Passed" },
      { subjectCode: "EL",  subjectName: "English Lab",            q1: 92, q2: 94, q3: 89, q4: 96, final: 92.75, letterGrade: "A-", remarks: "Passed" },
      { subjectCode: "WP",  subjectName: "Wika at Pagpapakatao",   q1: 93, q2: 89, q3: 92, q4: 94, final: 92.00, letterGrade: "A-", remarks: "Passed" },
      { subjectCode: "PSY", subjectName: "Psychomotor",            q1: 96, q2: 93, q3: 95, q4: 95, final: 94.75, letterGrade: "A",  remarks: "Passed" },
      { subjectCode: "TLE", subjectName: "TLE",                    q1: 94, q2: 96, q3: 91, q4: 97, final: 94.50, letterGrade: "A",  remarks: "Passed" },
      { subjectCode: "MSE", subjectName: "MSE",                    q1: 90, q2: 90, q3: 94, q4: 93, final: 91.75, letterGrade: "A-", remarks: "Passed" },
      { subjectCode: "COD", subjectName: "Coding",                 q1: 92, q2: 94, q3: 97, q4: 96, final: 94.75, letterGrade: "A",  remarks: "Passed" },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

export function getAge(birthdate: string): number {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "long", day: "numeric", year: "numeric",
  });
}

export const GRADE_COLORS: Record<number, string> = {
  7:  "bg-teal-100 text-teal-800",
  8:  "bg-violet-100 text-violet-700",
  9:  "bg-blue-100   text-blue-700",
  10: "bg-cyan-100   text-cyan-700",
};

export const STATUS_STYLES: Record<string, string> = {
  Enrolled:    "bg-emerald-100 text-emerald-700",
  Promoted:    "bg-blue-100    text-blue-700",
  Retained:    "bg-amber-100   text-amber-700",
  Transferred: "bg-slate-100   text-slate-600",
  Dropped:     "bg-red-100     text-red-700",
};