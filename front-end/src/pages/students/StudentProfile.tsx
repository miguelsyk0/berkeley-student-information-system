import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight, Pencil, GraduationCap, User,
  BookOpen, Clock, Award,
  TrendingUp, CheckCircle2, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  GRADE_COLORS, STATUS_STYLES,
} from "@/utils/gradeUtils";
import { useHeader } from "@/contexts/HeaderContext";
import React from "react";
import { getAge, formatDate } from "@/utils/dateUtils";
import { getStudentDetails, getStudentEnrollments, getStudentAcademicRecords } from "@/services/api";
import { ROUTES } from "@/routes";
import type { Student, Enrollment, AcademicRecord } from "@/services/api";

// ── Helpers ────────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5 py-3 border-b border-slate-100 last:border-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-700">
        {value ?? <span className="text-slate-300 font-normal">—</span>}
      </p>
    </div>
  );
}

// ── Tab: Personal Information ──────────────────────────────────────────────────

function PersonalInfoTab({ student }: { student: Student }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pt-5 pb-0 px-5">
          <CardTitle className="text-xs font-black text-slate-600 uppercase tracking-widest">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <InfoRow label="Last Name" value={student.lastName} />
          <InfoRow label="First Name" value={student.firstName} />
          <InfoRow label="Middle Name" value={student.middleName} />
          <InfoRow label="Suffix" value={student.suffix} />
          <InfoRow label="Sex" value={student.gender} />
          <InfoRow
            label="Birthdate"
            value={`${formatDate(student.birthdate)} (${getAge(student.birthdate)} years old)`}
          />
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardHeader className="pt-5 pb-0 px-5">
          <CardTitle className="text-xs font-black text-slate-600 uppercase tracking-widest">System Information</CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <InfoRow label="Learner Reference Number (LRN)" value={student.lrn} />
          <InfoRow label="Student ID" value={`STU-${String(student.id).padStart(5, "0")}`} />
        </CardContent>
      </Card>
    </div>
  );
}

// ── Tab: JHS Eligibility ───────────────────────────────────────────────────────

