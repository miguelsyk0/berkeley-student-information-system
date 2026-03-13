import { useState, useRef } from "react";
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
import { SUBJECTS, SECTIONS, MOCK_STUDENTS, computeAvg, gradeColor } from "./MockData";
import { ROUTES } from "@/routes";
import type { StudentGrade } from "../types";

export default function ClassGradeSheet() {
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();

  const [section,    setSection]    = useState(sectionId ?? "Diligence");
  const [gradeLevel, setGradeLevel] = useState("8");
  const [quarter,    setQuarter]    = useState("1");
  const [schoolYear, setSchoolYear] = useState("2025-2026");

  const [students,     setStudents]     = useState<StudentGrade[]>(MOCK_STUDENTS);
  const [editingCell,  setEditingCell]  = useState<{ studentId: number; code: string } | null>(null);
  const [editValue,    setEditValue]    = useState("");
  const [editingRow,   setEditingRow]   = useState<number | null>(null);
  const [rowEdits,     setRowEdits]     = useState<Record<string, string>>({});
  const [hasUnsaved,   setHasUnsaved]   = useState(false);
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
    SUBJECTS.forEach((s) => {
      edits[s.code] = grades[s.code] === null ? "" : String(grades[s.code]);
    });
    setRowEdits(edits);
    setEditingCell(null);
  }

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
              onClick={() => setHasUnsaved(false)}
            >
              <Save className="w-3.5 h-3.5" /> Save All
            </Button>
          </div>
        </header>

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
              <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-2026">2025–2026</SelectItem>
                <SelectItem value="2024-2025">2024–2025</SelectItem>
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
                {SECTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
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
                    {SUBJECTS.map((s) => (
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
                        {SUBJECTS.map((subj) => {
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
                    {SUBJECTS.map((subj) => {
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