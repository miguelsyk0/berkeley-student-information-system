import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2, AlertCircle, ClipboardList, BarChart2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { GRADE_COLORS } from "@/utils/gradeUtils";
import { ROUTES } from "@/routes";
import { getSchoolYears, getEncodingProgress } from "@/services/api";
import { useSetHeader } from "@/contexts/HeaderContext";
import type { SchoolYear } from "@/services/api";

export default function GradeEncodingHome() {
  const navigate = useNavigate();
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [schoolYearId, setSchoolYearId] = useState<string>("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [quarter, setQuarter] = useState("1");
  const [sectionData, setSectionData] = useState<any[]>([]);


  useEffect(() => {
    async function init() {
      try {
        const years = await getSchoolYears();
        setSchoolYears(years);
        const activeYear = years.find((y) => y.isActive) || years[0];
        if (activeYear) setSchoolYearId(String(activeYear.id));
      } catch (error) {
        console.error("Failed to load school years", error);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!schoolYearId || !quarter) return;
    getEncodingProgress(Number(schoolYearId), Number(quarter))
      .then((data) => {
        setSectionData(data.map(s => ({
          ...s,
          complete: s.encoded === s.total && s.total > 0
        })));
      })
      .catch(console.error);
  }, [schoolYearId, quarter]);

  const filtered = useMemo(() => {
    return sectionData.filter(
      (s) => gradeFilter === "all" || String(s.gradeLevel) === gradeFilter
    );
  }, [sectionData, gradeFilter]);

  const completeCount = filtered.filter((s) => s.complete).length;
  const currentYearLabel = schoolYears.find(y => String(y.id) === schoolYearId)?.label || "---";

  useSetHeader({
    breadcrumbs: [
      { label: "Grade Encoding" },
      { label: "Home" },
    ],
    actions: (
      <Button
        size="sm" variant="outline"
        className="h-8 text-xs gap-1.5"
        onClick={() => navigate(ROUTES.grades.generalAverage)}
      >
        <BarChart2 className="w-3.5 h-3.5" /> General Average
      </Button>
    )
  });

  return (
    <div className="p-6 space-y-5">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Grade Encoding</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Encode and manage quarterly grades for all sections.
          </p>
        </div>

        {/* Banner */}
        <div className="bg-teal-600 rounded-2xl px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-1">
              Active Period
            </p>
            <p className="text-white text-lg font-black">
              S.Y. {currentYearLabel} — Quarter {quarter}
            </p>
            <p className="text-teal-200 text-sm mt-0.5">
              {completeCount}/{sectionData.length} sections fully encoded
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-teal-200 text-xs">Completion</p>
              <p className="text-white text-2xl font-black">
                {sectionData.length > 0
                  ? Math.round((completeCount / sectionData.length) * 100)
                  : 0}%
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-teal-400 border-opacity-40 flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={schoolYearId} onValueChange={setSchoolYearId}>
            <SelectTrigger className="h-8 w-40 text-xs border-slate-200 bg-white">
              <SelectValue placeholder="School Year" />
            </SelectTrigger>
            <SelectContent>
              {schoolYears.map((y) => (
                <SelectItem key={y.id} value={String(y.id)}>{y.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={quarter} onValueChange={setQuarter}>
            <SelectTrigger className="h-8 w-28 text-xs border-slate-200 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((q) => (
                <SelectItem key={q} value={String(q)}>Quarter {q}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="h-8 w-32 text-xs border-slate-200 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {[7, 8, 9, 10].map((g) => (
                <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {filtered.map((sec) => (
            <Card
              key={sec.id}
              className="border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              onClick={() => navigate(`${ROUTES.grades.classSheet(sec.name)}?gradeLevel=${sec.gradeLevel}&quarter=${quarter}&schoolYearId=${schoolYearId}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[sec.gradeLevel]}`}>
                      Grade {sec.gradeLevel}
                    </span>
                    <p className="text-sm font-black text-slate-800 mt-1.5">{sec.name}</p>
                  </div>
                  {sec.complete
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    : <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  }
                </div>
                <Progress value={(sec.encoded / sec.total) * 100} className="h-1.5 mb-2" />
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">
                    {sec.encoded}/{sec.total} students encoded
                  </p>
                  <Badge className={`text-[9px] h-4 px-1.5 border-0 ${sec.complete
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                    }`}>
                    {sec.complete ? "Complete" : "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

  );
}
