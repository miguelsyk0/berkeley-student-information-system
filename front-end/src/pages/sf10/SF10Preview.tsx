import { useRef } from "react";
import { SUBJECTS, QUARTERLY_MOCK, computeAvg } from "../encoding/MockData";
import type { StudentGrade } from "../types";

// ─── PDF Export ────────────────────────────────────────────────────────────────

async function exportToPDF(elementId: string, filename: string) {
  const { default: html2canvas } = await import("html2canvas");
  const { default: jsPDF } = await import("jspdf");

  const el = document.getElementById(elementId);
  if (!el) return;

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "legal", // SF10 is typically on legal size paper
  });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const imgW = canvas.width;
  const imgH = canvas.height;
  const ratio = imgW / imgH;

  const pdfW = pageW;
  const pdfH = pdfW / ratio;

  // If content is taller than one page, split across pages
  if (pdfH <= pageH) {
    pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
  } else {
    let yOffset = 0;
    const sliceH = (pageH / pdfH) * imgH;

    while (yOffset < imgH) {
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = imgW;
      sliceCanvas.height = Math.min(sliceH, imgH - yOffset);
      const ctx = sliceCanvas.getContext("2d")!;
      ctx.drawImage(canvas, 0, -yOffset, imgW, imgH);
      const sliceData = sliceCanvas.toDataURL("image/png");
      const slicePdfH = (sliceCanvas.height / imgH) * pdfH;

      if (yOffset > 0) pdf.addPage();
      pdf.addImage(sliceData, "PNG", 0, 0, pdfW, slicePdfH);

      yOffset += sliceH;
    }
  }

  pdf.save(filename);
}

// ─── Shared helpers ────────────────────────────────────────────────────────────

const LEARNING_AREAS = [
  { code: "FIL",  name: "Filipino",                           indent: false },
  { code: "ENG",  name: "English",                            indent: false },
  { code: "MATH", name: "Mathematics",                        indent: false },
  { code: "SCI",  name: "Science",                            indent: false },
  { code: "AP",   name: "Araling Panlipunan (AP)",            indent: false },
  { code: "ESP",  name: "Edukasyon sa Pagpapakatao (EsP)",    indent: false },
  { code: "TLE",  name: "Technology and Livelihood Education (TLE)", indent: false },
  { code: "MAPEH",name: "MAPEH",                              indent: false, isGroup: true },
  { code: "MUS",  name: "Music",                              indent: true  },
  { code: "ARTS", name: "Arts",                               indent: true  },
  { code: "PE",   name: "Physical Education",                 indent: true  },
  { code: "HLT",  name: "Health",                             indent: true  },
];

// Border-collapse table styles as inline style objects (Tailwind can conflict
// with border-collapse in print; we use a mix of Tailwind + inline)
const TH = "border border-black px-1 py-0.5 text-center text-[9px] font-bold";
const TD = "border border-black px-1 py-0.5 text-center text-[9px]";
const TDL = "border border-black px-1 py-0.5 text-left text-[9px]";

interface GradeEntry {
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
}

interface ScholasticRecord {
  school: string;
  schoolId: string;
  district: string;
  division: string;
  region: string;
  gradeLevel: number;
  section: string;
  schoolYear: string;
  adviser: string;
  grades: Record<string, GradeEntry>;
}

function getRemarks(final: number | null): string {
  if (final === null) return "";
  return final >= 75 ? "PASSED" : "FAILED";
}

