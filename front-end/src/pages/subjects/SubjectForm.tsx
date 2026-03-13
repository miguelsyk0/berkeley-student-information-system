import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronRight, Save, X, BookMarked, Tag, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/sidebar";
import type { Subject } from "../types";
import { ROUTES } from "@/routes";

// ── Mock MAPEH parent subjects for dropdown ────────────────────────────────────

const MAPEH_PARENTS = [
  { id: 7, name: "Psychomotor (MAPEH)" },
];

// ── Field wrapper ──────────────────────────────────────────────────────────────

function Field({
  label, hint, required, error, children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
        {hint && (
          <span className="text-[10px] text-slate-400 normal-case tracking-normal font-normal flex items-center gap-0.5">
            <Info className="w-3 h-3" /> {hint}
          </span>
        )}
      </div>
      {children}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function SubjectForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const initial: Subject | null = state?.subject ?? null;
  const isEdit = !!initial;

  const [form, setForm] = useState({
    code:          initial?.code        ?? "",
    name:          initial?.name        ?? "",
    displayName:   initial?.displayName ?? "",
    isMapeh:       initial?.isMapeh     ?? false,
    mapehParentId: initial?.mapehParentId ? String(initial.mapehParentId) : "none",
    isActive:      initial?.isActive    ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.code.trim())        e.code        = "Subject code is required.";
    if (form.code.length > 8)     e.code        = "Code must be 8 characters or less.";
    if (!form.name.trim())        e.name        = "Subject name is required.";
    if (!form.displayName.trim()) e.displayName = "SF10 display name is required.";
    if (form.isMapeh && form.mapehParentId === "none") {
      e.mapehParentId = "Please select a MAPEH parent subject.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    console.log("Save subject", form);
    navigate(ROUTES.subjects.root);
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
            onClick={() => navigate(ROUTES.subjects.root)}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Subjects
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">
            {isEdit ? `Edit — ${initial?.name}` : "Add Subject"}
          </span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => navigate(-1)}>
              <X className="w-3.5 h-3.5" /> Cancel
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
              onClick={handleSubmit}
            >
              <Save className="w-3.5 h-3.5" />
              {isEdit ? "Save Changes" : "Add Subject"}
            </Button>
          </div>
        </header>

        <div className="p-6 max-w-2xl space-y-5">
          <div>
            <h1 className="text-2xl font-black text-slate-800">
              {isEdit ? "Edit Subject" : "Add Subject"}
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Configure how this subject appears in the grade sheet and in SF10 documents.
            </p>
          </div>

          {/* ── Main Info ── */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pt-5 pb-0 px-6">
              <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-teal-500" />
                Subject Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4 space-y-4">
              {/* Code */}
              <Field
                label="Subject Code"
                required
                hint="Short internal identifier used in grade sheets"
                error={errors.code}
              >
                <Input
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase().slice(0, 8))}
                  placeholder="e.g. MATH, SCI, EL"
                  maxLength={8}
                  className={`h-9 text-sm font-mono border-slate-200 ${errors.code ? "border-red-400" : ""}`}
                />
              </Field>

              {/* Name */}
              <Field
                label="Subject Name"
                required
                hint="School-specific name shown in the grade encoding UI"
                error={errors.name}
              >
                <Input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Science Lab, Math Lab"
                  className={`h-9 text-sm border-slate-200 ${errors.name ? "border-red-400" : ""}`}
                />
              </Field>

              {/* SF10 Display Name */}
              <Field
                label="SF10 Display Name"
                required
                hint="Official DepEd name printed on the SF10 document"
                error={errors.displayName}
              >
                <Input
                  value={form.displayName}
                  onChange={(e) => set("displayName", e.target.value)}
                  placeholder="e.g. Science, Mathematics"
                  className={`h-9 text-sm border-slate-200 ${errors.displayName ? "border-red-400" : ""}`}
                />
              </Field>

              {/* Preview */}
              {(form.code || form.name || form.displayName) && (
                <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Preview</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                      {form.code || "CODE"}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">{form.name || "Subject Name"}</span>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span className="text-xs text-slate-500 italic">{form.displayName || "SF10 Name"}</span>
                    {form.isMapeh && (
                      <Badge className="bg-violet-100 text-violet-700 border-0 text-[10px]">MAPEH</Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── MAPEH Settings ── */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pt-5 pb-0 px-6">
              <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
                <Tag className="w-4 h-4 text-violet-500" />
                MAPEH Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4 space-y-4">
              {/* MAPEH toggle */}
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold text-slate-700">This is a MAPEH sub-subject</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Enable if this is Music, Arts, PE, or Health under a parent MAPEH subject.
                  </p>
                </div>
                <Switch
                  checked={form.isMapeh}
                  onCheckedChange={(v) => {
                    set("isMapeh", v);
                    if (!v) set("mapehParentId", "none");
                  }}
                />
              </div>

              {/* Parent subject dropdown — only when isMapeh is true */}
              {form.isMapeh && (
                <Field
                  label="MAPEH Parent Subject"
                  required
                  error={errors.mapehParentId}
                >
                  <Select
                    value={form.mapehParentId}
                    onValueChange={(v) => set("mapehParentId", v)}
                  >
                    <SelectTrigger className={`h-9 text-sm border-slate-200 ${errors.mapehParentId ? "border-red-400" : ""}`}>
                      <SelectValue placeholder="Select parent subject..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select parent...</SelectItem>
                      {MAPEH_PARENTS.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </CardContent>
          </Card>

          {/* ── Status ── */}
          <Card className="border-0 shadow-sm">
            <CardContent className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-700">Active</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Inactive subjects won't appear in grade encoding or new imports.
                  </p>
                </div>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => set("isActive", v)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}