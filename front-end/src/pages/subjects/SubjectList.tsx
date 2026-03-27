import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, ChevronRight, Pencil, Trash2,
  Search, BookMarked, MoreHorizontal,
  ArrowUp, ArrowDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import Sidebar from "@/components/sidebar";
import { ROUTES } from "@/routes";
import { getSubjects } from "@/services/api";
import type { Subject } from "../types";


// ── Subject Row ────────────────────────────────────────────────────────────────

function SubjectRow({
  subject,
  onEdit,
  onDelete,
  onToggleActive,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  subject: Subject;
  onEdit: (s: Subject) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <tr className={`border-b border-slate-100 group transition-colors hover:bg-slate-50 ${!subject.isActive ? "opacity-50" : ""}`}>
        {/* Order controls */}
        <td className="px-3 py-3 w-16">
          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              disabled={isFirst}
              onClick={() => onMoveUp(subject.id)}
              className="p-0.5 rounded text-slate-400 hover:text-slate-600 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              disabled={isLast}
              onClick={() => onMoveDown(subject.id)}
              className="p-0.5 rounded text-slate-400 hover:text-slate-600 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
        </td>

        {/* Code */}
        <td className="px-4 py-3.5 w-24">
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {subject.code}
          </span>
        </td>

        {/* Name */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            {subject.isMapeh && (
              <span className="w-3 border-l-2 border-slate-200 ml-1 self-stretch inline-block" />
            )}
            <div>
              <p className="text-sm font-semibold text-slate-800">{subject.name}</p>
              {subject.isMapeh && (
                <p className="text-[10px] text-violet-500 font-semibold">MAPEH sub-subject</p>
              )}
            </div>
          </div>
        </td>

        {/* SF10 Display Name */}
        <td className="px-4 py-3.5">
          <span className="text-xs text-slate-500">{subject.displayName}</span>
        </td>

        {/* MAPEH flag */}
        <td className="px-4 py-3.5 text-center">
          {subject.isMapeh ? (
            <Badge className="bg-violet-100 text-violet-700 border-0 text-[10px] h-4 px-1.5">MAPEH</Badge>
          ) : (
            <span className="text-slate-300 text-xs">—</span>
          )}
        </td>

        {/* Active toggle */}
        <td className="px-4 py-3.5 text-center">
          <Switch
            checked={subject.isActive}
            onCheckedChange={() => onToggleActive(subject.id)}
            className="scale-75"
          />
        </td>

        {/* Actions */}
        <td className="px-4 py-3.5 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => onEdit(subject)}>
                <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
              </DropdownMenuItem>
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

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{subject.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the subject from the system. Grades already encoded under this subject will not be deleted, but the subject will no longer be available for new imports or encoding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => onDelete(subject.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function SubjectList() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<any[]>([]); // Using any since Subject might not exist locally
  const [search, setSearch] = useState("");
  const [filterMapeh, setFilterMapeh] = useState<"all" | "mapeh" | "regular">("all");

  useEffect(() => {
    getSubjects().then(setSubjects).catch(console.error);
  }, []);

  const filtered = subjects
    .filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        (s.displayName?.toLowerCase()?.includes(search.toLowerCase()) ?? false);
      const matchMapeh =
        filterMapeh === "all" ? true :
        filterMapeh === "mapeh" ? s.isMapeh :
        !s.isMapeh;
      return matchSearch && matchMapeh;
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  function handleDelete(id: number) {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleToggleActive(id: number) {
    // Optimistic toggle
    setSubjects((prev) => prev.map((s) => s.id === id ? { ...s, isActive: !s.isActive } : s));
    // Provide actual API call here in production
  }

  function handleMoveUp(id: number) {
    setSubjects((prev) => {
      const sorted = [...prev].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const idx = sorted.findIndex((s) => s.id === id);
      if (idx <= 0) return prev;
      const next = sorted.map((s) => ({ ...s }));
      [next[idx - 1].order, next[idx].order] = [next[idx].order, next[idx - 1].order];
      return next;
    });
  }

  function handleMoveDown(id: number) {
    setSubjects((prev) => {
      const sorted = [...prev].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const idx = sorted.findIndex((s) => s.id === id);
      if (idx >= sorted.length - 1) return prev;
      const next = sorted.map((s) => ({ ...s }));
      [next[idx + 1].order, next[idx].order] = [next[idx].order, next[idx + 1].order];
      return next;
    });
  }

  const activeCount = subjects.filter((s) => s.isActive).length;
  const mapehCount  = subjects.filter((s) => s.isMapeh).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }}
        onLogout={() => console.log("Logout")}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <span className="text-xs text-slate-400">Subjects</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">Subject List</span>
          <div className="ml-auto">
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
              onClick={() => navigate(ROUTES.subjects.add)}
            >
              <Plus className="w-3.5 h-3.5" /> Add Subject
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-4">
          {/* Title + summary */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Subjects</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {subjects.length} subjects
                <span className="mx-1.5 text-slate-300">·</span>
                <span className="text-emerald-600 font-medium">{activeCount} active</span>
                <span className="mx-1.5 text-slate-300">·</span>
                <span className="text-violet-600 font-medium">{mapehCount} MAPEH sub-subjects</span>
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-48 max-w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search by code, name, or SF10 name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-xs bg-white border-slate-200"
              />
            </div>
            <div className="flex gap-1 bg-white rounded-lg border border-slate-200 p-1">
              {(["all", "regular", "mapeh"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterMapeh(f)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors capitalize ${
                    filterMapeh === f
                      ? "bg-teal-600 text-white"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {f === "all" ? "All" : f === "regular" ? "Regular" : "MAPEH"}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <Card className="border-0 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <BookMarked className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-semibold">No subjects found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-3 py-3 w-16" />
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Code</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject Name</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">SF10 Display Name</th>
                    <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">MAPEH</th>
                    <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Active</th>
                    <th className="px-4 py-3 w-12" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((subject, idx) => (
                    <SubjectRow
                      key={subject.id}
                      subject={subject}
                      isFirst={idx === 0}
                      isLast={idx === filtered.length - 1}
                      onEdit={(s) => navigate(ROUTES.subjects.edit(s.id), { state: { subject: s } })}
                      onDelete={handleDelete}
                      onToggleActive={handleToggleActive}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </Card>

          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" />
            Use the arrows to reorder subjects. Order affects how columns appear in the grade sheet.
          </p>
        </div>
      </main>
    </div>
  );
}