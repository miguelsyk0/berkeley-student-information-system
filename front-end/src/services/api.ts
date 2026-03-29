import { authFetch, BASE_URL } from "./authFetch";

// ── School Management ──────────────────────────────────────────────────────

export interface School {
  id: number;
  name: string;
  schoolId: string;
  district: string;
  division: string;
  region: string;
  address: string;
}

export interface SchoolYear {
  id: number;
  label: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  quarters: any[];
}

export interface Section {
  id: number;
  name: string;
  gradeLevel: number;
  schoolYearId: number;
  schoolYear: string;
  adviserId: number | null;
  adviserName: string | null;
  studentCount: number;
  roomNumber?: string;
  capacity?: number;
  enrolledCount?: number;
}

export interface Teacher {
  id: number;
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  gender?: string;
  birthdate?: string;
  contactNumber?: string;
  email?: string;
  specialization?: string;
  isActive: boolean;
  name?: string; // Concatenated name from server if available
  userId?: string;
}

export async function getSchoolProfile(): Promise<School> {
  const res = await authFetch(`${BASE_URL}/school/profile`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateSchoolProfile(data: Partial<School>): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/school/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getSchoolYears(): Promise<SchoolYear[]> {
  const res = await authFetch(`${BASE_URL}/years`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addSchoolYear(data: { label: string; startDate: string; endDate: string; isActive: boolean; quarters?: any[] }): Promise<SchoolYear> {
  const res = await authFetch(`${BASE_URL}/years`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateSchoolYear(id: number, data: { label: string; startDate: string; endDate: string; isActive: boolean; quarters?: any[] }): Promise<SchoolYear> {
  const res = await authFetch(`${BASE_URL}/years/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteSchoolYear(id: number): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/years/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getSections(schoolYearId?: number, gradeLevel?: number): Promise<Section[]> {
  const params = new URLSearchParams();
  if (schoolYearId) params.append("schoolYearId", String(schoolYearId));
  if (gradeLevel) params.append("gradeLevel", String(gradeLevel));
  const res = await authFetch(`${BASE_URL}/sections?${params}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createSection(data: Partial<Section>): Promise<Section> {
  const res = await authFetch(`${BASE_URL}/sections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateSection(id: number, data: Partial<Section>): Promise<Section> {
  const res = await authFetch(`${BASE_URL}/sections/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteSection(id: number): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/sections/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getTeachers(): Promise<Teacher[]> {
  const res = await authFetch(`${BASE_URL}/teachers`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createTeacher(data: Partial<Teacher>): Promise<Teacher> {
  const res = await authFetch(`${BASE_URL}/teachers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateTeacher(id: number, data: Partial<Teacher>): Promise<Teacher> {
  const res = await authFetch(`${BASE_URL}/teachers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteTeacher(id: number): Promise<{ message: string }> {
  const res = await authFetch(`${BASE_URL}/teachers/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function assignSectionAdviser(sectionId: number, teacherId: number | null): Promise<Section> {
  const res = await authFetch(`${BASE_URL}/sections/${sectionId}/adviser`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adviserId: teacherId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Student Management ─────────────────────────────────────────────────────

export interface Student {
  id: number;
  lrn: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  gender: "Male" | "Female";
  birthdate: string;
  birthPlace?: string;
  nationality?: string;
  religion?: string;
  motherTongue?: string;
  address?: string;
  barangay?: string;
  municipality?: string;
  province?: string;
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  guardianRelationship?: string;
  contactNumber?: string;
  // Elementary Info
  elemSchoolName?: string;
  elemSchoolId?: string;
  elemSchoolAddress?: string;
  elemPeptPasser?: boolean;
  elemPeptDate?: string;
  elemAlsAePasser?: boolean;
  elemAlsAeDate?: string;
  elemCompletionDate?: string;
  elemGenAverage?: number;
  elemCitation?: string;
  // Alternative Credentials
  altCredentialType?: string;
  altCredentialRating?: string;
  altCredentialExamDate?: string;
  altCredentialCenter?: string;
}

export interface Enrollment {
  id: number;
  schoolYear: string;
  gradeLevel: number;
  section: string;
  adviserName?: string;
  status: "Enrolled" | "Promoted" | "Retained" | "Transferred" | "Dropped";
  enrollmentDate: string;
}

export interface AcademicRecord {
  enrollmentId: number;
  schoolYear: string;
  gradeLevel: number;
  section: string;
  generalAverage?: number;
  remarks?: string;
  subjectName?: string;
  q1Grade?: number;
  q2Grade?: number;
  q3Grade?: number;
  q4Grade?: number;
  finalGrade?: number;
  finalLetterGrade?: string;
  subjectRemarks?: string;
}

export async function getStudents(filters?: {
  grade?: string;
  section?: string;
  year?: string;
  gender?: string;
  search?: string;
}): Promise<Student[]> {
  const params = new URLSearchParams();
  if (filters?.grade) params.append("grade", filters.grade);
  if (filters?.section) params.append("section", filters.section);
  if (filters?.year) params.append("year", filters.year);
  if (filters?.gender) params.append("gender", filters.gender);
  if (filters?.search) params.append("search", filters.search);

  const res = await authFetch(`${BASE_URL}/students?${params}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createStudent(studentData: Partial<Student>): Promise<{ result: string; id: number }> {
  const res = await authFetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getStudentDetails(id: number): Promise<Student> {
  const res = await authFetch(`${BASE_URL}/students/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateStudent(id: number, studentData: Partial<Student>): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteStudent(id: number): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/students/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function enrollStudent(enrollmentData: {
  studentId: number;
  schoolYearId: number;
  sectionId: number;
  gradeLevel: number;
  enrollmentDate?: string;
}): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/students/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enrollmentData),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getStudentEnrollments(studentId: number): Promise<Enrollment[]> {
  const res = await authFetch(`${BASE_URL}/students/${studentId}/enrollments`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getStudentAcademicRecords(studentId: number): Promise<AcademicRecord[]> {
  const res = await authFetch(`${BASE_URL}/students/${studentId}/academic-records`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addTransfereeTranscript(studentId: number, transcriptData: any): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/students/${studentId}/transcript`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transcriptData),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Subject Management ─────────────────────────────────────────────────────

export interface Subject {
  id: number;
  code: string;
  name: string;
  displayName?: string;
  gradeLevel?: number;
  isMapeh?: boolean;
  mapehComponent?: string;
  mapehParentId?: number;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export async function getSubjects(): Promise<Subject[]> {
  const res = await authFetch(`${BASE_URL}/subjects`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createSubject(data: {
  name: string;
  code: string;
  gradeLevel: number;
  description?: string;
}): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateSubject(id: number, data: {
  name: string;
  code: string;
  gradeLevel: number;
  description?: string;
}): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/subjects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteSubject(id: number): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/subjects/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function reorderSubject(id: number, direction: "up" | "down"): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/subjects/${id}/order?direction=${direction}`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Grade Management ───────────────────────────────────────────────────────

export interface StudentGrade {
  studentId: number;
  lrn: string;
  fullName: string;
  subjectId: number;
  subjectName: string;
  q1Grade?: number;
  q2Grade?: number;
  q3Grade?: number;
  q4Grade?: number;
  finalGrade?: number;
  remarks?: string;
}

export interface GeneralAverage {
  studentId: number;
  lrn: string;
  fullName: string;
  generalAverage: number;
}

export async function getClassGradeSheet(section: string, schoolYear: string, quarter?: number): Promise<StudentGrade[]> {
  const params = new URLSearchParams({ section, schoolYear });
  if (quarter) params.append("quarter", quarter.toString());

  const res = await authFetch(`${BASE_URL}/grades/class?${params}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveClassGrades(gradesData: Array<{
  studentId: number;
  subjectId: number;
  sectionId: number;
  schoolYearId: number;
  quarter: string;
  grade: number;
}>): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/grades/class`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gradesData),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getStudentGrades(studentId: number): Promise<Array<{
  subjectName: string;
  q1Grade?: number;
  q2Grade?: number;
  q3Grade?: number;
  q4Grade?: number;
  finalGrade?: number;
  remarks?: string;
}>> {
  const res = await authFetch(`${BASE_URL}/grades/student/${studentId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getGeneralAverage(section: string, quarter?: string): Promise<GeneralAverage[]> {
  const params = new URLSearchParams({ section });
  if (quarter) params.append("quarter", quarter);

  const res = await authFetch(`${BASE_URL}/grades/general-average?${params}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Import Management ──────────────────────────────────────────────────────

export interface ImportLog {
  id: number;
  fileId: string;
  fileName: string;
  fileUrl: string;
  section: string;
  gradeLevel: number;
  schoolYear: string;
  quarter: number;
  importedBy: string;
  importedAt: string;
  status: "success" | "partial" | "failed" | "processing";
  rowsTotal: number;
  rowsEncoded: number;
  rowsSkipped: number;
  errors: any[];
}

export async function getStudentSF10History(studentId: number): Promise<any[]> {
  const res = await authFetch(`${BASE_URL}/sf10/history/${studentId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function startImport(data: {
  fileUrl: string;
  section: string;
  gradeLevel: number;
  schoolYear: string;
  quarter: number;
  columnMappings: Array<{ sourceColumn: string; targetField: string }>;
}): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/imports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getImports(): Promise<ImportLog[]> {
  const res = await authFetch(`${BASE_URL}/imports`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getImportHistory(): Promise<ImportLog[]> {
  const res = await authFetch(`${BASE_URL}/imports/history`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getImportDetails(logId: number): Promise<ImportLog> {
  const res = await authFetch(`${BASE_URL}/imports/${logId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function confirmImport(logId: number, skipErrors?: boolean): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/imports/${logId}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skipErrors }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── SF10 Management ────────────────────────────────────────────────────────

export async function getSF10Data(studentId: number): Promise<any> {
  const res = await authFetch(`${BASE_URL}/sf10/${studentId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function generateBulkSF10(studentIds: number[], options?: any): Promise<{ result: string }> {
  const res = await authFetch(`${BASE_URL}/sf10/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentIds, options }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function exportSF10PDF(studentId: number): Promise<Blob> {
  const res = await authFetch(`${BASE_URL}/sf10/${studentId}/export`);
  if (!res.ok) throw new Error(await res.text());
  return res.blob();
}