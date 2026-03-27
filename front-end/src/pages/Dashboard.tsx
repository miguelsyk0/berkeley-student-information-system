import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Users,
  BookOpen,
  AlertTriangle,
  Upload,
  Plus,
  FileSpreadsheet,
  ChevronRight,
  TrendingUp,
  Bell,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  School,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/sidebar";

// ── Data ──────────────────────────────────────────────────────────────────────

const studentsByGrade = [
  { grade: "Grade 7", students: 142 },
  { grade: "Grade 8", students: 138 },
  { grade: "Grade 9", students: 127 },
  { grade: "Grade 10", students: 119 },
];

const gradeDistribution = [
  { label: "A+", count: 48, color: "#16a34a" },
  { label: "A", count: 112, color: "#22c55e" },
  { label: "A-", count: 134, color: "#86efac" },
  { label: "B+", count: 97, color: "#fbbf24" },
  { label: "B", count: 78, color: "#f59e0b" },
  { label: "B-", count: 43, color: "#fb923c" },
  { label: "C", count: 29, color: "#f87171" },
  { label: "D", count: 12, color: "#ef4444" },
];


const importCompletion = [
  { section: "7 - Integrity", grade: 7, done: true, progress: 100 },
  { section: "7 - Honesty", grade: 7, done: true, progress: 100 },
  { section: "7 - Loyalty", grade: 7, done: false, progress: 0 },
  { section: "8 - Diligence", grade: 8, done: true, progress: 100 },
  { section: "8 - Humility", grade: 8, done: false, progress: 60 },
  { section: "9 - Wisdom", grade: 9, done: true, progress: 100 },
  { section: "9 - Courage", grade: 9, done: false, progress: 0 },
  { section: "10 - Excellence", grade: 10, done: true, progress: 100 },
];

const recentImports = [
  { section: "8 - Diligence", quarter: "Q1", by: "R. Dela Cruz", time: "2 hours ago", status: "success" },
  { section: "7 - Integrity", quarter: "Q1", by: "M. Santos", time: "5 hours ago", status: "success" },
  { section: "9 - Wisdom", quarter: "Q1", by: "R. Dela Cruz", time: "Yesterday", status: "success" },
  { section: "8 - Humility", quarter: "Q1", by: "M. Santos", time: "Yesterday", status: "partial" },
  { section: "10 - Excellence", quarter: "Q1", by: "R. Dela Cruz", time: "2 days ago", status: "success" },
];

const recentStudents = [
  { name: "Sofia Reyes", lrn: "105-01-2025-0028", section: "7 - Integrity", addedAt: "Today" },
  { name: "Carlo Dizon", lrn: "105-01-2025-0029", section: "8 - Diligence", addedAt: "Today" },
  { name: "Isabella De Leon", lrn: "105-01-2025-0030", section: "9 - Wisdom", addedAt: "Yesterday" },
];

