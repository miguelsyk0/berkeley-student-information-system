import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Printer, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import { SF10FrontPage, SF10BackPage } from "./SF10Preview";
import { ROUTES } from "@/routes";
import { getStudentDetails, getSubjects } from "@/services/api";
import type { Student, Subject } from "@/services/api";

export default function SingleStudentSF10() {
  const navigate  = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  const [page, setPage] = useState<"front" | "back">("front");
  const [student, setStudent] = useState<Student | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    async function load() {
      try {
        const [stu, subjs] = await Promise.all([
          getStudentDetails(Number(studentId)),
          getSubjects(),
        ]);
        setStudent(stu);
        setSubjects(subjs);
      } catch (err) {
        console.error("Failed to load student", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center">
        <p className="text-slate-400 animate-pulse font-semibold">Loading SF10...</p>
      </div>
    );
  }

  const stuData = student
    ? { name: `${student.lastName}, ${student.firstName}`, lrn: student.lrn }
    : { name: "Unknown Student", lrn: "" };

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
          <span className="text-xs font-semibold text-slate-600 truncate max-w-48">
            {stuData.name}
          </span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              <Printer className="w-3.5 h-3.5" /> Print
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800">
              <FileDown className="w-3.5 h-3.5" /> Export PDF
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-4">
          {/* Title + page toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-800">SF10 Preview</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {stuData.name} · LRN: {stuData.lrn}
              </p>
            </div>
            <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
              {(["front", "back"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    page === p ? "bg-teal-600 text-white" : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {p === "front" ? "Front Page" : "Back Page"}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex justify-center pb-6">
            <div className="shadow-2xl rounded-lg overflow-hidden">
              {page === "front"
                ? <SF10FrontPage student={stuData} subjects={subjects} />
                : <SF10BackPage  student={stuData} />
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}