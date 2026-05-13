import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronRight, Save, X, BookMarked, Layers, Info,
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
import { createSubject, updateSubject, type Subject } from "@/services/api";
import type { SubjectCluster } from "../types";
import { ROUTES } from "@/routes";
import { useSetHeader } from "@/contexts/HeaderContext";
import React from "react";

// ── Cluster Configuration ──────────────────────────────────────────────────────

export const CLUSTERS: {
  value: SubjectCluster;
  label: string;
  color: string;
  badgeClass: string;
}[] = [
  {
    value: "Logical Analysis",
    label: "Logical Analysis",
    color: "bg-indigo-50 border-indigo-200",
    badgeClass: "bg-indigo-100 text-indigo-700 border-0",
  },
  {
    value: "Social Literacy",
    label: "Social Literacy",
    color: "bg-teal-50 border-teal-200",
    badgeClass: "bg-teal-100 text-teal-700 border-0",
  },
  {
    value: "Wika at Pagpapakatao",
    label: "Wika at Pagpapakatao",
    color: "bg-amber-50 border-amber-200",
    badgeClass: "bg-amber-100 text-amber-700 border-0",
  },
  {
    value: "Psychomotor",
    label: "Psychomotor",
    color: "bg-violet-50 border-violet-200",
    badgeClass: "bg-violet-100 text-violet-700 border-0",
  },
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

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: initial?.code ?? "",
    name: initial?.name ?? "",
    displayName: initial?.displayName ?? "",
    gradeLevel: initial?.gradeLevel ? String(initial.gradeLevel) : "7",
    cluster: (initial?.cluster ?? "none") as SubjectCluster | "none",
    isActive: initial?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useSetHeader({
    breadcrumbs: [
      { label: "Subjects", onClick: () => navigate(ROUTES.subjects.root) },
      { label: isEdit ? `Edit — ${initial?.name}` : "Add Subject" },
    ],
    actions: (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => navigate(-1)}>
          <X className="w-3.5 h-3.5" /> Cancel
        </Button>
        <Button
          size="sm"
          className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
          onClick={handleSubmit}
          disabled={loading}
        >
          <Save className="w-3.5 h-3.5" />
          {loading ? "Saving..." : (isEdit ? "Save Changes" : "Add Subject")}
        </Button>
      </div>
    )
  });

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.gradeLevel) e.gradeLevel = "Grade level is required.";
    if (!form.code.trim()) e.code = "Subject code is required.";
    if (form.code.length > 8) e.code = "Code must be 8 characters or less.";
    if (!form.name.trim()) e.name = "Subject name is required.";
    if (!form.displayName.trim()) e.displayName = "SF10 display name is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        code: form.code,
        displayName: form.displayName,
        gradeLevel: parseInt(form.gradeLevel),
        cluster: form.cluster === "none" ? null : form.cluster,
        isActive: form.isActive,
      };

      if (isEdit) {
        await updateSubject(initial!.id, payload);
      } else {
        await createSubject(payload);
      }
      navigate(ROUTES.subjects.root);
    } catch (err) {
      console.error("Save subject error:", err);
      alert("Failed to save subject. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const activeCluster = CLUSTERS.find((c) => c.value === form.cluster);

  return (
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
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Field
                  label="Grade Level"
                  required
                  error={errors.gradeLevel}
                >
                  <Select
                    value={form.gradeLevel}
                    onValueChange={(v) => set("gradeLevel", v)}
                  >
                    <SelectTrigger className={`h-9 text-sm border-slate-200 ${errors.gradeLevel ? "border-red-400" : ""}`}>
                      <SelectValue placeholder="Grade..." />
                    </SelectTrigger>
                    <SelectContent>
                      {[7, 8, 9, 10].map((gl) => (
                        <SelectItem key={gl} value={String(gl)}>Grade {gl}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="col-span-2">
                <Field
                  label="Subject Code"
                  required
                  hint="Short internal identifier"
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
              </div>
            </div>

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
                  {activeCluster && (
                    <Badge className={`${activeCluster.badgeClass} text-[10px]`}>{activeCluster.label}</Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Cluster Settings ── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pt-5 pb-0 px-6">
            <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Cluster Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4 space-y-4">
            <Field
              label="Cluster"
              hint="Groups related subjects for tracking and filtering"
            >
              <Select
                value={form.cluster ?? "none"}
                onValueChange={(v) => set("cluster", v as SubjectCluster | "none")}
              >
                <SelectTrigger className="h-9 text-sm border-slate-200">
                  <SelectValue placeholder="No cluster assigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-slate-400">No cluster</span>
                  </SelectItem>
                  {CLUSTERS.map((c) => (
                    <SelectItem key={c.value!} value={c.value!}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Cluster color swatches */}
            <div className="grid grid-cols-2 gap-2">
              {CLUSTERS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => set("cluster", form.cluster === c.value ? "none" : c.value)}
                  className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all
                    ${form.cluster === c.value
                      ? `${c.color} ring-2 ring-offset-1 ${c.badgeClass.includes("indigo") ? "ring-indigo-300"
                        : c.badgeClass.includes("teal") ? "ring-teal-300"
                        : c.badgeClass.includes("amber") ? "ring-amber-300"
                        : "ring-violet-300"}`
                      : "bg-white border-slate-100 hover:bg-slate-50"
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    c.badgeClass.includes("indigo") ? "bg-indigo-400"
                    : c.badgeClass.includes("teal") ? "bg-teal-400"
                    : c.badgeClass.includes("amber") ? "bg-amber-400"
                    : "bg-violet-400"
                  }`} />
                  <span className="text-[11px] font-semibold text-slate-700">{c.label}</span>
                  {form.cluster === c.value && (
                    <span className="ml-auto text-[10px] font-bold text-slate-500">✓</span>
                  )}
                </button>
              ))}
            </div>
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

  );
}