const alerts = [
  { type: "warning", message: "3 sections haven't submitted Q1 grade sheets yet", link: "View Sections" },
  { type: "error", message: "12 students have failing grades (below 75) in Q1", link: "View Students" },
  { type: "info", message: "5 students are not yet enrolled in any section for 2025-2026", link: "Enroll Now" },
  { type: "warning", message: "2 duplicate LRNs detected during last import", link: "Review" },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
  onClick?: () => void;
}) {
  return (
    <Card
      className={`relative overflow-hidden cursor-pointer border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className={`absolute inset-0 opacity-5 ${accent}`} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-800 leading-none">{value}</p>
            {sub && <p className="text-xs text-slate-400 mt-1.5">{sub}</p>}
          </div>
          <div className={`p-2.5 rounded-xl ${accent} bg-opacity-10`}>
            <Icon className={`w-5 h-5 ${accent.replace("bg-", "text-")}`} />
          </div>
        </div>
        {onClick && (
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-slate-400 hover:text-slate-600">
            View all <ChevronRight className="w-3 h-3" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ImportStatusIcon({ status }: { status: string }) {
  if (status === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === "partial") return <Clock className="w-4 h-4 text-amber-500" />;
  return <XCircle className="w-4 h-4 text-red-400" />;
}

function AlertItem({ type, message, link }: { type: string; message: string; link: string }) {
  const styles = {
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };
  const icons = {
    warning: <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />,
    error: <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />,
    info: <Bell className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />,
  };
  return (
    <div className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-xs ${styles[type as keyof typeof styles]}`}>
      {icons[type as keyof typeof icons]}
      <span className="flex-1 leading-relaxed">{message}</span>
      <button className="font-bold underline underline-offset-2 whitespace-nowrap opacity-70 hover:opacity-100">
        {link}
      </button>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState("2025-2026");

  const completedSections = importCompletion.filter((s) => s.done).length;
  const totalSections = importCompletion.length;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <Sidebar
        user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }}
        onLogout={() => console.log("Logout")}
      />

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">

        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-4 sticky top-0 z-10">
          <div className="flex-1">
            <h1 className="text-lg font-black text-slate-800">Dashboard</h1>
            <p className="text-xs text-slate-400">Welcome back, Registrar Dela Cruz</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search students, sections..."
                className="pl-9 h-8 w-56 text-xs bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-8 w-32 text-xs border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-2026">2025–2026</SelectItem>
                <SelectItem value="2024-2025">2024–2025</SelectItem>
                <SelectItem value="2023-2024">2023–2024</SelectItem>
              </SelectContent>
            </Select>
            <button className="relative p-2 rounded-lg hover:bg-slate-50 text-slate-500">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-500">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">

          {/* ── Current Period Banner ── */}
          <div className="bg-teal-600 rounded-2xl px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-0.5">Active Period</p>
              <p className="text-white text-xl font-black">School Year {selectedYear} — Quarter 1</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="h-8 text-xs font-semibold gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Student
              </Button>
              <Button size="sm" className="h-8 text-xs font-semibold gap-1.5 bg-white text-teal-800 hover:bg-teal-50">
                <Upload className="w-3.5 h-3.5" /> New Import
              </Button>
              <Button size="sm" variant="secondary" className="h-8 text-xs font-semibold gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Grade Sheet
              </Button>
            </div>
          </div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Enrolled Students"
              value="526"
              sub="Across all grade levels"
              accent="bg-teal-500"
              onClick={() => {}}
            />
            <StatCard
              icon={School}
              label="Active Sections"
              value="8"
              sub="4 grade levels"
              accent="bg-violet-500"
            />
            <StatCard
              icon={Upload}
              label="Pending Imports"
              value={totalSections - completedSections}
              sub={`${completedSections}/${totalSections} sections done`}
              accent="bg-amber-500"
              onClick={() => {}}
            />
            <StatCard
              icon={AlertTriangle}
              label="Incomplete Grades"
              value="17"
              sub="Students missing Q1 grades"
              accent="bg-red-500"
              onClick={() => {}}
            />
          </div>

          {/* ── Charts Row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Students per Grade Level */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-5 px-5">
                <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-500" />
                  Students per Grade Level
                </CardTitle>
                <p className="text-xs text-slate-400">S.Y. {selectedYear}</p>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={studentsByGrade} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="grade" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                      cursor={{ fill: "#f8fafc" }}
                    />
                    <Bar dataKey="students" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-5 px-5">
                <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-violet-500" />
                  Grade Distribution — Q1
                </CardTitle>
                <p className="text-xs text-slate-400">All students, all subjects</p>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={gradeDistribution} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                      cursor={{ fill: "#f8fafc" }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* ── Bottom Row: Activity + Alerts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Recent Imports */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-teal-400" />
                    Recent Imports
                  </CardTitle>
                  <button className="text-[11px] text-teal-500 font-semibold hover:underline">
                    View all
                  </button>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                {recentImports.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <ImportStatusIcon status={item.status} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{item.section}</p>
                      <p className="text-[10px] text-slate-400">{item.quarter} · by {item.by}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recently Added Students */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
                    <Users className="w-4 h-4 text-violet-400" />
                    Recent Students
                  </CardTitle>
                  <button className="text-[11px] text-teal-500 font-semibold hover:underline">
                    View all
                  </button>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                {recentStudents.map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarFallback className="bg-violet-100 text-violet-700 text-[10px] font-bold">
                        {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{s.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{s.section}</p>
                    </div>
                    <Badge variant="outline" className="text-[9px] h-4 px-1.5 font-semibold text-slate-500">
                      {s.addedAt}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full h-7 text-xs mt-1 border-dashed gap-1.5">
                  <Plus className="w-3 h-3" /> Add Student
                </Button>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-400" />
                  Alerts & Flags
                  <Badge className="ml-auto bg-red-100 text-red-700 text-[10px] h-4 px-1.5">
                    {alerts.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-2">
                {alerts.map((alert, i) => (
                  <AlertItem key={i} {...alert} />
                ))}
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}