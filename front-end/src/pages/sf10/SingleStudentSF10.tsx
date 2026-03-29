import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Printer, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SF10FrontPage, SF10BackPage } from "./SF10Preview";
import { ROUTES } from "@/routes";
import { getStudentDetails, getSubjects } from "@/services/api";
import { useHeader } from "@/contexts/HeaderContext";
import type { Student, Subject } from "@/services/api";

export default function SingleStudentSF10() {
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const navigate = useNavigate();
  const [page, setPage] = useState<"front" | "back">("front");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const stuData = student
    ? { name: `${student.lastName}, ${student.firstName}`, lrn: student.lrn }
    : { name: "Loading...", lrn: "" };

  useHeader(student ? {
    title: "SF10 Preview",
    subtitle: `${stuData.name} · LRN: ${stuData.lrn}`,
    breadcrumbs: [
      { label: "SF10", onClick: () => navigate(ROUTES.sf10.root) },
      { label: "Preview" },
    ],
    actions: (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
          <Printer className="w-3.5 h-3.5" /> Print
        </Button>
        <Button size="sm" className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800">
          <FileDown className="w-3.5 h-3.5" /> Export PDF
        </Button>
      </div>
    )
  } : undefined);

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
      <div className="flex-1 flex items-center justify-center p-20">
        <p className="text-slate-400 animate-pulse font-semibold">Loading SF10...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Page toggle */}
        <div className="flex justify-end">
          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-slate-100">
            {(["front", "back"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${page === p ? "bg-teal-600 text-white shadow-md shadow-teal-100" : "text-slate-500 hover:bg-slate-50"
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
              : <SF10BackPage student={stuData} />
            }
          </div>
        </div>
      </div>
  );
}
