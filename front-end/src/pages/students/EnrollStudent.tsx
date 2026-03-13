import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronRight, GraduationCap, Save, X,
  User, School, CalendarDays, CheckCircle2,
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
import { MOCK_STUDENTS, MOCK_ENROLLMENTS, GRADE_COLORS, getAge, formatDate } from "./mockData";
import type { Student } from "../types";
import { ROUTES } from "@/routes";

// ── Mock section options per grade level ───────────────────────────────────────

const SECTIONS_BY_GRADE: Record<string, { id: number; name: string; adviserName: string; slots: number; enrolled: number }[]> = {
  "7": [
    { id: 1, name: "Integrity", adviserName: "Ms. A. Reyes",  slots: 40, enrolled: 38 },
    { id: 2, name: "Honesty",   adviserName: "Mr. B. Santos", slots: 40, enrolled: 36 },
    { id: 3, name: "Loyalty",   adviserName: "TBA",           slots: 40, enrolled: 34 },
  ],
  "8": [
    { id: 4, name: "Diligence", adviserName: "Ms. C. Cruz",   slots: 40, enrolled: 40 },
    { id: 5, name: "Humility",  adviserName: "Mr. D. Lim",    slots: 40, enrolled: 38 },
  ],
  "9": [
    { id: 6, name: "Wisdom",  adviserName: "Ms. E. Garcia",  slots: 40, enrolled: 35 },
    { id: 7, name: "Courage", adviserName: "TBA",            slots: 40, enrolled: 32 },
  ],
  "10": [
    { id: 8, name: "Excellence", adviserName: "Mr. F. Torres", slots: 40, enrolled: 37 },
  ],
};

const SCHOOL_YEARS = ["2025-2026", "2024-2025"];

// ── Student Search ─────────────────────────────────────────────────────────────

