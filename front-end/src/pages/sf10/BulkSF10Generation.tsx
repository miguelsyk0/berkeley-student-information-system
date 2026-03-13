import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, FileDown, Download, CheckCircle2, RefreshCw, Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/sidebar";
import { SECTIONS, MOCK_STUDENTS } from "../encoding/MockData";
import { ROUTES } from "@/routes";

export default function BulkSF10Generation() {
  const navigate = useNavigate();

  const [section,    setSection]    = useState("Diligence");
  const [gradeLevel, setGradeLevel] = useState("8");
  const [schoolYear, setSchoolYear] = useState("2025-2026");
  const [generating, setGenerating] = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [done,       setDone]       = useState(false);
  const [currentStudent, setCurrentStudent] = useState("");

  function startGeneration() {
    setGenerating(true);
    setProgress(0);
    setDone(false);

    const names = MOCK_STUDENTS.map((s) => s.name);
    let i = 0;

    const interval = setInterval(() => {
      i++;
      setProgress(Math.round((i / names.length) * 100));
      setCurrentStudent(names[i - 1] ?? "");
      if (i >= names.length) {
        clearInterval(interval);
        setTimeout(() => {
          setGenerating(false);
          setDone(true);
        }, 500);
      }
    }, 300);
  }

  function reset() {
    setDone(false);
    setProgress(0);
    setCurrentStudent("");
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        user={{ name: "R. Dela Cruz", role: "Registrar", initials: "RD" }}
        onLogout={() => {}}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-6 gap-2 sticky top-0 z-10">
          <button
            onClick={() => navigate(ROUTES.sf10.root)}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            SF10
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-xs font-semibold text-slate-600">Bulk Generation</span>
        </header>

        <div className="p-6 max-w-2xl space-y-5">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Bulk SF10 Generation</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Generate SF10 PDFs for all students in a section and download as a ZIP file.
            </p>
          </div>

          {/* Config card */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pt-5 pb-0 px-6">
              <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-500" />
                Select Section & Period
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">School Year</p>
                <Select value={schoolYear} onValueChange={setSchoolYear} disabled={generating}>
                  <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-2026">2025–2026</SelectItem>
                    <SelectItem value="2024-2025">2024–2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Grade Level</p>
                <Select value={gradeLevel} onValueChange={setGradeLevel} disabled={generating}>
                  <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[7, 8, 9, 10].map((g) => (
                      <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Section</p>
                <Select value={section} onValueChange={setSection} disabled={generating}>
                  <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Student preview list */}
          {!generating && !done && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-black text-slate-700">Students to Generate</p>
                  <Badge className="bg-teal-100 text-teal-700 border-0 text-[10px]">
                    {MOCK_STUDENTS.length} students
                  </Badge>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {MOCK_STUDENTS.map((s, i) => (
                    <div key={s.studentId} className="flex items-center gap-2.5 py-1">
                      <span className="text-[10px] text-slate-400 w-5 text-right">{i + 1}.</span>
                      <p className="text-xs font-semibold text-slate-700">{s.name}</p>
                      <span className="text-[10px] font-mono text-slate-400 ml-auto">{s.lrn}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress screen */}
          {generating && (
            <Card className="border-0 shadow-sm">
              <CardContent className="px-6 py-8 flex flex-col items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                  <RefreshCw className="w-7 h-7 text-teal-600 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-700">Generating SF10 PDFs...</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {Math.round((progress / 100) * MOCK_STUDENTS.length)}/{MOCK_STUDENTS.length} students complete
                  </p>
                  {currentStudent && (
                    <p className="text-xs text-teal-600 font-semibold mt-1">
                      Processing: {currentStudent}
                    </p>
                  )}
                </div>
                <div className="w-full max-w-xs space-y-1.5">
                  <Progress value={progress} className="h-2.5" />
                  <p className="text-center text-xs text-slate-500 font-semibold">{progress}%</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Done state */}
          {done && (
            <Card className="border-0 shadow-sm bg-emerald-50 border border-emerald-100">
              <CardContent className="px-6 py-6 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-emerald-800">Generation Complete!</p>
                  <p className="text-xs text-emerald-600 mt-1">
                    {MOCK_STUDENTS.length} SF10 PDFs ready for download.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-9 px-5 text-sm font-semibold gap-2 bg-teal-600 hover:bg-teal-800"
                  >
                    <Download className="w-4 h-4" /> Download ZIP
                  </Button>
                  <Button size="sm" variant="outline" className="h-9 text-xs" onClick={reset}>
                    Generate Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generate button */}
          {!generating && !done && (
            <Button
              size="sm"
              className="h-9 px-6 text-sm font-semibold gap-2 bg-teal-600 hover:bg-teal-800"
              onClick={startGeneration}
            >
              <FileDown className="w-4 h-4" /> Generate {MOCK_STUDENTS.length} SF10 PDFs
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}