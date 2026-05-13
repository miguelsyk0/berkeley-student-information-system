import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2, RefreshCw, Users, Download, FileDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/routes";
import { getSections, getSchoolYears, getStudents, getStudentDetails, getSubjects, getSF10Data } from "@/services/api";
import { useSetHeader } from "@/contexts/HeaderContext";
import type { Section, SchoolYear, Student, Subject } from "@/services/api";
import { SF10FrontPage, SF10BackPage, compileSF10Records } from "./SF10Preview";
import type { ScholasticRecord } from "./SF10Preview";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function BulkSF10Generation() {
  const navigate = useNavigate();

  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);

  const [section, setSection] = useState("Diligence");
  const [gradeLevel, setGradeLevel] = useState("8");
  const [schoolYear, setSchoolYear] = useState("");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [currentStudentName, setCurrentStudentName] = useState("");
  
  // Used to supply the hidden renderer with data
  const [renderStudent, setRenderStudent] = useState<Student | null>(null);
  const [renderRecords, setRenderRecords] = useState<ScholasticRecord[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  useEffect(() => {
    getSchoolYears().then((years) => {
      setSchoolYears(years);
      const active = years.find(y => y.isActive) || years[0];
      if (active) setSchoolYear(active.label);
    });
    getSubjects().then(setAllSubjects);
  }, []);

  useEffect(() => {
    if (!schoolYear) return;
    const yId = schoolYears.find(y => y.label === schoolYear)?.id;
    if (yId) getSections(yId).then(setSections);
  }, [schoolYear, schoolYears]);

  useEffect(() => {
    if (!section) return;
    getStudents({ section }).then(setStudents);
  }, [section]);

  async function startGeneration() {
    if (students.length === 0) return;
    setGenerating(true);
    setProgress(0);
    setDone(false);
    setZipBlob(null);

    try {
      const { toJpeg } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const zip = new JSZip();

      for (let i = 0; i < students.length; i++) {
        const s = students[i];
        setCurrentStudentName(`${s.lastName}, ${s.firstName}`);
        setProgress(Math.round((i / students.length) * 100));

        // Fetch deep details for the student to include grades
        const [details, sf10] = await Promise.all([
          getStudentDetails(Number(s.id)),
          getSF10Data(Number(s.id))
        ]);
        setRenderStudent(details);
        setRenderRecords(compileSF10Records(sf10));

        // Wait for React to mount and style the hidden DOM fully (600ms is usually generous)
        await new Promise(r => setTimeout(r, 600));

        const printContainer = document.getElementById("sf10-bulk-print");
        if (!printContainer) throw new Error("Print container missing");
        
        const frontContainer = printContainer.children[0] as HTMLElement;
        const backContainer = printContainer.children[1] as HTMLElement;

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "in",
          format: [8.5, 13]
        });

        const exportOpts = {
          quality: 1.0,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
          style: {
            transform: "scale(1)",
            transformOrigin: "top left",
            width: "816px",
            height: "1248px"
          }
        };

        const dataUrlFront = await toJpeg(frontContainer, exportOpts);
        pdf.addImage(dataUrlFront, "JPEG", 0, 0, 8.5, 13);

        pdf.addPage();
        const dataUrlBack = await toJpeg(backContainer, exportOpts);
        pdf.addImage(dataUrlBack, "JPEG", 0, 0, 8.5, 13);

        const pdfBlob = pdf.output("blob");
        // Ensure filenames are safe
        const safeName = `${s.lastName}_${s.firstName}`.replace(/[^a-z0-9_]/gi, "");
        zip.file(`SF10_${safeName}_${s.lrn}.pdf`, pdfBlob);
      }

      setProgress(100);
      setCurrentStudentName("Zipping files...");

      const finalBlob = await zip.generateAsync({ type: "blob" });
      setZipBlob(finalBlob);
      setDone(true);
      
      // Auto-trigger download
      saveAs(finalBlob, `SF10_${section}_${schoolYear}.zip`);

    } catch (err) {
      console.error(err);
      alert("An error occurred during bulk generation. Check console.");
    } finally {
      setGenerating(false);
      setRenderStudent(null);
    }
  }

  function handleDownloadZip() {
    if (zipBlob) {
      saveAs(zipBlob, `SF10_${section}_${schoolYear}.zip`);
    }
  }

  function reset() {
    setDone(false);
    setProgress(0);
    setCurrentStudentName("");
    setZipBlob(null);
  }

  useSetHeader({
    title: "Bulk SF10 Generation",
    subtitle: "Generate SF10 PDFs for all students in a section",
    breadcrumbs: [
      { label: "SF10", onClick: () => navigate(ROUTES.sf10.root) },
      { label: "Bulk Generation" },
    ],
  });

  const renderStuData = renderStudent
    ? { name: `${renderStudent.lastName}, ${renderStudent.firstName}`, lrn: renderStudent.lrn }
    : { name: "", lrn: "" };

  return (
    <div className="p-6 max-w-2xl space-y-5">
      {/* 
        ── Hidden Background Renderer ──
        Renders the active student off-screen for html-to-image picking 
      */}
      <div
        id="sf10-bulk-print"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          overflow: "hidden",
          width: "816px",
          height: "1px",
          pointerEvents: "none",
          zIndex: -50
        }}
        aria-hidden="true"
      >
        <SF10FrontPage student={renderStuData} subjects={allSubjects} records={renderRecords} />
        <div className="sf10-page-break">
          <SF10BackPage student={renderStuData} subjects={allSubjects} records={renderRecords} />
        </div>
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
            <Select value={schoolYear} onValueChange={setSchoolYear} disabled={generating || done}>
              <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                {schoolYears.map(y => (
                  <SelectItem key={y.id} value={y.label}>{y.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Grade Level</p>
            <Select value={gradeLevel} onValueChange={setGradeLevel} disabled={generating || done}>
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
            <Select value={section} onValueChange={setSection} disabled={generating || done}>
              <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                {sections.map((s) => (
                  <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
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
                {students.length} students
              </Badge>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {students.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2.5 py-1">
                  <span className="text-[10px] text-slate-400 w-5 text-right">{i + 1}.</span>
                  <p className="text-xs font-semibold text-slate-700">{s.lastName}, {s.firstName}</p>
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
                {Math.round((progress / 100) * students.length)}/{students.length} students complete
              </p>
              {currentStudentName && (
                <p className="text-xs text-teal-600 font-semibold mt-1">
                  Processing: {currentStudentName}
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
                {students.length} SF10 PDFs packed into a ZIP archive.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleDownloadZip}
                disabled={!zipBlob}
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
          <FileDown className="w-4 h-4" /> Generate {students.length} SF10 PDFs
        </Button>
      )}
    </div>
  );
}