import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, Upload, Link2, FileSpreadsheet,
  CheckCircle2, XCircle, AlertCircle, ArrowRight,
  X, RefreshCw, Table2, Wand2, Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/components/sidebar";
import { ROUTES } from "@/routes";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ColumnMap {
  sheetColumn: string;
  mappedTo: string;
  autoDetected: boolean;
}

interface PreviewRow {
  row: number;
  lrn: string;
  studentName: string;
  grades: Record<string, string>;
  errors: { field: string; message: string; severity: "error" | "warning" }[];
}

// ── Mock data for preview ──────────────────────────────────────────────────────

const MOCK_COLUMN_MAPS: ColumnMap[] = [
  { sheetColumn: "A",  mappedTo: "lrn",    autoDetected: true  },
  { sheetColumn: "B",  mappedTo: "lastName", autoDetected: true },
  { sheetColumn: "C",  mappedTo: "firstName", autoDetected: true },
  { sheetColumn: "D",  mappedTo: "q1_LA",   autoDetected: true  },
  { sheetColumn: "E",  mappedTo: "q1_SCI",  autoDetected: true  },
  { sheetColumn: "F",  mappedTo: "q1_MATH", autoDetected: true  },
  { sheetColumn: "G",  mappedTo: "q1_SL",   autoDetected: true  },
  { sheetColumn: "H",  mappedTo: "q1_EL",   autoDetected: true  },
  { sheetColumn: "I",  mappedTo: "q1_WP",   autoDetected: false },
  { sheetColumn: "J",  mappedTo: "q1_MAP",  autoDetected: true  },
  { sheetColumn: "K",  mappedTo: "q1_TLE",  autoDetected: true  },
  { sheetColumn: "L",  mappedTo: "q1_MSE",  autoDetected: true  },
  { sheetColumn: "M",  mappedTo: "q1_COD",  autoDetected: true  },
];

const MOCK_PREVIEW: PreviewRow[] = [
  { row: 2, lrn: "105012300001", studentName: "Santos, Miguel",   grades: { LA: "94", SCI: "95", MATH: "91", SL: "90", EL: "92" }, errors: [] },
  { row: 3, lrn: "105012300002", studentName: "Reyes, Sofia",     grades: { LA: "96", SCI: "93", MATH: "88", SL: "91", EL: "94" }, errors: [] },
  { row: 4, lrn: "105012300099", studentName: "Unknown, Student", grades: { LA: "88", SCI: "90", MATH: "85", SL: "89", EL: "91" },
    errors: [{ field: "lrn", message: "LRN not found in the system.", severity: "error" }] },
  { row: 5, lrn: "105012300004", studentName: "Villanueva, Lara", grades: { LA: "90", SCI: "92", MATH: "105", SL: "88", EL: "95" },
    errors: [{ field: "MATH", message: "Grade 105 is out of range (0–100).", severity: "error" }] },
  { row: 6, lrn: "105012300005", studentName: "Cruz, Nathan",     grades: { LA: "91", SCI: "87", MATH: "93", SL: "90", EL: "" },
    errors: [{ field: "EL", message: "Missing grade value.", severity: "warning" }] },
  { row: 7, lrn: "105012300006", studentName: "Lim, Andrea",      grades: { LA: "85", SCI: "88", MATH: "90", SL: "86", EL: "89" }, errors: [] },
];

const FIELD_OPTIONS = [
  { value: "skip",      label: "— Skip column —" },
  { value: "lrn",       label: "LRN" },
  { value: "lastName",  label: "Last Name" },
  { value: "firstName", label: "First Name" },
  { value: "q1_LA",     label: "Q1 — Logical Analysis" },
  { value: "q1_SCI",    label: "Q1 — Science Lab" },
  { value: "q1_MATH",   label: "Q1 — Math Lab" },
  { value: "q1_SL",     label: "Q1 — Social Literacy" },
  { value: "q1_EL",     label: "Q1 — English Lab" },
  { value: "q1_WP",     label: "Q1 — Wika at Pagpapakatao" },
  { value: "q1_MAP",    label: "Q1 — Psychomotor" },
  { value: "q1_TLE",    label: "Q1 — TLE" },
  { value: "q1_MSE",    label: "Q1 — MSE" },
  { value: "q1_COD",    label: "Q1 — Coding" },
];

