import { useState, useEffect } from "react";
import { CalendarDays, Save, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import type { SchoolYear, Quarter } from "../types";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SchoolYearFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<SchoolYear, "id" | "quarters"> & { quarters: Omit<Quarter, "id" | "schoolYearId">[] }) => void;
  initial?: SchoolYear | null;
}

// ── Helper ───────────────────────────────────────────────────────────────────

function formatDateInput(dateStr: string | undefined): string {
  if (!dateStr) return "";
  // Directly extract the YYYY-MM-DD portion to avoid timezone shifting when parsed
  return dateStr.split("T")[0];
}

// ── Default quarter dates derived from SY start ───────────────────────────────

function deriveQuarters(startDate: string): Omit<Quarter, "id" | "schoolYearId">[] {
  if (!startDate) return [
    { number: 1, label: "1st Quarter", startDate: "", endDate: "", isActive: false },
    { number: 2, label: "2nd Quarter", startDate: "", endDate: "", isActive: false },
    { number: 3, label: "3rd Quarter", startDate: "", endDate: "", isActive: false },
    { number: 4, label: "4th Quarter", startDate: "", endDate: "", isActive: false },
  ];
  const base = new Date(startDate);
  const add = (d: Date, weeks: number) => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + weeks * 7);
    return copy.toISOString().split("T")[0];
  };
  return [
    { number: 1, label: "1st Quarter", startDate: startDate, endDate: add(base, 10), isActive: true },
    { number: 2, label: "2nd Quarter", startDate: add(base, 11), endDate: add(base, 21), isActive: false },
    { number: 3, label: "3rd Quarter", startDate: add(base, 23), endDate: add(base, 33), isActive: false },
    { number: 4, label: "4th Quarter", startDate: add(base, 34), endDate: add(base, 44), isActive: false },
  ];
}

// ── Quarter Fields ─────────────────────────────────────────────────────────────

function QuarterFields({
  quarter,
  index,
  onChange,
}: {
  quarter: Omit<Quarter, "id" | "schoolYearId">;
  index: number;
  onChange: (index: number, field: string, value: string | boolean) => void;
}) {
  const colors = ["bg-teal-100 text-teal-800", "bg-violet-100 text-violet-700", "bg-blue-100 text-blue-700", "bg-cyan-100 text-cyan-700"];
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${colors[index]}`}>{quarter.label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Set as active</span>
          <Switch
            checked={quarter.isActive}
            onCheckedChange={(val) => onChange(index, "isActive", val)}
            className="scale-75"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Start Date</Label>
          <Input
            type="date"
            value={quarter.startDate}
            onChange={(e) => onChange(index, "startDate", e.target.value)}
            className="h-8 text-xs border-slate-200"
          />
        </div>
        <div>
          <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">End Date</Label>
          <Input
            type="date"
            value={quarter.endDate}
            onChange={(e) => onChange(index, "endDate", e.target.value)}
            className="h-8 text-xs border-slate-200"
          />
        </div>
      </div>
    </div>
  );
}

// ── Form ───────────────────────────────────────────────────────────────────────

export default function SchoolYearForm({ open, onClose, onSave, initial }: SchoolYearFormProps) {
  const isEdit = !!initial;

  const [form, setForm] = useState({
    label: initial?.label ?? "",
    startDate: formatDateInput(initial?.startDate),
    endDate: formatDateInput(initial?.endDate),
    isActive: initial?.isActive ?? false,
  });

  const [quarters, setQuarters] = useState<Omit<Quarter, "id" | "schoolYearId">[]>(
    initial?.quarters?.map(({ id, schoolYearId, ...rest }) => ({
      ...rest,
      startDate: formatDateInput(rest.startDate),
      endDate: formatDateInput(rest.endDate)
    })) ??
    deriveQuarters("")
  );

  useEffect(() => {
    if (open) {
      setForm({
        label: initial?.label ?? "",
        startDate: formatDateInput(initial?.startDate),
        endDate: formatDateInput(initial?.endDate),
        isActive: initial?.isActive ?? false,
      });
      setQuarters(
        initial?.quarters?.map(({ id, schoolYearId, ...rest }) => ({
          ...rest,
          startDate: formatDateInput(rest.startDate),
          endDate: formatDateInput(rest.endDate)
        })) ??
        deriveQuarters(formatDateInput(initial?.startDate))
      );
    }
  }, [open, initial]);

  function handleStartDateChange(val: string) {
    setForm((p) => ({ ...p, startDate: val }));
    if (!initial) setQuarters(deriveQuarters(val));
  }

  function handleQuarterChange(index: number, field: string, value: string | boolean) {
    if (field === "isActive" && value === true) {
      setQuarters((prev) => prev.map((q, i) => ({ ...q, isActive: i === index })));
    } else {
      setQuarters((prev) => prev.map((q, i) => i === index ? { ...q, [field]: value } : q));
    }
  }

  function handleSubmit() {
    if (!form.label.trim()) return alert("School Year Label is required.");
    if (!form.startDate) return alert("Start Date is required.");
    if (!form.endDate) return alert("End Date is required.");
    if (new Date(form.startDate) >= new Date(form.endDate)) return alert("End date must be after start date.");

    onSave({ ...form, quarters });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-teal-500" />
            {isEdit ? `Edit S.Y. ${initial?.label}` : "Add School Year"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Label */}
          <div>
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
              School Year Label
            </Label>
            <Input
              placeholder="e.g. 2026-2027"
              value={form.label}
              onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
              className="h-9 text-sm border-slate-200"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">Start Date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="h-9 text-sm border-slate-200"
              />
            </div>
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">End Date</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                className="h-9 text-sm border-slate-200"
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-slate-700">Set as active school year</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Only one school year can be active at a time.</p>
            </div>
            <Switch
              checked={form.isActive}
              onCheckedChange={(val) => setForm((p) => ({ ...p, isActive: val }))}
            />
          </div>

          <Separator />

          {/* Quarters */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <p className="text-xs font-black text-slate-700">Quarter Periods</p>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Auto-filled from start date — adjust as needed
              </span>
            </div>
            <div className="space-y-2.5">
              {quarters.map((q, i) => (
                <QuarterFields key={i} quarter={q} index={i} onChange={handleQuarterChange} />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} className="h-8 text-xs bg-teal-600 hover:bg-teal-800 gap-1.5">
            <Save className="w-3.5 h-3.5" />
            {isEdit ? "Save Changes" : "Create School Year"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}