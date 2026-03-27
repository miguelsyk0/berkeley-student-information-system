import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronRight, GraduationCap, Save, X,
  User, School, CheckCircle2,
  UserPlus, Users, ArrowRight, Plus, Trash2,
  BookOpen, Award, Building2, AlertCircle,
  ArrowLeft, ClipboardList, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from "@/components/sidebar";
import { GRADE_COLORS } from "@/utils/gradeUtils";
import { getAge } from "@/utils/dateUtils";
import { getStudents, addStudent, enrollStudent, getStudentEnrollments } from "@/services/api";
import type { Student, Enrollment } from "@/services/api";
import { ROUTES } from "@/routes";

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

export interface SubjectGradeEntry {
  subjectName: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  finalRating: string;
  remarks: string;
  isMapeh?: boolean;
  mapehComponent?: string;
}

export interface SchoolRecord {
  id: string;
  // School details
  schoolName: string;
  schoolId: string;
  schoolAddress: string;
  district: string;
  division: string;
  region: string;
  adviserName: string;
  // This school can have multiple grade-year entries (e.g. stayed 2 years)
  gradeYearEntries: GradeYearEntry[];
}

export interface GradeYearEntry {
  id: string;
  gradeLevel: string;
  schoolYear: string;
  sectionName: string;
  generalAverage: string;
  remarks: string;
  subjects: SubjectGradeEntry[];
}

type EnrollmentMode = "existing" | "transferee" | null;

// transferee sub-pages
// page 0 = dashboard (mode select)
// page 1 = personal info / eligibility  [transferee only]
// page 2 = prior transcript encoding    [transferee only]
// page 3 = enrollment assignment (grade/section) — both modes share this
type WizardPage = 0 | 1 | 2 | 3;

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS / DEFAULTS
// ══════════════════════════════════════════════════════════════════════════════

const SECTIONS_BY_GRADE: Record<string, { id: number; name: string; adviserName: string; slots: number; enrolled: number }[]> = {
  "7": [
    { id: 1, name: "Integrity",  adviserName: "Ms. A. Reyes",  slots: 40, enrolled: 38 },
    { id: 2, name: "Honesty",    adviserName: "Mr. B. Santos", slots: 40, enrolled: 36 },
    { id: 3, name: "Loyalty",    adviserName: "TBA",           slots: 40, enrolled: 34 },
  ],
  "8": [
    { id: 4, name: "Diligence",  adviserName: "Ms. C. Cruz",   slots: 40, enrolled: 40 },
    { id: 5, name: "Humility",   adviserName: "Mr. D. Lim",    slots: 40, enrolled: 38 },
  ],
  "9": [
    { id: 6, name: "Wisdom",     adviserName: "Ms. E. Garcia", slots: 40, enrolled: 35 },
    { id: 7, name: "Courage",    adviserName: "TBA",           slots: 40, enrolled: 32 },
  ],
  "10": [
    { id: 8, name: "Excellence", adviserName: "Mr. F. Torres", slots: 40, enrolled: 37 },
  ],
};

const SCHOOL_YEARS = ["2025-2026", "2024-2025", "2023-2024", "2022-2023", "2021-2022", "2020-2021"];

