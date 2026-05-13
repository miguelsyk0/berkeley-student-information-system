import { useState, useRef } from "react";
import {
  ChevronRight, Search, Save, X, Edit2, Check,
  ClipboardList, TrendingUp, FileDown, Users,
  AlertCircle, CheckCircle2, Download,
  Printer, RefreshCw, Eye, User, FileText,
  BarChart2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from "@/components/sidebar";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Subject {
  code: string;
  name: string;
  shortName: string;
}

interface StudentGrade {
  studentId: number;
  lrn: string;
  name: string;
  grades: Record<string, number | null>;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const SUBJECTS: Subject[] = [
  { code: "LA", name: "Logical Analysis", shortName: "LA" },
  { code: "SCI", name: "Science Lab", shortName: "SCI" },
  { code: "MATH", name: "Math Lab", shortName: "MATH" },
  { code: "SL", name: "Social Literacy", shortName: "SL" },
  { code: "EL", name: "English Lab", shortName: "EL" },
  { code: "WP", name: "Wika at Pagpapakatao", shortName: "WP" },
  { code: "MAP", name: "Psychomotor", shortName: "MAP" },
  { code: "TLE", name: "TLE", shortName: "TLE" },
  { code: "MSE", name: "MSE", shortName: "MSE" },
  { code: "COD", name: "Coding", shortName: "COD" },
];

const GRADE_COLORS: Record<number, string> = {
  7: "bg-violet-100 text-violet-800",
  8: "bg-teal-100 text-teal-800",
  9: "bg-amber-100 text-amber-800",
  10: "bg-rose-100 text-rose-800",
};

const SECTIONS = ["Integrity", "Honesty", "Loyalty", "Diligence", "Humility", "Wisdom", "Courage", "Excellence"];

// ── Mock Data ──────────────────────────────────────────────────────────────────

function generateGrades(base: number): Record<string, number | null> {
  const obj: Record<string, number | null> = {};
  SUBJECTS.forEach((s) => {
    obj[s.code] = Math.min(100, Math.max(70, base + Math.round((Math.random() - 0.5) * 14)));
  });
  return obj;
}

const MOCK_STUDENTS: StudentGrade[] = [
  { studentId: 1, lrn: "105012300001", name: "Santos, Miguel A.", grades: generateGrades(92) },
  { studentId: 2, lrn: "105012300002", name: "Reyes, Sofia L.", grades: generateGrades(87) },
  { studentId: 3, lrn: "105012300003", name: "Villanueva, Lara M.", grades: generateGrades(95) },
  { studentId: 4, lrn: "105012300004", name: "Cruz, Nathan B.", grades: generateGrades(79) },
  { studentId: 5, lrn: "105012300005", name: "Lim, Andrea C.", grades: generateGrades(88) },
  { studentId: 6, lrn: "105012300006", name: "Dela Cruz, John P.", grades: generateGrades(83) },
  { studentId: 7, lrn: "105012300007", name: "Garcia, Maria T.", grades: generateGrades(91) },
  { studentId: 8, lrn: "105012300008", name: "Mendoza, Nico R.", grades: { ...generateGrades(85), SCI: null, EL: null } },
  { studentId: 9, lrn: "105012300009", name: "Torres, Ana F.", grades: generateGrades(74) },
  { studentId: 10, lrn: "105012300010", name: "Bautista, Luis G.", grades: generateGrades(90) },
  { studentId: 11, lrn: "105012300011", name: "Fernandez, Clara D.", grades: generateGrades(86) },
  { studentId: 12, lrn: "105012300012", name: "Aquino, Marco E.", grades: generateGrades(93) },
];

function computeAvg(grades: Record<string, number | null>): number | null {
  const vals = Object.values(grades).filter((v): v is number => v !== null);
  if (vals.length === 0) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
}

function gradeColor(g?: number | null): string {
  if (g === null || g === undefined) return "text-slate-300";
  if (g >= 90) return "text-emerald-600 font-bold";
  if (g >= 85) return "text-teal-600 font-semibold";
  if (g >= 80) return "text-blue-600 font-semibold";
  if (g >= 75) return "text-slate-700 font-semibold";
  return "text-red-600 font-bold";
}

function letterGrade(avg: number | null): string {
  if (!avg) return "—";
  if (avg >= 97) return "A+";
  if (avg >= 93) return "A";
  if (avg >= 90) return "A-";
  if (avg >= 87) return "B+";
  if (avg >= 83) return "B";
  if (avg >= 80) return "B-";
  if (avg >= 77) return "C+";
  if (avg >= 75) return "C";
  return "F";
}

// ══════════════════════════════════════════════════════════════════════════════
// GRADE ENCODING HOME
// ══════════════════════════════════════════════════════════════════════════════

export function GradeEncodingHome({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [schoolYear, setSchoolYear] = useState("2025-2026");
  const [gradeLevel, setGradeLevel] = useState("all");
  const [quarter, setQuarter] = useState("1");

  const sectionData = SECTIONS.map((sec, i) => {
    const gl = [7, 7, 7, 8, 8, 9, 9, 10][i];
    const encoded = Math.floor(Math.random() * 10) + 30;
    const total = 38 + Math.floor(Math.random() * 5);
    return { name: sec, gradeLevel: gl, encoded, total, complete: encoded === total };
  });

  const filtered = sectionData.filter(
    (s) => gradeLevel === "all" || String(s.gradeLevel) === gradeLevel
  );

  const completeCount = filtered.filter((s) => s.complete).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }} onLogout={() => { }} />
      <main className="flex-1 overflow-y-auto">
        <header className="h-32 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <span className="text-xs text-slate-400">Grade Encoding</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">Home</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5"
              onClick={() => onNavigate("general-average")}>
              <BarChart2 className="w-3.5 h-3.5" /> General Average
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-5">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Grade Encoding</h1>
            <p className="text-sm text-slate-400 mt-0.5">Encode and manage quarterly grades for all sections.</p>
          </div>

          {/* Banner */}
          <div className="bg-teal-600 rounded-2xl px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-1">Active Period</p>
              <p className="text-white text-lg font-black">S.Y. {schoolYear} — Quarter {quarter}</p>
              <p className="text-teal-200 text-sm mt-0.5">
                {completeCount}/{filtered.length} sections fully encoded
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-teal-200 text-xs">Completion</p>
                <p className="text-white text-2xl font-black">
                  {filtered.length > 0 ? Math.round((completeCount / filtered.length) * 100) : 0}%
                </p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-teal-400 border-opacity-40 flex items-center justify-center">
                <ClipboardList className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={schoolYear} onValueChange={setSchoolYear}>
              <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-2026">2025–2026</SelectItem>
                <SelectItem value="2024-2025">2024–2025</SelectItem>
              </SelectContent>
            </Select>
            <Select value={quarter} onValueChange={setQuarter}>
              <SelectTrigger className="h-8 w-28 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map(q => <SelectItem key={q} value={String(q)}>Quarter {q}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={gradeLevel} onValueChange={setGradeLevel}>
              <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {[7, 8, 9, 10].map(g => <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Section Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {filtered.map((sec) => (
              <Card key={sec.name} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                onClick={() => onNavigate("class-grade-sheet", { section: sec.name, gradeLevel: sec.gradeLevel, quarter })}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[sec.gradeLevel]}`}>
                        Grade {sec.gradeLevel}
                      </span>
                      <p className="text-sm font-black text-slate-800 mt-1.5">{sec.name}</p>
                    </div>
                    {sec.complete
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      : <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    }
                  </div>
                  <Progress value={(sec.encoded / sec.total) * 100} className="h-1.5 mb-2" />
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-slate-400">{sec.encoded}/{sec.total} students encoded</p>
                    <Badge className={`text-[9px] h-4 px-1.5 border-0 ${sec.complete ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {sec.complete ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CLASS GRADE SHEET
// ══════════════════════════════════════════════════════════════════════════════

export function ClassGradeSheet({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [section, setSection] = useState("Diligence");
  const [gradeLevel, setGradeLevel] = useState("8");
  const [quarter, setQuarter] = useState("1");
  const [schoolYear, setSchoolYear] = useState("2025-2026");
  const [students, setStudents] = useState<StudentGrade[]>(MOCK_STUDENTS);
  const [editingCell, setEditingCell] = useState<{ studentId: number; code: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [rowEdits, setRowEdits] = useState<Record<string, string>>({});
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function startCellEdit(studentId: number, code: string, current: number | null) {
    setEditingCell({ studentId, code });
    setEditValue(current === null ? "" : String(current));
    setEditingRow(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function commitCellEdit() {
    if (!editingCell) return;
    const val = editValue.trim() === "" ? null : Number(editValue);
    if (val !== null && (isNaN(val) || val < 0 || val > 100)) {
      setEditingCell(null);
      return;
    }
    setStudents(prev => prev.map(s =>
      s.studentId === editingCell.studentId
        ? { ...s, grades: { ...s.grades, [editingCell.code]: val } }
        : s
    ));
    setEditingCell(null);
    setHasUnsaved(true);
  }

  function startRowEdit(studentId: number, grades: Record<string, number | null>) {
    setEditingRow(studentId);
    const edits: Record<string, string> = {};
    SUBJECTS.forEach(s => { edits[s.code] = grades[s.code] === null ? "" : String(grades[s.code]); });
    setRowEdits(edits);
    setEditingCell(null);
  }

  function commitRowEdit() {
    if (editingRow === null) return;
    setStudents(prev => prev.map(s => {
      if (s.studentId !== editingRow) return s;
      const newGrades = { ...s.grades };
      Object.entries(rowEdits).forEach(([code, val]) => {
        newGrades[code] = val.trim() === "" ? null : Number(val);
      });
      return { ...s, grades: newGrades };
    }));
    setEditingRow(null);
    setHasUnsaved(true);
  }

  const missingCount = students.filter(s =>
    Object.values(s.grades).some(v => v === null)
  ).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }} onLogout={() => { }} />
      <main className="flex-1 overflow-y-auto">
        <header className="h-32 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <button onClick={() => onNavigate("grade-home")} className="text-xs text-slate-400 hover:text-slate-600">
            Grade Encoding
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">Class Grade Sheet</span>
          <div className="ml-auto flex gap-2">
            {hasUnsaved && (
              <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] h-6 px-2">Unsaved changes</Badge>
            )}
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5"
              onClick={() => onNavigate("student-grade-view")}>
              <User className="w-3.5 h-3.5" /> Student View
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
              onClick={() => setHasUnsaved(false)}>
              <Save className="w-3.5 h-3.5" /> Save All
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Class Grade Sheet</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Click any cell to edit inline · Double-click a row to edit all grades at once
              </p>
            </div>
            {missingCount > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <p className="text-xs text-amber-700 font-semibold">{missingCount} student{missingCount > 1 ? "s" : ""} with missing grades</p>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={schoolYear} onValueChange={setSchoolYear}>
              <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-2026">2025–2026</SelectItem>
                <SelectItem value="2024-2025">2024–2025</SelectItem>
              </SelectContent>
            </Select>
            <Select value={gradeLevel} onValueChange={setGradeLevel}>
              <SelectTrigger className="h-8 w-28 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[7, 8, 9, 10].map(g => <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger className="h-8 w-36 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={quarter} onValueChange={setQuarter}>
              <SelectTrigger className="h-8 w-28 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map(q => <SelectItem key={q} value={String(q)}>Quarter {q}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Spreadsheet */}
          <div className="overflow-x-auto">
            <Card className="border-0 shadow-sm overflow-hidden min-w-max">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="sticky left-0 bg-slate-50 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 w-48 z-10 border-r border-slate-200">Student</th>
                    {SUBJECTS.map(s => (
                      <th key={s.code} className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 min-w-[60px]">
                        {s.shortName}
                      </th>
                    ))}
                    <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 min-w-[60px]">Avg</th>
                    <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 w-16">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const avg = computeAvg(student.grades);
                    const isRowEditing = editingRow === student.studentId;
                    return (
                      <tr key={student.studentId}
                        className={`border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors ${isRowEditing ? "bg-teal-50/30" : ""}`}
                        onDoubleClick={() => !isRowEditing && startRowEdit(student.studentId, student.grades)}>
                        {/* Student name - sticky */}
                        <td className="sticky left-0 bg-white px-4 py-2.5 border-r border-slate-100 z-10">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6 flex-shrink-0">
                              <AvatarFallback className="bg-teal-100 text-teal-800 text-[9px] font-bold">
                                {student.name.split(",")[0]?.[0]}{student.name.split(" ").slice(-1)[0]?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-slate-700 text-xs truncate max-w-32">{student.name}</span>
                          </div>
                        </td>

                        {/* Grade cells */}
                        {SUBJECTS.map(subj => {
                          const isCellEditing = editingCell?.studentId === student.studentId && editingCell.code === subj.code;
                          const val = student.grades[subj.code];
                          if (isRowEditing) {
                            return (
                              <td key={subj.code} className="px-1 py-1.5 text-center">
                                <input
                                  type="number" min={0} max={100}
                                  value={rowEdits[subj.code] ?? ""}
                                  onChange={e => setRowEdits(r => ({ ...r, [subj.code]: e.target.value }))}
                                  className="w-14 text-center text-xs h-7 border border-teal-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white"
                                />
                              </td>
                            );
                          }
                          if (isCellEditing) {
                            return (
                              <td key={subj.code} className="px-1 py-1.5 text-center">
                                <input
                                  ref={inputRef}
                                  type="number" min={0} max={100}
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value)}
                                  onBlur={commitCellEdit}
                                  onKeyDown={e => { if (e.key === "Enter") commitCellEdit(); if (e.key === "Escape") setEditingCell(null); }}
                                  className="w-14 text-center text-xs h-7 border border-teal-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                                />
                              </td>
                            );
                          }
                          return (
                            <td key={subj.code}
                              className="px-3 py-2.5 text-center cursor-pointer hover:bg-teal-50 rounded group"
                              onClick={() => startCellEdit(student.studentId, subj.code, val)}>
                              <span className={`${gradeColor(val)} group-hover:opacity-70`}>
                                {val === null ? <span className="text-slate-300">—</span> : val}
                              </span>
                            </td>
                          );
                        })}

                        {/* Average */}
                        <td className="px-3 py-2.5 text-center font-black text-sm border-l border-slate-100">
                          <span className={gradeColor(avg)}>{avg?.toFixed(1) ?? "—"}</span>
                        </td>

                        {/* Row action */}
                        <td className="px-2 py-2.5 text-center">
                          {isRowEditing ? (
                            <div className="flex items-center gap-1 justify-center">
                              <button onClick={commitRowEdit} className="p-1 rounded text-emerald-600 hover:bg-emerald-50">
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setEditingRow(null)} className="p-1 rounded text-slate-400 hover:bg-slate-100">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startRowEdit(student.studentId, student.grades)}
                              className="p-1 rounded text-slate-300 hover:text-teal-600 hover:bg-teal-50 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Footer average row */}
                <tfoot>
                  <tr className="bg-slate-50 border-t-2 border-slate-200">
                    <td className="sticky left-0 bg-slate-50 px-4 py-2.5 border-r border-slate-200 z-10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Class Average</p>
                    </td>
                    {SUBJECTS.map(subj => {
                      const vals = students.map(s => s.grades[subj.code]).filter((v): v is number => v !== null);
                      const avg = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10 : null;
                      return (
                        <td key={subj.code} className="px-3 py-2.5 text-center">
                          <span className={`text-xs font-bold ${gradeColor(avg)}`}>{avg ?? "—"}</span>
                        </td>
                      );
                    })}
                    <td className="px-3 py-2.5 text-center border-l border-slate-200">
                      <span className="text-xs font-black text-slate-700">
                        {(() => {
                          const avgs = students.map(s => computeAvg(s.grades)).filter((v): v is number => v !== null);
                          return avgs.length > 0 ? (avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(1) : "—";
                        })()}
                      </span>
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </Card>
          </div>

          <p className="text-[10px] text-slate-400">
            💡 Click any grade cell to edit it inline · Double-click a row to edit all grades for that student at once
          </p>
        </div>
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STUDENT GRADE VIEW
// ══════════════════════════════════════════════════════════════════════════════

const QUARTERLY_MOCK: Record<string, Record<number, number | null>> = Object.fromEntries(
  SUBJECTS.map(s => [s.code, {
    1: Math.random() > 0.1 ? Math.round(75 + Math.random() * 25) : null,
    2: Math.random() > 0.15 ? Math.round(75 + Math.random() * 25) : null,
    3: Math.random() > 0.2 ? Math.round(75 + Math.random() * 25) : null,
    4: Math.random() > 0.25 ? Math.round(75 + Math.random() * 25) : null,
  }])
);

export function StudentGradeView({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [tab, setTab] = useState<"quarterly" | "final">("quarterly");
  const [selectedStudent, setSelectedStudent] = useState(MOCK_STUDENTS[0]);
  const [search, setSearch] = useState("");

  const filtered = MOCK_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.lrn.includes(search)
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }} onLogout={() => { }} />
      <main className="flex-1 overflow-y-auto">
        <header className="h-32 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <button onClick={() => onNavigate("grade-home")} className="text-xs text-slate-400 hover:text-slate-600">Grade Encoding</button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">Student Grade View</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5"
              onClick={() => onNavigate("class-grade-sheet")}>
              <ClipboardList className="w-3.5 h-3.5" /> Class Sheet
            </Button>
          </div>
        </header>

        <div className="flex h-[calc(100%-64px)]">
          {/* Student Sidebar */}
          <div className="w-64 border-r border-slate-100 bg-white flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  placeholder="Search student..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-8 text-xs border-slate-200"
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 py-1">
              {filtered.map(s => (
                <button key={s.studentId}
                  onClick={() => setSelectedStudent(s)}
                  className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${selectedStudent.studentId === s.studentId ? "bg-teal-50" : ""}`}>
                  <Avatar className="w-7 h-7 flex-shrink-0">
                    <AvatarFallback className={`text-[10px] font-bold ${selectedStudent.studentId === s.studentId ? "bg-teal-200 text-teal-800" : "bg-slate-100 text-slate-600"}`}>
                      {s.name.split(",")[0]?.[0]}{s.name.split(" ").slice(-1)[0]?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${selectedStudent.studentId === s.studentId ? "text-teal-800" : "text-slate-700"}`}>
                      {s.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">{s.lrn}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Grade Panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Student header */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-teal-100 text-teal-800 text-sm font-black">
                    {selectedStudent.name.split(",")[0]?.[0]}{selectedStudent.name.split(" ").slice(-1)[0]?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-black text-slate-800">{selectedStudent.name}</h2>
                  <p className="text-xs font-mono text-slate-400">LRN: {selectedStudent.lrn}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[8]}`}>Grade 8</span>
                    <span className="text-xs text-slate-500">Diligence · S.Y. 2025–2026</span>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">General Average</p>
                  <p className={`text-2xl font-black ${gradeColor(computeAvg(selectedStudent.grades))}`}>
                    {computeAvg(selectedStudent.grades)?.toFixed(2) ?? "—"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm w-fit">
              {[
                { key: "quarterly", label: "Quarterly Grades", icon: ClipboardList },
                { key: "final", label: "Final Grades", icon: TrendingUp },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${tab === t.key ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    }`}>
                  <t.icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Quarterly Tab */}
            {tab === "quarterly" && (
              <Card className="border-0 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject</th>
                      {[1, 2, 3, 4].map(q => (
                        <th key={q} className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Q{q}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SUBJECTS.map(subj => (
                      <tr key={subj.code} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="px-5 py-3">
                          <p className="text-xs font-semibold text-slate-700">{subj.name}</p>
                          <p className="text-[10px] text-slate-400">{subj.code}</p>
                        </td>
                        {[1, 2, 3, 4].map(q => {
                          const v = QUARTERLY_MOCK[subj.code]?.[q];
                          return (
                            <td key={q} className="px-4 py-3 text-center">
                              <span className={`text-sm ${gradeColor(v)}`}>{v ?? <span className="text-slate-300 text-xs">—</span>}</span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            {/* Final Grades Tab */}
            {tab === "final" && (
              <Card className="border-0 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject</th>
                      <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Q1</th>
                      <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Q2</th>
                      <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Q3</th>
                      <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Q4</th>
                      <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Final</th>
                      <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Letter</th>
                      <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SUBJECTS.map(subj => {
                      const qs = [1, 2, 3, 4].map(q => QUARTERLY_MOCK[subj.code]?.[q] ?? null);
                      const validQs = qs.filter((v): v is number => v !== null);
                      const final = validQs.length === 4 ? Math.round(validQs.reduce((a, b) => a + b) / 4 * 100) / 100 : null;
                      const passed = final !== null && final >= 75;
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
                            <span className={`text-sm font-bold ${gradeColor(final)}`}>{final?.toFixed(2) ?? "—"}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-xs font-bold bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded">
                              {letterGrade(final)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {final === null
                              ? <span className="text-xs text-slate-400">Incomplete</span>
                              : passed
                                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                                : <span className="text-xs font-bold text-red-500">Failed</span>
                            }
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

// ══════════════════════════════════════════════════════════════════════════════
// GENERAL AVERAGE COMPUTATION
// ══════════════════════════════════════════════════════════════════════════════

export function GeneralAverageView({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [viewMode, setViewMode] = useState<"section" | "student">("section");
  const [section, setSection] = useState("Diligence");
  const [quarter, setQuarter] = useState("all");

  const students = MOCK_STUDENTS.map(s => {
    const avg = computeAvg(s.grades);
    return { ...s, avg, letter: letterGrade(avg) };
  }).sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0));

  const classAvg = students.reduce((sum, s) => sum + (s.avg ?? 0), 0) / students.filter(s => s.avg !== null).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }} onLogout={() => { }} />
      <main className="flex-1 overflow-y-auto">
        <header className="h-32 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <button onClick={() => onNavigate("grade-home")} className="text-xs text-slate-400 hover:text-slate-600">Grade Encoding</button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">General Average</span>
        </header>

        <div className="p-6 space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-800">General Average</h1>
              <p className="text-sm text-slate-400 mt-0.5">Auto-computed from all quarterly grades.</p>
            </div>
            <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
              {(["section", "student"] as const).map(m => (
                <button key={m} onClick={() => setViewMode(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${viewMode === m ? "bg-teal-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
                  By {m}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger className="h-8 w-36 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={quarter} onValueChange={setQuarter}>
              <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quarters</SelectItem>
                {[1, 2, 3, 4].map(q => <SelectItem key={q} value={String(q)}>Quarter {q}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Class Average", value: classAvg.toFixed(2), color: "text-teal-700", bg: "bg-teal-50" },
              { label: "Highest", value: students[0]?.avg?.toFixed(2) ?? "—", color: "text-emerald-700", bg: "bg-emerald-50" },
              { label: "Lowest", value: students[students.length - 1]?.avg?.toFixed(2) ?? "—", color: "text-red-600", bg: "bg-red-50" },
              { label: "Passing", value: `${students.filter(s => (s.avg ?? 0) >= 75).length}/${students.length}`, color: "text-slate-700", bg: "bg-white" },
            ].map(({ label, value, color, bg }) => (
              <Card key={label} className={`border-0 shadow-sm ${bg}`}>
                <CardContent className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
                  <p className={`text-3xl font-black ${color} leading-none`}>{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ranking table */}
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <p className="text-sm font-black text-slate-700">{section} — General Average Ranking</p>
              <Badge className="bg-teal-100 text-teal-700 border-0 text-[10px]">{students.length} students</Badge>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Rank</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Student</th>
                  {SUBJECTS.map(s => (
                    <th key={s.code} className="px-2 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.shortName}</th>
                  ))}
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Average</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Letter</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, rank) => (
                  <tr key={s.studentId} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${rank === 0 ? "bg-amber-50/50" : rank === 1 ? "bg-slate-50/80" : ""}`}>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-black ${rank === 0 ? "text-amber-600" : rank === 1 ? "text-slate-500" : rank === 2 ? "text-amber-800" : "text-slate-400"}`}>
                        #{rank + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-slate-100 text-slate-600 text-[9px] font-bold">
                            {s.name.split(",")[0]?.[0]}{s.name.split(" ").slice(-1)[0]?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs font-semibold text-slate-700">{s.name}</p>
                      </div>
                    </td>
                    {SUBJECTS.map(subj => (
                      <td key={subj.code} className="px-2 py-3 text-center">
                        <span className={`text-xs ${gradeColor(s.grades[subj.code])}`}>
                          {s.grades[subj.code] ?? "—"}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-black ${gradeColor(s.avg)}`}>{s.avg?.toFixed(2) ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs font-bold bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded">{s.letter}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SF10 HOME
// ══════════════════════════════════════════════════════════════════════════════

export function SF10Home({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [search, setSearch] = useState("");

  const filtered = MOCK_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.lrn.includes(search)
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }} onLogout={() => { }} />
      <main className="flex-1 overflow-y-auto">
        <header className="h-32 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <span className="text-xs text-slate-400">SF10 Generation</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">Home</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
              onClick={() => onNavigate("sf10-bulk")}>
              <Download className="w-3.5 h-3.5" /> Bulk Generation
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-5">
          <div>
            <h1 className="text-2xl font-black text-slate-800">SF10 Generation</h1>
            <p className="text-sm text-slate-400 mt-0.5">Generate and export Permanent Records (SF10) for individual students or entire sections.</p>
          </div>

          {/* Banner */}
          <div className="bg-teal-600 rounded-2xl px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-1">Bulk Generation</p>
              <p className="text-white text-lg font-black">Generate SF10 for an Entire Section</p>
              <p className="text-teal-200 text-sm mt-0.5">Select a section and export all SF10s as a ZIP of PDFs.</p>
            </div>
            <Button size="sm" className="h-9 px-5 text-sm font-semibold gap-2 bg-white text-teal-800 hover:bg-teal-50 flex-shrink-0"
              onClick={() => onNavigate("sf10-bulk")}>
              <Download className="w-4 h-4" /> Start Bulk Export
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Student Search */}
            <div className="space-y-3">
              <p className="text-sm font-black text-slate-700">Individual Student SF10</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  placeholder="Search by name or LRN..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm border-slate-200 bg-white"
                />
              </div>
              <Card className="border-0 shadow-sm overflow-hidden">
                {filtered.slice(0, 8).map(s => (
                  <div key={s.studentId}
                    className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer group"
                    onClick={() => onNavigate("sf10-student", { student: s })}>
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-teal-100 text-teal-800 text-xs font-bold">
                        {s.name.split(",")[0]?.[0]}{s.name.split(" ").slice(-1)[0]?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{s.name}</p>
                      <p className="text-[11px] font-mono text-slate-400">{s.lrn}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[8]}`}>G8</span>
                      <Button size="sm" variant="outline" className="h-6 text-[11px] px-2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-3 h-3" /> Preview
                      </Button>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Section Quick Access */}
            <div className="space-y-3">
              <p className="text-sm font-black text-slate-700">Sections</p>
              <div className="grid grid-cols-2 gap-2">
                {SECTIONS.map((sec, i) => {
                  const gl = [7, 7, 7, 8, 8, 9, 9, 10][i];
                  return (
                    <Card key={sec} className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
                      onClick={() => onNavigate("sf10-bulk", { section: sec })}>
                      <CardContent className="px-4 py-3 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${GRADE_COLORS[gl]}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-700">{sec}</p>
                          <p className="text-[10px] text-slate-400">Grade {gl} · ~38 students</p>
                        </div>
                        <Download className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SINGLE STUDENT SF10
// ══════════════════════════════════════════════════════════════════════════════

function SF10FrontPage({ student }: { student: StudentGrade }) {
  return (
    <div className="bg-white border border-slate-300 shadow-sm p-8 text-xs font-sans" style={{ width: "720px", minHeight: "1000px" }}>
      {/* Header */}
      <div className="text-center mb-4 border-b-2 border-slate-800 pb-3">
        <p className="text-[10px] font-semibold text-slate-600">Republic of the Philippines</p>
        <p className="text-[10px] font-semibold text-slate-600">Department of Education</p>
        <div className="flex items-center justify-center gap-4 my-2">
          <div className="w-14 h-14 rounded-full border-2 border-slate-300 flex items-center justify-center bg-slate-50">
            <span className="text-[10px] text-slate-400 font-bold">DepEd</span>
          </div>
          <div>
            <p className="text-base font-black text-slate-800 uppercase tracking-wide">School Form 10</p>
            <p className="text-[11px] font-bold text-slate-600">(SF10) Learner's Permanent Academic Record</p>
            <p className="text-[10px] text-slate-500">For Junior High School</p>
          </div>
          <div className="w-14 h-14 rounded-full border-2 border-slate-300 flex items-center justify-center bg-slate-50">
            <span className="text-[10px] text-slate-400 font-bold">School</span>
          </div>
        </div>
      </div>

      {/* School info */}
      <div className="grid grid-cols-2 gap-x-8 mb-4 text-[10px]">
        <div>
          <div className="flex gap-2 border-b border-slate-200 pb-1 mb-1">
            <span className="text-slate-500 w-24 flex-shrink-0">School Name:</span>
            <span className="font-semibold text-slate-800">DepEd JHS Model School</span>
          </div>
          <div className="flex gap-2 border-b border-slate-200 pb-1 mb-1">
            <span className="text-slate-500 w-24 flex-shrink-0">School ID:</span>
            <span className="font-semibold text-slate-800">301028</span>
          </div>
          <div className="flex gap-2 border-b border-slate-200 pb-1">
            <span className="text-slate-500 w-24 flex-shrink-0">District:</span>
            <span className="font-semibold text-slate-800">Quezon City District IV</span>
          </div>
        </div>
        <div>
          <div className="flex gap-2 border-b border-slate-200 pb-1 mb-1">
            <span className="text-slate-500 w-24 flex-shrink-0">Division:</span>
            <span className="font-semibold text-slate-800">Quezon City</span>
          </div>
          <div className="flex gap-2 border-b border-slate-200 pb-1 mb-1">
            <span className="text-slate-500 w-24 flex-shrink-0">Region:</span>
            <span className="font-semibold text-slate-800">NCR</span>
          </div>
          <div className="flex gap-2 border-b border-slate-200 pb-1">
            <span className="text-slate-500 w-24 flex-shrink-0">Address:</span>
            <span className="font-semibold text-slate-800">Quezon City, Metro Manila</span>
          </div>
        </div>
      </div>

      {/* Learner info */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Learner Information</p>
        <div className="grid grid-cols-3 gap-3 text-[10px]">
          {[
            { label: "LRN", value: student.lrn },
            { label: "Last Name", value: student.name.split(",")[0]?.trim() },
            { label: "First Name", value: student.name.split(",")[1]?.trim().split(" ")[0] ?? "" },
            { label: "Middle Name", value: "Santos" },
            { label: "Sex", value: "Male" },
            { label: "Birthdate", value: "March 15, 2010" },
            { label: "Age", value: "14" },
            { label: "Place of Birth", value: "Quezon City" },
            { label: "Nationality", value: "Filipino" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-slate-400 mb-0.5">{label}</p>
              <p className="font-semibold text-slate-800 border-b border-slate-300 pb-0.5">{value || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* JHS Eligibility */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">JHS Admission Basis</p>
        <div className="grid grid-cols-2 gap-3 text-[10px]">
          <div>
            <p className="text-slate-400 mb-0.5">Elementary School Completed</p>
            <p className="font-semibold text-slate-800 border-b border-slate-300 pb-0.5">QC Elementary School</p>
          </div>
          <div>
            <p className="text-slate-400 mb-0.5">General Average</p>
            <p className="font-semibold text-slate-800 border-b border-slate-300 pb-0.5">92.50</p>
          </div>
          <div>
            <p className="text-slate-400 mb-0.5">School Year Completed</p>
            <p className="font-semibold text-slate-800 border-b border-slate-300 pb-0.5">2022–2023</p>
          </div>
          <div>
            <p className="text-slate-400 mb-0.5">Honors / Award Received</p>
            <p className="font-semibold text-slate-800 border-b border-slate-300 pb-0.5">With High Honors</p>
          </div>
        </div>
      </div>

      {/* Scholastic Record — Grade 8 */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Scholastic Record</p>
        <table className="w-full border border-slate-300 text-[9px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 px-2 py-1.5 text-left font-bold text-slate-700">Learning Areas</th>
              <th className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-700" colSpan={4}>
                Grade 8 — S.Y. 2025–2026
              </th>
              <th className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-700">Final</th>
              <th className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-700">Rem.</th>
            </tr>
            <tr className="bg-slate-50">
              <th className="border border-slate-300 px-2 py-1"></th>
              {["Q1", "Q2", "Q3", "Q4"].map(q => (
                <th key={q} className="border border-slate-300 px-2 py-1 text-center text-slate-600">{q}</th>
              ))}
              <th className="border border-slate-300 px-2 py-1"></th>
              <th className="border border-slate-300 px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {SUBJECTS.map(subj => {
              const qs = [1, 2, 3, 4].map(q => QUARTERLY_MOCK[subj.code]?.[q] ?? null);
              const validQs = qs.filter((v): v is number => v !== null);
              const final = validQs.length >= 2 ? Math.round(validQs.reduce((a, b) => a + b) / validQs.length) : null;
              return (
                <tr key={subj.code} className="hover:bg-slate-50">
                  <td className="border border-slate-200 px-2 py-1.5 font-medium text-slate-700">{subj.name}</td>
                  {qs.map((q, i) => (
                    <td key={i} className="border border-slate-200 px-2 py-1.5 text-center text-slate-700">{q ?? "—"}</td>
                  ))}
                  <td className="border border-slate-200 px-2 py-1.5 text-center font-bold text-slate-800">{final ?? "—"}</td>
                  <td className="border border-slate-200 px-2 py-1.5 text-center text-slate-600">
                    {final !== null ? (final >= 75 ? "P" : "F") : "—"}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-slate-100 font-bold">
              <td className="border border-slate-300 px-2 py-2 font-black text-slate-700">General Average</td>
              {[1, 2, 3, 4].map(q => (
                <td key={q} className="border border-slate-300 px-2 py-2 text-center text-slate-700">
                  {(() => {
                    const vals = SUBJECTS.map(s => QUARTERLY_MOCK[s.code]?.[q]).filter((v): v is number => v !== null);
                    return vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(0) : "—";
                  })()}
                </td>
              ))}
              <td className="border border-slate-300 px-2 py-2 text-center font-black text-slate-800">
                {computeAvg(student.grades)?.toFixed(2) ?? "—"}
              </td>
              <td className="border border-slate-300 px-2 py-2 text-center text-emerald-700 font-bold">P</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-end justify-between text-[10px] text-slate-500">
        <div>
          <p className="font-semibold border-b border-slate-400 pb-1 w-48 mb-1">R. Dela Cruz</p>
          <p>Registrar's Signature over Printed Name</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Date Printed: {new Date().toLocaleDateString("en-PH")}</p>
        </div>
      </div>
    </div>
  );
}

export function SingleStudentSF10({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [page, setPage] = useState<"front" | "back">("front");
  const student = MOCK_STUDENTS[1];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }} onLogout={() => { }} />
      <main className="flex-1 overflow-y-auto">
        <header className="h-32 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <button onClick={() => onNavigate("sf10-home")} className="text-xs text-slate-400 hover:text-slate-600">SF10</button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">{student.name}</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              <Printer className="w-3.5 h-3.5" /> Print
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800">
              <FileDown className="w-3.5 h-3.5" /> Export PDF
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-800">SF10 Preview</h1>
              <p className="text-sm text-slate-400 mt-0.5">{student.name} · LRN: {student.lrn}</p>
            </div>
            {/* Page toggle */}
            <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
              {(["front", "back"] as const).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${page === p ? "bg-teal-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
                  {p === "front" ? "Front Page" : "Back Page"}
                </button>
              ))}
            </div>
          </div>

          {/* Preview container */}
          <div className="flex justify-center pb-6">
            <div className="shadow-2xl rounded-lg overflow-hidden">
              {page === "front" ? (
                <SF10FrontPage student={student} />
              ) : (
                <div className="bg-white border border-slate-300 p-8 text-xs" style={{ width: "720px", minHeight: "1000px" }}>
                  <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
                    <p className="text-base font-black text-slate-800 uppercase">School Form 10 — Continuation</p>
                    <p className="text-[11px] text-slate-600 font-bold">{student.name} · LRN: {student.lrn}</p>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Prior Grade Level Records</p>
                  {[7].map(gl => (
                    <div key={gl} className="mb-6">
                      <p className="text-[11px] font-black text-slate-700 mb-2 bg-slate-50 px-3 py-1.5 rounded-lg">Grade {gl} — S.Y. 2024–2025</p>
                      <table className="w-full border border-slate-300 text-[9px]">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border border-slate-300 px-2 py-1.5 text-left font-bold text-slate-700">Learning Areas</th>
                            {["Q1", "Q2", "Q3", "Q4"].map(q => <th key={q} className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-700">{q}</th>)}
                            <th className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-700">Final</th>
                            <th className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-700">Rem.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {SUBJECTS.map(subj => {
                            const fakeQs = [1, 2, 3, 4].map(() => Math.round(78 + Math.random() * 20));
                            const final = Math.round(fakeQs.reduce((a, b) => a + b, 0) / 4);
                            return (
                              <tr key={subj.code} className="hover:bg-slate-50">
                                <td className="border border-slate-200 px-2 py-1.5 font-medium text-slate-700">{subj.name}</td>
                                {fakeQs.map((q, i) => <td key={i} className="border border-slate-200 px-2 py-1.5 text-center text-slate-700">{q}</td>)}
                                <td className="border border-slate-200 px-2 py-1.5 text-center font-bold text-slate-800">{final}</td>
                                <td className="border border-slate-200 px-2 py-1.5 text-center text-emerald-700">P</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ))}
                  <div className="mt-8 flex items-end justify-between text-[10px] text-slate-500">
                    <div>
                      <p className="font-semibold border-b border-slate-400 pb-1 w-48 mb-1">R. Dela Cruz</p>
                      <p>Registrar's Signature over Printed Name</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BULK SF10 GENERATION
// ══════════════════════════════════════════════════════════════════════════════

export function BulkSF10Generation({ onNavigate }: { onNavigate: (page: string, params?: any) => void }) {
  const [section, setSection] = useState("Diligence");
  const [gradeLevel, setGradeLevel] = useState("8");
  const [schoolYear, setSchoolYear] = useState("2025-2026");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [currentStudent, setCurrentStudent] = useState("");

  function startGeneration() {
    setGenerating(true);
    setProgress(0);
    setDone(false);
    const names = MOCK_STUDENTS.map(s => s.name);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setProgress(Math.round((i / names.length) * 100));
      setCurrentStudent(names[i - 1] ?? "");
      if (i >= names.length) {
        clearInterval(interval);
        setTimeout(() => { setGenerating(false); setDone(true); }, 500);
      }
    }, 300);
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }} onLogout={() => { }} />
      <main className="flex-1 overflow-y-auto">
        <header className="h-32 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <button onClick={() => onNavigate("sf10-home")} className="text-xs text-slate-400 hover:text-slate-600">SF10</button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">Bulk Generation</span>
        </header>

        <div className="p-6 max-w-2xl space-y-5">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Bulk SF10 Generation</h1>
            <p className="text-sm text-slate-400 mt-0.5">Generate SF10 PDFs for all students in a section and download as a ZIP file.</p>
          </div>

          {/* Config */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pt-5 pb-0 px-6">
              <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-500" />
                Select Section & Period
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">School Year</p>
                <Select value={schoolYear} onValueChange={setSchoolYear} disabled={generating}>
                  <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-2026">2025–2026</SelectItem>
                    <SelectItem value="2024-2025">2024–2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Grade Level</p>
                <Select value={gradeLevel} onValueChange={setGradeLevel} disabled={generating}>
                  <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[7, 8, 9, 10].map(g => <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Section</p>
                <Select value={section} onValueChange={setSection} disabled={generating}>
                  <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Student preview list */}
          {!generating && !done && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-black text-slate-700">Students to Generate</p>
                  <Badge className="bg-teal-100 text-teal-700 border-0 text-[10px]">{MOCK_STUDENTS.length} students</Badge>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {MOCK_STUDENTS.map((s, i) => (
                    <div key={s.studentId} className="flex items-center gap-2.5 py-1">
                      <span className="text-[10px] text-slate-400 w-5 text-right">{i + 1}.</span>
                      <p className="text-xs font-semibold text-slate-700">{s.name}</p>
                      <span className="text-[10px] font-mono text-slate-400">{s.lrn}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Screen */}
          {generating && (
            <Card className="border-0 shadow-sm">
              <CardContent className="px-6 py-8 flex flex-col items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                  <RefreshCw className="w-7 h-7 text-teal-600 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-700">Generating SF10 PDFs...</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {Math.round((progress / 100) * MOCK_STUDENTS.length)}/{MOCK_STUDENTS.length} students complete
                  </p>
                  {currentStudent && (
                    <p className="text-xs text-teal-600 font-semibold mt-1">Processing: {currentStudent}</p>
                  )}
                </div>
                <div className="w-full max-w-xs space-y-1.5">
                  <Progress value={progress} className="h-2.5" />
                  <p className="text-center text-xs text-slate-500 font-semibold">{progress}%</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Done */}
          {done && (
            <Card className="border-0 shadow-sm bg-emerald-50 border border-emerald-100">
              <CardContent className="px-6 py-6 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-emerald-800">Generation Complete!</p>
                  <p className="text-xs text-emerald-600 mt-1">
                    {MOCK_STUDENTS.length} SF10 PDFs ready for download.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="h-9 px-5 text-sm font-semibold gap-2 bg-teal-600 hover:bg-teal-800">
                    <Download className="w-4 h-4" /> Download ZIP
                  </Button>
                  <Button size="sm" variant="outline" className="h-9 text-xs" onClick={() => { setDone(false); setProgress(0); }}>
                    Generate Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!generating && !done && (
            <Button size="sm" className="h-9 px-6 text-sm font-semibold gap-2 bg-teal-600 hover:bg-teal-800" onClick={startGeneration}>
              <FileDown className="w-4 h-4" /> Generate {MOCK_STUDENTS.length} SF10 PDFs
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP ROUTER
// ══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState("grade-home");

  function navigate(p: string) {
    setPage(p);
    window.scrollTo(0, 0);
  }

  // Demo nav rail
  const navItems = [
    { key: "grade-home", label: "Grade Home" },
    { key: "class-grade-sheet", label: "Class Grade Sheet" },
    { key: "student-grade-view", label: "Student Grade View" },
    { key: "general-average", label: "General Average" },
    { key: "sf10-home", label: "SF10 Home" },
    { key: "sf10-student", label: "Single SF10" },
    { key: "sf10-bulk", label: "Bulk SF10" },
  ];

  return (
    <div>
      {/* Demo nav bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 rounded-2xl shadow-2xl px-3 py-2 flex gap-1">
        {navItems.map(n => (
          <button key={n.key} onClick={() => navigate(n.key)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap ${page === n.key ? "bg-teal-500 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
              }`}>
            {n.label}
          </button>
        ))}
      </div>

      {page === "grade-home" && <GradeEncodingHome onNavigate={navigate} />}
      {page === "class-grade-sheet" && <ClassGradeSheet onNavigate={navigate} />}
      {page === "student-grade-view" && <StudentGradeView onNavigate={navigate} />}
      {page === "general-average" && <GeneralAverageView onNavigate={navigate} />}
      {page === "sf10-home" && <SF10Home onNavigate={navigate} />}
      {page === "sf10-student" && <SingleStudentSF10 onNavigate={navigate} />}
      {page === "sf10-bulk" && <BulkSF10Generation onNavigate={navigate} />}
    </div>
  );
}