function EligibilityTab({ student }: { student: Student }) {
  const hasCredential = !!student.elemSchoolId || !!student.elemSchoolName; // updated heuristic

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pt-5 pb-0 px-5">
          <CardTitle className="text-xs font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-violet-500" />
            Elementary School Completion
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <InfoRow label="School Name" value={student.elemSchoolName} />
          <InfoRow label="School ID" value={student.elemSchoolId} />
          <InfoRow label="School Address" value={student.elemSchoolAddress} />
          <InfoRow label="General Average" value={student.elemGenAverage} />
          <InfoRow label="Citation / Honors" value={student.elemCitation} />
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pt-5 pb-0 px-5">
          <CardTitle className="text-xs font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Alternative Credential
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {hasCredential ? (
            <>
              <InfoRow label="Credential Type" value={student.altCredentialType} />
              <InfoRow label="Rating" value={student.altCredentialRating} />
              <InfoRow label="Exam Date" value={student.altCredentialExamDate ? formatDate(student.altCredentialExamDate) : undefined} />
              <InfoRow label="Testing Center" value={student.altCredentialCenter} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Award className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-xs">No alternative credential on record.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Tab: Enrollment History ────────────────────────────────────────────────────

function EnrollmentHistoryTab({ enrollments }: { studentId?: number; enrollments: Enrollment[] }) {
  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <GraduationCap className="w-10 h-10 mb-3 opacity-20" />
        <p className="text-sm font-semibold">No enrollment records found.</p>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80">
            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">School Year</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Grade Level</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Section</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Adviser</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => (
            <tr key={e.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
              <td className="px-5 py-3.5">
                <p className="text-xs font-semibold text-slate-700">S.Y. {e.schoolYear}</p>
              </td>
              <td className="px-4 py-3.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[e.gradeLevel]}`}>
                  Grade {e.gradeLevel}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <p className="text-xs text-slate-600">{e.section}</p>
              </td>
              <td className="px-4 py-3.5">
                <p className="text-xs text-slate-500">{e.adviserName ?? "—"}</p>
              </td>
              <td className="px-4 py-3.5">
                <Badge className={`text-[10px] h-5 px-2 border-0 ${STATUS_STYLES[e.status]}`}>
                  {e.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

// ── Tab: Academic Record ───────────────────────────────────────────────────────

function AcademicRecordTab({ records }: { studentId?: number; records: AcademicRecord[] }) {
  const [selectedRecord, setSelectedRecord] = useState<AcademicRecord | null>(records[0] ?? null);

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <TrendingUp className="w-10 h-10 mb-3 opacity-20" />
        <p className="text-sm font-semibold">No academic records found.</p>
        <p className="text-xs mt-1">Grades will appear here once they are encoded.</p>
      </div>
    );
  }

  function gradeColor(grade?: number) {
    if (!grade) return "text-slate-400";
    if (grade >= 90) return "text-emerald-600 font-bold";
    if (grade >= 80) return "text-blue-600 font-semibold";
    if (grade >= 75) return "text-slate-700 font-semibold";
    return "text-red-600 font-bold";
  }

  return (
    <div className="space-y-4">
      {/* School year tabs */}
      {records.length > 1 && (
        <div className="flex gap-2">
          {records.map((r) => (
            <button
              key={r.enrollmentId}
              onClick={() => setSelectedRecord(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedRecord?.enrollmentId === r.enrollmentId
                  ? "bg-teal-600 text-white"
                  : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                }`}
            >
              Grade {r.gradeLevel} — S.Y. {r.schoolYear}
            </button>
          ))}
        </div>
      )}

      {selectedRecord && (
        <Card className="border-0 shadow-sm overflow-hidden">
          {/* Record header */}
          <div className="flex items-center gap-4 px-5 py-4 bg-slate-50 border-b border-slate-100">
            <div>
              <p className="text-xs font-black text-slate-700">
                Grade {selectedRecord.gradeLevel} — {selectedRecord.section}
              </p>
              <p className="text-[11px] text-slate-400">S.Y. {selectedRecord.schoolYear}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {selectedRecord.generalAverage && (
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">General Average</p>
                  <p className={`text-lg font-black ${gradeColor(selectedRecord.generalAverage)}`}>
                    {selectedRecord.generalAverage.toFixed(2)}
                  </p>
                </div>
              )}
              {selectedRecord.finalLetterGrade && (
                <span className="text-2xl font-black text-teal-600 border-2 border-teal-200 rounded-xl w-10 h-10 flex items-center justify-center">
                  {selectedRecord.finalLetterGrade}
                </span>
              )}
            </div>
          </div>

          {/* Grades table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Q1</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Q2</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Q3</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Q4</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Final</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Grade</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {selectedRecord.subjectName ? (
                <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <p className="text-xs font-semibold text-slate-700">{selectedRecord.subjectName}</p>
                  </td>
                  {[selectedRecord.q1Grade, selectedRecord.q2Grade, selectedRecord.q3Grade, selectedRecord.q4Grade].map((q, i) => (
                    <td key={i} className={`px-4 py-3 text-center text-xs ${gradeColor(q)}`}>
                      {q ?? "—"}
                    </td>
                  ))}
                  <td className={`px-4 py-3 text-center text-sm ${gradeColor(selectedRecord.finalGrade)}`}>
                    {selectedRecord.finalGrade?.toFixed(2) ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    —
                  </td>
                  <td className="px-4 py-3 text-center">
                    {selectedRecord.subjectRemarks === "Passed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                    ) : selectedRecord.subjectRemarks === "Failed" ? (
                      <AlertCircle className="w-4 h-4 text-red-400 mx-auto" />
                    ) : (
                      <span className="text-[11px] text-slate-400">{selectedRecord.subjectRemarks ?? "—"}</span>
                    )}
                  </td>
                </tr>
              ) : (
                <tr><td colSpan={8} className="text-center py-4 text-xs text-slate-400">No grades detailed.</td></tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "personal", label: "Personal Information", icon: User },
  { key: "eligibility", label: "JHS Eligibility", icon: BookOpen },
  { key: "history", label: "Enrollment History", icon: Clock },
  { key: "academic", label: "Academic Record", icon: TrendingUp },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function StudentProfile() {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>("personal");

  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!studentId) return;
      try {
        setLoading(true);
        const [studentData, enrollmentsData, recordsData] = await Promise.all([
          getStudentDetails(Number(studentId)),
          getStudentEnrollments(Number(studentId)),
          getStudentAcademicRecords(Number(studentId)),
        ]);
        setStudent(studentData);
        setEnrollments(enrollmentsData ?? []);
        setAcademicRecords(recordsData ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-20">
        <p className="text-slate-400 font-semibold animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20">
        <div className="text-center text-slate-400">
          <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-semibold">Student not found.</p>
          <button onClick={() => navigate(ROUTES.students.root)} className="text-teal-500 text-sm mt-2 hover:underline">
            Back to Student List
          </button>
        </div>
      </div>
    );
  }

  const currentEnrollment = enrollments.find(
    (e) => e.status === "Enrolled"
  );

  useHeader({
    breadcrumbs: [
      { label: "Students", href: ROUTES.students.root },
      { label: `${student.lastName}, ${student.firstName}` },
    ],
    actions: (
      <div className="flex gap-2">
        {!currentEnrollment && (
          <Button
            size="sm" variant="outline"
            className="h-8 text-xs gap-1.5"
            onClick={() => navigate(ROUTES.students.enroll, { state: { student } })}
          >
            <GraduationCap className="w-3.5 h-3.5" /> Enroll
          </Button>
        )}
        <Button
          size="sm"
          className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
          onClick={() => navigate(ROUTES.students.edit(student.id), { state: { student } })}
        >
          <Pencil className="w-3.5 h-3.5" /> Edit Info
        </Button>
      </div>
    )
  });

  return (
    <div className="p-6 space-y-5">
        {/* ── Student Header Card ── */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-5">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-teal-100 text-teal-800 text-xl font-black">
                  {student.firstName[0]}{student.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-xl font-black text-slate-800">
                  {student.lastName}, {student.firstName}
                  {student.suffix ? ` ${student.suffix}` : ""}
                  {student.middleName ? ` ${student.middleName[0]}.` : ""}
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-0.5">LRN: {student.lrn}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-xs text-slate-500">{student.gender}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">{getAge(student.birthdate)} years old</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">{formatDate(student.birthdate)}</span>
                  {currentEnrollment && (
                    <>
                      <span className="text-slate-300">·</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[currentEnrollment.gradeLevel]}`}>
                        Grade {currentEnrollment.gradeLevel} — {currentEnrollment.section}
                      </span>
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] h-4 px-1.5">
                        Enrolled
                      </Badge>
                    </>
                  )}
                  {!currentEnrollment && (
                    <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] h-4 px-1.5">
                      Not enrolled
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${activeTab === tab.key
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === "personal" && <PersonalInfoTab student={student} />}
        {activeTab === "eligibility" && <EligibilityTab student={student} />}
        {activeTab === "history" && <EnrollmentHistoryTab studentId={student.id} enrollments={enrollments} />}
        {activeTab === "academic" && <AcademicRecordTab studentId={student.id} records={academicRecords} />}
      </div>
  );
}