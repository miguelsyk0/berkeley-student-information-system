import { useState, useEffect } from "react";
import {
  UserCheck, Search,
  CheckCircle2, AlertCircle, ArrowRight, Users,
  Plus, Pencil, Trash2, Mail, GraduationCap, RotateCcw
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Section, Teacher, SchoolYear } from "@/services/api";
import { getSections, getTeachers, assignSectionAdviser, getSchoolYears, deleteTeacher, updateTeacher } from "@/services/api";
import { useSetHeader } from "@/contexts/HeaderContext";
import TeacherForm from "./TeacherForm";

const GRADE_COLORS: Record<number, string> = {
  7: "bg-teal-100 text-teal-800",
  8: "bg-violet-100 text-violet-700",
  9: "bg-blue-100   text-blue-700",
  10: "bg-cyan-100   text-cyan-700",
};

// ── Assign Modal ───────────────────────────────────────────────────────────────

function AssignModal({
  section,
  teachers,
  open,
  onClose,
  onAssign,
}: {
  section: Section | null;
  teachers: Teacher[];
  open: boolean;
  onClose: () => void;
  onAssign: (sectionId: number, teacherId: number | null) => void;
}) {
  const [selectedId, setSelectedId] = useState<string>("unassigned");

  useEffect(() => {
    setSelectedId(section?.adviserId ? String(section.adviserId) : "unassigned");
  }, [section, open]);

  if (!section) return null;

  function handleSave() {
    onAssign(section!.id, selectedId === "unassigned" ? null : Number(selectedId));
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-500" />
            Assign Adviser
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {/* Section info */}
          <div className={`flex items-center gap-3 rounded-xl p-3 ${GRADE_COLORS[section.gradeLevel]} bg-opacity-20 border border-current border-opacity-20`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm ${GRADE_COLORS[section.gradeLevel]}`}>
              {section.gradeLevel}
            </div>
            <div>
              <p className="text-sm font-black text-slate-700">Grade {section.gradeLevel} — {section.name}</p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Users className="w-3 h-3" /> {section.studentCount} students · S.Y. {section.schoolYear}
              </p>
            </div>
          </div>

          {/* Current adviser */}
          {section.adviserName && (
            <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 flex items-center gap-2">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-teal-100 text-teal-800 text-[10px] font-bold">
                  {section.adviserName.split(" ").slice(-1)[0][0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[11px] text-slate-400">Current adviser</p>
                <p className="text-xs font-semibold text-slate-700">{section.adviserName}</p>
              </div>
              {section.adviserId && <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto" />}
            </div>
          )}

          {/* Select new adviser */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
              {section.adviserName ? "Reassign to" : "Assign adviser"}
            </p>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="h-9 text-sm border-slate-200">
                <SelectValue placeholder="Select a teacher..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Remove adviser</SelectItem>
                {teachers.filter(t => t.isActive).map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    <div className="flex flex-col">
                      <span>{t.firstName} {t.lastName}</span>
                      <span className="text-[10px] text-slate-400">{t.employeeId}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">Cancel</Button>
          <Button size="sm" onClick={handleSave} className="h-8 text-xs bg-teal-600 hover:bg-teal-800 gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Confirm Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Teacher Details Modal ──────────────────────────────────────────────────────

function TeacherDetailsModal({
  teacher,
  open,
  onClose,
}: {
  teacher: Teacher | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!teacher) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-black text-slate-800 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-500" />
            Teacher Profile Snapshot
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-5">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 border-2 border-slate-100 rounded-2xl shadow-sm">
              <AvatarFallback className="bg-slate-50 text-slate-500 rounded-2xl text-xl font-black">
                {teacher.firstName?.[0]}{teacher.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                {teacher.firstName} {teacher.middleName} {teacher.lastName} {teacher.suffix}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-teal-600 border-teal-200 bg-teal-50 px-2 py-0">
                  {teacher.employeeId}
                </Badge>
                {!teacher.isActive && (
                  <Badge variant="secondary" className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0">
                    INACTIVE
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Specialization</p>
              <p className="text-xs font-semibold text-slate-800">{teacher.specialization || "None specified"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Gender</p>
              <p className="text-xs font-semibold text-slate-800">{teacher.gender || "Not specified"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Contact Number</p>
              <p className="text-xs font-semibold text-slate-800">{teacher.contactNumber || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
              <p className="text-xs font-semibold text-slate-800 break-all">{teacher.email || "N/A"}</p>
            </div>
          </div>

          {teacher.userId && (
            <div className="bg-teal-50 border border-teal-100 rounded-lg p-3">
              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-0.5">Linked User Account ID</p>
              <p className="text-xs font-mono font-medium text-teal-800 break-all">{teacher.userId}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdviserAssignment() {
  const [sections, setSections] = useState<Section[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);

  const [sectionSearch, setSectionSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("1");

  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);

  const fetchTeachers = async () => {
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSchoolYears().then((sys) => {
      setSchoolYears(sys);
      if (sys.length > 0 && yearFilter === "1") setYearFilter(String(sys[0].id));
    }).catch(console.error);
    fetchTeachers();
  }, [yearFilter]);

  useEffect(() => {
    if (yearFilter) {
      getSections(Number(yearFilter)).then(setSections).catch(console.error);
    }
  }, [yearFilter]);

  const unassigned = sections.filter((s) => !s.adviserId);
  const assigned = sections.filter((s) => s.adviserId);
  const activeTeachers = teachers.filter((t) => t.isActive);

  const filteredSections = sections.filter((s) => {
    return s.name.toLowerCase().includes(sectionSearch.toLowerCase()) ||
      (s.adviserName ?? "").toLowerCase().includes(sectionSearch.toLowerCase());
  });

  const filteredTeachers = teachers.filter(t => {
    const fullName = `${t.firstName} ${t.lastName}`.toLowerCase();
    const search = teacherSearch.toLowerCase();
    return fullName.includes(search) || t.employeeId.toLowerCase().includes(search);
  });

  async function handleAssign(sectionId: number, teacherId: number | null) {
    try {
      await assignSectionAdviser(sectionId, teacherId);
      const teacher = teachers.find((t) => t.id === teacherId) ?? null;
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? { ...s, adviserId: teacherId, adviserName: teacher ? `${teacher.firstName} ${teacher.lastName}` : null }
            : s
        )
      );
    } catch (err: any) {
      console.error(err);
      const msg = err.message ? JSON.parse(err.message).error : "Failed to assign adviser.";
      alert(msg);
    }
  }

  const handleDeleteTeacher = async (id: number) => {
    try {
      await deleteTeacher(id);
      fetchTeachers();
      if (yearFilter) {
        getSections(Number(yearFilter)).then(setSections).catch(console.error);
      }
    } catch (err) {
      console.error("Failed to deactivate teacher:", err);
    }
  };

  function openModal(section: Section) {
    setSelectedSection(section);
    setModalOpen(true);
  }

  useSetHeader({
    title: "Advisers & Teachers",
    subtitle: "Manage faculty members and assign class advisers.",
    breadcrumbs: [
      { label: "School & Sections" },
      { label: "Advisers & Teachers" },
    ],
    extra: (
      <Select value={yearFilter} onValueChange={setYearFilter}>
        <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {schoolYears.map((sy) => (
            <SelectItem key={sy.id} value={String(sy.id)}>{sy.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
  });

  return (
    <div className="p-6 space-y-6 w-full">

      {/* Summary cards (Top Row) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Assigned Sections"
          value={assigned.length}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Unassigned Sections"
          value={unassigned.length}
          icon={AlertCircle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          label="Total Teachers"
          value={teachers.length}
          icon={UserCheck}
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
        />
        <StatCard
          label="Active Instructors"
          value={activeTeachers.length}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      {/* Split layout: Sections vs Teachers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* LEFT COLUMN: Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800">Assign Advisers</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search sections..."
                value={sectionSearch}
                onChange={(e) => setSectionSearch(e.target.value)}
                className="pl-8 h-8 w-48 text-xs bg-white border-slate-200"
              />
            </div>
          </div>

          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100 h-[600px] overflow-y-auto">
              {filteredSections.map((section) => (
                <div key={section.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-2 w-32 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[section.gradeLevel]}`}>
                      G{section.gradeLevel}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 truncate">{section.name}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    {section.adviserName ? (
                      <>
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="bg-teal-100 text-teal-800 text-[8px] font-bold">
                            {section.adviserName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold text-slate-700 truncate">{section.adviserName}</span>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <span className="text-xs font-semibold">No adviser</span>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={section.adviserName ? "outline" : "default"}
                    className={`h-7 text-[10px] px-2.5 opacity-0 group-hover:opacity-100 transition-opacity ${!section.adviserName ? "bg-teal-600 hover:bg-teal-800 text-white" : ""
                      }`}
                    onClick={() => openModal(section)}
                  >
                    {section.adviserName ? "Reassign" : "Assign"}
                  </Button>
                </div>
              ))}
              {filteredSections.length === 0 && (
                <div className="px-4 py-8 text-center text-slate-400 text-sm">No sections match your search.</div>
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Teachers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800">Teachers</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  placeholder="Search teachers..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  className="pl-8 h-8 w-40 text-xs bg-white border-slate-200"
                />
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setEditingTeacher(null);
                  setIsFormOpen(true);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white h-8 text-xs gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 h-[600px] overflow-y-auto content-start">
            {filteredTeachers.map((teacher) => (
              <Card
                key={teacher.id}
                className={`border-0 shadow-sm transition-all group overflow-hidden cursor-pointer hover:shadow-md ${!teacher.isActive ? "opacity-60 grayscale" : ""}`}
                onClick={() => setViewingTeacher(teacher)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10 border border-slate-100 rounded-lg">
                        <AvatarFallback className="bg-slate-50 text-slate-400 rounded-lg text-xs font-bold">
                          {teacher.firstName?.[0]}{teacher.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                          {teacher.firstName} {teacher.lastName}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider">
                            {teacher.employeeId}
                          </p>
                          {!teacher.isActive && (
                            <Badge variant="secondary" className="text-[8px] h-3.5 px-1 bg-slate-100 text-slate-500">INACTIVE</Badge>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 mt-2">
                          {teacher.specialization && (
                            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                              <GraduationCap className="w-3 h-3 text-slate-300" /> {teacher.specialization}
                            </span>
                          )}
                          {teacher.email && (
                            <span className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                              <Mail className="w-3 h-3 text-slate-300" /> {teacher.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <Button
                        variant="ghost" size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTeacher(teacher);
                          setIsFormOpen(true);
                        }}
                        className="h-7 w-7 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      {teacher.isActive && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost" size="icon"
                              onClick={e => e.stopPropagation()}
                              className="h-7 w-7 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={e => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Deactivate Teacher?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will mark <strong>{teacher.firstName} {teacher.lastName}</strong> as inactive. They will remain in past records but won't be available for new assignments.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTeacher(teacher.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Deactivate
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      {!teacher.isActive && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost" size="icon"
                              onClick={e => e.stopPropagation()}
                              className="h-7 w-7 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={e => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reactivate Teacher?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will mark <strong>{teacher.firstName} {teacher.lastName}</strong> as active again. They will be available for new section assignments.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  try {
                                    await updateTeacher(teacher.id, { ...teacher, isActive: true });
                                    fetchTeachers();
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="bg-teal-500 hover:bg-teal-600 text-white"
                              >
                                Reactivate
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredTeachers.length === 0 && (
              <div className="p-6 text-center text-slate-400 text-sm bg-white rounded-xl border border-dashed border-slate-200">
                No teachers found. Click "Add" to create one.
              </div>
            )}
          </div>
        </div>

      </div>

      <AssignModal
        section={selectedSection}
        teachers={teachers}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAssign={handleAssign}
      />

      <TeacherForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false);
          fetchTeachers();
        }}
        teacher={editingTeacher}
      />

      <TeacherDetailsModal
        teacher={viewingTeacher}
        open={viewingTeacher !== null}
        onClose={() => setViewingTeacher(null)}
      />
    </div>
  );
}