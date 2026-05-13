import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, Search, CheckCircle2, School, AlertCircle, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSetHeader } from "@/contexts/HeaderContext";
import { GRADE_COLORS } from "@/utils/gradeUtils";
import { getAge } from "@/utils/dateUtils";
import {
  getStudents, enrollStudent, getStudentEnrollments,
  getSections, getSchoolYears,
} from "@/services/api";
import type { Student, Enrollment, Section, SchoolYear } from "@/services/api";
import { ROUTES } from "@/routes";

// ══════════════════════════════════════════════════════════════════════════════
// SECTION SELECTOR
// ══════════════════════════════════════════════════════════════════════════════

function SectionSelector({ gradeLevel, selectedSectionId, onSelect, sections }: {
  gradeLevel: string;
  selectedSectionId: number | null;
  onSelect: (id: number, name: string) => void;
  sections: Section[];
}) {
  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
        <School className="w-8 h-8 mb-2 opacity-30" />
        <p className="text-sm">No sections found for Grade {gradeLevel} in the selected school year.</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {sections.map((sec) => {
        const sel = selectedSectionId === sec.id;
        const count = sec.enrolledCount ?? sec.studentCount ?? 0;
        return (
          <button key={sec.id} onClick={() => onSelect(sec.id, sec.name)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all text-left
              ${sel ? "border-teal-400 bg-teal-50" : "border-slate-100 bg-white hover:border-teal-200 hover:bg-teal-50/40"}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${GRADE_COLORS[Number(gradeLevel)]}`}>
              <School className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">Grade {gradeLevel} — {sec.name}</p>
              <p className="text-[11px] text-slate-400">{sec.adviserName ?? "No adviser assigned"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-600">{count} Student{count !== 1 ? "s" : ""}</p>
              <p className="text-[10px] text-slate-400">Currently Enrolled</p>
            </div>
            {sel && <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function EnrollStudent() {
  const navigate = useNavigate();

  // ── State ──
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [existingEnrollment, setExistingEnrollment] = useState<Enrollment | null>(null);

  const [schoolYear, setSchoolYear] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [selectedSectionName, setSelectedSectionName] = useState("");

  const [allYears, setAllYears] = useState<SchoolYear[]>([]);
  const [allSections, setAllSections] = useState<Section[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Load meta ──
  useEffect(() => {
    async function loadMeta() {
      try {
        const [secs, years] = await Promise.all([getSections(), getSchoolYears()]);
        setAllSections(secs);
        setAllYears(years);
        const activeYear = years.find((y) => y.isActive) || years[0];
        if (activeYear) setSchoolYear(activeYear.label);
      } catch (err) {
        console.error("Failed to load resources:", err);
      }
    }
    loadMeta();
  }, []);

  // ── Student search ──
  useEffect(() => {
    if (query.length < 2) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const data = await getStudents({ search: query });
        setSearchResults(data.slice(0, 6));
      } catch (err) { console.error(err); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // ── Check for existing enrollment when student or SY changes ──
  useEffect(() => {
    if (!selectedStudent || !schoolYear) { setExistingEnrollment(null); return; }
    getStudentEnrollments(selectedStudent.id)
      .then((data) => {
        const found = data?.find((e) => e.schoolYear === schoolYear && e.status !== "Dropped");
        setExistingEnrollment(found ?? null);
      })
      .catch(console.error);
  }, [selectedStudent, schoolYear]);

  // ── When grade level changes, reset section ──
  useEffect(() => {
    setSelectedSectionId(null);
    setSelectedSectionName("");
  }, [gradeLevel, schoolYear]);

  // ── Header ──
  useSetHeader({
    title: "Enroll Student",
    subtitle: "Assign an existing student to a section for a school year.",
    breadcrumbs: [
      { label: "Students", href: ROUTES.students.root },
      { label: "Enroll Student" },
    ],
    actions: (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => navigate(ROUTES.students.root)}>
          Cancel
        </Button>
        <Button size="sm" className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
          onClick={handleSubmit} disabled={isSubmitting}>
          <GraduationCap className="w-3.5 h-3.5" />
          {isSubmitting ? "Enrolling..." : "Confirm Enrollment"}
        </Button>
      </div>
    )
  });

  // ── Validation ──
  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!selectedStudent) e.student = "Please select a student.";
    if (selectedStudent && existingEnrollment) e.student = `Already enrolled in S.Y. ${schoolYear}.`;
    if (!schoolYear) e.schoolYear = "Please select a school year.";
    if (!gradeLevel) e.gradeLevel = "Please select a grade level.";
    if (!selectedSectionId) e.section = "Please select a section.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      const syId = allYears.find((y) => y.label === schoolYear)?.id;
      if (!syId) throw new Error("Could not find the selected school year.");
      await enrollStudent({
        studentId: selectedStudent!.id,
        schoolYearId: syId,
        gradeLevel: Number(gradeLevel),
        sectionId: selectedSectionId!,
      });
      navigate(ROUTES.students.root, { replace: true });
    } catch (err) {
      console.error(err);
      alert("Failed to enroll: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Derived sections ──
  const filteredSections = allSections.filter((s) => {
    const syId = allYears.find((y) => y.label === schoolYear)?.id;
    return s.gradeLevel === Number(gradeLevel) && s.schoolYearId === syId;
  });

  const isAlreadyEnrolled = !!existingEnrollment;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 pb-20">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Enroll Student</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Select a student and assign them to a section for the school year.
        </p>
      </div>

      {/* ── Step 1: Select Student ── */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] flex items-center justify-center font-black flex-shrink-0">1</span>
          Select Student
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
                  <p className="text-sm font-black text-slate-800">{selectedStudent.lastName}, {selectedStudent.firstName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{selectedStudent.lrn}</p>
                  <p className="text-[11px] text-slate-400">{selectedStudent.gender} · {getAge(selectedStudent.birthdate)} yrs</p>
                </div>
                <button onClick={() => { setSelectedStudent(null); setQuery(""); setExistingEnrollment(null); }}
                  className="text-slate-400 hover:text-slate-600 text-xs underline">
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input placeholder="Search by name or LRN..." value={query} onChange={(e) => setQuery(e.target.value)}
                  className="h-9 text-sm border-slate-200 pl-9" />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    {searchResults.map((s) => (
                      <button key={s.id} onClick={() => { setSelectedStudent(s); setQuery(""); setSearchResults([]); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left">
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
                {query.length >= 2 && searchResults.length === 0 && (
                  <p className="text-xs text-slate-400 mt-2 px-1">No students found.</p>
                )}
              </div>
            )}
            {errors.student && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <p className="text-[11px] text-red-700">{errors.student}</p>
              </div>
            )}
            {isAlreadyEnrolled && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <p className="text-[11px] text-amber-700">
                  This student is already enrolled in <strong>{existingEnrollment?.section}</strong> (Grade {existingEnrollment?.gradeLevel}) for S.Y. {schoolYear}.
                  To change sections, please update via other means.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Step 2: School Year & Grade ── */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] flex items-center justify-center font-black flex-shrink-0">2</span>
          School Year &amp; Grade Level
        </p>
        <Card className="border-0 shadow-sm">
          <CardContent className="px-5 py-4 grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
                School Year <span className="text-red-400">*</span>
              </Label>
              <Select value={schoolYear} onValueChange={(v) => { setSchoolYear(v); setGradeLevel(""); }}>
                <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {allYears.map((y) => <SelectItem key={y.id} value={y.label}>{y.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.schoolYear && <p className="text-[11px] text-red-500 mt-1">{errors.schoolYear}</p>}
            </div>
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
                Enrolling at Grade Level <span className="text-red-400">*</span>
              </Label>
              <Select value={gradeLevel} onValueChange={setGradeLevel}>
                <SelectTrigger className="h-9 text-sm border-slate-200">
                  <SelectValue placeholder="Select grade..." />
                </SelectTrigger>
                <SelectContent>
                  {["7","8","9","10"].map((g) => <SelectItem key={g} value={g}>Grade {g}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.gradeLevel && <p className="text-[11px] text-red-500 mt-1">{errors.gradeLevel}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Step 3: Select Section ── */}
      {gradeLevel && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] flex items-center justify-center font-black flex-shrink-0">3</span>
            Select Section
          </p>
          <SectionSelector
            gradeLevel={gradeLevel}
            selectedSectionId={selectedSectionId}
            onSelect={(id, name) => { setSelectedSectionId(id); setSelectedSectionName(name); }}
            sections={filteredSections}
          />
          {errors.section && <p className="text-[11px] text-red-500">{errors.section}</p>}
        </div>
      )}

      {/* ── Confirmation Summary ── */}
      {selectedStudent && gradeLevel && selectedSectionId && !isAlreadyEnrolled && (
        <Card className="border-0 shadow-sm bg-teal-50">
          <CardContent className="px-5 py-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-teal-600" />
            <p className="text-sm text-teal-800">
              <span className="font-black">{selectedStudent.firstName} {selectedStudent.lastName}</span>
              {" will be enrolled in "}
              <span className="font-black">Grade {gradeLevel} — {selectedSectionName}</span>
              {" for S.Y. "}
              <span className="font-black">{schoolYear}</span>.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Help text */}
      <div className="flex items-start gap-2 text-[11px] text-slate-400 pt-2">
        <Users className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <p>To add a new student or encode transcript records, use the <strong>Add Student</strong> button on the Students list page.</p>
      </div>
    </div>
  );
}
