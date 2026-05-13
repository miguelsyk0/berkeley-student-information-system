import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Pencil, Trash2,
  Search, BookMarked, MoreHorizontal,
  ArrowUp, ArrowDown, Layers,
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
import { ROUTES } from "@/routes";
import { getSubjects, deleteSubject, updateSubject, reorderSubject, type Subject } from "@/services/api";
import { useSetHeader } from "@/contexts/HeaderContext";
import type { SubjectCluster } from "../types";
import { CLUSTERS } from "./SubjectForm";

// ── Cluster Badge Helper ───────────────────────────────────────────────────────

function ClusterBadge({ cluster }: { cluster?: SubjectCluster }) {
  if (!cluster) return <span className="text-slate-300 text-xs">—</span>;
  const cfg = CLUSTERS.find((c) => c.value === cluster);
  if (!cfg) return <span className="text-slate-300 text-xs">—</span>;
  return (
    <Badge className={`${cfg.badgeClass} text-[10px] h-5 px-1.5`}>{cfg.label}</Badge>
  );
}

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
          <p className="text-sm font-semibold text-slate-800">{subject.name}</p>
        </td>

        {/* SF10 Display Name */}
        <td className="px-4 py-3.5">
          <span className="text-xs text-slate-500">{subject.displayName}</span>
        </td>

        {/* Cluster */}
        <td className="px-4 py-3.5 text-center">
          <ClusterBadge cluster={subject.cluster} />
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

type ClusterFilter = "all" | SubjectCluster;

export default function SubjectList() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [filterCluster, setFilterCluster] = useState<ClusterFilter>("all");

  useEffect(() => {
    getSubjects().then(setSubjects).catch(console.error);
  }, []);

  const filtered = subjects
    .filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        (s.displayName?.toLowerCase()?.includes(search.toLowerCase()) ?? false);
      const matchCluster =
        filterCluster === "all" ? true : s.cluster === filterCluster;
      return matchSearch && matchCluster;
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  async function handleDelete(id: number) {
    try {
      const res = await deleteSubject(id);
      if (res.result === "Subject deleted successfully") {
        setSubjects((prev) => prev.filter((s) => s.id !== id));
      } else {
        alert(res.result || "Failed to delete subject.");
      }
    } catch (err) {
      console.error("Delete subject error:", err);
      alert("An error occurred while deleting the subject.");
    }
  }

  async function handleToggleActive(id: number) {
    const subject = subjects.find((s) => s.id === id);
    if (!subject) return;

    try {
      const newActive = !subject.isActive;
      await updateSubject(id, {
        ...subject,
        isActive: newActive,
      });
      setSubjects((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: newActive } : s))
      );
    } catch (err) {
      console.error("Toggle active error:", err);
      alert("Failed to update subject status.");
    }
  }

  async function handleMoveUp(id: number) {
    try {
      await reorderSubject(id, "up");
      const updated = await getSubjects();
      setSubjects(updated);
    } catch (err) {
      console.error("Move up error:", err);
    }
  }

  async function handleMoveDown(id: number) {
    try {
      await reorderSubject(id, "down");
      const updated = await getSubjects();
      setSubjects(updated);
    } catch (err) {
      console.error("Move down error:", err);
    }
  }

  const activeCount = subjects.filter((s) => s.isActive).length;
  const clusteredCount = subjects.filter((s) => !!s.cluster).length;

  useSetHeader({
    title: "Subjects",
    subtitle: `${subjects.length} subjects · ${activeCount} active · ${clusteredCount} clustered`,
    breadcrumbs: [
      { label: "Subjects" },
      { label: "Subject List" },
    ],
    actions: (
      <Button
        size="sm"
        className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
        onClick={() => navigate(ROUTES.subjects.add)}
      >
        <Plus className="w-3.5 h-3.5" /> Add Subject
      </Button>
    )
  });

  return (
    <div className="p-6 space-y-4">
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
          <div className="flex gap-1 bg-white rounded-lg border border-slate-200 p-1 flex-wrap">
            <button
              onClick={() => setFilterCluster("all")}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                filterCluster === "all"
                  ? "bg-slate-700 text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              All
            </button>
            {CLUSTERS.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilterCluster(filterCluster === c.value ? "all" : c.value)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  filterCluster === c.value
                    ? c.badgeClass
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  c.badgeClass.includes("indigo") ? "bg-indigo-400"
                  : c.badgeClass.includes("teal") ? "bg-teal-400"
                  : c.badgeClass.includes("amber") ? "bg-amber-400"
                  : "bg-violet-400"
                }`} />
                {c.label}
              </button>
            ))}
            <button
              onClick={() => setFilterCluster(filterCluster === null ? "all" : null)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                filterCluster === null
                  ? "bg-slate-200 text-slate-700"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Unassigned
            </button>
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
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-center gap-1">
                    <Layers className="w-3 h-3" /> Cluster
                  </th>
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
  );
}