const DEFAULT_SUBJECTS: SubjectGradeEntry[] = [
  { subjectName: "Filipino",                             q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "English",                              q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Mathematics",                          q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Science",                              q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Araling Panlipunan (AP)",              q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Edukasyon sa Pagpapakatao (EsP)",       q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Technology and Livelihood Education (TLE)", q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "MAPEH", isMapeh: true,                 q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Music",   isMapeh: true, mapehComponent: "Music",  q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Arts",    isMapeh: true, mapehComponent: "Arts",   q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Physical Education", isMapeh: true, mapehComponent: "PE", q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Health",  isMapeh: true, mapehComponent: "Health", q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
];

const EMPTY_GRADE_YEAR_ENTRY = (): GradeYearEntry => ({
  id: crypto.randomUUID(),
  gradeLevel: "",
  schoolYear: "",
  sectionName: "",
  generalAverage: "",
  remarks: "Promoted",
  subjects: DEFAULT_SUBJECTS.map((s) => ({ ...s })),
});

const EMPTY_SCHOOL_RECORD = (): SchoolRecord => ({
  id: crypto.randomUUID(),
  schoolName: "",
  schoolId: "",
  schoolAddress: "",
  district: "",
  division: "",
  region: "",
  adviserName: "",
  gradeYearEntries: [EMPTY_GRADE_YEAR_ENTRY()],
});

type TransfereeForm = {
  lrn: string;
  lastName: string;
  firstName: string;
  middleName: string;
  nameExtension: string;
  sex: "Male" | "Female";
  birthdate: string;
  elementarySchoolName: string;
  elementarySchoolId: string;
  elementarySchoolAddress: string;
  elementaryGeneralAvg: string;
  elementaryCitation: string;
  otherCredential: string;
  otherCredentialRating: string;
  credentialExamDate: string;
  credentialTestingCenter: string;
};

const EMPTY_TRANSFEREE_FORM = (): TransfereeForm => ({
  lrn: "",
  lastName: "",
  firstName: "",
  middleName: "",
  nameExtension: "",
  sex: "Male",
  birthdate: "",
  elementarySchoolName: "",
  elementarySchoolId: "",
  elementarySchoolAddress: "",
  elementaryGeneralAvg: "",
  elementaryCitation: "",
  otherCredential: "",
  otherCredentialRating: "",
  credentialExamDate: "",
  credentialTestingCenter: "",
});

// ══════════════════════════════════════════════════════════════════════════════
// SMALL SHARED UI HELPERS
// ══════════════════════════════════════════════════════════════════════════════

function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function SectionSelector({
  gradeLevel, selectedSectionId, onSelect, accent = "teal",
}: {
  gradeLevel: string;
  selectedSectionId: number | null;
  onSelect: (id: number, name: string) => void;
  accent?: "teal" | "violet";
}) {
  const sections = SECTIONS_BY_GRADE[gradeLevel] ?? [];
  const selBorder = accent === "violet" ? "border-violet-400 bg-violet-50" : "border-teal-400 bg-teal-50";
  const hov       = accent === "violet" ? "hover:border-violet-200 hover:bg-violet-50/40" : "hover:border-teal-200 hover:bg-teal-50/40";
  const chk       = accent === "violet" ? "text-violet-600" : "text-teal-600";

  return (
    <div className="space-y-2">
      {sections.map((sec) => {
        const full   = sec.enrolled >= sec.slots;
        const sel    = selectedSectionId === sec.id;
        const remain = sec.slots - sec.enrolled;
        return (
          <button
            key={sec.id}
            disabled={full}
            onClick={() => !full && onSelect(sec.id, sec.name)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all text-left
              ${sel ? selBorder : full
                ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                : `border-slate-100 bg-white ${hov}`}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${GRADE_COLORS[Number(gradeLevel)]}`}>
              <School className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">Grade {gradeLevel} — {sec.name}</p>
              <p className="text-[11px] text-slate-400">{sec.adviserName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-600">{sec.enrolled} / {sec.slots}</p>
              <p className={`text-[10px] ${full ? "text-red-500 font-bold" : "text-slate-400"}`}>
                {full ? "Full" : `${remain} slot${remain !== 1 ? "s" : ""} left`}
              </p>
            </div>
            {sel && <CheckCircle2 className={`w-5 h-5 ${chk} flex-shrink-0`} />}
          </button>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 0 — MODE SELECTOR (Dashboard)
// ══════════════════════════════════════════════════════════════════════════════

function ModeSelectorPage({
  onSelect,
}: {
  onSelect: (mode: "existing" | "transferee") => void;
}) {
  const [hovered, setHovered] = useState<"existing" | "transferee" | null>(null);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-full py-16 px-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 mb-4">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Enroll a Student</h1>
          <p className="text-sm text-slate-400">Select the type of enrollment to proceed.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-5">
          {/* Existing */}
          <button
            onClick={() => onSelect("existing")}
            onMouseEnter={() => setHovered("existing")}
            onMouseLeave={() => setHovered(null)}
            className={`group relative flex flex-col items-start gap-4 p-7 rounded-2xl border-2 text-left transition-all duration-200
              ${hovered === "existing"
                ? "border-teal-400 bg-teal-50 shadow-lg shadow-teal-100 -translate-y-0.5"
                : "border-slate-150 bg-white hover:shadow-md"}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200
              ${hovered === "existing" ? "bg-teal-600" : "bg-slate-100"}`}
            >
              <Users className={`w-6 h-6 transition-colors duration-200 ${hovered === "existing" ? "text-white" : "text-slate-500"}`} />
            </div>
            <div className="flex-1 space-y-1">
              <p className={`text-base font-black transition-colors ${hovered === "existing" ? "text-teal-800" : "text-slate-800"}`}>
                Existing Student
              </p>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                Student already has a profile in the system. Search and assign to a new school year.
              </p>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-bold transition-colors duration-200
              ${hovered === "existing" ? "text-teal-600" : "text-slate-400"}`}
            >
              Search & Enroll <ArrowRight className="w-3.5 h-3.5" />
            </div>
            {/* Steps preview */}
            <div className="absolute bottom-4 right-5 flex gap-1">
              {["Student", "Grade", "Section"].map((s, i) => (
                <span key={i} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-colors
                  ${hovered === "existing" ? "bg-teal-100 text-teal-600" : "bg-slate-100 text-slate-400"}`}>
                  {s}
                </span>
              ))}
            </div>
          </button>

          {/* Transferee */}
          <button
            onClick={() => onSelect("transferee")}
            onMouseEnter={() => setHovered("transferee")}
            onMouseLeave={() => setHovered(null)}
            className={`group relative flex flex-col items-start gap-4 p-7 rounded-2xl border-2 text-left transition-all duration-200
              ${hovered === "transferee"
                ? "border-violet-400 bg-violet-50 shadow-lg shadow-violet-100 -translate-y-0.5"
                : "border-slate-150 bg-white hover:shadow-md"}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200
              ${hovered === "transferee" ? "bg-violet-600" : "bg-slate-100"}`}
            >
              <UserPlus className={`w-6 h-6 transition-colors duration-200 ${hovered === "transferee" ? "text-white" : "text-slate-500"}`} />
            </div>
            <div className="flex-1 space-y-1">
              <p className={`text-base font-black transition-colors ${hovered === "transferee" ? "text-violet-800" : "text-slate-800"}`}>
                Transferee
              </p>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                New student from another school. Creates a full profile, encodes prior transcript for SF10.
              </p>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-bold transition-colors duration-200
              ${hovered === "transferee" ? "text-violet-600" : "text-slate-400"}`}
            >
              Full Enrollment <ArrowRight className="w-3.5 h-3.5" />
            </div>
            {/* Steps preview */}
            <div className="absolute bottom-4 right-5 flex gap-1">
              {["Profile", "Transcript", "Grade", "Section"].map((s, i) => (
                <span key={i} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-colors
                  ${hovered === "transferee" ? "bg-violet-100 text-violet-600" : "bg-slate-100 text-slate-400"}`}>
                  {s}
                </span>
              ))}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — TRANSFEREE PERSONAL INFO
// ══════════════════════════════════════════════════════════════════════════════

function TransfereeInfoPage({
  form,
  onChange,
  errors,
}: {
  form: TransfereeForm;
  onChange: <K extends keyof TransfereeForm>(key: K, value: TransfereeForm[K]) => void;
  errors: Partial<Record<keyof TransfereeForm, string>>;
}) {
  const hasCredential = !!form.otherCredential && form.otherCredential !== "none";

  return (
    <div className="max-w-3xl mx-auto space-y-5 py-6 px-6">
      {/* Notice */}
      <div className="flex gap-3 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
        <UserPlus className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-violet-700 leading-relaxed">
          Fill in the student's personal information, elementary school eligibility details, and any alternative credentials. You'll enter prior school transcript records on the next step.
        </p>
      </div>

      {/* Personal Info */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-0 pt-5 px-6">
          <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
            <User className="w-4 h-4 text-violet-500" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4 space-y-4">
          <Field label="Learner Reference Number (LRN)" required error={errors.lrn}>
            <Input
              value={form.lrn}
              onChange={(e) => onChange("lrn", e.target.value.replace(/\D/g, "").slice(0, 12))}
              placeholder="12-digit LRN"
              maxLength={12}
              className={`h-9 text-sm font-mono border-slate-200 ${errors.lrn ? "border-red-400" : ""}`}
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Last Name" required error={errors.lastName}>
              <Input value={form.lastName} onChange={(e) => onChange("lastName", e.target.value)}
                placeholder="Dela Cruz" className={`h-9 text-sm border-slate-200 ${errors.lastName ? "border-red-400" : ""}`} />
            </Field>
            <Field label="First Name" required error={errors.firstName}>
              <Input value={form.firstName} onChange={(e) => onChange("firstName", e.target.value)}
                placeholder="Juan" className={`h-9 text-sm border-slate-200 ${errors.firstName ? "border-red-400" : ""}`} />
            </Field>
            <Field label="Middle Name">
              <Input value={form.middleName} onChange={(e) => onChange("middleName", e.target.value)}
                placeholder="Santos" className="h-9 text-sm border-slate-200" />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Name Extension">
              <Select value={form.nameExtension || "none"} onValueChange={(v) => onChange("nameExtension", v === "none" ? "" : v)}>
                <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Jr.">Jr.</SelectItem>
                  <SelectItem value="Sr.">Sr.</SelectItem>
                  <SelectItem value="II">II</SelectItem>
                  <SelectItem value="III">III</SelectItem>
                  <SelectItem value="IV">IV</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Sex" required>
              <Select value={form.sex} onValueChange={(v) => onChange("sex", v as "Male" | "Female")}>
                <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Birthdate" required error={errors.birthdate}>
              <Input type="date" value={form.birthdate} onChange={(e) => onChange("birthdate", e.target.value)}
                className={`h-9 text-sm border-slate-200 ${errors.birthdate ? "border-red-400" : ""}`} />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* JHS Eligibility */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-0 pt-5 px-6">
          <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-500" />
            JHS Eligibility
            <Badge className="ml-1 bg-slate-100 text-slate-500 border-0 text-[10px]">from Elementary</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Elementary School Name">
              <Input value={form.elementarySchoolName} onChange={(e) => onChange("elementarySchoolName", e.target.value)}
                placeholder="e.g. Quezon City Elementary School" className="h-9 text-sm border-slate-200" />
            </Field>
            <Field label="School ID">
              <Input value={form.elementarySchoolId} onChange={(e) => onChange("elementarySchoolId", e.target.value)}
                placeholder="e.g. 105001" className="h-9 text-sm border-slate-200" />
            </Field>
          </div>
          <Field label="School Address">
            <Input value={form.elementarySchoolAddress} onChange={(e) => onChange("elementarySchoolAddress", e.target.value)}
              placeholder="Complete address" className="h-9 text-sm border-slate-200" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="General Average">
              <Input type="number" min={0} max={100} step={0.01} value={form.elementaryGeneralAvg}
                onChange={(e) => onChange("elementaryGeneralAvg", e.target.value)}
                placeholder="e.g. 92.5" className="h-9 text-sm border-slate-200" />
            </Field>
            <Field label="Honors / Citation">
              <Input value={form.elementaryCitation} onChange={(e) => onChange("elementaryCitation", e.target.value)}
                placeholder="e.g. With Highest Honors" className="h-9 text-sm border-slate-200" />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Credentials */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-0 pt-5 px-6">
          <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Alternative Credentials
            <Badge className="ml-1 bg-slate-100 text-slate-500 border-0 text-[10px]">Optional — PEPT / ALS</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4 space-y-4">
          <Field label="Credential Type">
            <Select value={form.otherCredential || "none"} onValueChange={(v) => onChange("otherCredential", v === "none" ? "" : v)}>
              <SelectTrigger className="h-9 text-sm border-slate-200">
                <SelectValue placeholder="No alternative credential" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="PEPT">PEPT</SelectItem>
                <SelectItem value="ALS">ALS (A&E)</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {hasCredential && (
            <div className="grid grid-cols-3 gap-3">
              <Field label="Rating / Grade">
                <Input value={form.otherCredentialRating} onChange={(e) => onChange("otherCredentialRating", e.target.value)}
                  placeholder="e.g. 85.0" className="h-9 text-sm border-slate-200" />
              </Field>
              <Field label="Exam Date">
                <Input type="date" value={form.credentialExamDate} onChange={(e) => onChange("credentialExamDate", e.target.value)}
                  className="h-9 text-sm border-slate-200" />
              </Field>
              <Field label="Testing Center">
                <Input value={form.credentialTestingCenter} onChange={(e) => onChange("credentialTestingCenter", e.target.value)}
                  placeholder="Testing center name" className="h-9 text-sm border-slate-200" />
              </Field>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GRADE ENCODING TABLE — used inside page 2
// ══════════════════════════════════════════════════════════════════════════════

function computeFinalRating(s: SubjectGradeEntry): string {
  const vals = [s.q1, s.q2, s.q3, s.q4].map(Number).filter((v) => !isNaN(v) && v > 0);
  if (vals.length === 0) return "";
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return avg.toFixed(2);
}

function GradeEncodingTable({
  entry,
  onUpdateSubject,
}: {
  entry: GradeYearEntry;
  onUpdateSubject: (entryId: string, subjectIdx: number, field: keyof SubjectGradeEntry, value: string) => void;
}) {
  const qCols = ["q1", "q2", "q3", "q4"] as const;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-xs min-w-[520px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-44">
              Learning Area
            </th>
            {qCols.map((q) => (
              <th key={q} className="px-2 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center w-14">
                Q{q[1]}
              </th>
            ))}
            <th className="px-2 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center w-16">
              Final
            </th>
            <th className="px-2 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center w-16">
              Remarks
            </th>
          </tr>
        </thead>
        <tbody>
          {entry.subjects.map((subj, idx) => {
            const isMapehParent = subj.isMapeh && !subj.mapehComponent;
            const isMapehChild  = subj.isMapeh && !!subj.mapehComponent;
            const computedFinal = computeFinalRating(subj);
            const finalVal = subj.finalRating || computedFinal;
            const finalNum = parseFloat(finalVal);
            const passed   = !isNaN(finalNum) && finalNum >= 75;

            return (
              <tr
                key={idx}
                className={`border-b border-slate-100 last:border-0 transition-colors
                  ${isMapehParent ? "bg-slate-50/80 font-semibold" : "bg-white hover:bg-slate-50/40"}`}
              >
                <td className={`px-3 py-1.5 text-[11px] text-slate-700 ${isMapehChild ? "pl-6 text-slate-500" : ""}`}>
                  {isMapehChild && <span className="text-slate-300 mr-1">└</span>}
                  {subj.subjectName}
                </td>
                {qCols.map((q) => (
                  <td key={q} className="px-1 py-1">
                    {isMapehParent ? (
                      <div className="h-7 flex items-center justify-center text-[10px] text-slate-300 italic">auto</div>
                    ) : (
                      <Input
                        type="number"
                        min={0} max={100} step={1}
                        value={subj[q]}
                        onChange={(e) => onUpdateSubject(entry.id, idx, q, e.target.value)}
                        placeholder="—"
                        className="h-7 text-xs text-center border-slate-200 px-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    )}
                  </td>
                ))}
                <td className="px-1 py-1 text-center">
                  {isMapehParent ? (
                    <span className="text-[11px] text-slate-400 italic">—</span>
                  ) : (
                    <span className={`text-[11px] font-bold ${
                      !finalVal ? "text-slate-300" : passed ? "text-emerald-600" : "text-red-500"
                    }`}>
                      {finalVal || "—"}
                    </span>
                  )}
                </td>
                <td className="px-1 py-1 text-center">
                  {!isMapehParent && finalVal && (
                    <Badge className={`text-[9px] h-4 px-1.5 border-0 ${
                      passed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                    }`}>
                      {passed ? "P" : "F"}
                    </Badge>
                  )}
                </td>
              </tr>
            );
          })}
          {/* General Average row */}
          <tr className="bg-slate-50 border-t-2 border-slate-200">
            <td colSpan={5} className="px-3 py-2 text-[11px] font-black text-slate-600 italic text-right pr-4">
              General Average
            </td>
            <td className="px-2 py-2 text-center">
              <span className={`text-sm font-black ${
                entry.generalAverage ? "text-slate-800" : "text-slate-300"
              }`}>
                {entry.generalAverage || "—"}
              </span>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GRADE-YEAR ENTRY CARD — one accordion panel inside a school record
// ══════════════════════════════════════════════════════════════════════════════

function GradeYearEntryPanel({
  entry,
  entryIndex,
  schoolId,
  canRemove,
  onUpdate,
  onRemove,
  onUpdateSubject,
}: {
  entry: GradeYearEntry;
  entryIndex: number;
  schoolId: string;
  canRemove: boolean;
  onUpdate: (schoolId: string, entryId: string, field: keyof GradeYearEntry, value: string) => void;
  onRemove: (schoolId: string, entryId: string) => void;
  onUpdateSubject: (schoolId: string, entryId: string, subjectIdx: number, field: keyof SubjectGradeEntry, value: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const label = entry.gradeLevel ? `Grade ${entry.gradeLevel}` : `Entry ${entryIndex + 1}`;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* Accordion header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 transition-colors text-left"
      >
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black
          ${entry.gradeLevel ? GRADE_COLORS[Number(entry.gradeLevel)] : "bg-slate-200 text-slate-500"}`}>
          {entry.gradeLevel || "?"}
        </div>
        <div className="flex-1">
          <span className="text-xs font-bold text-slate-700">{label}</span>
          {entry.schoolYear && (
            <span className="ml-2 text-[10px] text-slate-400">S.Y. {entry.schoolYear}</span>
          )}
          {entry.generalAverage && (
            <span className="ml-2 text-[10px] font-bold text-emerald-600">GWA {entry.generalAverage}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(schoolId, entry.id); }}
              className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 transition-colors px-2 py-0.5 rounded"
            >
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* Accordion body */}
      {open && (
        <div className="border-t border-slate-100 bg-slate-50/30 p-4 space-y-4">
          {/* Grade/Year/Section/Adviser row */}
          <div className="grid grid-cols-4 gap-3">
            <Field label="Grade Level" required>
              <Select value={entry.gradeLevel} onValueChange={(v) => onUpdate(schoolId, entry.id, "gradeLevel", v)}>
                <SelectTrigger className="h-8 text-xs border-slate-200">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {["7","8","9","10"].map((g) => (
                    <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="School Year" required>
              <Select value={entry.schoolYear} onValueChange={(v) => onUpdate(schoolId, entry.id, "schoolYear", v)}>
                <SelectTrigger className="h-8 text-xs border-slate-200">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {SCHOOL_YEARS.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Section Name">
              <Input value={entry.sectionName} onChange={(e) => onUpdate(schoolId, entry.id, "sectionName", e.target.value)}
                placeholder="e.g. Rizal" className="h-8 text-xs border-slate-200" />
            </Field>
            <Field label="General Average">
              <Input type="number" min={0} max={100} step={0.01} value={entry.generalAverage}
                onChange={(e) => onUpdate(schoolId, entry.id, "generalAverage", e.target.value)}
                placeholder="e.g. 88.5" className="h-8 text-xs border-slate-200" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Remarks / Status at End of Year">
              <Select value={entry.remarks} onValueChange={(v) => onUpdate(schoolId, entry.id, "remarks", v)}>
                <SelectTrigger className="h-8 text-xs border-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Promoted">Promoted</SelectItem>
                  <SelectItem value="Retained">Retained</SelectItem>
                  <SelectItem value="Transferred">Transferred</SelectItem>
                  <SelectItem value="Dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Grade encoding table */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Subject Grades</p>
            <GradeEncodingTable
              entry={entry}
              onUpdateSubject={(entryId, subjectIdx, field, value) =>
                onUpdateSubject(schoolId, entryId, subjectIdx, field, value)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCHOOL RECORD CARD — left column (details) + right column (grade entries)
// ══════════════════════════════════════════════════════════════════════════════

function SchoolRecordCard({
  record,
  recordIndex,
  canRemove,
  onUpdateSchool,
  onRemoveSchool,
  onUpdateEntry,
  onRemoveEntry,
  onAddEntry,
  onUpdateSubject,
}: {
  record: SchoolRecord;
  recordIndex: number;
  canRemove: boolean;
  onUpdateSchool: (id: string, field: keyof SchoolRecord, value: string) => void;
  onRemoveSchool: (id: string) => void;
  onUpdateEntry: (schoolId: string, entryId: string, field: keyof GradeYearEntry, value: string) => void;
  onRemoveEntry: (schoolId: string, entryId: string) => void;
  onAddEntry: (schoolId: string) => void;
  onUpdateSubject: (schoolId: string, entryId: string, subjectIdx: number, field: keyof SubjectGradeEntry, value: string) => void;
}) {
  const hasName = !!record.schoolName.trim();

  return (
    <div className="border-2 border-slate-200 rounded-2xl overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 text-[11px] font-black flex items-center justify-center">
            {recordIndex + 1}
          </div>
          <div>
            <p className="text-xs font-black text-slate-700">
              {hasName ? record.schoolName : `School ${recordIndex + 1}`}
            </p>
            {record.division && (
              <p className="text-[10px] text-slate-400">{record.division}</p>
            )}
          </div>
        </div>
        {canRemove && (
          <button
            onClick={() => onRemoveSchool(record.id)}
            className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Remove School
          </button>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[300px_1fr] divide-x divide-slate-200 min-h-0">

        {/* ── LEFT COLUMN: School Details ── */}
        <div className="p-5 space-y-3 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-3 h-3" /> School Details
          </p>

          <Field label="School Name" required>
            <Input value={record.schoolName}
              onChange={(e) => onUpdateSchool(record.id, "schoolName", e.target.value)}
              placeholder="e.g. Bagumbayan NHS" className="h-8 text-xs border-slate-200" />
          </Field>
          <Field label="School ID / DepEd ID">
            <Input value={record.schoolId}
              onChange={(e) => onUpdateSchool(record.id, "schoolId", e.target.value)}
              placeholder="e.g. 300123" className="h-8 text-xs border-slate-200" />
          </Field>
          <Field label="School Address">
            <Input value={record.schoolAddress}
              onChange={(e) => onUpdateSchool(record.id, "schoolAddress", e.target.value)}
              placeholder="Complete address" className="h-8 text-xs border-slate-200" />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="District">
              <Input value={record.district}
                onChange={(e) => onUpdateSchool(record.id, "district", e.target.value)}
                placeholder="e.g. District IV" className="h-8 text-xs border-slate-200" />
            </Field>
            <Field label="Division">
              <Input value={record.division}
                onChange={(e) => onUpdateSchool(record.id, "division", e.target.value)}
                placeholder="Division of QC" className="h-8 text-xs border-slate-200" />
            </Field>
          </div>
          <Field label="Region">
            <Input value={record.region}
              onChange={(e) => onUpdateSchool(record.id, "region", e.target.value)}
              placeholder="e.g. Region IV-A" className="h-8 text-xs border-slate-200" />
          </Field>
          <Field label="Adviser Name">
            <Input value={record.adviserName}
              onChange={(e) => onUpdateSchool(record.id, "adviserName", e.target.value)}
              placeholder="e.g. Cruz, Maria S." className="h-8 text-xs border-slate-200" />
          </Field>

          {/* Quick summary of entries */}
          {record.gradeYearEntries.length > 0 && (
            <div className="mt-2 pt-3 border-t border-slate-100 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Encoded Years</p>
              {record.gradeYearEntries.map((e) => (
                <div key={e.id} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black
                    ${e.gradeLevel ? GRADE_COLORS[Number(e.gradeLevel)] : "bg-slate-200 text-slate-500"}`}>
                    {e.gradeLevel || "?"}
                  </div>
                  <span className="text-[11px] text-slate-600">{e.schoolYear || "—"}</span>
                  {e.generalAverage && (
                    <span className="text-[10px] text-emerald-600 font-bold">GWA {e.generalAverage}</span>
                  )}
                  <Badge className={`ml-auto text-[9px] h-4 px-1.5 border-0 ${
                    e.remarks === "Promoted" ? "bg-emerald-50 text-emerald-700"
                    : e.remarks === "Retained" ? "bg-amber-50 text-amber-700"
                    : "bg-slate-100 text-slate-500"
                  }`}>{e.remarks}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: Grade Encoding ── */}
        <div className="p-5 bg-slate-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <ClipboardList className="w-3 h-3" /> Grade Encoding
            </p>
            <button
              onClick={() => onAddEntry(record.id)}
              className="flex items-center gap-1.5 text-[11px] font-bold text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 transition-colors rounded-lg px-3 py-1.5"
            >
              <Plus className="w-3 h-3" /> Add Year
            </button>
          </div>

          <div className="space-y-3">
            {record.gradeYearEntries.map((entry, idx) => (
              <GradeYearEntryPanel
                key={entry.id}
                entry={entry}
                entryIndex={idx}
                schoolId={record.id}
                canRemove={record.gradeYearEntries.length > 1}
                onUpdate={onUpdateEntry}
                onRemove={onRemoveEntry}
                onUpdateSubject={onUpdateSubject}
              />
            ))}
          </div>

          {/* Hint */}
          <p className="text-[10px] text-slate-400 italic text-center pt-1">
            If the student attended this school for multiple years, click "Add Year" to encode each grade separately.
          </p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — PRIOR TRANSCRIPT ENCODING
// ══════════════════════════════════════════════════════════════════════════════

function TranscriptPage({
  records,
  onUpdateSchool,
  onRemoveSchool,
  onAddSchool,
  onUpdateEntry,
  onRemoveEntry,
  onAddEntry,
  onUpdateSubject,
}: {
  records: SchoolRecord[];
  onUpdateSchool: (id: string, field: keyof SchoolRecord, value: string) => void;
  onRemoveSchool: (id: string) => void;
  onAddSchool: () => void;
  onUpdateEntry: (schoolId: string, entryId: string, field: keyof GradeYearEntry, value: string) => void;
  onRemoveEntry: (schoolId: string, entryId: string) => void;
  onAddEntry: (schoolId: string) => void;
  onUpdateSubject: (schoolId: string, entryId: string, subjectIdx: number, field: keyof SubjectGradeEntry, value: string) => void;
}) {
  return (
    <div className="space-y-5 py-6 px-6">
      {/* Info banner */}
      <div className="flex gap-3 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
        <AlertCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] text-violet-700 leading-relaxed font-semibold mb-0.5">
            Prior School Transcript (SF10 Scholastic Record)
          </p>
          <p className="text-[11px] text-violet-600 leading-relaxed">
            Add one card per school the student attended. Within each school card, use <strong>"Add Year"</strong> if they stayed for multiple grade levels or school years. The left column collects school details; the right column is for grade encoding.
          </p>
        </div>
      </div>

      {/* School record cards */}
      {records.map((record, idx) => (
        <SchoolRecordCard
          key={record.id}
          record={record}
          recordIndex={idx}
          canRemove={records.length > 1}
          onUpdateSchool={onUpdateSchool}
          onRemoveSchool={onRemoveSchool}
          onUpdateEntry={onUpdateEntry}
          onRemoveEntry={onRemoveEntry}
          onAddEntry={onAddEntry}
          onUpdateSubject={onUpdateSubject}
        />
      ))}

      {/* Add school button */}
      <button
        onClick={onAddSchool}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-violet-200 text-violet-500 hover:border-violet-400 hover:bg-violet-50/40 transition-all text-xs font-bold"
      >
        <Plus className="w-4 h-4" />
        Add Another School
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — ENROLLMENT ASSIGNMENT (shared between existing & transferee)
// ══════════════════════════════════════════════════════════════════════════════

function EnrollmentAssignmentPage({
  mode,
  selectedStudent,
  onSelectStudent,
  transfereeName,
  schoolYear,
  onSchoolYear,
  gradeLevel,
  onGradeLevel,
  selectedSectionId,
  selectedSectionName,
  onSelectSection,
  existingEnrollment,
  errors,
}: {
  mode: "existing" | "transferee";
  selectedStudent: Student | null;
  onSelectStudent: (s: Student) => void;
  transfereeName: string;
  schoolYear: string;
  onSchoolYear: (v: string) => void;
  gradeLevel: string;
  onGradeLevel: (v: string) => void;
  selectedSectionId: number | null;
  selectedSectionName: string;
  onSelectSection: (id: number, name: string) => void;
  existingEnrollment: unknown;
  errors: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Student[]>([]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
         const data = await getStudents({ search: query });
         setResults(data.slice(0, 5));
      } catch (err) { console.error(err); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const accent   = mode === "transferee" ? "violet" : "teal";
  const stepColor = mode === "transferee" ? "bg-violet-600" : "bg-teal-600";

  function StepNum({ n }: { n: number }) {
    return (
      <span className={`w-4 h-4 rounded-full ${stepColor} text-white text-[9px] flex items-center justify-center font-black flex-shrink-0`}>
        {n}
      </span>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 py-6 px-6">
      {/* Existing student search */}
      {mode === "existing" && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <StepNum n={1} /> Select Student
          </p>
          <Card className="border-0 shadow-sm">
            <CardContent className="px-5 py-4 space-y-3">
              {selectedStudent ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50 border border-teal-100">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-teal-200 text-teal-800 font-black text-sm">
                      {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-800">
                      {selectedStudent.lastName}, {selectedStudent.firstName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">{selectedStudent.lrn}</p>
                    <p className="text-[11px] text-slate-400">
                      {selectedStudent.sex} · {getAge(selectedStudent.birthdate)} yrs
                    </p>
                  </div>
                  <button
                    onClick={() => { setQuery(""); onSelectStudent(null as unknown as Student); }}
                    className="text-slate-400 hover:text-slate-600 text-xs underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    placeholder="Search by name or LRN..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-9 text-sm border-slate-200"
                  />
                  {results.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                      {results.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => { onSelectStudent(s); setQuery(""); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left"
                        >
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className="bg-teal-100 text-teal-800 text-[10px] font-bold">
                              {s.firstName[0]}{s.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-semibold text-slate-700">{s.lastName}, {s.firstName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{s.lrn}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {query.length >= 2 && results.length === 0 && (
                    <p className="text-xs text-slate-400 mt-2 px-1">No students found.</p>
                  )}
                </div>
              )}
              {errors.student && <p className="text-[11px] text-red-500">{errors.student}</p>}
              {!!existingEnrollment && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <p className="text-[11px] text-amber-700">Already enrolled in S.Y. {schoolYear}.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transferee confirmation chip */}
      {mode === "transferee" && transfereeName && (
        <div className="flex items-center gap-3 px-4 py-3 bg-violet-50 border border-violet-100 rounded-xl">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-violet-200 text-violet-800 font-black text-sm">
              {transfereeName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-black text-violet-800">{transfereeName}</p>
            <p className="text-[11px] text-violet-500">New transferee profile</p>
          </div>
          <Badge className="ml-auto bg-violet-100 text-violet-700 border-0 text-[10px]">Transferee</Badge>
        </div>
      )}

      {/* School Year & Grade */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
          <StepNum n={mode === "existing" ? 2 : 1} />
          School Year & Grade Level
        </p>
        <Card className="border-0 shadow-sm">
          <CardContent className="px-5 py-4 grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
                School Year <span className="text-red-400">*</span>
              </Label>
              <Select value={schoolYear} onValueChange={onSchoolYear}>
                <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SCHOOL_YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.schoolYear && <p className="text-[11px] text-red-500 mt-1">{errors.schoolYear}</p>}
            </div>
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
                Enrolling at Grade Level <span className="text-red-400">*</span>
              </Label>
              <Select value={gradeLevel} onValueChange={onGradeLevel}>
                <SelectTrigger className="h-9 text-sm border-slate-200">
                  <SelectValue placeholder="Select grade..." />
                </SelectTrigger>
                <SelectContent>
                  {["7","8","9","10"].map((g) => (
                    <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gradeLevel && <p className="text-[11px] text-red-500 mt-1">{errors.gradeLevel}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section */}
      {gradeLevel && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <StepNum n={mode === "existing" ? 3 : 2} />
            Select Section
          </p>
          <SectionSelector
            gradeLevel={gradeLevel}
            selectedSectionId={selectedSectionId}
            onSelect={onSelectSection}
            accent={accent}
          />
          {errors.section && <p className="text-[11px] text-red-500">{errors.section}</p>}
        </div>
      )}

      {/* Summary confirmation */}
      {gradeLevel && selectedSectionId && (
        mode === "existing" ? selectedStudent : transfereeName
      ) && (
        <Card className={`border-0 shadow-sm ${mode === "transferee" ? "bg-violet-50" : "bg-teal-50"}`}>
          <CardContent className="px-5 py-4 flex items-center gap-3">
            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${mode === "transferee" ? "text-violet-600" : "text-teal-600"}`} />
            <p className={`text-sm ${mode === "transferee" ? "text-violet-800" : "text-teal-800"}`}>
              <span className="font-black">
                {mode === "existing"
                  ? `${selectedStudent?.firstName} ${selectedStudent?.lastName}`
                  : transfereeName}
              </span>
              {" will be enrolled in "}
              <span className="font-black">Grade {gradeLevel} — {selectedSectionName}</span>
              {" for S.Y. "}
              <span className="font-black">{schoolYear}</span>.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// WIZARD PROGRESS BAR
// ══════════════════════════════════════════════════════════════════════════════

function WizardProgressBar({
  mode,
  page,
}: {
  mode: EnrollmentMode;
  page: WizardPage;
}) {
  if (!mode) return null;

  const steps =
    mode === "existing"
      ? [{ label: "Type", page: 0 }, { label: "Enrollment", page: 3 }]
      : [
          { label: "Type",       page: 0 },
          { label: "Profile",    page: 1 },
          { label: "Transcript", page: 2 },
          { label: "Enrollment", page: 3 },
        ];

  const currentIdx = steps.findIndex((s) => s.page === page);

  return (
    <div className="flex items-center gap-0 ml-4">
      {steps.map((step, idx) => {
        const done    = idx < currentIdx;
        const current = idx === currentIdx;
        return (
          <div key={step.label} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all
              ${done    ? (mode === "transferee" ? "bg-violet-100 text-violet-600" : "bg-teal-100 text-teal-600")
              : current ? (mode === "transferee" ? "bg-violet-600 text-white" : "bg-teal-600 text-white")
              :           "bg-slate-100 text-slate-400"}`}
            >
              {done && <CheckCircle2 className="w-3 h-3" />}
              {step.label}
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-5 h-px mx-0.5 ${done ? (mode === "transferee" ? "bg-violet-300" : "bg-teal-300") : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function EnrollStudent() {
  const navigate  = useNavigate();
  const { state } = useLocation();
  const prefilledStudent: Student | null = state?.student ?? null;

  // ── Wizard state ──
  const [mode, setMode]   = useState<EnrollmentMode>(prefilledStudent ? "existing" : null);
  const [page, setPage]   = useState<WizardPage>(prefilledStudent ? 3 : 0);

  // ── Shared enrollment fields ──
  const [schoolYear, setSchoolYear]             = useState("2025-2026");
  const [gradeLevel, setGradeLevel]             = useState("");
  const [selectedSectionId, setSelectedSectionId]     = useState<number | null>(null);
  const [selectedSectionName, setSelectedSectionName] = useState("");
  const [errors, setErrors]                     = useState<Record<string, string>>({});

  // ── Existing student ──
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(prefilledStudent);

  // ── Transferee ──
  const [transfereeForm, setTransfereeForm]           = useState<TransfereeForm>(EMPTY_TRANSFEREE_FORM());
  const [transfereeFormErrors, setTransfereeFormErrors] = useState<Partial<Record<keyof TransfereeForm, string>>>({});
  const [schoolRecords, setSchoolRecords]             = useState<SchoolRecord[]>([EMPTY_SCHOOL_RECORD()]);

  // ── Derived ──
  const [existingEnrollment, setExistingEnrollment] = useState<Enrollment | null>(null);
  
  useEffect(() => {
    if (mode === "existing" && selectedStudent) {
      getStudentEnrollments(selectedStudent.id)
        .then(data => {
          const found = data?.find(e => e.schoolYear === schoolYear && e.status !== "Dropped");
          setExistingEnrollment(found ?? null);
        })
        .catch(console.error);
    } else {
      setExistingEnrollment(null);
    }
  }, [selectedStudent, schoolYear, mode]);

  const transfereeName = [transfereeForm.firstName, transfereeForm.lastName].filter(Boolean).join(" ");
  const accentColor    = mode === "transferee" ? "violet" : "teal";

  // ── Mode select ──
  function handleModeSelect(m: "existing" | "transferee") {
    setMode(m);
    setErrors({});
    setGradeLevel("");
    setSelectedSectionId(null);
    setSelectedSectionName("");
    if (m === "existing") {
      setTransfereeForm(EMPTY_TRANSFEREE_FORM());
      setSchoolRecords([EMPTY_SCHOOL_RECORD()]);
    } else {
      setSelectedStudent(null);
    }
    // existing skips to page 3, transferee goes to page 1
    setPage(m === "existing" ? 3 : 1);
  }

  // ── Navigation ──
  function handleBack() {
    if (page === 0) { navigate(ROUTES.students.root); return; }
    if (mode === "existing") { setMode(null); setPage(0); return; }
    // transferee
    if (page === 1) { setMode(null); setPage(0); return; }
    if (page === 2) { setPage(1); return; }
    if (page === 3) { setPage(mode === "transferee" ? 2 : 0); return; }
  }

  function handleNext() {
    if (page === 1) {
      if (!validateTransfereeInfo()) return;
      setPage(2);
    } else if (page === 2) {
      setPage(3);
    }
  }

  // ── Validation ──
  function validateTransfereeInfo(): boolean {
    const fe: Partial<Record<keyof TransfereeForm, string>> = {};
    if (!transfereeForm.lrn.trim())            fe.lrn       = "LRN is required.";
    else if (transfereeForm.lrn.length !== 12) fe.lrn       = "Must be exactly 12 digits.";
    if (!transfereeForm.lastName.trim())       fe.lastName  = "Last name is required.";
    if (!transfereeForm.firstName.trim())      fe.firstName = "First name is required.";
    if (!transfereeForm.birthdate)             fe.birthdate = "Birthdate is required.";
    setTransfereeFormErrors(fe);
    return Object.keys(fe).length === 0;
  }

  function validateEnrollment(): boolean {
    const e: Record<string, string> = {};
    if (mode === "existing" && !selectedStudent)   e.student    = "Please select a student.";
    if (mode === "existing" && existingEnrollment) e.student    = `Already enrolled in S.Y. ${schoolYear}.`;
    if (!schoolYear)        e.schoolYear = "Please select a school year.";
    if (!gradeLevel)        e.gradeLevel = "Please select a grade level.";
    if (!selectedSectionId) e.section    = "Please select a section.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!validateEnrollment()) return;
    if (mode === "transferee" && !validateTransfereeInfo()) return;

    try {
      setIsSubmitting(true);
      if (mode === "transferee") {
        const newStudent = await addStudent({
          ...transfereeForm,
          elementaryGeneralAvg: transfereeForm.elementaryGeneralAvg ? parseFloat(transfereeForm.elementaryGeneralAvg) : undefined,
          birthdate: transfereeForm.birthdate || undefined
        });
        
        await enrollStudent({
          studentId: newStudent.id,
          schoolYearId: 1, // To be replaced with actual lookup when school years API is used
          gradeLevel: Number(gradeLevel),
          sectionId: selectedSectionId!,
        });
        // Note: schoolRecords (prior transcript) parsing to be added here when backend endpoint is ready
      } else if (mode === "existing" && selectedStudent) {
        await enrollStudent({
           studentId: selectedStudent.id,
           schoolYearId: 1, // To be replaced with actual lookup when school years API is used
           gradeLevel: Number(gradeLevel),
           sectionId: selectedSectionId!,
        });
      }
      navigate(ROUTES.students.root, { replace: true });
    } catch (err) {
      console.error(err);
      alert("Failed to enroll: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── School record handlers ──
  function updateSchoolField(id: string, field: keyof SchoolRecord, value: string) {
    setSchoolRecords((prev) =>
      prev.map((r) => r.id === id ? { ...r, [field]: value } : r)
    );
  }

  function removeSchool(id: string) {
    setSchoolRecords((prev) => prev.filter((r) => r.id !== id));
  }

  function addSchool() {
    setSchoolRecords((prev) => [...prev, EMPTY_SCHOOL_RECORD()]);
  }

  function updateGradeYearField(schoolId: string, entryId: string, field: keyof GradeYearEntry, value: string) {
    setSchoolRecords((prev) =>
      prev.map((r) =>
        r.id === schoolId
          ? { ...r, gradeYearEntries: r.gradeYearEntries.map((e) => e.id === entryId ? { ...e, [field]: value } : e) }
          : r
      )
    );
  }

  function removeGradeYearEntry(schoolId: string, entryId: string) {
    setSchoolRecords((prev) =>
      prev.map((r) =>
        r.id === schoolId
          ? { ...r, gradeYearEntries: r.gradeYearEntries.filter((e) => e.id !== entryId) }
          : r
      )
    );
  }

  function addGradeYearEntry(schoolId: string) {
    setSchoolRecords((prev) =>
      prev.map((r) =>
        r.id === schoolId
          ? { ...r, gradeYearEntries: [...r.gradeYearEntries, EMPTY_GRADE_YEAR_ENTRY()] }
          : r
      )
    );
  }

  function updateSubjectField(
    schoolId: string, entryId: string,
    subjectIdx: number, field: keyof SubjectGradeEntry, value: string
  ) {
    setSchoolRecords((prev) =>
      prev.map((r) => {
        if (r.id !== schoolId) return r;
        return {
          ...r,
          gradeYearEntries: r.gradeYearEntries.map((e) => {
            if (e.id !== entryId) return e;
            const subjects = e.subjects.map((s, i) => {
              if (i !== subjectIdx) return s;
              const updated = { ...s, [field]: value };
              // auto-compute final for non-MAPEH-parent rows
              if (!s.isMapeh || s.mapehComponent) {
                updated.finalRating = computeFinalRating(updated);
                updated.remarks     = parseFloat(updated.finalRating) >= 75 ? "Passed" : "Failed";
              }
              return updated;
            });
            // recompute MAPEH parent final as avg of its 4 components
            const mapehComponents = subjects.filter((s) => s.isMapeh && s.mapehComponent);
            const mapehParentIdx  = subjects.findIndex((s) => s.isMapeh && !s.mapehComponent);
            if (mapehParentIdx >= 0 && mapehComponents.length > 0) {
              const vals = mapehComponents.map((s) => parseFloat(s.finalRating)).filter((v) => !isNaN(v));
              if (vals.length > 0) {
                const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
                subjects[mapehParentIdx] = { ...subjects[mapehParentIdx], finalRating: avg };
              }
            }
            return { ...e, subjects };
          }),
        };
      })
    );
  }

  // ── Header action buttons ──
  function renderHeaderActions() {
    if (page === 0) {
      return (
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => navigate(-1)}>
          <X className="w-3.5 h-3.5" /> Cancel
        </Button>
      );
    }

    const isLastPage = (mode === "existing" && page === 3) || (mode === "transferee" && page === 3);

    return (
      <>
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={handleBack}>
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Button>
        {!isLastPage ? (
          <Button
            size="sm"
            onClick={handleNext}
            className={`h-8 text-xs gap-1.5 ${accentColor === "violet" ? "bg-violet-600 hover:bg-violet-800" : "bg-teal-600 hover:bg-teal-800"}`}
          >
            Next <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`h-8 text-xs gap-1.5 ${accentColor === "violet" ? "bg-violet-600 hover:bg-violet-800" : "bg-teal-600 hover:bg-teal-800"}`}
          >
            <Save className="w-3.5 h-3.5" /> {isSubmitting ? "Saving..." : "Save & Enroll"}
          </Button>
        )}
      </>
    );
  }

  // ── Page titles ──
  const pageTitles: Record<WizardPage, string> = {
    0: "Enroll Student",
    1: "Personal Information",
    2: "Prior Transcript",
    3: "Enrollment Assignment",
  };

  // ── Render ──
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }}
        onLogout={() => console.log("Logout")}
      />

      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10 flex-shrink-0">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate(ROUTES.students.root)}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Students
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">{pageTitles[page]}</span>
          {mode && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <Badge className={`text-[10px] h-5 px-2 border-0
                ${mode === "transferee" ? "bg-violet-100 text-violet-700" : "bg-teal-100 text-teal-700"}`}>
                {mode === "transferee" ? "Transferee" : "Existing Student"}
              </Badge>
            </>
          )}

          {/* Progress bar */}
          <WizardProgressBar mode={mode} page={page} />

          {/* Actions */}
          <div className="ml-auto flex gap-2">
            {renderHeaderActions()}
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1">
          {page === 0 && (
            <ModeSelectorPage onSelect={handleModeSelect} />
          )}

          {page === 1 && mode === "transferee" && (
            <TransfereeInfoPage
              form={transfereeForm}
              onChange={(key, val) => {
                setTransfereeForm((p) => ({ ...p, [key]: val }));
                setTransfereeFormErrors((p) => ({ ...p, [key]: undefined }));
              }}
              errors={transfereeFormErrors}
            />
          )}

          {page === 2 && mode === "transferee" && (
            <TranscriptPage
              records={schoolRecords}
              onUpdateSchool={updateSchoolField}
              onRemoveSchool={removeSchool}
              onAddSchool={addSchool}
              onUpdateEntry={updateGradeYearField}
              onRemoveEntry={removeGradeYearEntry}
              onAddEntry={addGradeYearEntry}
              onUpdateSubject={updateSubjectField}
            />
          )}

          {page === 3 && (
            <EnrollmentAssignmentPage
              mode={mode as "existing" | "transferee"}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
              transfereeName={transfereeName}
              schoolYear={schoolYear}
              onSchoolYear={setSchoolYear}
              gradeLevel={gradeLevel}
              onGradeLevel={(v) => { setGradeLevel(v); setSelectedSectionId(null); setSelectedSectionName(""); }}
              selectedSectionId={selectedSectionId}
              selectedSectionName={selectedSectionName}
              onSelectSection={(id, name) => { setSelectedSectionId(id); setSelectedSectionName(name); setErrors((p) => ({ ...p, section: "" })); }}
              existingEnrollment={existingEnrollment}
              errors={errors}
            />
          )}
        </div>
      </main>
    </div>
  );
}