// ── Step Indicator ─────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const steps = ["Select File", "Map Columns", "Validate", "Confirm"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const n = i + 1;
        const done    = step > n;
        const current = step === n;
        return (
          <div key={n} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-colors
                ${done    ? "bg-emerald-500 text-white" :
                  current ? "bg-teal-600 text-white"  :
                  "bg-slate-100 text-slate-400"}`}
              >
                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : n}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${current ? "text-slate-800" : "text-slate-400"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1: Select File ────────────────────────────────────────────────────────

function Step1({
  driveUrl, setDriveUrl, section, setSection,
  gradeLevel, setGradeLevel, quarter, setQuarter,
  schoolYear, setSchoolYear,
  errors,
}: {
  driveUrl: string; setDriveUrl: (v: string) => void;
  section: string;  setSection:  (v: string) => void;
  gradeLevel: string; setGradeLevel: (v: string) => void;
  quarter: string;  setQuarter:  (v: string) => void;
  schoolYear: string; setSchoolYear: (v: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-5 max-w-2xl">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pt-5 pb-0 px-6">
          <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-teal-500" />
            Google Drive File
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4 space-y-4">
          <div>
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
              Google Drive File URL <span className="text-red-400">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className={`h-9 text-sm border-slate-200 flex-1 ${errors.driveUrl ? "border-red-400" : ""}`}
              />
              <Button size="sm" variant="outline" className="h-9 text-xs gap-1.5 flex-shrink-0">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Browse Drive
              </Button>
            </div>
            {errors.driveUrl
              ? <p className="text-[11px] text-red-500 mt-1">{errors.driveUrl}</p>
              : <p className="text-[11px] text-slate-400 mt-1">Paste the shareable link to the grade sheet file in Google Drive.</p>
            }
          </div>

          {driveUrl && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-emerald-700 truncate">Grade_Sheet_8_Diligence_Q1.xlsx</p>
                <p className="text-[10px] text-emerald-600">File found · 40 rows detected</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pt-5 pb-0 px-6">
          <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
            <Table2 className="w-4 h-4 text-violet-500" />
            Target Section & Period
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4 grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
              School Year <span className="text-red-400">*</span>
            </Label>
            <Select value={schoolYear} onValueChange={setSchoolYear}>
              <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-2026">2025–2026</SelectItem>
                <SelectItem value="2024-2025">2024–2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
              Quarter <span className="text-red-400">*</span>
            </Label>
            <Select value={quarter} onValueChange={setQuarter}>
              <SelectTrigger className={`h-9 text-sm border-slate-200 ${errors.quarter ? "border-red-400" : ""}`}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4].map((q) => <SelectItem key={q} value={String(q)}>{q}st Quarter</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.quarter && <p className="text-[11px] text-red-500 mt-1">{errors.quarter}</p>}
          </div>
          <div>
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
              Grade Level <span className="text-red-400">*</span>
            </Label>
            <Select value={gradeLevel} onValueChange={setGradeLevel}>
              <SelectTrigger className={`h-9 text-sm border-slate-200 ${errors.gradeLevel ? "border-red-400" : ""}`}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {[7,8,9,10].map((g) => <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.gradeLevel && <p className="text-[11px] text-red-500 mt-1">{errors.gradeLevel}</p>}
          </div>
          <div>
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 block">
              Section <span className="text-red-400">*</span>
            </Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger className={`h-9 text-sm border-slate-200 ${errors.section ? "border-red-400" : ""}`}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {["Integrity","Honesty","Loyalty","Diligence","Humility","Wisdom","Courage","Excellence"].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.section && <p className="text-[11px] text-red-500 mt-1">{errors.section}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Step 2: Map Columns ────────────────────────────────────────────────────────

function Step2({ columnMaps, setColumnMaps }: {
  columnMaps: ColumnMap[];
  setColumnMaps: (maps: ColumnMap[]) => void;
}) {
  function updateMapping(idx: number, value: string) {
    const next = columnMaps.map((m, i) => i === idx ? { ...m, mappedTo: value, autoDetected: false } : m);
    setColumnMaps(next);
  }

  const autoCount = columnMaps.filter((m) => m.autoDetected).length;

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3">
        <Wand2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
        <p className="text-xs text-teal-800">
          <span className="font-bold">{autoCount} of {columnMaps.length}</span> columns were auto-detected.
          Review and adjust any that look incorrect.
        </p>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Sheet Column</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Sample Value</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Maps To</th>
              <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Auto</th>
            </tr>
          </thead>
          <tbody>
            {columnMaps.map((map, idx) => (
              <tr key={map.sheetColumn} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-5 py-2.5">
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Col {map.sheetColumn}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-xs text-slate-500 italic">
                    {map.mappedTo === "lrn" ? "105012300001" :
                     map.mappedTo === "lastName" ? "Santos" :
                     map.mappedTo === "firstName" ? "Miguel" : "94"}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <Select value={map.mappedTo} onValueChange={(v) => updateMapping(idx, v)}>
                    <SelectTrigger className="h-8 text-xs border-slate-200 w-52">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-2.5 text-center">
                  {map.autoDetected
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                    : <span className="text-[10px] text-amber-600 font-semibold">Manual</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Step 3: Validate & Preview ─────────────────────────────────────────────────

function Step3({ rows }: { rows: PreviewRow[] }) {
  const errorCount   = rows.filter((r) => r.errors.some((e) => e.severity === "error")).length;
  const warningCount = rows.filter((r) => r.errors.some((e) => e.severity === "warning")).length;
  const cleanCount   = rows.filter((r) => r.errors.length === 0).length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex gap-3">
        {[
          { label: "Ready to encode", count: cleanCount,   color: "bg-emerald-100 text-emerald-700" },
          { label: "Warnings",         count: warningCount, color: "bg-amber-100   text-amber-700"   },
          { label: "Errors (skipped)", count: errorCount,   color: "bg-red-100     text-red-700"     },
        ].map(({ label, count, color }) => (
          <div key={label} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${color}`}>
            <span className="text-xl font-black">{count}</span>
            <span className="text-xs font-semibold">{label}</span>
          </div>
        ))}
      </div>

      {errorCount > 0 && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">
            <span className="font-bold">{errorCount} row{errorCount > 1 ? "s" : ""}</span> will be skipped due to errors.
            You can still proceed — valid rows will be encoded and skipped rows can be fixed manually.
          </p>
        </div>
      )}

      {/* Preview table */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Row</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">LRN</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Student</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Sample Grades</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const hasError   = row.errors.some((e) => e.severity === "error");
              const hasWarning = row.errors.some((e) => e.severity === "warning");
              return (
                <tr key={row.row} className={`border-b border-slate-100 last:border-0 ${hasError ? "bg-red-50/40" : hasWarning ? "bg-amber-50/40" : ""}`}>
                  <td className="px-5 py-3 text-xs text-slate-400">#{row.row}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{row.lrn}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-700">{row.studentName}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {Object.entries(row.grades).slice(0, 4).map(([subj, grade]) => (
                        <span key={subj} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded
                          ${Number(grade) > 100 ? "bg-red-100 text-red-600" : grade === "" ? "bg-slate-100 text-slate-400" : "bg-slate-100 text-slate-600"}`}>
                          {subj}: {grade || "—"}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {hasError ? (
                      <div className="space-y-1">
                        {row.errors.filter((e) => e.severity === "error").map((e, i) => (
                          <p key={i} className="text-[10px] text-red-600 flex items-center gap-1">
                            <XCircle className="w-3 h-3 flex-shrink-0" /> {e.message}
                          </p>
                        ))}
                      </div>
                    ) : hasWarning ? (
                      <div className="space-y-1">
                        {row.errors.filter((e) => e.severity === "warning").map((e, i) => (
                          <p key={i} className="text-[10px] text-amber-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" /> {e.message}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Step 4: Confirm & Encode ───────────────────────────────────────────────────

function Step4({
  section, gradeLevel, quarter, schoolYear,
  fileName, rows, onEncode, encoding,
}: {
  section: string; gradeLevel: string; quarter: string;
  schoolYear: string; fileName: string;
  rows: PreviewRow[]; onEncode: () => void; encoding: boolean;
}) {
  const toEncode = rows.filter((r) => !r.errors.some((e) => e.severity === "error")).length;
  const toSkip   = rows.length - toEncode;

  return (
    <div className="space-y-4 max-w-2xl">
      <Card className="border-0 shadow-sm">
        <CardContent className="px-6 py-5 space-y-4">
          <p className="text-sm font-black text-slate-700">Import Summary</p>
          <div className="divide-y divide-slate-100">
            {[
              { label: "File",         value: fileName || "Grade_Sheet.xlsx" },
              { label: "School Year",  value: schoolYear },
              { label: "Quarter",      value: `Q${quarter}` },
              { label: "Grade Level",  value: `Grade ${gradeLevel}` },
              { label: "Section",      value: section },
              { label: "Rows to Encode", value: `${toEncode} rows` },
              { label: "Rows to Skip",  value: toSkip > 0 ? `${toSkip} rows (errors)` : "None" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-xs font-semibold text-slate-700">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {encoding ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="px-6 py-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-teal-600 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-slate-700">Encoding grades...</p>
              <p className="text-xs text-slate-400 mt-1">This may take a few seconds.</p>
            </div>
            <Progress value={66} className="w-full max-w-xs h-2" />
          </CardContent>
        </Card>
      ) : (
        <div className="flex gap-3">
          <Button
            size="sm"
            className="h-9 px-6 text-sm font-semibold gap-2 bg-teal-600 hover:bg-teal-800"
            onClick={onEncode}
          >
            <Save className="w-4 h-4" /> Confirm & Encode {toEncode} Rows
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function NewImport() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 state
  const [driveUrl,   setDriveUrl]   = useState("");
  const [section,    setSection]    = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [quarter,    setQuarter]    = useState("");
  const [schoolYear, setSchoolYear] = useState("2025-2026");

  // Step 2 state
  const [columnMaps, setColumnMaps] = useState<ColumnMap[]>(MOCK_COLUMN_MAPS);

  // Step 4 state
  const [encoding, setEncoding] = useState(false);

  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  function validateStep1(): boolean {
    const e: Record<string, string> = {};
    if (!driveUrl.trim()) e.driveUrl   = "Please enter a Google Drive URL.";
    if (!quarter)         e.quarter    = "Please select a quarter.";
    if (!gradeLevel)      e.gradeLevel = "Please select a grade level.";
    if (!section)         e.section    = "Please select a section.";
    setStepErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (step === 1 && !validateStep1()) return;
    setStep((s) => Math.min(s + 1, 4));
  }

  function handleEncode() {
    setEncoding(true);
    setTimeout(() => {
      navigate(ROUTES.import.root);
    }, 2000);
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }}
        onLogout={() => console.log("Logout")}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(ROUTES.import.root)} className="text-xs text-slate-400 hover:text-slate-600">
              Grade Import
            </button>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-xs font-semibold text-slate-600">New Import</span>
          </div>
          <div className="ml-4 flex-1">
            <StepIndicator step={step} />
          </div>
          <Button
            size="sm" variant="outline"
            className="h-8 text-xs gap-1.5"
            onClick={() => navigate(-1)}
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </Button>
        </header>

        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-800">
                {step === 1 ? "Select File" :
                 step === 2 ? "Map Columns" :
                 step === 3 ? "Validate & Preview" :
                 "Confirm & Encode"}
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">Step {step} of 4</p>
            </div>
            <div className="flex gap-2">
              {step > 1 && (
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setStep((s) => s - 1)}>
                  Back
                </Button>
              )}
              {step < 4 && (
                <Button size="sm" className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800" onClick={handleNext}>
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>

          {step === 1 && (
            <Step1
              driveUrl={driveUrl} setDriveUrl={setDriveUrl}
              section={section}   setSection={setSection}
              gradeLevel={gradeLevel} setGradeLevel={setGradeLevel}
              quarter={quarter}   setQuarter={setQuarter}
              schoolYear={schoolYear} setSchoolYear={setSchoolYear}
              errors={stepErrors}
            />
          )}
          {step === 2 && <Step2 columnMaps={columnMaps} setColumnMaps={setColumnMaps} />}
          {step === 3 && <Step3 rows={MOCK_PREVIEW} />}
          {step === 4 && (
            <Step4
              section={section} gradeLevel={gradeLevel} quarter={quarter}
              schoolYear={schoolYear} fileName="Grade_Sheet_8_Diligence_Q1.xlsx"
              rows={MOCK_PREVIEW} onEncode={handleEncode} encoding={encoding}
            />
          )}
        </div>
      </main>
    </div>
  );
}