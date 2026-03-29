import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronRight, Save, X, User, BookOpen, Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHeader } from "@/contexts/HeaderContext";
import React from "react";
import { createStudent, updateStudent } from "@/services/api";
import type { Student } from "@/services/api";
import { ROUTES } from "@/routes";

// ── Types ──────────────────────────────────────────────────────────────────────

type FormData = Omit<Student, "id">;

// ── Helpers ────────────────────────────────────────────────────────────────────

function Field({
  label, required, error, children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      {children}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function StudentForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const initial: Student | null = state?.student ?? null;
  const isEdit = !!initial;

  const [submitting, setSubmitting] = useState(false);

  useHeader({
    breadcrumbs: [
      { label: "Students", href: ROUTES.students.root },
      { label: isEdit ? `Edit — ${initial?.firstName} ${initial?.lastName}` : "Add Student" },
    ],
    actions: (
      <div className="flex gap-2">
        <Button
          size="sm" variant="outline"
          className="h-8 text-xs gap-1.5"
          onClick={() => navigate(-1)}
        >
          <X className="w-3.5 h-3.5" /> Cancel
        </Button>
        <Button
          size="sm"
          className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
          onClick={handleSubmit}
          disabled={submitting}
        >
          <Save className="w-3.5 h-3.5" />
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Student"}
        </Button>
      </div>
    )
  });

  const [form, setForm] = useState<FormData>({
    lrn: initial?.lrn ?? "",
    lastName: initial?.lastName ?? "",
    firstName: initial?.firstName ?? "",
    middleName: initial?.middleName ?? "",
    suffix: initial?.suffix ?? "",
    gender: initial?.gender ?? "Male",
    birthdate: initial?.birthdate ?? "",
    elemSchoolName: initial?.elemSchoolName ?? "",
    elemSchoolId: initial?.elemSchoolId ?? "",
    elemSchoolAddress: initial?.elemSchoolAddress ?? "",
    elemGenAverage: initial?.elemGenAverage ?? undefined,
    elemCitation: initial?.elemCitation ?? "",
    altCredentialType: initial?.altCredentialType ?? undefined,
    altCredentialRating: initial?.altCredentialRating ?? "",
    altCredentialExamDate: initial?.altCredentialExamDate ?? "",
    altCredentialCenter: initial?.altCredentialCenter ?? "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.lrn.trim()) e.lrn = "LRN is required.";
    if (form.lrn.length !== 12) e.lrn = "LRN must be exactly 12 digits.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.birthdate) e.birthdate = "Birthdate is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function handleSubmit() {
    if (!validate()) return;
    try {
      setSubmitting(true);
      if (isEdit && initial?.id) {
        await updateStudent(initial.id, form);
      } else {
        await createStudent(form);
      }
      navigate(ROUTES.students.root);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to save student");
    } finally {
      setSubmitting(false);
    }
  }

  const hasCredential = !!form.altCredentialType;

  return (
    <div className="p-6 max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-800">
          {isEdit ? "Edit Student" : "Add New Student"}
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {isEdit
            ? "Update the student's personal and eligibility information."
            : "Fill in the student's information to add them to the system."}
        </p>
      </div>

        {/* ── Section 1: Personal Information ── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-0 pt-5 px-6">
            <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-500" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4 space-y-4">
            {/* LRN */}
            <Field label="Learner Reference Number (LRN)" required error={errors.lrn}>
              <Input
                value={form.lrn}
                onChange={(e) => set("lrn", e.target.value.replace(/\D/g, "").slice(0, 12))}
                placeholder="12-digit LRN"
                maxLength={12}
                className={`h-9 text-sm font-mono border-slate-200 ${errors.lrn ? "border-red-400" : ""}`}
              />
            </Field>

            {/* Name row */}
            <div className="grid grid-cols-3 gap-3">
              <Field label="Last Name" required error={errors.lastName}>
                <Input
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  placeholder="Dela Cruz"
                  className={`h-9 text-sm border-slate-200 ${errors.lastName ? "border-red-400" : ""}`}
                />
              </Field>
              <Field label="First Name" required error={errors.firstName}>
                <Input
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  placeholder="Juan"
                  className={`h-9 text-sm border-slate-200 ${errors.firstName ? "border-red-400" : ""}`}
                />
              </Field>
              <Field label="Middle Name">
                <Input
                  value={form.middleName ?? ""}
                  onChange={(e) => set("middleName", e.target.value)}
                  placeholder="Santos"
                  className="h-9 text-sm border-slate-200"
                />
              </Field>
            </div>

            {/* Suffix + Sex + Birthdate */}
            <div className="grid grid-cols-3 gap-3">
              <Field label="Suffix">
                <Select value={form.suffix || "none"} onValueChange={(v) => set("suffix", v === "none" ? "" : v)}>
                  <SelectTrigger className="h-9 text-xs border-slate-200">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="Jr.">Jr.</SelectItem>
                    <SelectItem value="Sr.">Sr.</SelectItem>
                    <SelectItem value="II">II</SelectItem>
                    <SelectItem value="III">III</SelectItem>
                    <SelectItem value="IV">IV</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Sex" required>
                <Select value={form.gender} onValueChange={(v) => set("gender", v as "Male" | "Female")}>
                  <SelectTrigger className="h-9 text-xs border-slate-200">
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Birthdate" required error={errors.birthdate}>
                <Input
                  type="date"
                  value={form.birthdate}
                  onChange={(e) => set("birthdate", e.target.value)}
                  className={`h-9 text-sm border-slate-200 ${errors.birthdate ? "border-red-400" : ""}`}
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* ── Section 2: JHS Eligibility ── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-0 pt-5 px-6">
            <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-500" />
              Elementary Eligibility
              <Badge className="ml-1 bg-slate-100 text-slate-500 border-0 text-[10px]">Form 137</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Elementary School Name">
                <Input
                  value={form.elemSchoolName}
                  onChange={(e) => set("elemSchoolName", e.target.value)}
                  placeholder="e.g. Quezon Primary School"
                  className="h-9 text-xs border-slate-200"
                />
              </Field>
              <Field label="School ID">
                <Input
                  value={form.elemSchoolId}
                  onChange={(e) => set("elemSchoolId", e.target.value)}
                  placeholder="e.g. 104001"
                  className="h-9 text-xs border-slate-200"
                />
              </Field>
            </div>
            <Field label="School Address">
              <Input
                value={form.elemSchoolAddress}
                onChange={(e) => set("elemSchoolAddress", e.target.value)}
                placeholder="Complete address"
                className="h-9 text-xs border-slate-200"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="General Average">
                <Input
                  type="number"
                  min={0} max={100} step={0.01}
                  value={form.elemGenAverage}
                  onChange={(e) => set("elemGenAverage", Number(e.target.value))}
                  placeholder="e.g. 88.5"
                  className="h-9 text-xs border-slate-200"
                />
              </Field>
              <Field label="Honors / Citation">
                <Input
                  value={form.elemCitation}
                  onChange={(e) => set("elemCitation", e.target.value)}
                  placeholder="e.g. With Honors"
                  className="h-9 text-xs border-slate-200"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* ── Section 3: Alternative Credentials ── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-0 pt-5 px-6">
            <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Alternative Credentials
              <Badge className="ml-1 bg-slate-100 text-slate-500 border-0 text-[10px]">
                Optional — PEPT / ALS
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4 space-y-4">
            <Field label="Credential Type">
              <Select value={form.altCredentialType || "none"} onValueChange={(v) => set("altCredentialType", v === "none" ? "" : v)}>
                <SelectTrigger className="h-9 text-xs border-slate-200 text-slate-500">
                  <SelectValue placeholder="No alternative credential" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="PEPT">PEPT (Philippine Educational Placement Test)</SelectItem>
                  <SelectItem value="ALS">ALS (Alternative Learning System) A&E</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {hasCredential && (
              <div className="grid grid-cols-3 gap-3">
                <Field label="Rating / Grade">
                  <Input
                    value={form.altCredentialRating}
                    onChange={(e) => set("altCredentialRating", e.target.value)}
                    placeholder="e.g. 85.0"
                    className="h-9 text-xs border-slate-200"
                  />
                </Field>
                <Field label="Exam Date">
                  <Input
                    type="date"
                    value={form.altCredentialExamDate}
                    onChange={(e) => set("altCredentialExamDate", e.target.value)}
                    className="h-9 text-xs border-slate-200"
                  />
                </Field>
                <Field label="Testing Center">
                  <Input
                    value={form.altCredentialCenter}
                    onChange={(e) => set("altCredentialCenter", e.target.value)}
                    placeholder="Testing center name"
                    className="h-9 text-xs border-slate-200"
                  />
                </Field>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

  );
}
