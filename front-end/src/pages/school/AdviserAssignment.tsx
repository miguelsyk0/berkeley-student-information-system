import { useState } from "react";
import {
  UserCheck, ChevronRight, Search, UserX,
  CheckCircle2, AlertCircle, ArrowRight, Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from "@/components/sidebar";
import type { Section, Teacher } from "../types";

// ── Mock Data ──────────────────────────────────────────────────────────────────

const MOCK_TEACHERS: Teacher[] = [
  { id: 1, name: "Ms. Andrea Reyes",    email: "a.reyes@school.edu.ph",   employeeId: "EMP-001" },
  { id: 2, name: "Mr. Ben Santos",      email: "b.santos@school.edu.ph",  employeeId: "EMP-002" },
  { id: 3, name: "Ms. Claire Cruz",     email: "c.cruz@school.edu.ph",    employeeId: "EMP-003" },
  { id: 4, name: "Mr. Dan Lim",         email: "d.lim@school.edu.ph",     employeeId: "EMP-004" },
  { id: 5, name: "Ms. Elena Garcia",    email: "e.garcia@school.edu.ph",  employeeId: "EMP-005" },
  { id: 6, name: "Mr. Felix Torres",    email: "f.torres@school.edu.ph",  employeeId: "EMP-006" },
  { id: 7, name: "Ms. Grace Navarro",   email: "g.navarro@school.edu.ph", employeeId: "EMP-007" },
];

const MOCK_SECTIONS: Section[] = [
  { id: 1, name: "Integrity",  gradeLevel: 7,  schoolYearId: 1, schoolYear: "2025-2026", adviserId: 1,    adviserName: "Ms. Andrea Reyes",  studentCount: 38 },
  { id: 2, name: "Honesty",    gradeLevel: 7,  schoolYearId: 1, schoolYear: "2025-2026", adviserId: 2,    adviserName: "Mr. Ben Santos",    studentCount: 36 },
  { id: 3, name: "Loyalty",    gradeLevel: 7,  schoolYearId: 1, schoolYear: "2025-2026", adviserId: null, adviserName: null,                studentCount: 34 },
  { id: 4, name: "Diligence",  gradeLevel: 8,  schoolYearId: 1, schoolYear: "2025-2026", adviserId: 3,    adviserName: "Ms. Claire Cruz",   studentCount: 40 },
  { id: 5, name: "Humility",   gradeLevel: 8,  schoolYearId: 1, schoolYear: "2025-2026", adviserId: 4,    adviserName: "Mr. Dan Lim",       studentCount: 38 },
  { id: 6, name: "Wisdom",     gradeLevel: 9,  schoolYearId: 1, schoolYear: "2025-2026", adviserId: 5,    adviserName: "Ms. Elena Garcia",  studentCount: 35 },
  { id: 7, name: "Courage",    gradeLevel: 9,  schoolYearId: 1, schoolYear: "2025-2026", adviserId: null, adviserName: null,                studentCount: 32 },
  { id: 8, name: "Excellence", gradeLevel: 10, schoolYearId: 1, schoolYear: "2025-2026", adviserId: 6,    adviserName: "Mr. Felix Torres",  studentCount: 37 },
];

const GRADE_COLORS: Record<number, string> = {
  7:  "bg-teal-100 text-teal-800",
  8:  "bg-violet-100 text-violet-700",
  9:  "bg-blue-100   text-blue-700",
  10: "bg-cyan-100   text-cyan-700",
};

// ── Assign Modal ───────────────────────────────────────────────────────────────

function AssignModal({
  section,
  teachers,
  open,
  onClose,
  onAssign,
}: {
  section: Section | null;
  teachers: Teacher[];
  open: boolean;
  onClose: () => void;
  onAssign: (sectionId: number, teacherId: number | null) => void;
}) {
  const [selectedId, setSelectedId] = useState<string>(
    section?.adviserId ? String(section.adviserId) : ""
  );

  if (!section) return null;

  function handleSave() {
    onAssign(section!.id, selectedId ? Number(selectedId) : null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-500" />
            Assign Adviser
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {/* Section info */}
          <div className={`flex items-center gap-3 rounded-xl p-3 ${GRADE_COLORS[section.gradeLevel]} bg-opacity-20 border border-current border-opacity-20`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm ${GRADE_COLORS[section.gradeLevel]}`}>
              {section.gradeLevel}
            </div>
            <div>
              <p className="text-sm font-black text-slate-700">Grade {section.gradeLevel} — {section.name}</p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Users className="w-3 h-3" /> {section.studentCount} students · S.Y. {section.schoolYear}
              </p>
            </div>
          </div>

          {/* Current adviser */}
          {section.adviserName && (
            <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 flex items-center gap-2">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-teal-100 text-teal-800 text-[10px] font-bold">
                  {section.adviserName.split(" ").slice(-1)[0][0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[11px] text-slate-400">Current adviser</p>
                <p className="text-xs font-semibold text-slate-700">{section.adviserName}</p>
              </div>
              {section.adviserId && <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto" />}
            </div>
          )}

          {/* Select new adviser */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
              {section.adviserName ? "Reassign to" : "Assign adviser"}
            </p>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="h-9 text-sm border-slate-200">
                <SelectValue placeholder="Select a teacher..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Remove adviser</SelectItem>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    <div className="flex flex-col">
                      <span>{t.name}</span>
                      <span className="text-[10px] text-slate-400">{t.employeeId}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">Cancel</Button>
          <Button size="sm" onClick={handleSave} className="h-8 text-xs bg-teal-600 hover:bg-teal-800 gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Confirm Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdviserAssignment() {
  const [sections, setSections] = useState(MOCK_SECTIONS);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("2025-2026");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const unassigned = sections.filter((s) => !s.adviserId && s.schoolYear === yearFilter);
  const assigned   = sections.filter((s) =>  s.adviserId && s.schoolYear === yearFilter);

  const filteredSections = sections.filter((s) => {
    const matchYear = s.schoolYear === yearFilter;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.adviserName ?? "").toLowerCase().includes(search.toLowerCase());
    return matchYear && matchSearch;
  });

  function handleAssign(sectionId: number, teacherId: number | null) {
    const teacher = MOCK_TEACHERS.find((t) => t.id === teacherId) ?? null;
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, adviserId: teacherId, adviserName: teacher?.name ?? null }
          : s
      )
    );
  }

  function openModal(section: Section) {
    setSelectedSection(section);
    setModalOpen(true);
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
          <span className="text-xs text-slate-400">School & Sections</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">Adviser Assignment</span>
          <div className="ml-auto flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search sections..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 w-48 text-xs bg-slate-50 border-slate-200"
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="h-8 w-32 text-xs border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-2026">2025–2026</SelectItem>
                <SelectItem value="2024-2025">2024–2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-4xl">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Adviser Assignment</h1>
            <p className="text-sm text-slate-400 mt-0.5">Assign or reassign class advisers to sections for S.Y. {yearFilter}.</p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-800">{assigned.length}</p>
                  <p className="text-[11px] text-slate-400">Assigned</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-800">{unassigned.length}</p>
                  <p className="text-[11px] text-slate-400">Unassigned</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-800">{MOCK_TEACHERS.length}</p>
                  <p className="text-[11px] text-slate-400">Teachers</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Unassigned alert */}
          {unassigned.length > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-700 font-medium">
                {unassigned.length} section{unassigned.length > 1 ? "s" : ""} still need an adviser assigned:{" "}
                <span className="font-bold">{unassigned.map((s) => `Grade ${s.gradeLevel} – ${s.name}`).join(", ")}</span>
              </p>
            </div>
          )}

          {/* Section table */}
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardHeader className="py-4 px-5 border-b border-slate-100">
              <CardTitle className="text-sm font-black text-slate-700">
                All Sections — S.Y. {yearFilter}
              </CardTitle>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {filteredSections.map((section) => (
                <div key={section.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group">
                  {/* Grade + Name */}
                  <div className="flex items-center gap-3 w-48 flex-shrink-0">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${GRADE_COLORS[section.gradeLevel]}`}>
                      G{section.gradeLevel}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">{section.name}</span>
                  </div>

                  {/* Students */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 w-24 flex-shrink-0">
                    <Users className="w-3.5 h-3.5" />
                    {section.studentCount} students
                  </div>

                  {/* Adviser */}
                  <div className="flex-1 flex items-center gap-2">
                    {section.adviserName ? (
                      <>
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-teal-100 text-teal-800 text-[9px] font-bold">
                            {section.adviserName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold text-slate-700">{section.adviserName}</span>
                        <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[9px] h-4 px-1.5">Assigned</Badge>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <UserX className="w-4 h-4" />
                        <span className="text-xs font-semibold">No adviser</span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <Button
                    size="sm"
                    variant={section.adviserName ? "outline" : "default"}
                    className={`h-7 text-[11px] px-3 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                      !section.adviserName ? "bg-teal-600 hover:bg-teal-800 text-white" : ""
                    }`}
                    onClick={() => openModal(section)}
                  >
                    <UserCheck className="w-3 h-3" />
                    {section.adviserName ? "Reassign" : "Assign"}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <AssignModal
        section={selectedSection}
        teachers={MOCK_TEACHERS}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAssign={handleAssign}
      />
    </div>
  );
}