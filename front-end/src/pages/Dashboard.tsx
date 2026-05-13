import { useState, useEffect } from "react";
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
  TrendingUp,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  School,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/StatCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSetHeader } from "@/contexts/HeaderContext";
import { getDashboardSummary, getSchoolYears } from "@/services/api";
import type { SchoolYear } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes";

// ── Data ──────────────────────────────────────────────────────────────────────

// ── Sub-components ─────────────────────────────────────────────────────────────

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
  const navigate = useNavigate();
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>("");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("1");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Initial load: fetch school years
  useEffect(() => {
    getSchoolYears().then(years => {
      setSchoolYears(years);
      const active = years.find(y => y.isActive) || years[0];
      if (active) setSelectedYearId(String(active.id));
    });
  }, []);

  // Fetch dashboard data when year or quarter changes
  useEffect(() => {
    if (!selectedYearId || !selectedQuarter) return;
    setLoading(true);
    getDashboardSummary(Number(selectedYearId), Number(selectedQuarter))
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedYearId, selectedQuarter]);

  const selectedYearLabel = schoolYears.find(y => String(y.id) === selectedYearId)?.label || "...";

  useSetHeader({
    title: "Dashboard",
    subtitle: `Welcome back — S.Y. ${selectedYearLabel} Quarter ${selectedQuarter}`,
    extra: (
      <div className="flex items-center gap-2">
        <Select value={selectedYearId} onValueChange={setSelectedYearId}>
          <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {schoolYears.map(y => (
              <SelectItem key={y.id} value={String(y.id)}>{y.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
          <SelectTrigger className="h-8 w-28 text-xs border-slate-200 bg-white shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4].map(q => (
              <SelectItem key={q} value={String(q)}>Quarter {q}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ),
    actions: (
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1.5 border-slate-200">
          <Plus className="w-3.5 h-3.5" /> Add Student
        </Button>
        <Button size="sm" className="h-8 text-xs font-semibold gap-1.5 bg-teal-600 hover:bg-teal-800">
          <Upload className="w-3.5 h-3.5" /> New Import
        </Button>
      </div>
    )
  });

  if (loading || !data) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-64 bg-slate-50 rounded-xl" />
          <div className="h-64 bg-slate-50 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Enrolled Students"
          value={data.stats.totalStudents}
          subValue="Across all grade levels"
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
          accent="bg-teal-500"
          onClick={() => navigate(ROUTES.students.root)}
        />
        <StatCard
          icon={School}
          label="Active Sections"
          value={data.stats.activeSections}
          subValue={`${data.charts.studentsPerGrade.length} grade levels`}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
          accent="bg-violet-500"
          onClick={() => navigate(ROUTES.school.sections)}
        />
        <StatCard
          icon={Upload}
          label="Encoding Progress"
          value={`${data.stats.completedImports}/${data.stats.totalSections}`}
          subValue="Sections fully encoded"
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          accent="bg-amber-500"
          onClick={() => navigate(ROUTES.grades.root)}
        />
        <StatCard
          icon={AlertTriangle}
          label="Incomplete Data"
          value={data.stats.incompleteStudents}
          subValue="Students missing profile info"
          iconColor="text-red-600"
          iconBg="bg-red-50"
          accent="bg-red-500"
          onClick={() => navigate(ROUTES.students.root)}
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
            <p className="text-xs text-slate-400">S.Y. {selectedYearLabel}</p>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.charts.studentsPerGrade} barSize={36}>
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
              Grade Distribution — Q{selectedQuarter}
            </CardTitle>
            <p className="text-xs text-slate-400">All students, all subjects</p>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            {data.charts.gradeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.charts.gradeDistribution} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.charts.gradeDistribution.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-xs text-slate-400 italic">
                No grades encoded for this quarter yet
              </div>
            )}
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
            {data.recentImports.length > 0 ? data.recentImports.map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-2.5">
                <ImportStatusIcon status={item.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{item.section}</p>
                  <p className="text-[10px] text-slate-400">{item.quarter} · by Registrar</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
              </div>
            )) : (
              <p className="text-[11px] text-slate-400 italic py-2">No recent imports</p>
            )}
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
              <button
                className="text-[11px] text-teal-500 font-semibold hover:underline"
                onClick={() => navigate(ROUTES.students.root)}
              >
                View all
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-3">
            {data.recentStudents.length > 0 ? data.recentStudents.map((s: any, i: number) => (
              <div key={i} className="flex items-center gap-2.5">
                <Avatar className="w-7 h-7 flex-shrink-0">
                  <AvatarFallback className="bg-violet-100 text-violet-700 text-[10px] font-bold">
                    {s.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
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
            )) : (
              <p className="text-[11px] text-slate-400 italic py-2">No students added recently</p>
            )}
            <Button
              variant="outline" size="sm" className="w-full h-7 text-xs mt-1 border-dashed gap-1.5"
              onClick={() => navigate(ROUTES.students.add)}
            >
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
                {data.alerts.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-2">
            {data.alerts.length > 0 ? data.alerts.map((alert: any, i: number) => (
              <AlertItem key={i} {...alert} />
            )) : (
              <div className="flex flex-col items-center justify-center py-4 text-slate-300">
                <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-[10px] font-medium">System healthy · No alerts</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
