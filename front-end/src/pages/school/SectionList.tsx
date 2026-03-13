import { useState } from "react";
import {
  Users, Plus, Pencil, Trash2, ChevronRight,
  Search, UserCheck, BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// badge not used in section list
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Sidebar from "@/components/sidebar";
import type { Section } from "../types";
import SectionForm from "./SectionForm"; // form component

// ── Mock Data ──────────────────────────────────────────────────────────────────

const MOCK_SECTIONS: Section[] = [
  { id: 1, name: "Integrity",  gradeLevel: 7,  schoolYearId: 1, schoolYear: "2025-2026", adviserId: 1, adviserName: "Ms. A. Reyes",    studentCount: 38, roomNumber: "201" },
  { id: 2, name: "Honesty",    gradeLevel: 7,  schoolYearId: 1, schoolYear: "2025-2026", adviserId: 2, adviserName: "Mr. B. Santos",   studentCount: 36, roomNumber: "202" },
  { id: 3, name: "Loyalty",    gradeLevel: 7,  schoolYearId: 1, schoolYear: "2025-2026", adviserId: null, adviserName: null,           studentCount: 34, roomNumber: "203" },
  { id: 4, name: "Diligence",  gradeLevel: 8,  schoolYearId: 1, schoolYear: "2025-2026", adviserId: 3, adviserName: "Ms. C. Cruz",     studentCount: 40, roomNumber: "301" },
  { id: 5, name: "Humility",   gradeLevel: 8,  schoolYearId: 1, schoolYear: "2025-2026", adviserId: 4, adviserName: "Mr. D. Lim",      studentCount: 38, roomNumber: "302" },
  { id: 6, name: "Wisdom",     gradeLevel: 9,  schoolYearId: 1, schoolYear: "2025-2026", adviserId: 5, adviserName: "Ms. E. Garcia",   studentCount: 35, roomNumber: "401" },
  { id: 7, name: "Courage",    gradeLevel: 9,  schoolYearId: 1, schoolYear: "2025-2026", adviserId: null, adviserName: null,           studentCount: 32, roomNumber: "402" },
  { id: 8, name: "Excellence", gradeLevel: 10, schoolYearId: 1, schoolYear: "2025-2026", adviserId: 6, adviserName: "Mr. F. Torres",   studentCount: 37, roomNumber: "501" },
];

// ── Grade Level badge color map ───────────────────────────────────────────────

const GRADE_COLORS: Record<number, string> = {
  7: "bg-teal-100 text-teal-800",
  8: "bg-violet-100 text-violet-700",
  9: "bg-blue-100 text-blue-700",
  10: "bg-cyan-100 text-cyan-700",
};

// ── Section Card ───────────────────────────────────────────────────────────────

function SectionCard({
  section,
  onEdit,
  onDelete,
  onAssignAdviser,
}: {
  section: Section;
  onEdit: (s: Section) => void;
  onDelete: (id: number) => void;
  onAssignAdviser: (s: Section) => void;
}) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          {/* Grade badge + name */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${GRADE_COLORS[section.gradeLevel]}`}>
              {section.gradeLevel}
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">{section.gradeLevel} — {section.name}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">S.Y. {section.schoolYear}{section.roomNumber ? ` · Room ${section.roomNumber}` : ""}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(section)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Grade {section.gradeLevel} — {section.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove the section and all its associated data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => onDelete(section.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          {/* Adviser */}
          <button
            onClick={() => onAssignAdviser(section)}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              section.adviserName
                ? "text-slate-600 hover:text-teal-600"
                : "text-amber-600 hover:text-amber-700"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            {section.adviserName ?? (
              <span className="font-semibold">No adviser assigned</span>
            )}
            {section.adviserName && <span className="text-slate-400">(adviser)</span>}
          </button>

          {/* Student count */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users className="w-3.5 h-3.5" />
            <span className="font-semibold">{section.studentCount}</span>
            <span className="text-slate-400">students</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function SectionList() {
  const [sections, setSections] = useState(MOCK_SECTIONS);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("2025-2026");
  const [formOpen, setFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);


  const filtered = sections.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.adviserName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchGrade = gradeFilter === "all" || String(s.gradeLevel) === gradeFilter;
    const matchYear = s.schoolYear === yearFilter;
    return matchSearch && matchGrade && matchYear;
  });

  const byGrade = [7, 8, 9, 10].map((g) => ({
    grade: g,
    sections: filtered.filter((s) => s.gradeLevel === g),
  })).filter((g) => g.sections.length > 0);

  function handleDelete(id: number) {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  function openNewSection() {
    setEditingSection(null);
    setFormOpen(true);
  }

  function openEditSection(s: Section) {
    setEditingSection(s);
    setFormOpen(true);
  }

  function handleSaveSection(data: Omit<Section, "id" | "studentCount" | "adviserName">) {
    if (editingSection) {
      setSections((prev) => prev.map((sec) => (sec.id === editingSection.id ? { ...editingSection, ...data } as Section : sec)));
    } else {
      const nextId = Math.max(0, ...sections.map((sec) => sec.id)) + 1;
      setSections((prev) => [...prev, { id: nextId, studentCount: 0, adviserName: null, ...data } as Section]);
    }
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
          <span className="text-xs font-semibold text-slate-600">Sections</span>
          <div className="ml-auto">
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800" onClick={openNewSection}>
              <Plus className="w-3.5 h-3.5" /> Add Section
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Title + Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Sections</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {filtered.length} section{filtered.length !== 1 ? "s" : ""} · {filtered.reduce((a, b) => a + b.studentCount, 0)} students total
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  placeholder="Search sections..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-8 w-48 text-xs bg-white border-slate-200"
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
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="h-8 w-32 text-xs border-slate-200">
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="7">Grade 7</SelectItem>
                  <SelectItem value="8">Grade 8</SelectItem>
                  <SelectItem value="9">Grade 9</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sections by grade */}
          {byGrade.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <BookOpen className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-semibold">No sections found</p>
              <p className="text-xs mt-1">Try adjusting your filters or add a new section.</p>
            </div>
          ) : (
            byGrade.map(({ grade, sections: gradeSections }) => (
              <div key={grade}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${GRADE_COLORS[grade]}`}>
                    Grade {grade}
                  </span>
                  <span className="text-xs text-slate-400">{gradeSections.length} section{gradeSections.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {gradeSections.map((s) => (
                    <SectionCard
                      key={s.id}
                      section={s}
                      onEdit={openEditSection}
                      onDelete={handleDelete}
                      onAssignAdviser={(sec) => console.log("Assign adviser", sec)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* form dialog for add/edit section */}
      <SectionForm
        open={formOpen}
        initial={editingSection}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveSection}
      />
    </div>
  );
}