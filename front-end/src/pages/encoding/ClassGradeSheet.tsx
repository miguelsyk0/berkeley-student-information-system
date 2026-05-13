import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Save, X, Edit2, Check, AlertCircle, User,
  ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { computeAvg, gradeColor } from "@/utils/gradeUtils";
import { ROUTES } from "@/routes";
import { useSetHeader } from "@/contexts/HeaderContext";
import {
  getSections, getSchoolYears, getSubjects, getClassGradeSheet, saveClassGrades,
} from "@/services/api";
import type { Section, SchoolYear, Subject, StudentGrade as ApiStudentGrade } from "@/services/api";
import type { StudentGrade } from "../types";

export default function ClassGradeSheet() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId } = useParams<{ sectionId: string }>();

  const searchParams = new URLSearchParams(location.search);
  const urlGradeLevel = searchParams.get("gradeLevel");
  const urlQuarter = searchParams.get("quarter");
  const urlSchoolYearId = searchParams.get("schoolYearId");

  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [section, setSection] = useState(sectionId ?? "");
  const [gradeLevel, setGradeLevel] = useState(urlGradeLevel ?? "8");
  const [quarter, setQuarter] = useState(urlQuarter ?? "1");
  const [schoolYear, setSchoolYear] = useState("");

  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [pageSize, setPageSize] = useState<string>("20");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const [editingCell, setEditingCell] = useState<{ studentId: number; code: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [rowEdits, setRowEdits] = useState<Record<string, string>>({});
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial load
  useEffect(() => {
    async function init() {
      try {
        const [years, subjs] = await Promise.all([getSchoolYears(), getSubjects()]);
        setSchoolYears(years);
        setSubjects(subjs);
        
        let targetYear = years.find(y => y.isActive) || years[0];
        if (urlSchoolYearId) {
          const match = years.find(y => String(y.id) === urlSchoolYearId);
          if (match) targetYear = match;
        }
        
        if (targetYear) setSchoolYear(targetYear.label);
      } catch (err) {
        console.error("Init failed", err);
      }
    }
    init();
  }, []);

  // Fetch sections based on school year AND grade level
  useEffect(() => {
    if (!schoolYear) return;
    const yearId = schoolYears.find(y => y.label === schoolYear)?.id;
    if (yearId) {
      getSections(yearId, Number(gradeLevel)).then((secs) => {
        setSections(secs);
        // If the current section is not in the new list, clear it or pick first
        if (!secs.find(s => s.name === section)) {
          setSection(secs.length > 0 ? secs[0].name : "");
        }
      });
    }
  }, [schoolYear, schoolYears, gradeLevel]);

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
          const match = subjects.find(s => s.name === g.subjectName || s.id === g.subjectId);
          if (match) {
            const field = `q${quarter}Grade` as keyof ApiStudentGrade;
            const val = g[field];
            grouped[g.studentId].grades[match.code] = (val !== null && val !== undefined && val !== "") ? Number(val) : null;
          }
        });
        setStudents(Object.values(grouped));
        setPendingChanges({});
        setCurrentPage(1); // Reset page on new data
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [section, schoolYear, quarter, subjects]);

  const SUBJECTS_LIST = subjects.length > 0 ? subjects : [];

  // Collapse clustered subjects into single display columns
  const displaySubjects = useMemo(() => {
    const result: Array<{ name: string; code: string; isCluster: boolean; subjectCodes: string[] }> = [];
    const seen = new Set<string>();
    SUBJECTS_LIST.forEach(subj => {
      if (subj.cluster) {
        if (seen.has(subj.cluster)) return;
        seen.add(subj.cluster);
        const members = SUBJECTS_LIST.filter(s => s.cluster === subj.cluster);
        result.push({ name: subj.cluster, code: `cluster_${subj.cluster}`, isCluster: true, subjectCodes: members.map(s => s.code) });
      } else {
        result.push({ name: subj.name, code: subj.code, isCluster: false, subjectCodes: [subj.code] });
      }
    });
    return result;
  }, [SUBJECTS_LIST]);

  // Helper to get a grade for a display column
  function getDisplayGrade(grades: Record<string, number | null>, ds: { subjectCodes: string[] }): number | null {
    for (const code of ds.subjectCodes) {
      if (grades[code] !== null && grades[code] !== undefined) return grades[code];
    }
    return null;
  }

  // Sorting and Pagination Logic
  const processedStudents = useMemo(() => {
    let result = [...students];

    // Sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let valA: any, valB: any;

        if (sortConfig.key === "name") {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
        } else if (sortConfig.key === "avg") {
          valA = computeAvg(a.grades) ?? -1;
          valB = computeAvg(b.grades) ?? -1;
        } else {
          // Subject sorting
          const ds = displaySubjects.find(d => d.code === sortConfig.key);
          valA = ds ? (getDisplayGrade(a.grades, ds) ?? -1) : -1;
          valB = ds ? (getDisplayGrade(b.grades, ds) ?? -1) : -1;
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [students, sortConfig, displaySubjects]);

  const paginatedStudents = useMemo(() => {
    if (pageSize === "all") return processedStudents;
    const size = Number(pageSize);
    const start = (currentPage - 1) * size;
    return processedStudents.slice(start, start + size);
  }, [processedStudents, pageSize, currentPage]);

  const totalPages = pageSize === "all" ? 1 : Math.ceil(processedStudents.length / Number(pageSize));

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleSaveAll = async () => {
    try {
      setLoading(true);
      const secObj = sections.find(sec => sec.name === section);
      const syObj = schoolYears.find(sy => sy.label === schoolYear);

      if (!secObj || !syObj) {
        console.error("Section or School Year not found");
        return;
      }

      const payload = Object.values(pendingChanges).map(change => ({
        ...change,
        sectionId: secObj.id,
        schoolYearId: syObj.id,
        quarter: quarter
      }));

      if (payload.length > 0) {
        await saveClassGrades(payload as any);
      }
      setHasUnsaved(false);
      setPendingChanges({});
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
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
    
    // Expand cluster codes if necessary
    const ds = displaySubjects.find(d => d.code === editingCell.code);
    const codesToUpdate = ds ? ds.subjectCodes : [editingCell.code];
    
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === editingCell.studentId
          ? { 
              ...s, 
              grades: { 
                ...s.grades, 
                ...Object.fromEntries(codesToUpdate.map(c => [c, val])) 
              } 
            }
          : s
      )
    );

    // Record pending changes
    const newChanges = { ...pendingChanges };
    codesToUpdate.forEach(code => {
      const subj = subjects.find(sub => sub.code === code);
      if (subj) {
        newChanges[`${editingCell.studentId}-${subj.id}`] = {
          studentId: editingCell.studentId,
          subjectId: subj.id,
          grade: val
        };
      }
    });
    setPendingChanges(newChanges);

    setEditingCell(null);
    setHasUnsaved(true);
  }

  function startRowEdit(studentId: number, grades: Record<string, number | null>) {
    setEditingRow(studentId);
    const edits: Record<string, string> = {};
    displaySubjects.forEach((ds) => {
      const val = getDisplayGrade(grades, ds);
      edits[ds.code] = val === null ? "" : String(val);
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
          const parsed = val.trim() === "" ? null : Number(val);
          // Find the display subject to expand cluster codes
          const ds = displaySubjects.find(d => d.code === code);
          const codesToUpdate = ds ? ds.subjectCodes : [code];
          codesToUpdate.forEach(c => { newGrades[c] = parsed; });
        });
        return { ...s, grades: newGrades };
      })
    );

    // Record pending changes for the entire row
    const newChanges = { ...pendingChanges };
    Object.entries(rowEdits).forEach(([code, val]) => {
      const parsed = val.trim() === "" ? null : Number(val);
      const ds = displaySubjects.find(d => d.code === code);
      const codesToUpdate = ds ? ds.subjectCodes : [code];
      
      codesToUpdate.forEach(c => {
        const subj = subjects.find(sub => sub.code === c);
        if (subj) {
          newChanges[`${editingRow}-${subj.id}`] = {
            studentId: editingRow,
            subjectId: subj.id,
            grade: parsed
          };
        }
      });
    });
    setPendingChanges(newChanges);

    setEditingRow(null);
    setHasUnsaved(true);
  }

  const missingCount = students.filter((s) =>
    Object.values(s.grades).some((v) => v === null)
  ).length;

  useSetHeader({
    breadcrumbs: [
      { label: "Grade Encoding", onClick: () => navigate(ROUTES.grades.root) },
      { label: "Class Grade Sheet" },
    ],
    actions: (
      <div className="flex items-center gap-2">
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
    )
  });

  return (
    <div className="p-6 space-y-4">

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

          <div className="flex items-center gap-2 ml-auto">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rows:</p>
            <Select value={pageSize} onValueChange={(val) => { setPageSize(val); setCurrentPage(1); }}>
              <SelectTrigger className="h-8 w-20 text-xs border-slate-200 bg-white shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Spreadsheet */}
        {!section ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-400">
            <AlertCircle className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm font-semibold text-slate-600">No section selected</p>
            <p className="text-xs mt-1">Please select a section from the dropdown above to view grades.</p>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-xl border border-slate-100 shadow-sm">
             <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-sm font-semibold text-slate-500">Loading student records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Card className="border-0 shadow-sm overflow-hidden min-w-max">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th
                    className="sticky left-0 bg-slate-50 px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 w-48 z-10 border-r border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center justify-between whitespace-nowrap">
                      Student
                      {sortConfig?.key === "name" ? (
                        sortConfig.direction === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-slate-700" /> : <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-40 group-hover:opacity-100" />
                      )}
                    </div>
                  </th>
                  {displaySubjects.map((ds) => (
                    <th
                      key={ds.code}
                      className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 min-w-[70px] cursor-pointer hover:bg-slate-100 transition-colors group"
                      onClick={() => handleSort(ds.code)}
                    >
                      <div className="flex flex-row items-center justify-center gap-1.5 whitespace-nowrap">
                        {ds.isCluster ? ds.name : ds.code}
                        {sortConfig?.key === ds.code ? (
                          sortConfig.direction === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-slate-700" /> : <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-40 group-hover:opacity-100" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th
                    className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 min-w-[70px] cursor-pointer hover:bg-slate-100 transition-colors group"
                    onClick={() => handleSort("avg")}
                  >
                    <div className="flex flex-row items-center justify-center gap-1.5 whitespace-nowrap">
                      Avg
                      {sortConfig?.key === "avg" ? (
                        sortConfig.direction === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-slate-700" /> : <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-40 group-hover:opacity-100" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedStudents.map((student) => {
                  const avg = computeAvg(student.grades);
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
                          <span className="font-semibold text-slate-700 text-xs truncate max-w-28">
                            {student.name}
                          </span>
                          {!isRowEditing && (
                            <button
                              onClick={() => startRowEdit(student.studentId, student.grades)}
                              className="p-1 rounded text-slate-300 hover:text-teal-600 hover:bg-teal-50 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Grade cells */}
                      {displaySubjects.map((ds) => {
                        const isCellEditing =
                          editingCell?.studentId === student.studentId &&
                          editingCell.code === ds.code;
                        const val = getDisplayGrade(student.grades, ds);

                        if (isRowEditing) {
                          return (
                            <td key={ds.code} className="px-1 py-1.5 text-center">
                              <input
                                type="number" min={0} max={100}
                                value={rowEdits[ds.code] ?? ""}
                                onChange={(e) =>
                                  setRowEdits((r) => ({ ...r, [ds.code]: e.target.value }))
                                }
                                className="w-14 text-center text-xs h-7 border border-teal-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white"
                              />
                            </td>
                          );
                        }

                        if (isCellEditing) {
                          return (
                            <td key={ds.code} className="px-1 py-1.5 text-center">
                              <input
                                ref={inputRef}
                                type="number" min={0} max={100}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={commitCellEdit}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") commitCellEdit();
                                  if (e.key === "Escape") setEditingCell(null);
                                }}
                                className="w-14 text-center text-xs h-7 border border-teal-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
                              />
                            </td>
                          );
                        }

                        return (
                          <td
                            key={ds.code}
                            className="px-3 py-2.5 text-center cursor-pointer hover:bg-teal-50 rounded group/cell"
                            onClick={() => startCellEdit(student.studentId, ds.code, val)}
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
                      <td className="px-3 py-2.5 text-center font-black text-sm border-l border-slate-100 min-w-[80px]">
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
                          <span className={gradeColor(avg)}>
                            {avg?.toFixed(1) ?? "—"}
                          </span>
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
                  {displaySubjects.map((ds) => {
                    const vals = processedStudents
                      .map((s) => getDisplayGrade(s.grades, ds))
                      .filter((v) => v !== null && v !== undefined)
                      .map(v => Number(v));
                    const avg = vals.length > 0
                      ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10
                      : null;
                    return (
                      <td key={ds.code} className="px-3 py-2.5 text-center">
                        <span className={`text-xs font-bold ${gradeColor(avg)}`}>
                          {avg ?? "—"}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-3 py-2.5 text-center border-l border-slate-200">
                    <span className="text-xs font-black text-slate-700">
                      {(() => {
                        const avgs = processedStudents
                          .map((s) => computeAvg(s.grades))
                          .filter((v) => v !== null && v !== undefined)
                          .map(v => Number(v));
                        return avgs.length > 0
                          ? (avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(1)
                          : "—";
                      })()}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </Card>
        </div>
      )}

        {/* Pagination controls and Tips */}
        {section && !loading && (
          <div className="space-y-4">
            {pageSize !== "all" && totalPages > 1 && (
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] text-slate-400">
                  Showing {Math.min(processedStudents.length, (currentPage - 1) * Number(pageSize) + 1)}-
                  {Math.min(processedStudents.length, currentPage * Number(pageSize))} of {processedStudents.length} students
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline" size="icon" className="h-7 w-7"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-[10px] font-bold text-slate-600 px-2 min-w-[80px] text-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline" size="icon" className="h-7 w-7"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
            <p className="text-[10px] text-slate-400">
              💡 Click any grade cell to edit inline · Double-click a row to edit all grades at once · Click headers to sort
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
