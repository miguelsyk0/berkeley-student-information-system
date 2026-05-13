import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Users,
  GraduationCap, Pencil, Trash2, BookOpen, MoreHorizontal, AlertTriangle, FileWarning, CheckCircle2
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { useSetHeader } from "@/contexts/HeaderContext";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GRADE_COLORS, STATUS_STYLES } from "@/utils/gradeUtils";
import { StatCard } from "@/components/ui/StatCard";
import { getAge, formatDate } from "@/utils/dateUtils";
import { getStudents, getSections, getSchoolYears, deleteStudent as deleteStudentApi, getStudentStats, getIncompleteStudents } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ROUTES } from "@/routes";

// ── Types ──────────────────────────────────────────────────────────────────────

interface StudentWithEnrollment {
  id: number;
  lrn: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  gender: "Male" | "Female";
  birthdate: string;
  // Enrollment fields returned by API
  enrollmentId?: number;
  schoolYear?: string;
  gradeLevel?: number;
  sectionName?: string;
  status?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getInitials(s: StudentWithEnrollment) {
  return `${(s.firstName || "?")[0]}${(s.lastName || "?")[0]}`.toUpperCase();
}

// Normalize rows from API (snake_case → camelCase)
function normalizeStudent(raw: any): StudentWithEnrollment {
  return {
    id: raw.id,
    lrn: raw.lrn,
    firstName: raw.first_name ?? raw.firstName ?? "",
    middleName: raw.middle_name ?? raw.middleName ?? "",
    lastName: raw.last_name ?? raw.lastName ?? "",
    suffix: raw.suffix ?? raw.name_extension ?? raw.nameExtension ?? "",
    gender: raw.gender ?? raw.sex ?? "Male",
    birthdate: raw.birthdate ?? "",
    enrollmentId: raw.enrollment_id ?? raw.enrollmentId,
    schoolYear: raw.school_year ?? raw.schoolYear,
    gradeLevel: raw.grade_level ?? raw.gradeLevel,
    sectionName: raw.section_name ?? raw.sectionName ?? raw.section,
    status: raw.status,
  };
}

// ── Student Row ────────────────────────────────────────────────────────────────

function StudentRow({
  student,
  onDelete,
}: {
  student: StudentWithEnrollment;
  onDelete: (student: StudentWithEnrollment) => void;
}) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isEnrolled = !!student.enrollmentId;

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
                {student.suffix ? ` ${student.suffix}` : ""}
              </p>
              <p className="text-[11px] text-slate-400">{student.middleName}</p>
            </div>
          </div>
        </td>

        {/* LRN */}
        <td className="px-4 py-3.5">
          <span className="text-xs font-mono text-slate-600">{student.lrn}</span>
        </td>

        {/* Gender / Age */}
        <td className="px-4 py-3.5">
          <p className="text-xs text-slate-600">{student.gender}</p>
          <p className="text-[11px] text-slate-400">
            {student.birthdate ? `${getAge(student.birthdate)} yrs · ${formatDate(student.birthdate)}` : "—"}
          </p>
        </td>

