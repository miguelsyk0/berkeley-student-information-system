import { useState, useEffect } from "react";
import {
  Users, Plus, Pencil, Trash2,
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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

import SectionForm from "./SectionForm";
import { getSections, deleteSection, createSection, updateSection, getSchoolYears, getTeachers, assignSectionAdviser } from "@/services/api";
import { useSetHeader } from "@/contexts/HeaderContext";
import type { Section, SchoolYear, Teacher } from "@/services/api";


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
              <p className="text-[11px] text-slate-400 mt-0.5">S.Y.: {section.schoolYear}{section.roomNumber ? ` · Room ${section.roomNumber}` : ""}</p>
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
            className={`flex items-center gap-1.5 text-xs transition-colors ${section.adviserName
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

// ── Assign Modal ─────────────────────────────────────────────────────────────

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
  const [selectedId, setSelectedId] = useState<string>("unassigned");

  useEffect(() => {
    setSelectedId(section?.adviserId ? String(section.adviserId) : "unassigned");
  }, [section, open]);

  if (!section) return null;

  function handleSave() {
    onAssign(section!.id, selectedId === "unassigned" ? null : Number(selectedId));
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

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
              {section.adviserName ? "Reassign to" : "Assign adviser"}
            </p>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="h-9 text-sm border-slate-200">
                <SelectValue placeholder="Select a teacher..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Remove adviser</SelectItem>
                {teachers.filter(t => t.isActive).map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    <div className="flex flex-col">
                      <span>{t.firstName} {t.lastName}</span>
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

export default function SectionList() {
  const [sections, setSections] = useState<Section[]>([]);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningSection, setAssigningSection] = useState<Section | null>(null);

  useEffect(() => {
    getSchoolYears().then(setSchoolYears).catch(console.error);
    getTeachers().then(setTeachers).catch(console.error);
  }, []);

  useEffect(() => {
    loadSections();
  }, [gradeFilter, yearFilter]);

  async function loadSections() {
    try {
      const data = await getSections(
        yearFilter && yearFilter !== "all" ? Number(yearFilter) : undefined,
        gradeFilter !== "all" ? Number(gradeFilter) : undefined
      );
      setSections(data);
    } catch (err) {
      console.error(err);
    }
  }


  const filtered = sections.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.adviserName ?? "").toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const byGrade = [7, 8, 9, 10].map((g) => ({
    grade: g,
    sections: filtered.filter((s) => s.gradeLevel === g),
  })).filter((g) => g.sections.length > 0);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      await deleteSection(id);
      setSections((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete section.");
    }
  }

  function openNewSection() {
    setEditingSection(null);
    setFormOpen(true);
  }

  function openEditSection(s: Section) {
    setEditingSection(s);
    setFormOpen(true);
  }

  async function handleSaveSection(data: Partial<Section>) {
    try {
      if (editingSection) {
        const updated = await updateSection(editingSection.id, data);
        setSections((prev) => prev.map((sec) => (sec.id === editingSection.id ? updated : sec)));
      } else {
        const added = await createSection(data);
        setSections((prev) => [...prev, added]);
      }
      setFormOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save section.");
    }
  }

  async function handleAssignAdviser(sectionId: number, teacherId: number | null) {
    try {
      const updated = await assignSectionAdviser(sectionId, teacherId);
      setSections(prev => prev.map(s => s.id === sectionId ? { ...s, ...updated } : s));
      setAssignModalOpen(false);
    } catch (err: any) {
      console.error(err);
      const msg = err.message ? JSON.parse(err.message).error : "Failed to assign adviser.";
      alert(msg);
    }
  }

  useSetHeader({
    title: "Sections",
    subtitle: `${filtered.length} section${filtered.length !== 1 ? "s" : ""} · ${filtered.reduce((a, b) => a + (b.enrolledCount || 0), 0)} students total`,
    breadcrumbs: [
      { label: "School & Sections" },
      { label: "Sections" },
    ],
    actions: (
      <Button size="sm" className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800" onClick={openNewSection}>
        <Plus className="w-3.5 h-3.5" /> Add Section
      </Button>
    )
  });

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Filters Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-end">
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
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {schoolYears.map((sy) => (
                  <SelectItem key={sy.id} value={String(sy.id)}>{sy.label}</SelectItem>
                ))}
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
                    onAssignAdviser={(sec) => {
                      setAssigningSection(sec);
                      setAssignModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <SectionForm
        open={formOpen}
        initial={editingSection}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveSection}
      />

      <AssignModal
        open={assignModalOpen}
        section={assigningSection}
        teachers={teachers}
        onClose={() => setAssignModalOpen(false)}
        onAssign={handleAssignAdviser}
      />
    </>
  );
}
