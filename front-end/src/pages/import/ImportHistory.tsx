import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight, Search, CheckCircle2, XCircle,
  AlertCircle, Clock, FileSpreadsheet, ExternalLink,
  Download, RefreshCw, Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/sidebar";
import {
  MOCK_IMPORT_LOGS, STATUS_STYLES, QUARTER_LABELS,
  GRADE_COLORS, formatDateTime, relativeTime,
} from "../MockData";
import { ROUTES } from "@/routes";
import type { ImportLog } from "../types";

// ── Status Icon ────────────────────────────────────────────────────────────────

function StatusIcon({ status, size = "md" }: { status: ImportLog["status"]; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  if (status === "success")    return <CheckCircle2 className={`${cls} text-emerald-500`} />;
  if (status === "partial")    return <AlertCircle  className={`${cls} text-amber-500`}   />;
  if (status === "failed")     return <XCircle      className={`${cls} text-red-400`}     />;
  return <Clock className={`${cls} text-blue-400`} />;
}

// ────────────────────────────────────────────────────────────────────────────────
// IMPORT HISTORY LIST
// ────────────────────────────────────────────────────────────────────────────────

export function ImportHistoryList() {
  const navigate = useNavigate();
  const [search,        setSearch]        = useState("");
  const [yearFilter,    setYearFilter]    = useState("all");
  const [quarterFilter, setQuarterFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [statusFilter,  setStatusFilter]  = useState("all");

  const sections = Array.from(new Set(MOCK_IMPORT_LOGS.map((l) => l.section))).sort();

  const filtered = MOCK_IMPORT_LOGS.filter((log) => {
    const matchSearch  = log.fileName.toLowerCase().includes(search.toLowerCase()) ||
                         log.section.toLowerCase().includes(search.toLowerCase()) ||
                         log.importedBy.toLowerCase().includes(search.toLowerCase());
    const matchYear    = yearFilter    === "all" || log.schoolYear === yearFilter;
    const matchQuarter = quarterFilter === "all" || String(log.quarter) === quarterFilter;
    const matchSection = sectionFilter === "all" || log.section === sectionFilter;
    const matchStatus  = statusFilter  === "all" || log.status === statusFilter;
    return matchSearch && matchYear && matchQuarter && matchSection && matchStatus;
  }).sort((a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime());

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }}
        onLogout={() => console.log("Logout")}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <button onClick={() => navigate(ROUTES.import.root)} className="text-xs text-slate-400 hover:text-slate-600">
            Grade Import
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">Import History</span>
        </header>

        <div className="p-6 space-y-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Import History</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {filtered.length} import{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-48 max-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search file, section, user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-xs bg-white border-slate-200"
              />
            </div>
            {[
              {
                value: yearFilter, onChange: setYearFilter, placeholder: "All Years",
                options: [{ value: "2025-2026", label: "2025–2026" }, { value: "2024-2025", label: "2024–2025" }],
              },
              {
                value: quarterFilter, onChange: setQuarterFilter, placeholder: "All Quarters",
                options: [1,2,3,4].map((q) => ({ value: String(q), label: `Q${q}` })),
              },
              {
                value: sectionFilter, onChange: setSectionFilter, placeholder: "All Sections",
                options: sections.map((s) => ({ value: s, label: s })),
              },
              {
                value: statusFilter, onChange: setStatusFilter, placeholder: "All Statuses",
                options: ["success","partial","failed"].map((s) => ({ value: s, label: STATUS_STYLES[s as keyof typeof STATUS_STYLES].label })),
              },
            ].map((filter, i) => (
              <Select key={i} value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white">
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{filter.placeholder}</SelectItem>
                  {filter.options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            ))}
          </div>

          {/* Log table */}
          <Card className="border-0 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-slate-400">
                <FileSpreadsheet className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-semibold">No import logs found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">File</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Section</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Period</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Rows</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Imported By</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log) => {
                    const style = STATUS_STYLES[log.status];
                    return (
                      <tr
                        key={log.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => navigate(`${ROUTES.import.history}/${log.id}`)}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <p className="text-xs font-semibold text-slate-700 max-w-48 truncate">{log.fileName}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-bold px-1 py-0.5 rounded ${GRADE_COLORS[log.gradeLevel]}`}>
                              G{log.gradeLevel}
                            </span>
                            <span className="text-xs text-slate-600">{log.section}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-xs text-slate-600">{QUARTER_LABELS[log.quarter]}</p>
                          <p className="text-[10px] text-slate-400">{log.schoolYear}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-xs font-semibold text-slate-700">{log.rowsEncoded}/{log.rowsTotal}</p>
                          {log.rowsSkipped > 0 && (
                            <p className="text-[10px] text-red-500">{log.rowsSkipped} skipped</p>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-xs text-slate-600">{log.importedBy}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge className={`text-[10px] h-5 px-2 border-0 gap-1 ${style.bg} ${style.text}`}>
                            <StatusIcon status={log.status} size="sm" />
                            {style.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-xs text-slate-600">{relativeTime(log.importedAt)}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// IMPORT LOG DETAIL
// ────────────────────────────────────────────────────────────────────────────────

export function ImportLogDetail() {
  const navigate = useNavigate();
  const { logId } = useParams<{ logId: string }>();
  const log = MOCK_IMPORT_LOGS.find((l) => l.id === Number(logId));

  if (!log) {
    return (
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-semibold">Import log not found.</p>
            <button onClick={() => navigate(ROUTES.import.history)} className="text-teal-500 text-sm mt-2 hover:underline">
              Back to History
            </button>
          </div>
        </main>
      </div>
    );
  }

  const style = STATUS_STYLES[log.status];
  const errorRows    = log.errors.filter((e) => e.severity === "error");
  const warningRows  = log.errors.filter((e) => e.severity === "warning");

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }}
        onLogout={() => console.log("Logout")}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <button onClick={() => navigate(ROUTES.import.root)} className="text-xs text-slate-400 hover:text-slate-600">
            Grade Import
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <button onClick={() => navigate(ROUTES.import.history)} className="text-xs text-slate-400 hover:text-slate-600">
            History
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600 truncate max-w-48">{log.fileName}</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export Log
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
              onClick={() => navigate(ROUTES.import.new)}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-import
            </Button>
          </div>
        </header>

        <div className="p-6 max-w-4xl space-y-5">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-800 truncate">{log.fileName}</h1>
                <Badge className={`text-xs h-6 px-2.5 border-0 gap-1.5 flex-shrink-0 ${style.bg} ${style.text}`}>
                  <StatusIcon status={log.status} />
                  {style.label}
                </Badge>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Imported by <span className="font-semibold text-slate-600">{log.importedBy}</span>
                {" · "}{formatDateTime(log.importedAt)}
              </p>
            </div>
            <a
              href={log.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-teal-500 hover:underline flex-shrink-0 mt-1"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open in Drive
            </a>
          </div>

          {/* ── Details Grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "School Year", value: log.schoolYear },
              { label: "Quarter",     value: QUARTER_LABELS[log.quarter] },
              { label: "Grade Level", value: `Grade ${log.gradeLevel}` },
              { label: "Section",     value: log.section },
            ].map(({ label, value }) => (
              <Card key={label} className="border-0 shadow-sm">
                <CardContent className="px-4 py-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
                  <p className="text-sm font-black text-slate-700">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ── Row counts ── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Rows",   value: log.rowsTotal,   color: "text-slate-800",   bg: "bg-white" },
              { label: "Rows Encoded", value: log.rowsEncoded, color: "text-emerald-700", bg: "bg-emerald-50" },
              { label: "Rows Skipped", value: log.rowsSkipped, color: "text-red-600",     bg: "bg-red-50" },
            ].map(({ label, value, color, bg }) => (
              <Card key={label} className={`border-0 shadow-sm ${bg}`}>
                <CardContent className="px-5 py-4 text-center">
                  <p className={`text-3xl font-black ${color}`}>{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ── Errors ── */}
          {log.errors.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-black text-slate-700">
                Issues Encountered
                <Badge className="ml-2 bg-red-100 text-red-700 border-0 text-[10px]">
                  {log.errors.length}
                </Badge>
              </p>
              <Card className="border-0 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Severity</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Row</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Student</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Field</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {log.errors.map((err, i) => (
                      <tr key={i} className={`border-b border-slate-100 last:border-0 ${err.severity === "error" ? "bg-red-50/30" : "bg-amber-50/30"}`}>
                        <td className="px-5 py-3">
                          {err.severity === "error"
                            ? <Badge className="bg-red-100 text-red-700 border-0 text-[10px] gap-1">
                                <XCircle className="w-3 h-3" /> Error
                              </Badge>
                            : <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] gap-1">
                                <AlertCircle className="w-3 h-3" /> Warning
                              </Badge>
                          }
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {err.row > 0 ? `#${err.row}` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-semibold text-slate-700">{err.studentName ?? "—"}</p>
                          {err.lrn && <p className="text-[10px] font-mono text-slate-400">{err.lrn}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {err.field}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">{err.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-sm font-semibold text-emerald-700">
                No errors or warnings — all {log.rowsTotal} rows were encoded successfully.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}