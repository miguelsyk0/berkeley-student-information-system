import { useState, useEffect } from "react";
import { BookOpen, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import type { Section, SchoolYear, Teacher } from "@/services/api";
import { getSchoolYears, getTeachers } from "@/services/api";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SectionFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Section, "id" | "studentCount" | "adviserName">) => void;
  initial?: Section | null;
}


// ── Component ──────────────────────────────────────────────────────────────────

export default function SectionForm({ open, onClose, onSave, initial }: SectionFormProps) {
  const isEdit = !!initial;

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    gradeLevel: String(initial?.gradeLevel ?? "7") as "7" | "8" | "9" | "10",
    schoolYearId: initial?.schoolYearId ? String(initial.schoolYearId) : "",
    schoolYear: initial?.schoolYear ?? "",
    adviserId: initial?.adviserId ? String(initial.adviserId) : "",
    roomNumber: initial?.roomNumber ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    if (open) {
      getSchoolYears().then((yrs) => {
        setSchoolYears(yrs);
        // Set default to first school year if adding new section
        if (!initial && yrs.length > 0) {
          setForm((p) => ({
            ...p,
            schoolYearId: String(yrs[0].id),
            schoolYear: yrs[0].label,
          }));
        }
      }).catch(console.error);
      getTeachers().then(setTeachers).catch(console.error);

      // Reset form when dialog opens
      setForm({
        name: initial?.name ?? "",
        gradeLevel: String(initial?.gradeLevel ?? "7") as "7" | "8" | "9" | "10",
        schoolYearId: initial?.schoolYearId ? String(initial.schoolYearId) : "",
        schoolYear: initial?.schoolYear ?? "",
        adviserId: initial?.adviserId ? String(initial.adviserId) : "",
        roomNumber: initial?.roomNumber ?? "",
      });
    }
  }, [open, initial]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Section name is required.";
    if (!form.schoolYearId) e.schoolYearId = "School year is required.";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const selectedSY = schoolYears.find((sy) => String(sy.id) === form.schoolYearId);
    onSave({
      name: form.name.trim(),
      gradeLevel: Number(form.gradeLevel),
      schoolYearId: Number(form.schoolYearId),
      schoolYear: selectedSY?.label ?? "",
      adviserId: form.adviserId && form.adviserId !== "none" ? Number(form.adviserId) : null,
      roomNumber: form.roomNumber || undefined,
    } as Omit<Section, "id" | "studentCount" | "adviserName">);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-500" />
            {isEdit ? `Edit Section — ${initial?.name}` : "Add Section"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Section Name */}
          <div>
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
              Section Name <span className="text-red-400">*</span>
            </Label>
            <Input
              placeholder="e.g. Integrity"
              value={form.name}
              onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setErrors((p) => ({ ...p, name: "" })); }}
              className={`h-9 text-sm border-slate-200 ${errors.name ? "border-red-400" : ""}`}
            />
            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Grade Level + School Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
                Grade Level <span className="text-red-400">*</span>
              </Label>
              <Select value={form.gradeLevel} onValueChange={(v) => setForm((p) => ({ ...p, gradeLevel: v as "7"|"8"|"9"|"10" }))}>
                <SelectTrigger className="h-9 text-sm border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[7, 8, 9, 10].map((g) => (
                    <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
                School Year <span className="text-red-400">*</span>
              </Label>
              <Select
                value={form.schoolYearId}
                onValueChange={(v) => {
                  const sy = schoolYears.find((s) => String(s.id) === v);
                  setForm((p) => ({ ...p, schoolYearId: v, schoolYear: sy?.label ?? "" }));
                  setErrors((p) => ({ ...p, schoolYearId: "" }));
                }}
              >
                <SelectTrigger className={`h-9 text-sm border-slate-200 ${errors.schoolYearId ? "border-red-400" : ""}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {schoolYears.map((sy) => (
                    <SelectItem key={sy.id} value={String(sy.id)}>{sy.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.schoolYearId && <p className="text-[11px] text-red-500 mt-1">{errors.schoolYearId}</p>}
            </div>
          </div>

          {/* Adviser */}
          <div>
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
              Adviser / Teacher
            </Label>
            <Select value={form.adviserId} onValueChange={(v) => setForm((p) => ({ ...p, adviserId: v }))}>
              <SelectTrigger className="h-9 text-sm border-slate-200">
                <SelectValue placeholder="Select an adviser (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No adviser yet</SelectItem>
                {teachers.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Room Number */}
          <div>
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
              Room Number <span className="text-slate-300 font-normal normal-case tracking-normal">(optional)</span>
            </Label>
            <Input
              placeholder="e.g. 201"
              value={form.roomNumber}
              onChange={(e) => setForm((p) => ({ ...p, roomNumber: e.target.value }))}
              className="h-9 text-sm border-slate-200"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} className="h-8 text-xs bg-teal-600 hover:bg-teal-800 gap-1.5">
            <Save className="w-3.5 h-3.5" />
            {isEdit ? "Save Changes" : "Create Section"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}