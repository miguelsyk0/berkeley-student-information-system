import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight, Search, ClipboardList, TrendingUp, CheckCircle2, AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from "@/components/sidebar";
import {
  SUBJECTS, MOCK_STUDENTS, QUARTERLY_MOCK, GRADE_COLORS,
  computeAvg, gradeColor, letterGrade,
} from "./MockData";
import { ROUTES } from "@/routes";

export default function StudentGradeView() {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();

  const initialStudent =
    MOCK_STUDENTS.find((s) => s.studentId === Number(studentId)) ?? MOCK_STUDENTS[0];

  const [tab,             setTab]             = useState<"quarterly" | "final">("quarterly");
  const [selectedStudent, setSelectedStudent] = useState(initialStudent);
  const [search,          setSearch]          = useState("");

  const filtered = MOCK_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.lrn.includes(search)
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }}
        onLogout={() => {}}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <button
            onClick={() => navigate(ROUTES.grades.root)}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Grade Encoding
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">Student Grade View</span>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm" variant="outline"
              className="h-8 text-xs gap-1.5"
              onClick={() => navigate(ROUTES.grades.classSheet())}
            >
              <ClipboardList className="w-3.5 h-3.5" /> Class Sheet
            </Button>
          </div>
        </header>

        <div className="flex h-[calc(100%-64px)]">
          {/* Student sidebar */}
          <div className="w-64 border-r border-slate-100 bg-white flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  placeholder="Search student..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-8 text-xs border-slate-200"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 py-1">
              {filtered.map((s) => {
                const active = selectedStudent.studentId === s.studentId;
                return (
                  <button
                    key={s.studentId}
                    onClick={() => setSelectedStudent(s)}
                    className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${active ? "bg-teal-50" : ""}`}
                  >
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarFallback className={`text-[10px] font-bold ${active ? "bg-teal-200 text-teal-800" : "bg-slate-100 text-slate-600"}`}>
                        {s.name.split(",")[0]?.[0]}
                        {s.name.split(" ").slice(-1)[0]?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${active ? "text-teal-800" : "text-slate-700"}`}>
                        {s.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">{s.lrn}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grade panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Student header card */}
            <Card className="border-0 shadow-sm">
              <div className="p-4 flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-teal-100 text-teal-800 text-sm font-black">
                    {selectedStudent.name.split(",")[0]?.[0]}
                    {selectedStudent.name.split(" ").slice(-1)[0]?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-black text-slate-800">{selectedStudent.name}</h2>
                  <p className="text-xs font-mono text-slate-400">LRN: {selectedStudent.lrn}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[8]}`}>
                      Grade 8
                    </span>
                    <span className="text-xs text-slate-500">Diligence · S.Y. 2025–2026</span>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">General Average</p>
                  <p className={`text-2xl font-black ${gradeColor(computeAvg(selectedStudent.grades))}`}>
                    {computeAvg(selectedStudent.grades)?.toFixed(2) ?? "—"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm w-fit">
              {[
                { key: "quarterly", label: "Quarterly Grades", icon: ClipboardList },
                { key: "final",     label: "Final Grades",     icon: TrendingUp    },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key as "quarterly" | "final")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    tab === t.key
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Quarterly Tab ── */}
            {tab === "quarterly" && (
              <Card className="border-0 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Subject
                      </th>
                      {[1, 2, 3, 4].map((q) => (
                        <th key={q} className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Q{q}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SUBJECTS.map((subj) => (
                      <tr key={subj.code} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="px-5 py-3">
                          <p className="text-xs font-semibold text-slate-700">{subj.name}</p>
                          <p className="text-[10px] text-slate-400">{subj.code}</p>
                        </td>
                        {[1, 2, 3, 4].map((q) => {
                          const v = QUARTERLY_MOCK[subj.code]?.[q];
                          return (
                            <td key={q} className="px-4 py-3 text-center">
                              <span className={`text-sm ${gradeColor(v)}`}>
                                {v ?? <span className="text-slate-300 text-xs">—</span>}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            {/* ── Final Grades Tab ── */}
            {tab === "final" && (
              <Card className="border-0 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject</th>
                      {["Q1", "Q2", "Q3", "Q4", "Final", "Letter", "Remarks"].map((h) => (
                        <th key={h} className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SUBJECTS.map((subj) => {
                      const qs      = [1, 2, 3, 4].map((q) => QUARTERLY_MOCK[subj.code]?.[q] ?? null);
                      const validQs = qs.filter((v): v is number => v !== null);
                      const final   = validQs.length === 4
                        ? Math.round(validQs.reduce((a, b) => a + b) / 4 * 100) / 100
                        : null;
                      const passed  = final !== null && final >= 75;

                      return (
                        <tr key={subj.code} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                          <td className="px-5 py-3">
                            <p className="text-xs font-semibold text-slate-700">{subj.name}</p>
                            <p className="text-[10px] text-slate-400">{subj.code}</p>
                          </td>
                          {qs.map((q, i) => (
                            <td key={i} className="px-4 py-3 text-center">
                              <span className={`text-xs ${gradeColor(q)}`}>{q ?? "—"}</span>
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center">
                            <span className={`text-sm font-bold ${gradeColor(final)}`}>
                              {final?.toFixed(2) ?? "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-xs font-bold bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded">
                              {letterGrade(final)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {final === null ? (
                              <span className="text-xs text-slate-400">Incomplete</span>
                            ) : passed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                            ) : (
                              <span className="text-xs font-bold text-red-500">Failed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}