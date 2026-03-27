import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight, Search, CheckCircle2, XCircle,
  AlertCircle, Clock, FileSpreadsheet, ExternalLink,
  Download, RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/sidebar";
import { GRADE_COLORS, QUARTER_LABELS } from "@/utils/gradeUtils";
import { formatDateTime, relativeTime } from "@/utils/dateUtils";
import { getImportHistory, getImportDetails } from "@/services/api";
import type { ImportLog } from "@/services/api";
import { ROUTES } from "@/routes";

// ── Import status helpers ──────────────────────────────────────────────────────

const IMPORT_STATUS_STYLES = {
  success:    { bg: "bg-emerald-100", text: "text-emerald-700", label: "Success"    },
  partial:    { bg: "bg-amber-100",   text: "text-amber-700",   label: "Partial"    },
  failed:     { bg: "bg-red-100",     text: "text-red-700",     label: "Failed"     },
  processing: { bg: "bg-blue-100",    text: "text-blue-700",    label: "Processing" },
} as const;

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
  const [logs, setLogs]                 = useState<ImportLog[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [yearFilter, setYearFilter]     = useState("all");
  const [quarterFilter, setQuarterFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    getImportHistory()
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sections = Array.from(new Set(logs.map((l) => l.section))).sort();
  const schoolYears = Array.from(new Set(logs.map((l) => l.schoolYear))).sort().reverse();

  const filtered = logs.filter((log) => {
    const matchSearch  = log.fileName.toLowerCase().includes(search.toLowerCase()) ||
                         log.section.toLowerCase().includes(search.toLowerCase()) ||
                         (log.importedBy ?? "").toLowerCase().includes(search.toLowerCase());
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
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {schoolYears.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={quarterFilter} onValueChange={setQuarterFilter}>
              <SelectTrigger className="h-8 w-28 text-xs border-slate-200 bg-white">
                <SelectValue placeholder="All Quarters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quarters</SelectItem>
                {[1, 2, 3, 4].map((q) => <SelectItem key={q} value={String(q)}>Q{q}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white">
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-28 text-xs border-slate-200 bg-white">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {(["success", "partial", "failed", "processing"] as const).map((s) => (
                  <SelectItem key={s} value={s}>{IMPORT_STATUS_STYLES[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Log table */}
          <Card className="border-0 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-slate-400">
                <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
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
                    const style = IMPORT_STATUS_STYLES[log.status] ?? IMPORT_STATUS_STYLES.processing;
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
                            <span className={`text-[10px] font-bold px-1 py-0.5 rounded ${GRADE_COLORS[log.gradeLevel] ?? ""}`}>
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
                          {(log.rowsSkipped ?? 0) > 0 && (
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
  const [log, setLog]       = useState<ImportLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!logId) return;
    getImportDetails(Number(logId))
      .then(setLog)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [logId]);

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

  const style = IMPORT_STATUS_STYLES[log.status] ?? IMPORT_STATUS_STYLES.processing;

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
            {log.fileUrl && (
              <a
                href={log.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-teal-500 hover:underline flex-shrink-0 mt-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open in Drive
              </a>
            )}
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
              { label: "Total Rows",   value: log.rowsTotal,   color: "text-slate-800",   bg: "bg-white"        },
              { label: "Rows Encoded", value: log.rowsEncoded, color: "text-emerald-700", bg: "bg-emerald-50"  },
              { label: "Rows Skipped", value: log.rowsSkipped, color: "text-red-600",     bg: "bg-red-50"      },
            ].map(({ label, value, color, bg }) => (
              <Card key={label} className={`border-0 shadow-sm ${bg}`}>
                <CardContent className="px-5 py-4 text-center">
                  <p className={`text-3xl font-black ${color}`}>{value ?? 0}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ── Errors ── */}
          {(log.errors?.length ?? 0) > 0 ? (
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
                    {log.errors.map((err: any, i: number) => (
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