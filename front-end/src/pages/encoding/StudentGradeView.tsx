import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search, ClipboardList, TrendingUp, CheckCircle2,
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
import { useSetHeader } from "@/contexts/HeaderContext";
import type { Student, Subject } from "@/services/api";

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

  // Collapse clustered subjects into single display rows
  const displaySubjects = useMemo(() => {
    const result: Array<{ name: string; code: string; isCluster: boolean; subjectNames: string[] }> = [];
    const seen = new Set<string>();
    subjects.forEach(subj => {
      if (subj.cluster) {
        if (seen.has(subj.cluster)) return;
        seen.add(subj.cluster);
        const members = subjects.filter(s => s.cluster === subj.cluster);
        result.push({ name: subj.cluster, code: `cluster_${subj.cluster}`, isCluster: true, subjectNames: members.map(s => s.name) });
      } else {
        result.push({ name: subj.name, code: subj.code, isCluster: false, subjectNames: [subj.name] });
      }
    });
    return result;
  }, [subjects]);

  // Use the first grade record to get metadata (they all share the same enrollment info)
  const firstRecord = grades[0];
  const currentGradeLevel = firstRecord?.gradeLevel;
  const currentSection = firstRecord?.section;
  const currentSY = firstRecord?.schoolYear;
  const genAvg = firstRecord?.generalAverage ? Number(firstRecord.generalAverage) : null;

  useSetHeader({
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
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50/50 overflow-hidden">
      {/* ── Left Sidebar: Student Selection ── */}
      <div className="w-full lg:w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50/30">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search student..."
              className="pl-9 h-9 text-xs border-slate-200 focus:ring-teal-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStudent(s)}
              className={`w-full p-4 text-left border-b border-slate-50 transition-colors hover:bg-slate-50 ${selectedStudent?.id === s.id ? "bg-teal-50/50 border-r-2 border-r-teal-500" : ""
                }`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">
                    {s.lastName[0]}{s.firstName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className={`text-xs font-bold truncate ${selectedStudent?.id === s.id ? "text-teal-900" : "text-slate-700"}`}>
                    {s.lastName}, {s.firstName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">{s.lrn}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Content: Grades ── */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-5">
          {/* Student Header */}
          <Card className="p-5 border-0 shadow-sm">
            <div className="flex items-center gap-5">
              <Avatar className="h-14 w-14 ring-4 ring-slate-50">
                <AvatarFallback className="bg-teal-100 text-teal-700 text-lg font-black">
                  {selectedStudent?.lastName[0]}{selectedStudent?.firstName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-black text-slate-800">
                  {selectedStudent ? `${selectedStudent.lastName}, ${selectedStudent.firstName}` : "---"}
                </h2>
                <p className="text-xs font-mono text-slate-400">LRN: {selectedStudent?.lrn}</p>
                {firstRecord && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[currentGradeLevel] || "bg-slate-100"}`}>
                      Grade {currentGradeLevel}
                    </span>
                    <span className="text-xs text-slate-500">{currentSection} · S.Y. {currentSY}</span>
                  </div>
                )}
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">General Average</p>
                <p className={`text-2xl font-black ${gradeColor(genAvg)}`}>
                  {genAvg ? genAvg.toFixed(2) : "—"}
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
                  {displaySubjects.map((ds) => {
                    const g = ds.isCluster
                      ? grades.find(x => ds.subjectNames.includes(x.subjectName))
                      : grades.find(x => x.subjectName === ds.name);
                    return (
                      <tr key={ds.code} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="px-5 py-3">
                          <p className="text-xs font-semibold text-slate-700">{ds.name}</p>
                          <p className="text-[10px] text-slate-400">{ds.isCluster ? "Cluster" : ds.code}</p>
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

                  {/* Quarterly Average Row */}
                  <tr className="bg-slate-50/50 border-t-2 border-slate-100">
                    <td className="px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-tight">Quarterly Average</td>
                    <td className={`px-4 py-3 text-center text-sm font-black ${gradeColor(firstRecord?.q1Average)}`}>
                      {firstRecord?.q1Average ? Number(firstRecord.q1Average).toFixed(2) : "—"}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm font-black ${gradeColor(firstRecord?.q2Average)}`}>
                      {firstRecord?.q2Average ? Number(firstRecord.q2Average).toFixed(2) : "—"}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm font-black ${gradeColor(firstRecord?.q3Average)}`}>
                      {firstRecord?.q3Average ? Number(firstRecord.q3Average).toFixed(2) : "—"}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm font-black ${gradeColor(firstRecord?.q4Average)}`}>
                      {firstRecord?.q4Average ? Number(firstRecord.q4Average).toFixed(2) : "—"}
                    </td>
                  </tr>

                  {/* Letter Grade Row */}
                  <tr className="bg-slate-50/50">
                    <td className="px-5 py-2 text-xs font-black text-slate-500 uppercase tracking-tight">Letter Grade</td>
                    <td className="px-4 py-2 text-center text-sm font-black text-teal-600">{firstRecord?.q1Letter ?? "—"}</td>
                    <td className="px-4 py-2 text-center text-sm font-black text-teal-600">{firstRecord?.q2Letter ?? "—"}</td>
                    <td className="px-4 py-2 text-center text-sm font-black text-teal-600">{firstRecord?.q3Letter ?? "—"}</td>
                    <td className="px-4 py-2 text-center text-sm font-black text-teal-600">{firstRecord?.q4Letter ?? "—"}</td>
                  </tr>
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
                  {displaySubjects.map((ds) => {
                    const g = ds.isCluster
                      ? grades.find(x => ds.subjectNames.includes(x.subjectName))
                      : grades.find(x => x.subjectName === ds.name);
                    const final = g?.finalGrade ?? null;
                    const passed = final !== null && final >= 75;

                    return (
                      <tr key={ds.code} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="px-5 py-3">
                          <p className="text-xs font-semibold text-slate-700">{ds.name}</p>
                          <p className="text-[10px] text-slate-400">{ds.isCluster ? "Cluster" : ds.code}</p>
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
                  {/* Quarterly Average Row */}
                  <tr className="bg-slate-50/50 border-t-2 border-slate-100">
                    <td className="px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-tight">Average Grade</td>
                    <td className={`px-4 py-3 text-center text-sm font-black ${gradeColor(firstRecord?.q1Average)}`}>
                      {firstRecord?.q1Average ? Number(firstRecord.q1Average).toFixed(2) : "—"}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm font-black ${gradeColor(firstRecord?.q2Average)}`}>
                      {firstRecord?.q2Average ? Number(firstRecord.q2Average).toFixed(2) : "—"}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm font-black ${gradeColor(firstRecord?.q3Average)}`}>
                      {firstRecord?.q3Average ? Number(firstRecord.q3Average).toFixed(2) : "—"}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm font-black ${gradeColor(firstRecord?.q4Average)}`}>
                      {firstRecord?.q4Average ? Number(firstRecord.q4Average).toFixed(2) : "—"}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm font-black ${gradeColor(firstRecord?.generalAverage)}`}>
                      {firstRecord?.generalAverage ? Number(firstRecord.generalAverage).toFixed(2) : "—"}
                    </td>
                    <td colSpan={2}></td>
                  </tr>

                  {/* Letter Grade Row */}
                  <tr className="bg-slate-50/50">
                    <td className="px-5 py-2 text-xs font-black text-slate-500 uppercase tracking-tight">Letter Grade</td>
                    <td className="px-4 py-2 text-center text-sm font-black text-teal-600">{firstRecord?.q1Letter ?? "—"}</td>
                    <td className="px-4 py-2 text-center text-sm font-black text-teal-600">{firstRecord?.q2Letter ?? "—"}</td>
                    <td className="px-4 py-2 text-center text-sm font-black text-teal-600">{firstRecord?.q3Letter ?? "—"}</td>
                    <td className="px-4 py-2 text-center text-sm font-black text-teal-600">{firstRecord?.q4Letter ?? "—"}</td>
                    <td className="px-4 py-2 text-center text-sm font-black text-teal-600">{firstRecord?.finalLetterGrade ?? "—"}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
