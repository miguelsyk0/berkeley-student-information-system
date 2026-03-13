import { useNavigate } from "react-router-dom";
import {
  Upload, Plus, ChevronRight, CheckCircle2,
  Clock, XCircle, AlertCircle, FileSpreadsheet,
  ExternalLink, History,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/sidebar";
import { MOCK_IMPORT_LOGS, STATUS_STYLES, QUARTER_LABELS, GRADE_COLORS, relativeTime } from "../MockData";
import { ROUTES } from "@/routes";
import type { ImportLog } from "../types";

// ── Status Icon ────────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: ImportLog["status"] }) {
  if (status === "success")    return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === "partial")    return <AlertCircle  className="w-4 h-4 text-amber-500"   />;
  if (status === "failed")     return <XCircle      className="w-4 h-4 text-red-400"     />;
  return <Clock className="w-4 h-4 text-blue-400" />;
}

// ── Recent Import Row ──────────────────────────────────────────────────────────

function RecentImportRow({ log, onClick }: { log: ImportLog; onClick: () => void }) {
  const style = STATUS_STYLES[log.status];
  return (
    <div
      className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer group border-b border-slate-100 last:border-0"
      onClick={onClick}
    >
      <StatusIcon status={log.status} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-700 truncate">{log.fileName}</p>
          <Badge className={`text-[9px] h-4 px-1.5 border-0 flex-shrink-0 ${style.bg} ${style.text}`}>
            {style.label}
          </Badge>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          <span className={`text-[10px] font-bold px-1 py-0.5 rounded mr-1.5 ${GRADE_COLORS[log.gradeLevel]}`}>
            G{log.gradeLevel}
          </span>
          {log.section} · {QUARTER_LABELS[log.quarter]} · by {log.importedBy}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs font-semibold text-slate-600">{log.rowsEncoded}/{log.rowsTotal} rows</p>
        <p className="text-[10px] text-slate-400">{relativeTime(log.importedAt)}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ImportDashboard() {
  const navigate = useNavigate();
  const logs = MOCK_IMPORT_LOGS;

  const successCount    = logs.filter((l) => l.status === "success").length;
  const partialCount    = logs.filter((l) => l.status === "partial").length;
  const failedCount     = logs.filter((l) => l.status === "failed").length;
  const totalRowsEncoded = logs.reduce((acc, l) => acc + l.rowsEncoded, 0);

  // Sections with no import this quarter
  const importedSections = new Set(logs.map((l) => l.section));
  const allSections = ["Integrity", "Honesty", "Loyalty", "Diligence", "Humility", "Wisdom", "Courage", "Excellence"];
  const pendingSections = allSections.filter((s) => !importedSections.has(s));

  const recentLogs = [...logs].sort(
    (a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime()
  ).slice(0, 5);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }}
        onLogout={() => console.log("Logout")}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <span className="text-xs text-slate-400">Grade Import</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">Import Dashboard</span>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm" variant="outline"
              className="h-8 text-xs gap-1.5"
              onClick={() => navigate(ROUTES.import.history)}
            >
              <History className="w-3.5 h-3.5" /> Import History
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
              onClick={() => navigate(ROUTES.import.new)}
            >
              <Plus className="w-3.5 h-3.5" /> New Import
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-5">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Grade Sheet Import</h1>
            <p className="text-sm text-slate-400 mt-0.5">Import grade sheets from Google Drive and encode them automatically.</p>
          </div>

          {/* ── Quick Import CTA ── */}
          <div className="bg-teal-600 rounded-2xl px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-1">Quick Action</p>
              <p className="text-white text-lg font-black">Import a Grade Sheet</p>
              <p className="text-teal-200 text-sm mt-0.5">Connect Google Drive, select a file, and encode grades automatically.</p>
            </div>
            <Button
              size="sm"
              className="h-9 px-5 text-sm font-semibold gap-2 bg-white text-teal-800 hover:bg-teal-50 flex-shrink-0"
              onClick={() => navigate(ROUTES.import.new)}
            >
              <Upload className="w-4 h-4" /> Start Import
            </Button>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Successful",    value: successCount,    icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Partial",       value: partialCount,    icon: AlertCircle,  color: "text-amber-600",   bg: "bg-amber-50"   },
              { label: "Failed",        value: failedCount,     icon: XCircle,      color: "text-red-500",     bg: "bg-red-50"     },
              { label: "Rows Encoded",  value: totalRowsEncoded, icon: FileSpreadsheet, color: "text-teal-600", bg: "bg-teal-50" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <Card key={label} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-800">{value}</p>
                    <p className="text-[11px] text-slate-400">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* ── Recent Imports ── */}
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-slate-700">Recent Imports</p>
                <button
                  onClick={() => navigate(ROUTES.import.history)}
                  className="text-xs text-teal-500 font-semibold hover:underline"
                >
                  View all
                </button>
              </div>
              <Card className="border-0 shadow-sm overflow-hidden">
                {recentLogs.map((log) => (
                  <RecentImportRow
                    key={log.id}
                    log={log}
                    onClick={() => navigate(`${ROUTES.import.history}/${log.id}`)}
                  />
                ))}
              </Card>
            </div>

            {/* ── Pending Sections ── */}
            <div className="space-y-2">
              <p className="text-sm font-black text-slate-700">
                Sections Pending Q1 Import
                <Badge className="ml-2 bg-amber-100 text-amber-700 border-0 text-[10px]">
                  {pendingSections.length}
                </Badge>
              </p>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 space-y-2">
                  {pendingSections.length === 0 ? (
                    <div className="flex flex-col items-center py-6 text-slate-400">
                      <CheckCircle2 className="w-8 h-8 mb-2 text-emerald-400" />
                      <p className="text-xs font-semibold">All sections imported!</p>
                    </div>
                  ) : (
                    pendingSections.map((sec) => (
                      <div
                        key={sec}
                        className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                      >
                        <p className="text-xs font-semibold text-slate-700">{sec}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[11px] px-2 gap-1"
                          onClick={() => navigate(ROUTES.import.new)}
                        >
                          <Upload className="w-3 h-3" /> Import
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}