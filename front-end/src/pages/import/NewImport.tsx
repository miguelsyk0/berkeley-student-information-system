import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, Link2, FileSpreadsheet,
  CheckCircle2, XCircle, AlertCircle, ArrowRight,
  X, RefreshCw, Table2, Wand2, Upload,
  Database, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/routes";
import { useSetHeader } from "@/contexts/HeaderContext";
import {
  analyzeImport, validateImport, confirmImport,
  getSubjects, getSchoolYears, getSections, bulkCreateStudents
} from "@/services/api";

// ── Types ──────────────────────────────────────────────────────────────────────



// ── Helper Components ──────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const steps = ["Select File", "Map Columns", "Validate", "Confirm"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const current = step === n;
        return (
          <div key={n} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-colors
                ${done ? "bg-emerald-500 text-white" :
                  current ? "bg-teal-600 text-white" :
                    "bg-slate-100 text-slate-400"}`}
              >
                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : n}
              </div>
              <span className={`text-xs font-semibold hidden lg:block ${current ? "text-slate-800" : "text-slate-400"}`}>
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

function Field({ label, children, required, error, hint }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
        {hint && <span className="text-[10px] text-slate-400 italic font-medium">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[10px] font-bold text-red-500">{error}</p>}
    </div>
  );
}

// ── Step 1: Select File ────────────────────────────────────────────────────────

function Step1({
  sourceMethod, setSourceMethod,
  file, setFile,
  url, setUrl,
  section, setSection,
  gradeLevel, setGradeLevel,
  quarter, setQuarter,
  schoolYear, setSchoolYear,
  sections, schoolYears,
  errors, onNext, analyzing
}: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5 max-w-3xl">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pt-6 pb-2 px-6">
          <CardTitle className="text-base font-black text-slate-700 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-500" />
            Import Method
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 self-start w-fit">
            {[
              { id: "local", label: "Local File", icon: Upload },
              { id: "url", label: "Drive Link", icon: Link2 },
              { id: "drive", label: "Browse Drive", icon: FileSpreadsheet },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSourceMethod(m.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                  ${sourceMethod === m.id ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <m.icon className="w-3.5 h-3.5" />
                {m.label}
              </button>
            ))}
          </div>

          {sourceMethod === "local" && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all
                ${file ? "border-teal-500 bg-teal-50/30" : "border-slate-200 hover:border-teal-400 hover:bg-slate-50/50"}`}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.xls,.csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${file ? "bg-teal-100 text-teal-600" : "bg-slate-100 text-slate-400"}`}>
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">{file ? file.name : "Click or drag file to upload"}</p>
              <p className="text-[11px] text-slate-400 mt-1">Supports .xlsx, .xls, and .csv</p>
            </div>
          )}

          {sourceMethod === "url" && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Make sure the link has <strong>"Anyone with the link"</strong> access turned on.
                </p>
              </div>
              <Field label="Google Drive URL" required error={errors.url}>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://drive.google.com/..." className="h-10 text-sm border-slate-200" />
              </Field>
            </div>
          )}

          {sourceMethod === "drive" && (
            <div className="border border-slate-100 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-slate-50/30">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-slate-600">Connect to Google Drive</p>
              <p className="text-[11px] text-slate-400 mt-1 mb-6 max-w-[240px]">Browse your spreadsheets directly.</p>
              <Button size="sm" variant="outline" className="h-9 px-6 rounded-xl font-bold bg-white opacity-50 cursor-not-allowed">Coming Soon</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pt-6 pb-0 px-6">
          <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
            <Database className="w-4 h-4 text-violet-500" /> Target Info
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Field label="School Year" required>
            <Select value={schoolYear} onValueChange={setSchoolYear}>
              <SelectTrigger className="h-10 text-sm border-slate-200"><SelectValue /></SelectTrigger>
              <SelectContent>{schoolYears.map((y: any) => <SelectItem key={y.id} value={y.label}>{y.label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Quarter" required error={errors.quarter}>
            <Select value={quarter} onValueChange={setQuarter}>
              <SelectTrigger className="h-10 text-sm border-slate-200"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>{[1, 2, 3, 4].map(q => <SelectItem key={q} value={String(q)}>{q}st Quarter</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Grade Level" required error={errors.gradeLevel}>
            <Select value={gradeLevel} onValueChange={setGradeLevel}>
              <SelectTrigger className="h-10 text-sm border-slate-200"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>{[7, 8, 9, 10].map(g => <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Section" required error={errors.section}>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger className="h-10 text-sm border-slate-200"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>{sections.filter((s: any) => s.gradeLevel === parseInt(gradeLevel)).map((s: any) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button className="bg-teal-600 hover:bg-teal-800 h-10 px-8 rounded-xl font-bold gap-2" onClick={onNext} disabled={analyzing}>
          {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          {analyzing ? "Analyzing..." : "Next: Map Columns"}
        </Button>
      </div>
    </div>
  );
}

function DataPreviewTable({ headers, sampleRows, sheetNames, selectedSheet, onSheetChange }: { headers: string[], sampleRows: any[], sheetNames: string[], selectedSheet: string, onSheetChange: (sheet: string) => void }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
      <div className="bg-slate-50/80 border-b border-slate-100 px-4 py-2 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Table2 className="w-3.5 h-3.5 text-teal-500" /> Spreadsheet Preview
        </p>
        <Badge variant="outline" className="text-[9px] font-bold border-slate-200 text-slate-500 bg-white">
          Showing {sampleRows.length} rows
        </Badge>
      </div>
      <div className="overflow-auto max-h-[450px]">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-slate-50/30 sticky top-0 backdrop-blur-sm">
              {headers.map(h => (
                <th key={h} className="px-4 py-2.5 text-[10px] font-black text-slate-500 border-b border-r border-slate-100 last:border-r-0 uppercase tracking-tight">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sampleRows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                {headers.map(h => (
                  <td key={h} className="px-4 py-2 text-[11px] text-slate-600 border-b border-r border-slate-50 last:border-r-0">
                    {String(row[h] || "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sheetNames.length > 1 && (
        <div className="bg-slate-900 px-2 py-1 flex items-center gap-1 overflow-x-auto scrollbar-hide border-t border-slate-800">
          {sheetNames.map((name) => (
            <button
              key={name}
              onClick={() => onSheetChange(name)}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-tight transition-all rounded px-3
                ${selectedSheet === name
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
            >
              {name}
              {selectedSheet === name && <div className="h-0.5 w-full bg-teal-500 mt-0.5 rounded-full" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Step2({
  columnMaps, setColumnMaps,
  headers, sampleRows, subjects,
  headerRow, setHeaderRow,
  onReAnalyze, analyzing,
  sheetNames, selectedSheet, onSheetChange
}: any) {
  const [search, setSearch] = useState("");
  const [showMappedOnly, setShowMappedOnly] = useState(false);
  const [columnLimit, setColumnLimit] = useState<number | "all">("all");

  const updateMapping = (idx: number, value: string) => {
    const next = columnMaps.map((m: any, i: number) => i === idx ? { ...m, mappedTo: value, autoDetected: false } : m);
    setColumnMaps(next);
  };

  const filteredMaps = columnMaps
    .filter((m: any) => !search || m.sheetColumn.toLowerCase().includes(search.toLowerCase()))
    .filter((m: any) => !showMappedOnly || m.mappedTo !== "skip")
    .slice(0, columnLimit === "all" ? columnMaps.length : columnLimit);

  // Build unique cluster list from the subjects that have one
  const clusterNames = Array.from(new Set(subjects.filter((s: any) => s.cluster).map((s: any) => s.cluster as string)));

  const FIELD_OPTIONS = [
    { value: "skip", label: "— Skip column —" },
    { value: "lrn", label: "LRN (Student ID)" },
    { value: "lastName", label: "Last Name" },
    { value: "firstName", label: "First Name" },
    { value: "middleName", label: "Middle Name" },
    { value: "averageGrade", label: "Quarterly Average Grade" },
    { value: "letterGrade", label: "Quarterly Letter Grade" },
    ...subjects.map((s: any) => ({ value: s.code, label: `${s.code} — ${s.name}` })),
    // Cluster options — maps one column to all subjects in that cluster
    ...clusterNames.map((c) => ({ value: `cluster:${c}`, label: `🔗 Cluster: ${c}` })),
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* ── Left: Mapping Controls ── */}
      <div className="space-y-4">
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardHeader className="py-4 px-6 border-b border-slate-50 bg-slate-50/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-black text-slate-700 uppercase tracking-tight flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-amber-500" /> Define Mapping
              </CardTitle>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Header Row</Label>
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-0.5">
                    <button onClick={() => { setHeaderRow(Math.max(1, headerRow - 1)); onReAnalyze(true); }} className="w-4 h-4 text-xs">-</button>
                    <span className="w-6 text-center text-xs font-bold">{headerRow}</span>
                    <button onClick={() => { setHeaderRow(headerRow + 1); onReAnalyze(true); }} className="w-4 h-4 text-xs">+</button>
                  </div>
                </div>
                {analyzing && <RefreshCw className="w-3.5 h-3.5 text-teal-500 animate-spin" />}
              </div>
            </div>
          </CardHeader>

          <div className="p-3 border-b border-slate-50 flex flex-wrap gap-3 bg-slate-50/20">
            <div className="relative flex-1 min-w-[200px]">
              <RefreshCw className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search columns..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs bg-white border-slate-200"
              />
            </div>

            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200">
              <Label className="text-[10px] font-bold text-slate-400 uppercase">Limit</Label>
              <Select value={String(columnLimit)} onValueChange={v => setColumnLimit(v === "all" ? "all" : parseInt(v))}>
                <SelectTrigger className="h-6 text-[10px] border-none shadow-none w-16 bg-transparent px-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {[10, 20, 50, 100].map(v => <SelectItem key={v} value={String(v)}>Top {v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg">
              <Switch id="mapped-only" checked={showMappedOnly} onCheckedChange={setShowMappedOnly} className="scale-75 origin-left" />
              <Label htmlFor="mapped-only" className="text-[10px] font-bold text-slate-500 uppercase cursor-pointer">Mapped Only</Label>
            </div>
          </div>

          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/20">
                  <th className="px-6 py-2.5 text-[10px] font-black uppercase text-slate-400">Sheet Column</th>
                  <th className="px-6 py-2.5 text-[10px] font-black uppercase text-slate-400">Target Field</th>
                  <th className="px-6 py-2.5 text-[10px] font-black uppercase text-slate-400 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaps.map((map: any, idx: number) => (
                  <tr key={map.sheetColumn} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td className="px-6 py-3">
                      <p className="text-xs font-black text-slate-700">{map.sheetColumn}</p>
                      <p className="text-[10px] text-slate-400 italic truncate max-w-[120px]">
                        eg: {String(sampleRows[0]?.[map.sheetColumn] || "—")}
                      </p>
                    </td>
                    <td className="px-6 py-3">
                      <Select value={map.mappedTo} onValueChange={(v) => updateMapping(idx, v)}>
                        <SelectTrigger className="h-8 text-[11px] border-slate-200 w-full bg-white font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {FIELD_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value} className="text-[11px]">{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-3 text-center">
                      {map.mappedTo !== "skip" ? (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-200 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
                {filteredMaps.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-slate-400 text-xs font-medium">
                      No columns match your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ── Right: Spreadsheet Preview ── */}
      <div className="space-y-4">
        <DataPreviewTable
          headers={headers}
          sampleRows={sampleRows}
          sheetNames={sheetNames}
          selectedSheet={selectedSheet}
          onSheetChange={onSheetChange}
        />
        <Card className="bg-slate-50 border-0 shadow-none">
          <CardContent className="p-4 flex gap-3">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Match your spreadsheet columns with our internal fields.
              We've attempted to auto-detect common fields like <strong>LRN</strong> and <strong>Subject Codes</strong>.
              Columns marked with a grey dot will be ignored.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Step 3: Validate & Preview ─────────────────────────────────────────────────

function Step3({ rows, overwrite, setOverwrite }: any) {
  const counts = { ready: rows.filter((r: any) => r.status === "ready").length, warn: rows.filter((r: any) => r.status === "warning").length, error: rows.filter((r: any) => r.status === "error").length };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Valid Rows" count={counts.ready} color="bg-emerald-50 text-emerald-700" icon={CheckCircle2} />
        <StatCard label="Warnings" count={counts.warn} color="bg-amber-50 text-amber-700" icon={AlertCircle} />
        <StatCard label="Errors (Skipped)" count={counts.error} color="bg-red-50 text-red-700" icon={XCircle} />
      </div>
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-6 py-4">
        <div className="flex items-center gap-3"><RefreshCw className="w-5 h-5 text-violet-500" /><div><p className="text-xs font-bold text-slate-700">Overwrite Existing Grades?</p><p className="text-[10px] text-slate-400">If a student already has a grade for this quarter, should we overwrite it?</p></div></div>
        <Switch checked={overwrite} onCheckedChange={setOverwrite} />
      </div>
      <Card className="border-0 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead><tr className="border-b border-slate-100 bg-slate-50/80"><th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase">Student</th><th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase">Grades</th><th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase">Status</th></tr></thead>
          <tbody>{rows.map((row: any) => (<tr key={row.rowId} className="border-b border-slate-100 last:border-0 hover:bg-slate-50"><td className="px-6 py-3.5"><p className="text-xs font-bold text-slate-800">{row.studentName}</p><p className="text-[10px] font-mono text-slate-400">LRN: {row.lrn}</p></td><td className="px-6 py-3.5"><div className="flex gap-1.5 flex-wrap">{Object.entries(row.grades).map(([s, g]: any) => <span key={s} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{s}: {g}</span>)}</div></td><td className="px-6 py-3.5">{row.errors.map((e: any, i: number) => <div key={i} className={`flex items-center gap-1 text-[10px] font-bold ${e.severity === "error" ? "text-red-500" : "text-amber-500"}`}>{e.message}</div>)}{row.status === "ready" && <div className="text-[10px] font-bold text-emerald-500">Ready</div>}</td></tr>))}</tbody>
        </table>
      </Card>
    </div>
  );
}

function StatCard({ label, count, color, icon: Icon }: any) {
  return (
    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border ${color}`}>
      <Icon className="w-6 h-6 opacity-40" />
      <div><p className="text-2xl font-black">{count}</p><p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</p></div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function NewImport() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [validating, setValidating] = useState(false);
  const [encoding, setEncoding] = useState(false);
  const [creatingStudents, setCreatingStudents] = useState(false);
  const [sourceMethod, setSourceMethod] = useState<"local" | "url" | "drive">("local");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [section, setSection] = useState("");
  const [gradeLevel, setGradeLevel] = useState("7");
  const [quarter, setQuarter] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [headerRow, setHeaderRow] = useState(1);
  const [sections, setSections] = useState<any[]>([]);
  const [schoolYears, setSchoolYears] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [sampleRows, setSampleRows] = useState<any[]>([]);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [rawData, setRawData] = useState<any[]>([]);
  const [columnMaps, setColumnMaps] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any[]>([]);
  const [overwrite, setOverwrite] = useState(false);
  const [stepErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getSubjects().then(setSubjects);
    getSchoolYears().then(y => {
      setSchoolYears(y);
      const active = y.find(y => y.isActive);
      if (active) setSchoolYear(active.label);
    });
  }, []);

  useEffect(() => {
    // Re-fetch sections when gradeLevel changes
    getSections().then(allSections => {
      // Filter is handled on frontend for now to ensure all sections are accessible
      setSections(allSections);
    });
  }, [gradeLevel, schoolYear]);

  useSetHeader({ breadcrumbs: [{ label: "Grade Import", onClick: () => navigate(ROUTES.import.root) }, { label: "New Import" }], extra: <StepIndicator step={step} />, actions: (<Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={() => navigate(-1)}><X className="w-3.5 h-3.5" /> Cancel</Button>) });

  async function handleAnalyze(reAnalyze: boolean | any = false, forceSheet?: string) {
    const isReAnalysis = reAnalyze === true;

    if (!isReAnalysis) {
      if (sourceMethod === "local" && !file) { alert("Please select a file to upload."); return; }
      if (sourceMethod === "url" && !url.trim()) { alert("Please enter a Google Drive URL."); return; }
      if (!quarter || !section || !schoolYear) { alert("Wait! Please complete the section, school year, and quarter information first."); return; }
    }

    setAnalyzing(true);
    try {
      const result = await analyzeImport({
        sourceMethod,
        file: file || undefined,
        url,
        headerRow,
        sheetName: forceSheet || selectedSheet
      });
      setHeaders(result.headers);
      setSampleRows(result.sampleRows);
      setRawData(result.rawData);
      setSheetNames(result.sheetNames || []);
      setSelectedSheet(result.currentSheet || "");

      const initialMaps = result.headers.map(h => {
        const lower = h.toLowerCase();
        let mappedTo = "skip";
        if (lower.includes("lrn")) mappedTo = "lrn";
        else if (lower.includes("last")) mappedTo = "lastName";
        else if (lower.includes("first")) mappedTo = "firstName";
        else if (lower.includes("middle")) mappedTo = "middleName";
        else if (lower.includes("average grade")) mappedTo = "averageGrade";
        else if (lower.includes("letter grade")) mappedTo = "letterGrade";
        else {
          // Try matching subject codes first
          const matchingSubj = subjects.find(s => lower.includes(s.code.toLowerCase()) || s.code.toLowerCase().includes(lower));
          if (matchingSubj) {
            mappedTo = matchingSubj.code;
          } else {
            // Try matching cluster names (e.g., "Logical Analysis", "Psychomotor")
            const clusterValues = Array.from(new Set(subjects.filter(s => s.cluster).map(s => s.cluster)));
            const matchingCluster = clusterValues.find(c => c && lower.includes(c.toLowerCase()));
            if (matchingCluster) mappedTo = `cluster:${matchingCluster}`;
          }
        }
        return { sheetColumn: h, mappedTo, autoDetected: mappedTo !== "skip" };
      });

      setColumnMaps(initialMaps);
      if (!isReAnalysis) setStep(2);
    } catch (err: any) {
      console.error("ANALYSIS FAILED:", err);
      alert(err.message || "Error analyzing file. Check if the link is public.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleValidate() {
    setValidating(true);
    try {
      const mappingObj: Record<string, string> = {};
      columnMaps.forEach((m: any) => { if (m.mappedTo !== "skip") mappingObj[m.mappedTo] = m.sheetColumn; });
      const result = await validateImport({ rows: rawData, mapping: mappingObj, section, gradeLevel: parseInt(gradeLevel) });
      setAnalysis(result); setStep(3);
    } catch (err: any) { alert(err.message); } finally { setValidating(false); }
  }

  async function handleCreateMissingStudents() {
    setCreatingStudents(true);
    try {
      // Find rows with students not found
      const missingRows = analysis.filter(r => r.errors?.some((e: any) => e.message.includes("not found in this section")));

      const studentsToCreate = missingRows.map(row => {
        // Map raw row data to get basic info
        const mappingObj: Record<string, string> = {};
        columnMaps.forEach((m: any) => { if (m.mappedTo !== "skip") mappingObj[m.mappedTo] = m.sheetColumn; });

        const sourceRow = rawData.find(r => String(r[mappingObj.lrn]).trim() === row.lrn) || rawData[0];

        return {
          lrn: row.lrn,
          lastName: sourceRow[mappingObj.lastName] || "",
          firstName: sourceRow[mappingObj.firstName] || "",
          middleName: sourceRow[mappingObj.middleName] || ""
        };
      }).filter(s => s.lrn);

      if (studentsToCreate.length === 0) return;

      const sy = schoolYears.find(y => y.label === schoolYear);
      const sec = sections.find(s => s.name === section);
      
      const enrollmentInfo = {
        schoolYearId: sy?.id,
        sectionId: sec?.id,
        gradeLevel: parseInt(gradeLevel)
      };

      const res = await bulkCreateStudents(studentsToCreate, enrollmentInfo);
      alert(`Created ${res.success_count} missing students successfully!`);

      // Re-validate to clear the errors
      await handleValidate();
    } catch (err: any) {
      alert("Failed to create students: " + err.message);
    } finally {
      setCreatingStudents(false);
    }
  }

  async function handleConfirm() {
    setEncoding(true);
    try {
      const mappingObj: Record<string, string> = {};
      columnMaps.forEach((m: any) => { if (m.mappedTo !== "skip") mappingObj[m.mappedTo] = m.sheetColumn; });
      await confirmImport({ rows: rawData, mapping: mappingObj, section, gradeLevel: parseInt(gradeLevel), schoolYear, quarter: parseInt(quarter), skipErrors: true, overwrite });
      navigate(ROUTES.import.root);
    } catch (err: any) { alert(err.message); } finally { setEncoding(false); }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">{step === 1 ? "Select Source" : step === 2 ? "Map Columns" : step === 3 ? "Review" : "Finalize"}</h1>
        <div className="flex gap-2 items-center">
          {step === 3 && analysis.some(r => r.errors?.some((e: any) => e.message.includes("not found in this section"))) && (
            <Button size="sm" variant="outline" className="h-8 border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg px-4 font-bold mr-4" onClick={handleCreateMissingStudents} disabled={creatingStudents}>
              {creatingStudents ? "Creating..." : "Add Missing Students"}
            </Button>
          )}
          {step > 1 && <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-lg px-4" onClick={() => setStep(step - 1)}>Back</Button>}
          {step === 2 && <Button size="sm" className="h-8 bg-teal-600 hover:bg-teal-800 rounded-lg px-6 font-bold" onClick={handleValidate} disabled={validating}>Validate</Button>}
          {step === 3 && <Button size="sm" className="h-8 bg-teal-600 hover:bg-teal-800 rounded-lg px-6 font-bold" onClick={handleConfirm} disabled={encoding}>Finish Import</Button>}
        </div>
      </div>
      {step === 1 && (
        <Step1
          sourceMethod={sourceMethod} setSourceMethod={setSourceMethod}
          file={file} setFile={setFile}
          url={url} setUrl={setUrl}
          section={section} setSection={setSection}
          gradeLevel={gradeLevel} setGradeLevel={setGradeLevel}
          quarter={quarter} setQuarter={setQuarter}
          schoolYear={schoolYear} setSchoolYear={setSchoolYear}
          sections={sections} schoolYears={schoolYears}
          errors={stepErrors} onNext={handleAnalyze} analyzing={analyzing}
        />
      )}
      {step === 2 && (
        <Step2
          columnMaps={columnMaps}
          setColumnMaps={setColumnMaps}
          headers={headers}
          sampleRows={sampleRows}
          subjects={subjects.filter(s => s.gradeLevel === parseInt(gradeLevel))}
          headerRow={headerRow}
          setHeaderRow={setHeaderRow}
          onReAnalyze={() => handleAnalyze(true)}
          analyzing={analyzing}
          sheetNames={sheetNames}
          selectedSheet={selectedSheet}
          onSheetChange={(s: string) => handleAnalyze(true, s)}
        />
      )}
      {step === 3 && <Step3 rows={analysis} overwrite={overwrite} setOverwrite={setOverwrite} />}
    </div>
  );
}
