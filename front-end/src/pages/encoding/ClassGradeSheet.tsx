import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight, Save, X, Edit2, Check, AlertCircle, User,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from "@/components/sidebar";
import { computeAvg, gradeColor } from "@/utils/gradeUtils";
import { ROUTES } from "@/routes";
import {
  getSections, getSchoolYears, getSubjects, getClassGradeSheet, saveClassGrades,
} from "@/services/api";
import type { Section, SchoolYear, Subject, StudentGrade as ApiStudentGrade } from "@/services/api";
import type { StudentGrade } from "../types";

export default function ClassGradeSheet() {
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();

  const [schoolYears,  setSchoolYears]  = useState<SchoolYear[]>([]);
  const [sections,     setSections]     = useState<Section[]>([]);
  const [subjects,     setSubjects]     = useState<Subject[]>([]);

  const [section,    setSection]    = useState(sectionId ?? "Diligence");
  const [gradeLevel, setGradeLevel] = useState("8");
  const [quarter,    setQuarter]    = useState("1");
  const [schoolYear, setSchoolYear] = useState("");

  const [students,     setStudents]     = useState<StudentGrade[]>([]);
  const [editingCell,  setEditingCell]  = useState<{ studentId: number; code: string } | null>(null);
  const [editValue,    setEditValue]    = useState("");
  const [editingRow,   setEditingRow]   = useState<number | null>(null);
  const [rowEdits,     setRowEdits]     = useState<Record<string, string>>({});
  const [hasUnsaved,   setHasUnsaved]   = useState(false);
  const [loading,      setLoading]      = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial load
  useEffect(() => {
    async function init() {
      try {
        const [years, subjs] = await Promise.all([getSchoolYears(), getSubjects()]);
        setSchoolYears(years);
        setSubjects(subjs);
        const activeYear = years.find(y => y.isActive) || years[0];
        if (activeYear) setSchoolYear(activeYear.label);
      } catch (err) {
        console.error("Init failed", err);
      }
    }
    init();
  }, []);

  // Fetch sections based on school year
  useEffect(() => {
    if (!schoolYear) return;
    const yearId = schoolYears.find(y => y.label === schoolYear)?.id;
    if (yearId) {
      getSections(yearId).then((secs) => {
        setSections(secs);
        // If the current section is not in the list, default to first
        if (sectionId && !secs.find(s => s.name === sectionId)) {
           // Maybe don't auto-reset if we came from a specific URL
        }
      });
    }
  }, [schoolYear, schoolYears]);

  // Main data fetch
  useEffect(() => {
    if (!section || !schoolYear || !quarter) return;
    async function fetchData() {
      setLoading(true);
      try {
        const rawGrades: ApiStudentGrade[] = await getClassGradeSheet(section, schoolYear, Number(quarter));

        // Group by student
        const grouped: Record<number, StudentGrade> = {};
        rawGrades.forEach(g => {
          if (!grouped[g.studentId]) {
            grouped[g.studentId] = {
              studentId: g.studentId,
              lrn: g.lrn,
              name: g.fullName,
              grades: {}
            };
          }
          // The component expects a map of subjectCode -> grade
          // We find the subject via its name or ID if subjectCode isn't in ApiStudentGrade
          // Assuming subjectName corresponds to a code we can find
          const match = subjects.find(s => s.name === g.subjectName || s.id === g.subjectId);
          if (match) {
            const field = `q${quarter}Grade` as keyof ApiStudentGrade;
            grouped[g.studentId].grades[match.code] = (g[field] as number) ?? null;
          }
        });
        setStudents(Object.values(grouped));
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [section, schoolYear, quarter, subjects]);

  const handleSaveAll = async () => {
    try {
      // Map current students back to the format saveClassGrades expects
      const payload = students.flatMap(s => {
        return Object.entries(s.grades).map(([code, grade]) => {
          const subj = subjects.find(sub => sub.code === code);
          const secObj = sections.find(sec => sec.name === section);
          const syObj = schoolYears.find(sy => sy.label === schoolYear);

          if (!subj || !secObj || !syObj || grade === null) return null;

          return {
            studentId: s.studentId,
            subjectId: subj.id,
            sectionId: secObj.id,
            schoolYearId: syObj.id,
            quarter: quarter,
            grade: grade
          };
        }).filter(x => x !== null);
      }) as any[];

      await saveClassGrades(payload);
      setHasUnsaved(false);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

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
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === editingCell.studentId
          ? { ...s, grades: { ...s.grades, [editingCell.code]: val } }
          : s
      )
    );
    setEditingCell(null);
    setHasUnsaved(true);
  }

  function startRowEdit(studentId: number, grades: Record<string, number | null>) {
    setEditingRow(studentId);
    const edits: Record<string, string> = {};
    subjects.forEach((s: Subject) => {
      edits[s.code] = grades[s.code] === null ? "" : String(grades[s.code]);
    });
    setRowEdits(edits);
    setEditingCell(null);
  }

  const SUBJECTS_LIST = subjects.length > 0 ? subjects : [];

  function commitRowEdit() {
    if (editingRow === null) return;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId !== editingRow) return s;
        const newGrades = { ...s.grades };
        Object.entries(rowEdits).forEach(([code, val]) => {
          newGrades[code] = val.trim() === "" ? null : Number(val);
        });
        return { ...s, grades: newGrades };
      })
    );
    setEditingRow(null);
    setHasUnsaved(true);
  }

  const missingCount = students.filter((s) =>
    Object.values(s.grades).some((v) => v === null)
  ).length;

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
          <span className="text-xs font-semibold text-slate-600">Class Grade Sheet</span>

          <div className="ml-auto flex items-center gap-2">
            {hasUnsaved && (
              <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] h-6 px-2">
                Unsaved changes
              </Badge>
            )}
            <Button
              size="sm" variant="outline"
              className="h-8 text-xs gap-1.5"
              onClick={() => navigate(ROUTES.grades.studentView)}
            >
              <User className="w-3.5 h-3.5" /> Student View
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
              onClick={handleSaveAll}
            >
              <Save className="w-3.5 h-3.5" /> Save All
            </Button>
          </div>
        </header>

        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-teal-700">Loading Grades...</p>
            </div>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Title row */}
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
                <p className="text-xs text-amber-700 font-semibold">
                  {missingCount} student{missingCount > 1 ? "s" : ""} with missing grades
                </p>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={schoolYear} onValueChange={setSchoolYear}>
              <SelectTrigger className="h-8 w-40 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {schoolYears.map((sy) => (
                  <SelectItem key={sy.id} value={sy.label}>{sy.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={gradeLevel} onValueChange={setGradeLevel}>
              <SelectTrigger className="h-8 w-28 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[7, 8, 9, 10].map((g) => (
                  <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger className="h-8 w-36 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {sections.map((s) => (
                  <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={quarter} onValueChange={setQuarter}>
              <SelectTrigger className="h-8 w-28 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((q) => (
                  <SelectItem key={q} value={String(q)}>Quarter {q}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Spreadsheet */}
          <div className="overflow-x-auto">
            <Card className="border-0 shadow-sm overflow-hidden min-w-max">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="sticky left-0 bg-slate-50 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 w-48 z-10 border-r border-slate-200">
                      Student
                    </th>
                    {SUBJECTS_LIST.map((s) => (
                      <th key={s.code} className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 min-w-[60px]">
                        {s.code}
                      </th>
                    ))}
                    <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 min-w-[60px]">
                      Avg
                    </th>
                    <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 w-16" />
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => {
                    const avg          = computeAvg(student.grades);
                    const isRowEditing = editingRow === student.studentId;

                    return (
                      <tr
                        key={student.studentId}
                        className={`border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors group ${isRowEditing ? "bg-teal-50/30" : ""}`}
                        onDoubleClick={() => !isRowEditing && startRowEdit(student.studentId, student.grades)}
                      >
                        {/* Name — sticky */}
                        <td className="sticky left-0 bg-white px-4 py-2.5 border-r border-slate-100 z-10">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6 flex-shrink-0">
                              <AvatarFallback className="bg-teal-100 text-teal-800 text-[9px] font-bold">
                                {student.name.split(",")[0]?.[0]}
                                {student.name.split(" ").slice(-1)[0]?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-slate-700 text-xs truncate max-w-32">
                              {student.name}
                            </span>
                          </div>
                        </td>

                        {/* Grade cells */}
                        {SUBJECTS_LIST.map((subj) => {
                          const isCellEditing =
                            editingCell?.studentId === student.studentId &&
                            editingCell.code === subj.code;
                          const val = student.grades[subj.code];

                          if (isRowEditing) {
                            return (
                              <td key={subj.code} className="px-1 py-1.5 text-center">
                                <input
                                  type="number" min={0} max={100}
                                  value={rowEdits[subj.code] ?? ""}
                                  onChange={(e) =>
                                    setRowEdits((r) => ({ ...r, [subj.code]: e.target.value }))
                                  }
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
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={commitCellEdit}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter")  commitCellEdit();
                                    if (e.key === "Escape") setEditingCell(null);
                                  }}
                                  className="w-14 text-center text-xs h-7 border border-teal-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                                />
                              </td>
                            );
                          }

                          return (
                            <td
                              key={subj.code}
                              className="px-3 py-2.5 text-center cursor-pointer hover:bg-teal-50 rounded group/cell"
                              onClick={() => startCellEdit(student.studentId, subj.code, val)}
                            >
                              <span className={`${gradeColor(val)} group-hover/cell:opacity-70`}>
                                {val === null
                                  ? <span className="text-slate-300">—</span>
                                  : val}
                              </span>
                            </td>
                          );
                        })}

                        {/* Average */}
                        <td className="px-3 py-2.5 text-center font-black text-sm border-l border-slate-100">
                          <span className={gradeColor(avg)}>
                            {avg?.toFixed(1) ?? "—"}
                          </span>
                        </td>

                        {/* Row action */}
                        <td className="px-2 py-2.5 text-center">
                          {isRowEditing ? (
                            <div className="flex items-center gap-1 justify-center">
                              <button
                                onClick={commitRowEdit}
                                className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingRow(null)}
                                className="p-1 rounded text-slate-400 hover:bg-slate-100"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startRowEdit(student.studentId, student.grades)}
                              className="p-1 rounded text-slate-300 hover:text-teal-600 hover:bg-teal-50 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Class average footer */}
                <tfoot>
                  <tr className="bg-slate-50 border-t-2 border-slate-200">
                    <td className="sticky left-0 bg-slate-50 px-4 py-2.5 border-r border-slate-200 z-10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Class Average
                      </p>
                    </td>
                    {SUBJECTS_LIST.map((subj: Subject) => {
                      const vals = students
                        .map((s) => s.grades[subj.code])
                        .filter((v): v is number => v !== null);
                      const avg = vals.length > 0
                        ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10
                        : null;
                      return (
                        <td key={subj.code} className="px-3 py-2.5 text-center">
                          <span className={`text-xs font-bold ${gradeColor(avg)}`}>
                            {avg ?? "—"}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-3 py-2.5 text-center border-l border-slate-200">
                      <span className="text-xs font-black text-slate-700">
                        {(() => {
                          const avgs = students
                            .map((s) => computeAvg(s.grades))
                            .filter((v): v is number => v !== null);
                          return avgs.length > 0
                            ? (avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(1)
                            : "—";
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
            💡 Click any grade cell to edit inline · Double-click a row to edit all grades at once
          </p>
        </div>
      </main>
    </div>
  );
}