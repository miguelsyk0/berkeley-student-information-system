// ── School & Section Management — Shared Types ────────────────────────────────

export interface School {
  id: number;
  name: string;
  schoolId: string;       // DepEd School ID
  district: string;
  division: string;
  region: string;
  address: string;
}

export interface SchoolYear {
  id: number;
  label: string;          // e.g. "2025-2026"
  startDate: string;      // ISO date
  endDate: string;
  isActive: boolean;
  quarters: Quarter[];
}

export interface Quarter {
  id: number;
  schoolYearId: number;
  number: 1 | 2 | 3 | 4;
  label: string;          // e.g. "1st Quarter"
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  employeeId: string;
}

export interface Section {
  id: number;
  name: string;           // e.g. "Integrity"
  gradeLevel: 7 | 8 | 9 | 10;
  schoolYearId: number;
  schoolYear: string;     // label for display
  adviserId: number | null;
  adviserName: string | null;
  studentCount: number;
  roomNumber?: string;
}

// ── Student Management — Shared Types ─────────────────────────────────────────

export interface Student {
  id: number;
  lrn: string;                      // Learner Reference Number
  lastName: string;
  firstName: string;
  middleName?: string;
  nameExtension?: string;           // Jr., II, III, etc.
  sex: "Male" | "Female";
  birthdate: string;                // ISO date

  // JHS Eligibility
  elementarySchoolName?: string;
  elementarySchoolId?: string;
  elementarySchoolAddress?: string;
  elementaryGeneralAvg?: number;
  elementaryCitation?: string;

  // Alternative credentials
  otherCredential?: "PEPT" | "ALS" | "Others";
  otherCredentialRating?: string;
  credentialExamDate?: string;
  credentialTestingCenter?: string;
}

export interface Enrollment {
  id: number;
  studentId: number;
  schoolYear: string;               // e.g. "2025-2026"
  gradeLevel: 7 | 8 | 9 | 10;
  section: string;
  adviserId?: number;
  adviserName?: string;
  dateOfRelease?: string;
  status: "Enrolled" | "Promoted" | "Retained" | "Transferred" | "Dropped";
}

export interface SubjectGrade {
  subjectCode: string;
  subjectName: string;
  q1?: number;
  q2?: number;
  q3?: number;
  q4?: number;
  final?: number;
  letterGrade?: string;
  remarks?: string;
}

export interface AcademicRecord {
  enrollmentId: number;
  schoolYear: string;
  gradeLevel: 7 | 8 | 9 | 10;
  section: string;
  grades: SubjectGrade[];
  generalAverage?: number;
  finalLetterGrade?: string;
}

// ── Subject Management Types ───────────────────────────────────────────────────

export interface Subject {
  id: number;
  code: string;             // Internal code e.g. "LA", "SCI"
  name: string;             // School-specific name e.g. "Science Lab"
  displayName: string;      // SF10 official DepEd name e.g. "Science"
  isMapeh: boolean;         // True if this is a MAPEH sub-subject
  mapehParentId?: number;   // If isMapeh, the id of the parent MAPEH subject
  order: number;            // Display order in grade sheet
  isActive: boolean;
}

// ── Grade Sheet Import Types ───────────────────────────────────────────────────

export type ImportStatus = "success" | "partial" | "failed" | "processing";

export interface ColumnMapping {
  sheetColumn: string;      // Column letter/header from the Drive file
  mappedTo: string;         // System field it maps to e.g. "lrn", "q1_LA"
  autoDetected: boolean;
}

export interface ValidationError {
  row: number;
  lrn?: string;
  studentName?: string;
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface ImportPreviewRow {
  row: number;
  lrn: string;
  studentName: string;
  grades: Record<string, number | null>;
  errors: ValidationError[];
  hasError: boolean;
}

export interface ImportLog {
  id: number;
  fileId: string;
  fileName: string;
  fileUrl: string;
  section: string;
  gradeLevel: 7 | 8 | 9 | 10;
  schoolYear: string;
  quarter: 1 | 2 | 3 | 4;
  importedBy: string;
  importedAt: string;       // ISO datetime
  status: ImportStatus;
  rowsTotal: number;
  rowsEncoded: number;
  rowsSkipped: number;
  errors: ValidationError[];
}