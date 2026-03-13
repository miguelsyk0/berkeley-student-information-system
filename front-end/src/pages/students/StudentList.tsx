import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, ChevronRight, Users,
  UserCheck, Filter, MoreHorizontal,
  GraduationCap, Pencil, Trash2, BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from "@/components/sidebar";
import {
  MOCK_STUDENTS, MOCK_ENROLLMENTS,
  GRADE_COLORS, STATUS_STYLES, getAge, formatDate,
} from "./mockData";
import type { Student } from "../types";
import { ROUTES } from "@/routes";

// ── Helpers ────────────────────────────────────────────────────────────────────

function getEnrollment(studentId: number, year: string) {
  return MOCK_ENROLLMENTS.find(
    (e) => e.studentId === studentId && e.schoolYear === year
  ) ?? null;
}

function getInitials(s: Student) {
  return `${s.firstName[0]}${s.lastName[0]}`.toUpperCase();
}

// ── Student Row ────────────────────────────────────────────────────────────────

function StudentRow({
  student,
  schoolYear,
  onDelete,
}: {
  student: Student;
  schoolYear: string;
  onDelete: (id: number) => void;
}) {
  const navigate = useNavigate();
  const enrollment = getEnrollment(student.id, schoolYear);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <tr
        className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
        onClick={() => navigate(ROUTES.students.profile(student.id))}
      >
        {/* Avatar + Name */}
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-teal-100 text-teal-800 text-xs font-bold">
                {getInitials(student)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {student.lastName}, {student.firstName}
                {student.nameExtension ? ` ${student.nameExtension}` : ""}
              </p>
              <p className="text-[11px] text-slate-400">{student.middleName}</p>
            </div>
          </div>
        </td>

        {/* LRN */}
        <td className="px-4 py-3.5">
          <span className="text-xs font-mono text-slate-600">{student.lrn}</span>
        </td>

        {/* Sex / Age */}
        <td className="px-4 py-3.5">
          <p className="text-xs text-slate-600">{student.sex}</p>
          <p className="text-[11px] text-slate-400">{getAge(student.birthdate)} yrs · {formatDate(student.birthdate)}</p>
        </td>

        {/* Enrollment */}
        <td className="px-4 py-3.5">
          {enrollment ? (
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[enrollment.gradeLevel]}`}>
                G{enrollment.gradeLevel}
              </span>
              <span className="text-xs text-slate-600">{enrollment.section}</span>
            </div>
          ) : (
            <span className="text-[11px] text-amber-600 font-semibold">Not enrolled</span>
          )}
        </td>

        {/* Status */}
        <td className="px-4 py-3.5">
          {enrollment ? (
            <Badge className={`text-[10px] h-5 px-2 border-0 ${STATUS_STYLES[enrollment.status]}`}>
              {enrollment.status}
            </Badge>
          ) : (
            <Badge className="text-[10px] h-5 px-2 border-0 bg-slate-100 text-slate-500">—</Badge>
          )}
        </td>

        {/* Actions */}
        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => navigate(ROUTES.students.profile(student.id))}>
                <BookOpen className="w-3.5 h-3.5 mr-2" /> View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(ROUTES.students.edit(student.id))}>
                <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Info
              </DropdownMenuItem>
              {!enrollment && (
                <DropdownMenuItem onClick={() => navigate(ROUTES.students.enroll, { state: { student } })}>
                  <GraduationCap className="w-3.5 h-3.5 mr-2" /> Enroll Student
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      {/* Delete confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {student.firstName} {student.lastName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the student and all their records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => onDelete(student.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("2025-2026");
  const [sexFilter, setSexFilter] = useState("all");

  // Derive available sections from current year's enrollments
  const availableSections = Array.from(
    new Set(
      MOCK_ENROLLMENTS
        .filter((e) => e.schoolYear === yearFilter)
        .map((e) => e.section)
    )
  ).sort();

  const filtered = students.filter((s) => {
    const fullName = `${s.lastName} ${s.firstName} ${s.middleName ?? ""}`.toLowerCase();
    const matchSearch = fullName.includes(search.toLowerCase()) || s.lrn.includes(search);
    const enrollment = getEnrollment(s.id, yearFilter);
    const matchGrade = gradeFilter === "all" || String(enrollment?.gradeLevel) === gradeFilter;
    const matchSection = sectionFilter === "all" || enrollment?.section === sectionFilter;
    const matchSex = sexFilter === "all" || s.sex === sexFilter;
    return matchSearch && matchGrade && matchSection && matchSex;
  });

  function handleDelete(id: number) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  const enrolledCount = filtered.filter((s) => getEnrollment(s.id, yearFilter)).length;
  const unenrolledCount = filtered.length - enrolledCount;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }}
        onLogout={() => console.log("Logout")}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <span className="text-xs text-slate-400">Students</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">Student List</span>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5"
              onClick={() => navigate(ROUTES.students.enroll)}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Enroll Student
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
              onClick={() => navigate(ROUTES.students.add)}
            >
              <Plus className="w-3.5 h-3.5" /> Add Student
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-4">
          {/* Title + summary */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Students</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {filtered.length} student{filtered.length !== 1 ? "s" : ""}
                <span className="mx-1.5 text-slate-300">·</span>
                <span className="text-emerald-600 font-medium">{enrolledCount} enrolled</span>
                {unenrolledCount > 0 && (
                  <><span className="mx-1.5 text-slate-300">·</span>
                  <span className="text-amber-600 font-medium">{unenrolledCount} not enrolled</span></>
                )}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-48 max-w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search by name or LRN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-xs bg-white border-slate-200"
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-2026">2025–2026</SelectItem>
                <SelectItem value="2024-2025">2024–2025</SelectItem>
              </SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={(v) => { setGradeFilter(v); setSectionFilter("all"); }}>
              <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white">
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="7">Grade 7</SelectItem>
                <SelectItem value="8">Grade 8</SelectItem>
                <SelectItem value="9">Grade 9</SelectItem>
                <SelectItem value="10">Grade 10</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="h-8 w-36 text-xs border-slate-200 bg-white">
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {availableSections.map((sec) => (
                  <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sexFilter} onValueChange={setSexFilter}>
              <SelectTrigger className="h-8 w-28 text-xs border-slate-200 bg-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Card className="border-0 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Users className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-semibold">No students found</p>
                <p className="text-xs mt-1">Try adjusting your filters or add a new student.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Student</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">LRN</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Sex / Age</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Enrollment</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student) => (
                    <StudentRow
                      key={student.id}
                      student={student}
                      schoolYear={yearFilter}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}