function StudentSearchCard({
  selected,
  onSelect,
}: {
  selected: Student | null;
  onSelect: (s: Student) => void;
}) {
  const [query, setQuery] = useState("");

  const results = query.length >= 2
    ? MOCK_STUDENTS.filter((s) => {
        const full = `${s.lastName} ${s.firstName} ${s.lrn}`.toLowerCase();
        return full.includes(query.toLowerCase());
      }).slice(0, 5)
    : [];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pt-5 pb-0 px-5">
        <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
          <User className="w-4 h-4 text-teal-500" />
          Student
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-4 space-y-3">
        {selected ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50 border border-teal-100">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-teal-200 text-teal-800 font-black text-sm">
                {selected.firstName[0]}{selected.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-black text-slate-800">
                {selected.lastName}, {selected.firstName}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">{selected.lrn}</p>
              <p className="text-[11px] text-slate-400">
                {selected.sex} · {getAge(selected.birthdate)} yrs · {formatDate(selected.birthdate)}
              </p>
            </div>
            <button
              onClick={() => { setQuery(""); onSelect(null as unknown as Student); }}
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
                    onClick={() => { onSelect(s); setQuery(""); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors"
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
      </CardContent>
    </Card>
  );
}

// ── Section Selector ───────────────────────────────────────────────────────────

function SectionSelector({
  gradeLevel,
  selectedSectionId,
  onSelect,
}: {
  gradeLevel: string;
  selectedSectionId: number | null;
  onSelect: (id: number, name: string) => void;
}) {
  const sections = SECTIONS_BY_GRADE[gradeLevel] ?? [];

  return (
    <div className="space-y-2">
      {sections.map((sec) => {
        const isFull = sec.enrolled >= sec.slots;
        const isSelected = selectedSectionId === sec.id;
        const remaining = sec.slots - sec.enrolled;

        return (
          <button
            key={sec.id}
            disabled={isFull}
            onClick={() => !isFull && onSelect(sec.id, sec.name)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all text-left
              ${isSelected
                ? "border-teal-400 bg-teal-50"
                : isFull
                  ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                  : "border-slate-100 bg-white hover:border-teal-200 hover:bg-teal-50/40"
              }
            `}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${GRADE_COLORS[Number(gradeLevel)]}`}>
              <School className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">
                Grade {gradeLevel} — {sec.name}
              </p>
              <p className="text-[11px] text-slate-400">{sec.adviserName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-600">{sec.enrolled} / {sec.slots}</p>
              <p className={`text-[10px] ${isFull ? "text-red-500 font-bold" : "text-slate-400"}`}>
                {isFull ? "Full" : `${remaining} slot${remaining !== 1 ? "s" : ""} left`}
              </p>
            </div>
            {isSelected && <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function EnrollStudent() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const prefilledStudent: Student | null = state?.student ?? null;

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(prefilledStudent);
  const [schoolYear, setSchoolYear] = useState("2025-2026");
  const [gradeLevel, setGradeLevel] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [selectedSectionName, setSelectedSectionName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if student already enrolled in selected year
  const existingEnrollment = selectedStudent
    ? MOCK_ENROLLMENTS.find(
        (e) => e.studentId === selectedStudent.id && e.schoolYear === schoolYear
      )
    : null;

  function handleSectionSelect(id: number, name: string) {
    setSelectedSectionId(id);
    setSelectedSectionName(name);
    setErrors((p) => ({ ...p, section: "" }));
  }

  function handleGradeChange(val: string) {
    setGradeLevel(val);
    setSelectedSectionId(null);
    setSelectedSectionName("");
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!selectedStudent)    e.student   = "Please select a student.";
    if (!schoolYear)         e.schoolYear = "Please select a school year.";
    if (!gradeLevel)         e.gradeLevel = "Please select a grade level.";
    if (!selectedSectionId)  e.section    = "Please select a section.";
    if (existingEnrollment)  e.student    = `Already enrolled in S.Y. ${schoolYear}.`;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    console.log("Enroll", {
      studentId: selectedStudent?.id,
      schoolYear,
      gradeLevel,
      sectionId: selectedSectionId,
      sectionName: selectedSectionName,
    });
    navigate(ROUTES.students.root);
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }}
        onLogout={() => console.log("Logout")}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <button
            onClick={() => navigate(ROUTES.students.root)}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Students
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">Enroll Student</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => navigate(-1)}>
              <X className="w-3.5 h-3.5" /> Cancel
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
              onClick={handleSubmit}
            >
              <Save className="w-3.5 h-3.5" /> Confirm Enrollment
            </Button>
          </div>
        </header>

        <div className="p-6 max-w-2xl space-y-5">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Enroll Student</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Assign a student to a grade level, section, and school year.
            </p>
          </div>

          {/* Already enrolled warning */}
          {existingEnrollment && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <GraduationCap className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-700 font-medium">
                This student is already enrolled in{" "}
                <span className="font-bold">
                  Grade {existingEnrollment.gradeLevel} — {existingEnrollment.section}
                </span>{" "}
                for S.Y. {schoolYear}.
              </p>
            </div>
          )}

          {/* Step 1: Student */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] flex items-center justify-center font-black">1</span>
              Select Student
            </p>
            <StudentSearchCard selected={selectedStudent} onSelect={setSelectedStudent} />
            {errors.student && <p className="text-[11px] text-red-500">{errors.student}</p>}
          </div>

          {/* Step 2: School Year + Grade */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] flex items-center justify-center font-black">2</span>
              School Year & Grade Level
            </p>
            <Card className="border-0 shadow-sm">
              <CardContent className="px-5 py-5 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
                    School Year <span className="text-red-400">*</span>
                  </Label>
                  <Select value={schoolYear} onValueChange={setSchoolYear}>
                    <SelectTrigger className="h-9 text-sm border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SCHOOL_YEARS.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.schoolYear && <p className="text-[11px] text-red-500 mt-1">{errors.schoolYear}</p>}
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
                    Grade Level <span className="text-red-400">*</span>
                  </Label>
                  <Select value={gradeLevel} onValueChange={handleGradeChange}>
                    <SelectTrigger className="h-9 text-sm border-slate-200">
                      <SelectValue placeholder="Select grade..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Grade 7</SelectItem>
                      <SelectItem value="8">Grade 8</SelectItem>
                      <SelectItem value="9">Grade 9</SelectItem>
                      <SelectItem value="10">Grade 10</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gradeLevel && <p className="text-[11px] text-red-500 mt-1">{errors.gradeLevel}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 3: Section */}
          {gradeLevel && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] flex items-center justify-center font-black">3</span>
                Select Section
              </p>
              <SectionSelector
                gradeLevel={gradeLevel}
                selectedSectionId={selectedSectionId}
                onSelect={handleSectionSelect}
              />
              {errors.section && <p className="text-[11px] text-red-500">{errors.section}</p>}
            </div>
          )}

          {/* Summary */}
          {selectedStudent && gradeLevel && selectedSectionId && (
            <Card className="border-0 shadow-sm bg-teal-50 border-teal-100">
              <CardContent className="px-5 py-4 flex items-center gap-4">
                <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div className="text-sm text-teal-800">
                  <span className="font-black">{selectedStudent.firstName} {selectedStudent.lastName}</span>
                  {" will be enrolled in "}
                  <span className="font-black">Grade {gradeLevel} — {selectedSectionName}</span>
                  {" for S.Y. "}
                  <span className="font-black">{schoolYear}</span>.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}