        {/* Enrollment */}
        <td className="px-4 py-3.5">
          {isEnrolled && student.gradeLevel ? (
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[student.gradeLevel] ?? ""}`}>
                G{student.gradeLevel}
              </span>
              <span className="text-xs text-slate-600">{student.sectionName}</span>
            </div>
          ) : (
            <span className="text-[11px] text-amber-600 font-semibold">Not enrolled</span>
          )}
        </td>

        {/* Status */}
        <td className="px-4 py-3.5">
          {student.status ? (
            <Badge className={`text-[10px] h-5 px-2 border-0 ${STATUS_STYLES[student.status] ?? "bg-slate-100 text-slate-500"}`}>
              {student.status}
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
              {!isEnrolled && (
                <DropdownMenuItem onClick={() => navigate(ROUTES.students.enroll)}>
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
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => onDelete(student)}>
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
  const [filters, setFilters] = useState({
    grade: "all",
    section: "all",
    year: "all",
    gender: "all",
    search: "",
  });

  const [students, setStudents] = useState<StudentWithEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_students: 0, incomplete_students: 0, g10_missing_transcripts: 0 });
  const [incompleteStudents, setIncompleteStudents] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [deletedStudentName, setDeletedStudentName] = useState("");

  // Load basic data
  const [sections, setSections] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);

  useEffect(() => {
    async function loadResources() {
      try {
        const [yearData, statsData, incompleteData] = await Promise.all([
          getSchoolYears(),
          getStudentStats(),
          getIncompleteStudents()
        ]);
        setYears(yearData);
        setStats(statsData);
        setIncompleteStudents(incompleteData);
        const activeYear = yearData.find(y => y.isActive) || yearData[0];
        if (activeYear) {
          setFilters(f => ({ ...f, year: activeYear.label }));
        }
      } catch (err) {
        console.error("Failed to load summary filters", err);
      }
    }
    loadResources();
  }, []);

  // Reload sections when year or grade changes
  useEffect(() => {
    async function loadSections() {
      try {
        const sy = years.find(y => y.label === filters.year);
        if (!sy) {
          setSections([]);
          return;
        }
        const secs = await getSections(sy.id, filters.grade !== "all" ? Number(filters.grade) : undefined);
        setSections(secs.map(s => s.name).sort());
      } catch (err) {
        console.error("Failed to load sections", err);
      }
    }
    if (years.length > 0) loadSections();
  }, [filters.year, filters.grade, years]);

  // Fetch students whenever filters change
  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const data = await getStudents({
          search: filters.search || undefined,
          grade: filters.grade !== "all" ? filters.grade : undefined,
          section: filters.section !== "all" ? filters.section : undefined,
          year: filters.year !== "all" ? filters.year : undefined,
          gender: filters.gender !== "all" ? filters.gender : undefined,
        });
        setStudents((data as any[]).map(normalizeStudent));
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [filters]);

  async function handleDelete(student: StudentWithEnrollment) {
    try {
      await deleteStudentApi(student.id);
      setStudents(prev => prev.filter(s => s.id !== student.id));
      setDeletedStudentName(`${student.firstName} ${student.lastName}`);
      setSuccessModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  }

  const enrolledCount = students.filter(s => !!s.enrollmentId).length;
  const unenrolledCount = students.length - enrolledCount;

  useSetHeader({
    breadcrumbs: [
      { label: "Students" },
      { label: "Student List" },
    ],
    actions: (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs gap-1.5"
          onClick={() => navigate(ROUTES.students.add)}
        >
          <GraduationCap className="w-3.5 h-3.5" /> Add Student
        </Button>
        <Button
          size="sm"
          className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
          onClick={() => navigate(ROUTES.students.enroll)}
        >
          <GraduationCap className="w-3.5 h-3.5" /> Enroll Student
        </Button>
      </div>
    )
  });

  return (
    <div className="p-6 space-y-4">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Total Students"
            value={stats.total_students}
            icon={Users}
            iconColor="text-teal-600"
            iconBg="bg-teal-50"
          />
          
          <StatCard
            label="Incomplete Records"
            value={stats.incomplete_students}
            icon={AlertTriangle}
            iconColor="text-amber-600"
            iconBg="bg-amber-100"
            className="border border-amber-200 bg-amber-50"
            onClick={() => { if(stats.incomplete_students > 0) setIsDialogOpen(true); }}
          />

          <StatCard
            label="Missing G10 Transcripts"
            value={stats.g10_missing_transcripts}
            icon={FileWarning}
            iconColor="text-rose-600"
            iconBg="bg-rose-100"
            className="border border-rose-200 bg-rose-50"
            onClick={() => { if(stats.g10_missing_transcripts > 0) setIsDialogOpen(true); }}
          />
        </div>

        {/* Title + summary */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Students</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {students.length} student{students.length !== 1 ? "s" : ""}
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
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
              className="pl-9 h-8 text-xs bg-white border-slate-200"
            />
          </div>
          <Select value={filters.year} onValueChange={(v) => setFilters(f => ({ ...f, year: v }))}>
            <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => (
                <SelectItem key={y.id} value={y.label}>{y.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.grade} onValueChange={(v) => { setFilters(f => ({ ...f, grade: v, section: "all" })); }}>
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
          <Select value={filters.section} onValueChange={(v) => setFilters(f => ({ ...f, section: v }))}>
            <SelectTrigger className="h-8 w-36 text-xs border-slate-200 bg-white">
              <SelectValue placeholder="All Sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {sections.map(sec => (
                <SelectItem key={sec} value={sec}>{sec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Gender Filter */}
          <Select
            value={filters.gender}
            onValueChange={(v) => setFilters((f) => ({ ...f, gender: v }))}
          >
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-semibold">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
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
                {students.map(student => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* Incomplete Records Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col p-0 gap-0 border-0 rounded-2xl shadow-2xl">
            <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-white">
              <DialogTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Students with Incomplete Records
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto bg-slate-50 p-6 flex-1">
              <div className="grid gap-3">
                {incompleteStudents.map(student => (
                  <Card key={student.id} 
                    className="border border-slate-200 shadow-sm hover:border-slate-300 transition-colors cursor-pointer"
                    onClick={() => navigate(ROUTES.students.edit(student.id))}
                  >
                    <div className="px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-amber-100 text-amber-700 font-black">
                            {student.first_name?.[0]}{student.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-slate-800">{student.last_name}, {student.first_name}</p>
                          <p className="text-xs text-slate-500 font-mono">{student.lrn}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        {student.is_g10_missing_transcript ? (
                           <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-0 text-[10px] font-bold">
                             Missing G7-G9 Transcripts
                           </Badge>
                        ) : (
                           <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 text-[10px] font-bold">
                             Basic Info Incomplete
                           </Badge>
                        )}
                        <p className="text-[11px] font-semibold text-slate-400">Missing: {student.missing_fields}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Delete Modal */}
        <AlertDialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Student Deleted
              </AlertDialogTitle>
              <AlertDialogDescription>
                {deletedStudentName} has been successfully deleted from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setSuccessModalOpen(false)}>
                Okay
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
  );
}
