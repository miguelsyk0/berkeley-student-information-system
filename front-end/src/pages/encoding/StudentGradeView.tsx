import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight, Search, ClipboardList, TrendingUp, CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  GRADE_COLORS, gradeColor, letterGrade,
} from "@/utils/gradeUtils";
import { ROUTES } from "@/routes";
import { getStudents, getStudentGrades, getSubjects } from "@/services/api";
import { useHeader } from "@/contexts/HeaderContext";
import type { Student, Subject } from "@/services/api";
import React from "react";

export default function StudentGradeView() {
  const navigate = useNavigate();
  const { studentId: paramId } = useParams<{ studentId: string }>();

  const [tab, setTab] = useState<"quarterly" | "final">("quarterly");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const [stus, subjs] = await Promise.all([getStudents(), getSubjects()]);
        setStudents(stus);
        setSubjects(subjs);
        if (paramId) {
          const found = stus.find(s => String(s.id) === paramId);
          if (found) setSelectedStudent(found);
        } else if (stus.length > 0) {
          setSelectedStudent(stus[0]);
        }
      } catch (err) {
        console.error("Init failed", err);
      }
    }
    init();
  }, [paramId]);

  useEffect(() => {
    if (!selectedStudent) return;
    getStudentGrades(selectedStudent.id).then(setGrades).catch(console.error);
  }, [selectedStudent]);

  const filtered = students.filter(
    (s) =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.lrn.includes(search)
  );

  const computeGenAvg = () => {
    const valid = grades.filter(g => g.finalGrade != null);
    if (valid.length === 0) return null;
    return valid.reduce((sum, g) => sum + g.finalGrade, 0) / valid.length;
  };

  const genAvg = computeGenAvg();

  useHeader({
    breadcrumbs: [
      { label: "Grade Encoding", onClick: () => navigate(ROUTES.grades.root) },
      { label: "Student Grade View" },
    ],
    actions: (
      <Button
        size="sm" variant="outline"
        className="h-8 text-xs gap-1.5"
        onClick={() => navigate(ROUTES.grades.classSheet())}
      >
        <ClipboardList className="w-3.5 h-3.5" /> Class Sheet
      </Button>
    )
  });

  return (
    <div className="flex h-full min-h-0">
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
              const active = selectedStudent?.id === s.id;
              const fullName = `${s.lastName}, ${s.firstName}`;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${active ? "bg-teal-50" : ""}`}
                >
                  <Avatar className="w-7 h-7 flex-shrink-0">
                    <AvatarFallback className={`text-[10px] font-bold ${active ? "bg-teal-200 text-teal-800" : "bg-slate-100 text-slate-600"}`}>
                      {s.lastName[0]}{s.firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${active ? "text-teal-800" : "text-slate-700"}`}>
                      {fullName}
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
                  {selectedStudent?.lastName[0]}{selectedStudent?.firstName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-black text-slate-800">
                  {selectedStudent ? `${selectedStudent.lastName}, ${selectedStudent.firstName}` : "---"}
                </h2>
                <p className="text-xs font-mono text-slate-400">LRN: {selectedStudent?.lrn}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[8]}`}>
                    Grade 8
                  </span>
                  <span className="text-xs text-slate-500">Diligence · S.Y. 2025–2026</span>
                </div>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">General Average</p>
                <p className={`text-2xl font-black ${gradeColor(genAvg)}`}>
                  {genAvg?.toFixed(2) ?? "—"}
                </p>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm w-fit">
            {[
              { key: "quarterly", label: "Quarterly Grades", icon: ClipboardList },
              { key: "final", label: "Final Grades", icon: TrendingUp },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as "quarterly" | "final")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${tab === t.key
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
                  {subjects.map((subj) => {
                    const g = grades.find(x => x.subjectName === subj.name);
                    return (
                      <tr key={subj.code} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="px-5 py-3">
                          <p className="text-xs font-semibold text-slate-700">{subj.name}</p>
                          <p className="text-[10px] text-slate-400">{subj.code}</p>
                        </td>
                        {[1, 2, 3, 4].map((q) => {
                          const v = g ? g[`q${q}Grade`] : null;
                          return (
                            <td key={q} className="px-4 py-3 text-center">
                              <span className={`text-sm ${gradeColor(v)}`}>
                                {v ?? <span className="text-slate-300 text-xs">—</span>}
                              </span>
                            </td>
  );
                        })}
                      </tr>
  );
                  })}
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
                  {subjects.map((subj) => {
                    const g = grades.find(x => x.subjectName === subj.name);
                    const final = g?.finalGrade ?? null;
                    const passed = final !== null && final >= 75;

                    return (
                      <tr key={subj.code} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="px-5 py-3">
                          <p className="text-xs font-semibold text-slate-700">{subj.name}</p>
                          <p className="text-[10px] text-slate-400">{subj.code}</p>
                        </td>
                        {[1, 2, 3, 4].map((q, i) => {
                          const val = g ? g[`q${q}Grade`] : null;
                          return (
                            <td key={i} className="px-4 py-3 text-center">
                              <span className={`text-xs ${gradeColor(val)}`}>{val ?? "—"}</span>
                            </td>
  );
                        })}
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

  );
}