function calcFinal(entry: GradeEntry | undefined): number | null {
  if (!entry) return null;
  const vals = [entry.q1, entry.q2, entry.q3, entry.q4].filter(
    (v): v is number => v != null
  );
  if (vals.length < 2) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function calcGeneralAvg(grades: Record<string, GradeEntry>): number | null {
  // Use only main subjects (not MAPEH sub-components) for gen avg
  const mainCodes = ["FIL","ENG","MATH","SCI","AP","ESP","TLE","MAPEH"];
  const finals: number[] = [];
  for (const code of mainCodes) {
    if (code === "MAPEH") {
      // MAPEH avg = avg of Music, Arts, PE, Health
      const mapehSubs = ["MUS","ARTS","PE","HLT"];
      const mapehVals = mapehSubs.map((c) => calcFinal(grades[c])).filter((v): v is number => v != null);
      if (mapehVals.length > 0) finals.push(Math.round(mapehVals.reduce((a, b) => a + b) / mapehVals.length));
    } else {
      const f = calcFinal(grades[code]);
      if (f != null) finals.push(f);
    }
  }
  if (finals.length === 0) return null;
  return Math.round((finals.reduce((a, b) => a + b, 0) / finals.length) * 100) / 100;
}

// ─── Grade Table ───────────────────────────────────────────────────────────────

function GradeTable({ record }: { record: ScholasticRecord }) {
  const genAvg = calcGeneralAvg(record.grades);

  return (
    <table className="w-full text-[9px]" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th className={`${TH} text-left w-[44%]`} rowSpan={2}>LEARNING AREAS</th>
          <th className={TH} colSpan={4}>Quarterly Rating</th>
          <th className={TH}>FINAL</th>
          <th className={TH}>REMARKS</th>
        </tr>
        <tr>
          {[1, 2, 3, 4].map((q) => (
            <th key={q} className={TH}>{q}</th>
          ))}
          <th className={TH}>RATING</th>
          <th className={TH}></th>
        </tr>
      </thead>
      <tbody>
        {LEARNING_AREAS.map((area) => {
          const entry = record.grades[area.code];

          if (area.isGroup) {
            return (
              <tr key={area.code}>
                <td className={TDL}>{area.name}</td>
                {[null, null, null, null].map((_, i) => (
                  <td key={i} className={TD}></td>
                ))}
                <td className={TD}></td>
                <td className={TD}></td>
              </tr>
            );
          }

          const q1 = entry?.q1 ?? null;
          const q2 = entry?.q2 ?? null;
          const q3 = entry?.q3 ?? null;
          const q4 = entry?.q4 ?? null;
          const final = calcFinal(entry);

          return (
            <tr key={area.code}>
              <td className={`${TDL} ${area.indent ? "pl-5" : ""}`}>
                {area.indent ? `    ${area.name}` : area.name}
              </td>
              <td className={TD}>{q1 ?? ""}</td>
              <td className={TD}>{q2 ?? ""}</td>
              <td className={TD}>{q3 ?? ""}</td>
              <td className={TD}>{q4 ?? ""}</td>
              <td className={`${TD} font-bold`}>{final ?? ""}</td>
              <td className={TD}>{final != null ? getRemarks(final) : ""}</td>
            </tr>
          );
        })}
        {/* General Average row */}
        <tr className="font-bold">
          <td className={`${TDL} font-bold`} colSpan={1}></td>
          <td className={TH} colSpan={4}>General Average</td>
          <td className={`${TD} font-bold`}>{genAvg?.toFixed(2) ?? ""}</td>
          <td className={TD}>{genAvg != null ? getRemarks(genAvg >= 75 ? 75 : 74) : ""}</td>
        </tr>
      </tbody>
    </table>
  );
}

// ─── Remedial Classes Table ────────────────────────────────────────────────────

function RemedialTable() {
  return (
    <>
      <div className="flex items-baseline gap-1 text-[9px] mt-1">
        <span className="font-bold">Remedial Classes</span>
        <span className="ml-2">Conducted from (mm/dd/yyyy)</span>
        <span className="border-b border-black inline-block w-36 mx-1"></span>
        <span>to (mm/dd/yyyy)</span>
        <span className="border-b border-black inline-block w-36 mx-1"></span>
      </div>
      <table className="w-full text-[9px] mt-0.5" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th className={`${TH} text-left`}>Learning Areas</th>
            <th className={TH}>Final Rating</th>
            <th className={TH}>Remedial Class Mark</th>
            <th className={TH}>Recomputed Final Grade</th>
            <th className={TH}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((i) => (
            <tr key={i}>
              <td className={`${TDL} h-4`}></td>
              <td className={TD}></td>
              <td className={TD}></td>
              <td className={TD}></td>
              <td className={TD}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// ─── Scholastic Block (school info + grade table + remedial) ───────────────────

function ScholasticBlock({ record }: { record: ScholasticRecord }) {
  return (
    <div className="mb-3">
      <p className="text-[9px]">
        School: <span className="font-semibold">{record.school}</span>
        {"  "}School ID: <span className="font-semibold">{record.schoolId}</span>
        {"  "}District: <span className="font-semibold">{record.district}</span>
        {"  "}Division: <span className="font-semibold">{record.division}</span>
        {"  "}Region: <span className="font-semibold">{record.region}</span>
      </p>
      <p className="text-[9px]">
        Classified as Grade: <span className="font-semibold">{record.gradeLevel}</span>
        {"  "}Section: <span className="font-semibold">{record.section}</span>
        {"  "}School Year: <span className="font-semibold">{record.schoolYear}</span>
        {"  "}Name of Adviser/Teacher: <span className="font-semibold">{record.adviser}</span>
        {"  "}Signature:{" "}
        <span className="border-b border-black inline-block w-24"></span>
      </p>
      <GradeTable record={record} />
      <RemedialTable />
    </div>
  );
}

// ─── Build mock records from existing mock data ────────────────────────────────

function buildGradesFromMock(): Record<string, GradeEntry> {
  const grades: Record<string, GradeEntry> = {};
  for (const subj of SUBJECTS) {
    const qData = QUARTERLY_MOCK[subj.code] ?? {};
    grades[subj.code] = {
      q1: qData[1] ?? null,
      q2: qData[2] ?? null,
      q3: qData[3] ?? null,
      q4: qData[4] ?? null,
    };
  }
  return grades;
}

function buildPriorGrades(): Record<string, GradeEntry> {
  const grades: Record<string, GradeEntry> = {};
  for (const subj of SUBJECTS) {
    grades[subj.code] = {
      q1: Math.round(78 + Math.random() * 18),
      q2: Math.round(78 + Math.random() * 18),
      q3: Math.round(78 + Math.random() * 18),
      q4: Math.round(78 + Math.random() * 18),
    };
  }
  return grades;
}

// ─── Front Page ────────────────────────────────────────────────────────────────

export function SF10FrontPage({ student }: { student: StudentGrade }) {
  const nameParts = student.name.split(",");
  const lastName  = nameParts[0]?.trim() ?? "";
  const firstRest = nameParts[1]?.trim().split(" ") ?? [];
  const firstName = firstRest[0] ?? "";
  const midName   = "Santos"; // placeholder

  const grade8Record: ScholasticRecord = {
    school:      "DepEd JHS Model School",
    schoolId:    "301028",
    district:    "Quezon City District IV",
    division:    "Quezon City",
    region:      "NCR",
    gradeLevel:  8,
    section:     "Rizal",
    schoolYear:  "2025–2026",
    adviser:     "R. Dela Cruz",
    grades:      buildGradesFromMock(),
  };

  const grade7Record: ScholasticRecord = {
    ...grade8Record,
    gradeLevel: 7,
    section:    "Bonifacio",
    schoolYear: "2024–2025",
    adviser:    "M. Santos",
    grades:     buildPriorGrades(),
  };

  return (
    <div
      className="bg-white text-black font-sans"
      style={{ width: "816px", padding: "28px 32px", fontSize: "10px" }}
    >
      {/* ── Header ── */}
      <div className="text-center mb-2 border-b-2 border-black pb-2">
        <p className="text-[9px]">Republic of the Philippines</p>
        <p className="text-[9px]">Department of Education</p>
        <p className="text-[13px] font-black uppercase mt-1">
          Learner's Permanent Academic Record for Junior High School (SF10-JHS)
        </p>
        <p className="text-[9px]">(Formerly Form 137)</p>
      </div>

      {/* ── Learner Information ── */}
      <div className="border border-black mb-2">
        <div className="bg-gray-100 px-2 py-0.5 border-b border-black">
          <span className="font-bold text-[9px] uppercase tracking-wide">Learner's Information</span>
        </div>
        <div className="px-2 py-1">
          <div className="flex gap-4 text-[9px] mb-1">
            <span>
              LAST NAME:{" "}
              <span className="font-semibold border-b border-black inline-block min-w-[100px] px-1">{lastName}</span>
            </span>
            <span>
              FIRST NAME:{" "}
              <span className="font-semibold border-b border-black inline-block min-w-[100px] px-1">{firstName}</span>
            </span>
            <span>
              NAME EXTN. (Jr, I, II):{" "}
              <span className="border-b border-black inline-block w-12"></span>
            </span>
            <span>
              MIDDLE NAME:{" "}
              <span className="font-semibold border-b border-black inline-block min-w-[90px] px-1">{midName}</span>
            </span>
          </div>
          <div className="flex gap-4 text-[9px]">
            <span>
              Learner Reference Number (LRN):{" "}
              <span className="font-semibold border-b border-black inline-block min-w-[80px] px-1">{student.lrn}</span>
            </span>
            <span>
              Birthdate (mm/dd/yyyy):{" "}
              <span className="font-semibold border-b border-black inline-block min-w-[80px] px-1">03/15/2010</span>
            </span>
            <span>
              Sex:{" "}
              <span className="font-semibold border-b border-black inline-block min-w-[40px] px-1">Male</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── JHS Eligibility ── */}
      <div className="border border-black mb-2">
        <div className="bg-gray-100 px-2 py-0.5 border-b border-black">
          <span className="font-bold text-[9px] uppercase tracking-wide">Eligibility for JHS Enrolment</span>
        </div>
        <div className="px-2 py-1 text-[9px]">
          <div className="flex gap-4 items-baseline mb-1">
            <span className="font-semibold">☑ Elementary School Completer</span>
            <span>
              General Average:{" "}
              <span className="font-semibold border-b border-black inline-block min-w-[40px] px-1">92.50</span>
            </span>
            <span>
              Citation (If Any):{" "}
              <span className="font-semibold border-b border-black inline-block min-w-[80px] px-1">With High Honors</span>
            </span>
          </div>
          <div className="flex gap-4 items-baseline mb-1">
            <span>
              Name of Elementary School:{" "}
              <span className="font-semibold border-b border-black inline-block min-w-[120px] px-1">QC Elementary School</span>
            </span>
            <span>
              School ID:{" "}
              <span className="border-b border-black inline-block w-16"></span>
            </span>
            <span>
              Address of School:{" "}
              <span className="border-b border-black inline-block w-32"></span>
            </span>
          </div>
          <div className="flex gap-4 items-baseline">
            <span>☐ PEPT Passer  Rating: <span className="border-b border-black inline-block w-12"></span></span>
            <span>☐ ALS A &amp; E Passer  Rating: <span className="border-b border-black inline-block w-12"></span></span>
            <span>☐ Others: <span className="border-b border-black inline-block w-20"></span></span>
          </div>
          <div>
            <span>Date of Examination/Assessment (mm/dd/yyyy):{" "}
              <span className="border-b border-black inline-block w-24"></span>
            </span>
            <span className="ml-4">Name and Address of Testing Center:{" "}
              <span className="border-b border-black inline-block w-40"></span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Scholastic Record ── */}
      <div className="border border-black mb-2">
        <div className="bg-gray-100 px-2 py-0.5 border-b border-black">
          <span className="font-bold text-[9px] uppercase tracking-wide">Scholastic Record</span>
        </div>
        <div className="px-2 py-1">
          <ScholasticBlock record={grade8Record} />
          <ScholasticBlock record={grade7Record} />
        </div>
      </div>

      {/* ── Certification ── */}
      <div className="text-[9px] mt-3">
        <p>
          I certify that this is a true and accurate record of{" "}
          <span className="font-semibold">{student.name}</span>.
        </p>
        <div className="flex justify-between mt-4">
          <div>
            <p className="border-b border-black w-56 pb-0.5 font-semibold">R. Dela Cruz</p>
            <p>School Registrar / Principal</p>
            <p>
              Date:{" "}
              <span className="border-b border-black inline-block w-24">
                {new Date().toLocaleDateString("en-PH")}
              </span>
            </p>
          </div>
          <div className="text-right">
            <div className="w-32 h-32 border border-dashed border-gray-400 flex items-center justify-center text-gray-300 text-[8px]">
              Dry Seal / Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Back Page ─────────────────────────────────────────────────────────────────

export function SF10BackPage({ student }: { student: StudentGrade }) {
  const grade9Record: ScholasticRecord = {
    school:     "DepEd JHS Model School",
    schoolId:   "301028",
    district:   "Quezon City District IV",
    division:   "Quezon City",
    region:     "NCR",
    gradeLevel: 9,
    section:    "Mabini",
    schoolYear: "2026–2027",
    adviser:    "",
    grades:     {},
  };

  const grade10Record: ScholasticRecord = {
    ...grade9Record,
    gradeLevel: 10,
    section:    "Luna",
    schoolYear: "2027–2028",
  };

  const summaryRecords = [grade9Record, grade10Record];

  return (
    <div
      className="bg-white text-black font-sans"
      style={{ width: "816px", padding: "28px 32px", fontSize: "10px" }}
    >
      {/* ── Header ── */}
      <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
        <div>
          <p className="font-black text-[11px] uppercase">SF 10-JHS</p>
          <p className="text-[9px] font-semibold">{student.name} · LRN: {student.lrn}</p>
        </div>
        <div className="text-[9px] text-right">
          <p>Page 2 of ________</p>
        </div>
      </div>

      {/* ── Additional Scholastic Records (Grade 9 & 10) ── */}
      {summaryRecords.map((record) => (
        <div key={record.gradeLevel} className="border border-black mb-3">
          <div className="bg-gray-100 px-2 py-0.5 border-b border-black">
            <span className="font-bold text-[9px] uppercase">Grade {record.gradeLevel} Scholastic Record</span>
          </div>
          <div className="px-2 py-1">
            <ScholasticBlock record={record} />
          </div>
        </div>
      ))}

      {/* ── Summary of Learner's Achievement ── */}
      <div className="border border-black mt-2">
        <div className="bg-gray-100 px-2 py-0.5 border-b border-black">
          <span className="font-bold text-[9px] uppercase tracking-wide">
            Summary of Learner's Achievement
          </span>
        </div>
        <table className="w-full text-[9px]" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th className={`${TH} text-left`}>Grade Level</th>
              <th className={TH}>School Year</th>
              <th className={TH}>General Average</th>
              <th className={TH}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {[7, 8, 9, 10].map((gl) => (
              <tr key={gl}>
                <td className={`${TDL} h-5`}>Grade {gl}</td>
                <td className={TD}></td>
                <td className={TD}></td>
                <td className={TD}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Certification ── */}
      <div className="text-[9px] mt-4">
        <p>
          I certify that this is a true and accurate record of{" "}
          <span className="font-semibold">{student.name}</span>.
        </p>
        <div className="flex justify-between mt-3">
          <div>
            <p className="border-b border-black w-56 pb-0.5 font-semibold">R. Dela Cruz</p>
            <p>School Registrar / Principal</p>
            <p>
              Date:{" "}
              <span className="border-b border-black inline-block w-24">
                {new Date().toLocaleDateString("en-PH")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Full Preview with Export Button ──────────────────────────────────────────

export function SF10Preview({ student }: { student: StudentGrade }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    await exportToPDF("sf10-print-area", `SF10_${student.lrn}_${student.name.replace(/[^a-zA-Z]/g, "_")}.pdf`);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-6 bg-slate-100 min-h-screen">
      {/* Export Button */}
      <div className="flex gap-3 items-center mb-2">
        <h2 className="text-lg font-bold text-slate-700">SF10 Preview</h2>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900
                     text-white font-semibold text-sm px-4 py-2 rounded-lg shadow
                     transition-colors duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Export to PDF
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 active:bg-slate-800
                     text-white font-semibold text-sm px-4 py-2 rounded-lg shadow
                     transition-colors duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012
                     2v5a2 2 0 01-2 2h-2m-2 0H8v4h8v-4z"/>
          </svg>
          Print
        </button>
      </div>

      {/* Print Area */}
      <div
        id="sf10-print-area"
        ref={printRef}
        className="flex flex-col gap-6 print:gap-0"
      >
        {/* Page 1 – Front */}
        <div className="shadow-md print:shadow-none">
          <SF10FrontPage student={student} />
        </div>

        {/* Page 2 – Back */}
        <div className="shadow-md print:shadow-none print:break-before-page">
          <SF10BackPage student={student} />
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #sf10-print-area { display: block !important; }
          #sf10-print-area > div { page-break-after: always; }
        }
      `}</style>
    </div>
  );
}

export default SF10Preview;