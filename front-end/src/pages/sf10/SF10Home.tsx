import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, Search, Download, FileText, Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from "@/components/sidebar";
import { GRADE_COLORS } from "@/utils/gradeUtils";
import { ROUTES } from "@/routes";
import { getStudents, getSections } from "@/services/api";
import type { Student, Section } from "@/services/api";

export default function SF10Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const [stus, secs] = await Promise.all([getStudents(), getSections()]);
        setStudents(stus);
        setSections(secs);
      } catch (err) {
        console.error("Init failed", err);
      }
    }
    init();
  }, []);

  const filtered = students.filter(
    (s) =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.lrn.includes(search)
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }}
        onLogout={() => {}}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <span className="text-xs text-slate-400">SF10 Generation</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">Home</span>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
              onClick={() => navigate(ROUTES.sf10.bulk)}
            >
              <Download className="w-3.5 h-3.5" /> Bulk Generation
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-5">
          <div>
            <h1 className="text-2xl font-black text-slate-800">SF10 Generation</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Generate and export Permanent Records (SF10) for individual students or entire sections.
            </p>
          </div>

          {/* Bulk CTA banner */}
          <div className="bg-teal-600 rounded-2xl px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-1">Bulk Generation</p>
              <p className="text-white text-lg font-black">Generate SF10 for an Entire Section</p>
              <p className="text-teal-200 text-sm mt-0.5">Select a section and export all SF10s as a ZIP of PDFs.</p>
            </div>
            <Button
              size="sm"
              className="h-9 px-5 text-sm font-semibold gap-2 bg-white text-teal-800 hover:bg-teal-50 flex-shrink-0"
              onClick={() => navigate(ROUTES.sf10.bulk)}
            >
              <Download className="w-4 h-4" /> Start Bulk Export
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Individual student search */}
            <div className="space-y-3">
              <p className="text-sm font-black text-slate-700">Individual Student SF10</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  placeholder="Search by name or LRN..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm border-slate-200 bg-white"
                />
              </div>
              <Card className="border-0 shadow-sm overflow-hidden">
                {filtered.slice(0, 8).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer group"
                    onClick={() => navigate(ROUTES.sf10.student(s.id))}
                  >
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-teal-100 text-teal-800 text-xs font-bold">
                        {s.lastName[0]}{s.firstName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{s.lastName}, {s.firstName}</p>
                      <p className="text-[11px] font-mono text-slate-400">{s.lrn}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${GRADE_COLORS[7]}`}>G7</span>
                      <Button
                        size="sm" variant="outline"
                        className="h-6 text-[11px] px-2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-3 h-3" /> Preview
                      </Button>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Section quick-access */}
            <div className="space-y-3">
              <p className="text-sm font-black text-slate-700">Sections</p>
              <div className="grid grid-cols-2 gap-2">
                {sections.map((sec) => {
                  const gl = sec.gradeLevel;
                  return (
                    <Card
                      key={sec.id}
                      className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
                      onClick={() => navigate(ROUTES.sf10.bulk)}
                    >
                      <CardContent className="px-4 py-3 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${GRADE_COLORS[gl] || "bg-slate-100 text-slate-600"}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-700">{sec.name}</p>
                          <p className="text-[10px] text-slate-400">Grade {gl} · {sec.enrolledCount || 0} students</p>
                        </div>
                        <Download className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}