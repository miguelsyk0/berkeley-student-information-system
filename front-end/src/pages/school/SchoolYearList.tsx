import { useState } from "react";
import {
  CalendarDays, ChevronRight, Plus, Pencil, Trash2,
  ChevronDown, ChevronUp, CheckCircle2, Circle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Sidebar from "@/components/sidebar";
import type { SchoolYear, Quarter } from "../types";
import SchoolYearForm from "./SchoolYearForm"; // <-- form component added

// ── Mock Data ──────────────────────────────────────────────────────────────────

const MOCK_SCHOOL_YEARS: SchoolYear[] = [
  {
    id: 1,
    label: "2025-2026",
    startDate: "2025-06-02",
    endDate: "2026-04-03",
    isActive: true,
    quarters: [
      { id: 1, schoolYearId: 1, number: 1, label: "1st Quarter", startDate: "2025-06-02", endDate: "2025-08-15", isActive: true },
      { id: 2, schoolYearId: 1, number: 2, label: "2nd Quarter", startDate: "2025-08-18", endDate: "2025-10-17", isActive: false },
      { id: 3, schoolYearId: 1, number: 3, label: "3rd Quarter", startDate: "2025-11-03", endDate: "2026-01-30", isActive: false },
      { id: 4, schoolYearId: 1, number: 4, label: "4th Quarter", startDate: "2026-02-02", endDate: "2026-04-03", isActive: false },
    ],
  },
  {
    id: 2,
    label: "2024-2025",
    startDate: "2024-06-03",
    endDate: "2025-04-04",
    isActive: false,
    quarters: [
      { id: 5, schoolYearId: 2, number: 1, label: "1st Quarter", startDate: "2024-06-03", endDate: "2024-08-16", isActive: false },
      { id: 6, schoolYearId: 2, number: 2, label: "2nd Quarter", startDate: "2024-08-19", endDate: "2024-10-18", isActive: false },
      { id: 7, schoolYearId: 2, number: 3, label: "3rd Quarter", startDate: "2024-11-04", endDate: "2025-01-31", isActive: false },
      { id: 8, schoolYearId: 2, number: 4, label: "4th Quarter", startDate: "2025-02-03", endDate: "2025-04-04", isActive: false },
    ],
  },
];

// ── Quarter Status Icon ────────────────────────────────────────────────────────

function QuarterStatus({ quarter, syActive }: { quarter: Quarter; syActive: boolean }) {
  if (quarter.isActive && syActive) return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
  const now = new Date();
  const end = new Date(quarter.endDate);
  if (end < now) return <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />;
  return <Circle className="w-3.5 h-3.5 text-slate-200" />;
}

// ── Quarter Row ────────────────────────────────────────────────────────────────

function QuarterRow({ quarter, syActive, onEdit }: { quarter: Quarter; syActive: boolean; onEdit: (q: Quarter) => void }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-slate-50 group transition-colors">
      <QuarterStatus quarter={quarter} syActive={syActive} />
      <div className="flex-1">
        <p className={`text-xs font-semibold ${quarter.isActive && syActive ? "text-teal-800" : "text-slate-600"}`}>
          {quarter.label}
          {quarter.isActive && syActive && (
            <Badge className="ml-2 bg-teal-100 text-teal-600 text-[9px] h-4 px-1.5 border-0">Active</Badge>
          )}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {new Date(quarter.startDate).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
          {" – "}
          {new Date(quarter.endDate).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>
      <button
        onClick={() => onEdit(quarter)}
        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-teal-600 transition-all p-1 rounded"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── School Year Card ───────────────────────────────────────────────────────────

function SchoolYearCard({
  sy,
  onEdit,
  onDelete,
  onEditQuarter,
}: {
  sy: SchoolYear;
  onEdit: (sy: SchoolYear) => void;
  onDelete: (id: number) => void;
  onEditQuarter: (q: Quarter) => void;
}) {
  const [expanded, setExpanded] = useState(sy.isActive);

  return (
    <Card className={`border-0 shadow-sm overflow-hidden transition-all ${sy.isActive ? "ring-2 ring-teal-200" : ""}`}>
      {/* Header */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${sy.isActive ? "bg-teal-600" : "bg-slate-100"}`}>
          <CalendarDays className={`w-5 h-5 ${sy.isActive ? "text-white" : "text-slate-400"}`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-800">S.Y. {sy.label}</h3>
            {sy.isActive && <Badge className="bg-emerald-100 text-emerald-700 text-[10px] h-4 px-1.5 border-0">Active</Badge>}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {new Date(sy.startDate).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}
            {" – "}
            {new Date(sy.endDate).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(sy); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          {!sy.isActive && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete S.Y. {sy.label}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove this school year and all its quarter records. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => onDelete(sy.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <div className="ml-1 text-slate-400">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Quarters */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-2 py-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 py-1.5">Quarters</p>
          {sy.quarters.map((q) => (
            <QuarterRow key={q.id} quarter={q} syActive={sy.isActive} onEdit={onEditQuarter} />
          ))}
        </div>
      )}
    </Card>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function SchoolYearList() {
  const [schoolYears, setSchoolYears] = useState(MOCK_SCHOOL_YEARS);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSY, setEditingSY] = useState<SchoolYear | null>(null);

  function handleDelete(id: number) {
    setSchoolYears((prev) => prev.filter((sy) => sy.id !== id));
  }

  function openNew() {
    setEditingSY(null);
    setFormOpen(true);
  }

  function openEdit(sy: SchoolYear) {
    setEditingSY(sy);
    setFormOpen(true);
  }

  function handleSave(data: Omit<SchoolYear, "id" | "quarters"> & { quarters: Omit<Quarter, "id" | "schoolYearId">[] }) {
    if (editingSY) {
      // update existing entry
      setSchoolYears((prev) => prev.map((s) => (s.id === editingSY.id ? { ...editingSY, ...data } as SchoolYear : s)));
    } else {
      // assign a new id for demo purposes
      const nextId = Math.max(0, ...schoolYears.map((s) => s.id)) + 1;
      setSchoolYears((prev) => [...prev, { id: nextId, ...data } as SchoolYear]);
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
          <span className="text-xs font-semibold text-slate-600">School Years</span>
          <div className="ml-auto">
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
              onClick={openNew}>
              <Plus className="w-3.5 h-3.5" /> Add School Year
            </Button>
          </div>
        </header>

        <div className="p-6 max-w-2xl space-y-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">School Years</h1>
            <p className="text-sm text-slate-400 mt-0.5">Manage academic years and their quarterly periods.</p>
          </div>

          {schoolYears.map((sy) => (
            <SchoolYearCard
              key={sy.id}
              sy={sy}
              onEdit={openEdit}
              onDelete={handleDelete}
              onEditQuarter={() => openEdit(sy)}
            />
          ))}
        </div>
      </main>

      {/* form dialog for add/edit */}
      <SchoolYearForm
        open={formOpen}
        initial={editingSY}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}