import { useState, useEffect } from "react";
import {
  CalendarDays, Plus, Pencil, Trash2,
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

import type { SchoolYear, Quarter } from "../types";
import SchoolYearForm from "./SchoolYearForm";
import { getSchoolYears, addSchoolYear, updateSchoolYear, deleteSchoolYear } from "@/services/api";
import { useSetHeader } from "@/contexts/HeaderContext";

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
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-50 group transition-colors">
      <QuarterStatus quarter={quarter} syActive={syActive} />
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold truncate ${quarter.isActive && syActive ? "text-teal-800" : "text-slate-600"}`}>
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
        <Pencil className="w-3 h-3" />
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
    <Card className={`border-0 shadow-sm overflow-hidden transition-all flex flex-col ${sy.isActive ? "border-l-4 border-l-teal-400" : "border-l-4 border-l-transparent"}`}>

      <div
        className="flex items-start gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${sy.isActive ? "bg-teal-600" : "bg-slate-100"}`}>
          <CalendarDays className={`w-4.5 h-4.5 ${sy.isActive ? "text-white" : "text-slate-400"}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-black text-slate-800">S.Y. {sy.label}</h3>
            {sy.isActive && <Badge className="bg-emerald-100 text-emerald-700 text-[10px] h-4 px-1.5 border-0">Active</Badge>}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
            {new Date(sy.startDate).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
            {" – "}
            {new Date(sy.endDate).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="flex items-center gap-0.5 flex-shrink-0 mt-0.5">
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

          <div className="ml-0.5 text-slate-400">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Quarters */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-2 py-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-1.5">Quarters</p>
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
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSY, setEditingSY] = useState<SchoolYear | null>(null);

  useEffect(() => {
    loadSchoolYears();
  }, []);

  async function loadSchoolYears() {
    try {
      const data = await getSchoolYears();
      setSchoolYears(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteSchoolYear(id);
      setSchoolYears((prev) => prev.filter((sy) => sy.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete school year.");
    }
  }

  function openNew() {
    setEditingSY(null);
    setFormOpen(true);
  }

  function openEdit(sy: SchoolYear) {
    setEditingSY(sy);
    setFormOpen(true);
  }

  async function handleSave(data: Omit<SchoolYear, "id" | "quarters"> & { quarters: Omit<Quarter, "id" | "schoolYearId">[] }) {
    try {
      if (editingSY) {
        const updated = await updateSchoolYear(editingSY.id, data);
        setSchoolYears((prev) =>
          prev.map((s) => {
            // If the updated year is now active, deactivate all others in local state too
            if (s.id === editingSY.id) return updated;
            if (data.isActive) return { ...s, isActive: false };
            return s;
          })
        );
      } else {
        const added = await addSchoolYear(data);
        // If the new year is active, deactivate all others locally
        if (data.isActive) {
          setSchoolYears((prev) => [...prev.map(s => ({ ...s, isActive: false })), added]);
        } else {
          setSchoolYears((prev) => [...prev, added]);
        }
      }
      setFormOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save school year.");
    }
  }

  useSetHeader({
    title: "School Years",
    subtitle: "Manage academic years and their quarterly periods",
    breadcrumbs: [
      { label: "School & Sections" },
      { label: "School Years" },
    ],
    actions: (
      <Button size="sm" className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
        onClick={openNew}>
        <Plus className="w-3.5 h-3.5" /> Add School Year
      </Button>
    )
  });

  // Sort: active first, then by label descending (newest year first)
  const sorted = [...schoolYears].sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    return b.label.localeCompare(a.label);
  });

  return (
    <>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          {sorted.map((sy) => (
            <SchoolYearCard
              key={sy.id}
              sy={sy}
              onEdit={openEdit}
              onDelete={handleDelete}
              onEditQuarter={() => openEdit(sy)}
            />
          ))}
        </div>
      </div>

      <SchoolYearForm
        open={formOpen}
        initial={editingSY}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
