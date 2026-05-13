import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Printer, FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SF10FrontPage, SF10BackPage, compileSF10Records } from "./SF10Preview";
import type { ScholasticRecord } from "./SF10Preview";
import { ROUTES } from "@/routes";
import { getStudentDetails, getSubjects, getSF10Data } from "@/services/api";
import { useSetHeader } from "@/contexts/HeaderContext";
import type { Student, Subject } from "@/services/api";

// ── Component ──────────────────────────────────────────────────────────────────

export default function SingleStudentSF10() {
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const navigate = useNavigate();
  const [page, setPage] = useState<"front" | "back">("front");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [records, setRecords] = useState<ScholasticRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const stuData = student
    ? { name: `${student.lastName}, ${student.firstName}`, lrn: student.lrn, middleName: student.middleName }
    : { name: "Loading...", lrn: "", middleName: "" };

  const [isExporting, setIsExporting] = useState(false);

  function handlePrint() {
    window.print();
  }

  async function handleExportPDF() {
    setIsExporting(true);
    try {
      const { toJpeg } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const printContainer = document.getElementById("sf10-print-both");
      if (!printContainer) throw new Error("Print container not found");

      // Temporarily bring the hidden container into flow so html-to-image can capture it perfectly
      printContainer.style.position = "absolute";
      printContainer.style.left = "0";
      printContainer.style.top = "0";
      printContainer.style.zIndex = "-50";
      // Explicitly set dimensions (816px wide = 8.5in at 96dpi, 1248px tall = 13in at 96dpi)
      // This helps html-to-image lock in the aspect ratio

      const frontContainer = printContainer.children[0] as HTMLElement;
      const backContainer = printContainer.children[1] as HTMLElement;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: [8.5, 13] // Exact Philippine Legal F4 size
      });

      const exportOpts = {
        quality: 1.0,
        pixelRatio: 2, // Retained high resolution
        backgroundColor: "#ffffff",
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          width: "816px",
          height: "1248px"
        }
      };

      // Render Front
      const dataUrlFront = await toJpeg(frontContainer, exportOpts);
      pdf.addImage(dataUrlFront, "JPEG", 0, 0, 8.5, 13);

      // Render Back
      pdf.addPage();
      const dataUrlBack = await toJpeg(backContainer, exportOpts);
      pdf.addImage(dataUrlBack, "JPEG", 0, 0, 8.5, 13);

      pdf.save(`SF10_${stuData.name.replace(/[^a-z0-9]/gi, "_")}.pdf`);
    } catch (err) {
      console.error("PDF Export failed:", err);
      alert("Failed to export PDF.");
    } finally {
      // Revert visibility hack
      const printContainer = document.getElementById("sf10-print-both");
      if (printContainer) {
        printContainer.style.left = "-9999px";
      }
      setIsExporting(false);
    }
  }

  useSetHeader({
    title: "SF10 Preview",
    subtitle: `${stuData.name} · LRN: ${stuData.lrn}`,
    breadcrumbs: [
      { label: "SF10", onClick: () => navigate(ROUTES.sf10.root) },
      { label: "Preview" },
    ],
    actions: (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs gap-1.5"
          onClick={handlePrint}
          disabled={isExporting}
        >
          <Printer className="w-3.5 h-3.5" /> Print (Native)
        </Button>
        <Button
          size="sm"
          className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800"
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
          {isExporting ? "Generating..." : "Download PDF"}
        </Button>

      </div>
    )
  });

  useEffect(() => {
    if (!studentId) return;
    async function load() {
      try {
        const [stu, subjs, sf10] = await Promise.all([
          getStudentDetails(Number(studentId)),
          getSubjects(),
          getSF10Data(Number(studentId))
        ]);
        setStudent(stu);
        setSubjects(subjs);
        setRecords(compileSF10Records(sf10));
      } catch (err) {
        console.error("[SF10] Failed to load student", err);
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
    <>
      {/*
        ── Print styles ──
        The sidebar and header already have print:hidden (set in MainLayout/sidebar).
        The outer layout has print:block and print:overflow-visible (set in MainLayout).

        Strategy:
          • .sf10-screen-only  → visible on screen, hidden during print
          • #sf10-print-both   → off-screen on screen (left: -9999px),
                                  brought back to normal flow during print
      */}
      <style>{`
        @media print {
          @page {
            size: 8.5in 13in portrait;
            margin: 0;
          }

          /* Remove body/html scroll constraints */
          html, body {
            height: auto !important;
            overflow: visible !important;
            margin: 0 !important;
          }

          /* Hide the on-screen toggle + preview */
          .sf10-screen-only {
            display: none !important;
          }

          /* Bring the off-screen print div back into normal flow */
          #sf10-print-both {
            position: static !important;
            left: auto !important;
            top: auto !important;
            width: auto !important;
            height: auto !important;
            overflow: visible !important;
            pointer-events: auto !important;
            clip: auto !important;
          }

          /* Remove rounded corners / shadows from page wrappers */
          #sf10-print-both .shadow-2xl,
          #sf10-print-both .rounded-lg {
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
          }

          /* Page break between front and back */
          .sf10-page-break {
            break-before: page !important;
            page-break-before: always !important;
          }
        }
      `}</style>

      {/* ── On-screen: page toggle + single-page preview ── */}
      <div className="sf10-screen-only p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-end">
          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-slate-100">
            {(["front", "back"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${page === p
                    ? "bg-teal-600 text-white shadow-md shadow-teal-100"
                    : "text-slate-500 hover:bg-slate-50"
                  }`}
              >
                {p === "front" ? "Front Page" : "Back Page"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center pb-6">
          <div className="shadow-2xl rounded-lg overflow-hidden">
            {page === "front"
              ? <SF10FrontPage student={stuData} subjects={subjects} records={records} />
              : <SF10BackPage student={stuData} subjects={subjects} records={records} />
            }
          </div>
        </div>
      </div>

      {/*
        ── Off-screen print area: always in DOM, both pages ──
        Positioned far left so it's invisible on screen but still rendered.
        During @media print the CSS above pulls it back into normal flow.
      */}
      <div
        id="sf10-print-both"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          overflow: "hidden",
          width: "816px",
          height: "1px",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        {/* Page 1 — Front */}
        <SF10FrontPage student={stuData} subjects={subjects} records={records} />

        {/* Page 2 — Back */}
        <div className="sf10-page-break">
          <SF10BackPage student={stuData} subjects={subjects} records={records} />
        </div>
      </div>
    </>
  );
}
