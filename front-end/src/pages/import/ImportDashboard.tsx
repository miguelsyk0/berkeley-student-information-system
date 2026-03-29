import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload, Plus, ChevronRight, CheckCircle2,
  Clock, XCircle, AlertCircle, FileSpreadsheet,
  ExternalLink, History,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GRADE_COLORS, QUARTER_LABELS } from "@/utils/gradeUtils";
import { relativeTime } from "@/utils/dateUtils";
import { getImportHistory } from "@/services/api";
import type { ImportLog } from "@/services/api";
import { ROUTES } from "@/routes";
import { useHeader } from "@/contexts/HeaderContext";
import React from "react";

// ── Import status helpers ──────────────────────────────────────────────────────

const IMPORT_STATUS_STYLES = {
  success: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Success" },
  partial: { bg: "bg-amber-100", text: "text-amber-700", label: "Partial" },
  failed: { bg: "bg-red-100", text: "text-red-700", label: "Failed" },
  processing: { bg: "bg-blue-100", text: "text-blue-700", label: "Processing" },
} as const;

// ── Status Icon ────────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: ImportLog["status"] }) {
  if (status === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === "partial") return <AlertCircle className="w-4 h-4 text-amber-500" />;
  if (status === "failed") return <XCircle className="w-4 h-4 text-red-400" />;
  return <Clock className="w-4 h-4 text-blue-400" />;
}

// ── Recent Import Row ──────────────────────────────────────────────────────────

function RecentImportRow({ log, onClick }: { log: ImportLog; onClick: () => void }) {
  const style = IMPORT_STATUS_STYLES[log.status] ?? IMPORT_STATUS_STYLES.processing;
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
          <span className={`text-[10px] font-bold px-1 py-0.5 rounded mr-1.5 ${GRADE_COLORS[log.gradeLevel] ?? ""}`}>
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
  const [logs, setLogs] = useState<ImportLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getImportHistory()
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const successCount = logs.filter((l) => l.status === "success").length;
  const partialCount = logs.filter((l) => l.status === "partial").length;
  const failedCount = logs.filter((l) => l.status === "failed").length;
  const totalRowsEncoded = logs.reduce((acc, l) => acc + (l.rowsEncoded ?? 0), 0);

  const importedSections = new Set(logs.map((l) => l.section));
  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime())
    .slice(0, 5);

  useHeader({
    breadcrumbs: [
      { label: "Grade Import" },
      { label: "Import Dashboard" },
    ],
    actions: (
      <div className="flex gap-2">
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
    )
  });

  return (
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
            { label: "Successful", value: successCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Partial", value: partialCount, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Failed", value: failedCount, icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
            { label: "Rows Encoded", value: totalRowsEncoded, icon: FileSpreadsheet, color: "text-teal-600", bg: "bg-teal-50" },
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
              {loading ? (
                <div className="flex items-center justify-center py-12 text-slate-400">
                  <div className="w-6 h-6 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mr-3" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : recentLogs.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-slate-400">
                  <FileSpreadsheet className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-xs font-semibold">No imports yet</p>
                </div>
              ) : (
                recentLogs.map((log) => (
                  <RecentImportRow
                    key={log.id}
                    log={log}
                    onClick={() => navigate(`${ROUTES.import.history}/${log.id}`)}
                  />
                ))
              )}
            </Card>
          </div>

          {/* ── Sections with imports ── */}
          <div className="space-y-2">
            <p className="text-sm font-black text-slate-700">
              Sections with Imports
              <Badge className="ml-2 bg-teal-100 text-teal-700 border-0 text-[10px]">
                {importedSections.size}
              </Badge>
            </p>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-2">
                {importedSections.size === 0 ? (
                  <div className="flex flex-col items-center py-6 text-slate-400">
                    <ExternalLink className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-xs font-semibold">No sections imported yet</p>
                  </div>
                ) : (
                  Array.from(importedSections).sort().map((sec) => (
                    <div
                      key={sec}
                      className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                    >
                      <p className="text-xs font-semibold text-slate-700">{sec}</p>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

  );
}
