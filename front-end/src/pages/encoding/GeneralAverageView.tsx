import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from "@/components/sidebar";
import { gradeColor, letterGrade } from "@/utils/gradeUtils";
import { ROUTES } from "@/routes";
import { getSchoolYears, getSections, getGeneralAverage, getSubjects } from "@/services/api";
import type { SchoolYear, Section, GeneralAverage, Subject } from "@/services/api";

export default function GeneralAverageView() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"section" | "student">("section");

  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [averages, setAverages] = useState<GeneralAverage[]>([]);

  const [schoolYear, setSchoolYear] = useState("");
  const [section, setSection] = useState("Diligence");
  const [quarter, setQuarter] = useState("all");

  useEffect(() => {
    async function init() {
      try {
        const [years, subjs] = await Promise.all([getSchoolYears(), getSubjects()]);
        setSchoolYears(years);
        setSubjects(subjs);
        const active = years.find(y => y.isActive) || years[0];
        if (active) setSchoolYear(active.label);
      } catch (err) {
        console.error("Init failed", err);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!schoolYear) return;
    const yId = schoolYears.find(y => y.label === schoolYear)?.id;
    if (yId) {
      getSections(yId).then(setSections).catch(console.error);
    }
  }, [schoolYear, schoolYears]);

  useEffect(() => {
    if (!section || !schoolYear) return;
    getGeneralAverage(section, quarter === "all" ? undefined : quarter)
      .then(setAverages)
      .catch(console.error);
  }, [section, quarter, schoolYear]);

  const ranked = averages
    .sort((a, b) => b.generalAverage - a.generalAverage)
    .map(a => ({
      ...a,
      avg: a.generalAverage,
      letter: letterGrade(a.generalAverage)
    }));

  const classAvg = averages.length > 0
    ? averages.reduce((sum, s) => sum + s.generalAverage, 0) / averages.length
    : 0;
  const passing = averages.filter((s) => s.generalAverage >= 75).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }}
        onLogout={() => { }}
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
          <span className="text-xs font-semibold text-slate-600">General Average</span>
        </header>

        <div className="p-6 space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-800">General Average</h1>
              <p className="text-sm text-slate-400 mt-0.5">Auto-computed from all quarterly grades.</p>
            </div>
            <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
              {(["section", "student"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${viewMode === m ? "bg-teal-600 text-white" : "text-slate-500 hover:bg-slate-50"
                    }`}
                >
                  By {m}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Select value={schoolYear} onValueChange={setSchoolYear}>
              <SelectTrigger className="h-8 w-40 text-xs border-slate-200 bg-white"><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>
                {schoolYears.map(y => <SelectItem key={y.id} value={y.label}>{y.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger className="h-8 w-36 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                {sections.map((s) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={quarter} onValueChange={setQuarter}>
              <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quarters</SelectItem>
                {[1, 2, 3, 4].map((q) => (
                  <SelectItem key={q} value={String(q)}>Quarter {q}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Class Average", value: classAvg.toFixed(2), color: "text-teal-700", bg: "bg-teal-50" },
              { label: "Highest", value: ranked[0]?.avg?.toFixed(2) ?? "—", color: "text-emerald-700", bg: "bg-emerald-50" },
              { label: "Lowest", value: ranked[ranked.length - 1]?.avg?.toFixed(2) ?? "—", color: "text-red-600", bg: "bg-red-50" },
              { label: "Passing", value: `${passing}/${ranked.length}`, color: "text-slate-700", bg: "bg-white" },
            ].map(({ label, value, color, bg }) => (
              <Card key={label} className={`border-0 shadow-sm ${bg}`}>
                <CardContent className="px-4 py-3.5 text-center">
                  <p className={`text-2xl font-black ${color}`}>{value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ranking table */}
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <p className="text-sm font-black text-slate-700">{section} — General Average Ranking</p>
              <Badge className="bg-teal-100 text-teal-700 border-0 text-[10px]">{ranked.length} students</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Rank</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Student</th>
                    {subjects.map((s) => (
                      <th key={s.code} className="px-2 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {s.code}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Average</th>
                    <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Letter</th>
                  </tr>
                </thead>
                <tbody>
                  {ranked.map((s, rank) => (
                    <tr
                      key={s.studentId}
                      className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${rank === 0 ? "bg-amber-50/50" :
                        rank === 1 ? "bg-slate-50/80" : ""
                        }`}
                    >
                      <td className="px-5 py-3">
                        <span className={`text-xs font-black ${rank === 0 ? "text-amber-600" :
                          rank === 1 ? "text-slate-500" :
                            rank === 2 ? "text-amber-800" : "text-slate-400"
                          }`}>
                          #{rank + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-slate-100 text-slate-600 text-[9px] font-bold">
                              {s.fullName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-xs font-semibold text-slate-700">{s.fullName}</p>
                        </div>
                      </td>
                      {subjects.map((subj) => (
                        <td key={subj.code} className="px-2 py-3 text-center">
                          <span className="text-xs text-slate-300">—</span>
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm font-black ${gradeColor(s.avg)}`}>
                          {s.avg?.toFixed(2) ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-bold bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded">
                          {s.letter}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}