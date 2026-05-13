import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getStudentDetails, getSubjects } from "@/services/api";
import type { Student, Subject } from "@/services/api";

import depedSeal from "@/assets/Department_of_Education.png";
import depedWordmark from "@/assets/Department_of_Education_(DepEd).png";

// Print-to-PDF: uses browser's native print dialog (works with "Save as PDF").
// No html2canvas needed — the DOM renders perfectly at print resolution.
function triggerPrint() {
  window.print();
}

// ─── Shared helpers ────────────────────────────────────────────────────────────

// ─── Shared helpers ────────────────────────────────────────────────────────────

// Border-collapse table styles as inline style objects (Tailwind can conflict
// with border-collapse in print; we use a mix of Tailwind + inline)
const TH = "border border-black px-1 py-0.5 text-center text-[9px] font-bold";
const TD = "border border-black px-1 py-0.5 text-center text-[9px]";
const TDL = "border border-black px-1 py-0.5 text-left text-[9px]";

const CALIBRI = "Calibri, 'Segoe UI', Candara, Bitstream Vera Sans, DejaVu Sans, Geneva, Trebuchet MS, Verdana, sans-serif";

interface GradeEntry {
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  final?: number | null;
  remarks?: string | null;
}

export interface ScholasticRecord {
  school: string;
  schoolId: string;
  district: string;
  division: string;
  region: string;
  gradeLevel: number;
  section: string;
  schoolYear: string;
  adviser: string;
  grades: Record<string, GradeEntry>; // Key is subject_name or displayName
  generalAvg?: number | null;
}

function getRemarks(final: number | null): string {
  if (final === null) return "";
  return final >= 75 ? "PASSED" : "FAILED";
}

function calcFinal(entry: GradeEntry | undefined): number | null {
  if (!entry) return null;
  return entry.final ?? null;
}

// ─── Grade Table ───────────────────────────────────────────────────────────────

function GradeTable({ record, subjects }: { record: ScholasticRecord; subjects: Subject[] }) {
  // Sort subjects by order (sort_order from DB)
  const sortedSubjects = [...(subjects || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Use record's genAvg from DB
  const genAvg = record.generalAvg ? Number(record.generalAvg) : null;

  return (
    <table className="w-full text-[9px]" style={{ borderCollapse: "collapse", fontFamily: CALIBRI }}>
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
        {sortedSubjects.map((subj) => {
          const areaName = subj.displayName || subj.name;
          const entry = record.grades[areaName] || record.grades[subj.name];

          const q1 = entry?.q1 ?? null;
          const q2 = entry?.q2 ?? null;
          const q3 = entry?.q3 ?? null;
          const q4 = entry?.q4 ?? null;
          const final = calcFinal(entry);
          const remarks = entry?.remarks || (final != null ? getRemarks(final) : "");

          return (
            <tr key={subj.code}>
              <td className={TDL}>
                {areaName}
              </td>
              <td className={TD}>{q1 ?? ""}</td>
              <td className={TD}>{q2 ?? ""}</td>
              <td className={TD}>{q3 ?? ""}</td>
              <td className={TD}>{q4 ?? ""}</td>
              <td className={`${TD} font-bold`}>{final ?? ""}</td>
              <td className={TD}>{remarks}</td>
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
      <div className="flex items-baseline gap-1 text-[9px] mt-1" style={{ fontFamily: CALIBRI }}>
        <span className="font-bold">Remedial Classes</span>
        <span className="ml-2">Conducted from (mm/dd/yyyy)</span>
        <span className="border-b border-black inline-block w-36 mx-1"></span>
        <span>to (mm/dd/yyyy)</span>
        <span className="border-b border-black inline-block w-36 mx-1"></span>
      </div>
      <table className="w-full text-[9px] mt-0.5" style={{ borderCollapse: "collapse", fontFamily: CALIBRI }}>
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

function ScholasticBlock({ record, subjects }: { record: ScholasticRecord; subjects: Subject[] }) {
  return (
    <div className="mb-3" style={{ fontFamily: CALIBRI }}>
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
      <GradeTable record={record} subjects={subjects} />
      <RemedialTable />
    </div>
  );
}

// ─── Front Page ────────────────────────────────────────────────────────────────

export function SF10FrontPage({ student, subjects, records }: { student: any; subjects: Subject[]; records: ScholasticRecord[] }) {
  const nameParts = student.name?.split(",") || [];
  const lastName  = nameParts[0]?.trim() ?? "";
  const firstRest = nameParts[1]?.trim().split(" ") ?? [];
  const firstName = firstRest[0] ?? "";
  const midName   = student.middleName || "";

  const emptyRecord = (gl: number): ScholasticRecord => ({
    school: "", schoolId: "", district: "", division: "", region: "",
    gradeLevel: gl, section: "", schoolYear: "", adviser: "", grades: {}
  });

  const grade7Record = records.find(r => r.gradeLevel === 7) || emptyRecord(7);
  const grade8Record = records.find(r => r.gradeLevel === 8) || emptyRecord(8);

  return (
    <div
      className="bg-white text-black"
      style={{ width: "816px", padding: "28px 32px", fontSize: "10px", fontFamily: CALIBRI }}
    >
      {/* ── Header ── */}
      <div className="relative text-center mb-2 border-b-2 border-black pb-2 flex items-center justify-center min-h-[80px]">
        <div className="absolute left-0 top-0">
          <img src={depedSeal} alt="DepEd Seal" className="w-16 h-16 object-contain" />
        </div>
        <div>
          <p className="text-[9px]">Republic of the Philippines</p>
          <p className="text-[9px]">Department of Education</p>
          <p className="text-[13px] font-black uppercase mt-1">
            Learner's Permanent Academic Record for Junior High School (SF10-JHS)
          </p>
          <p className="text-[9px]">(Formerly Form 137)</p>
        </div>
        <div className="absolute right-0 top-0">
          <img src={depedWordmark} alt="DepEd Wordmark" className="w-24 h-16 object-contain" />
        </div>
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
              <span className="border-b border-black inline-block w-12">{student.nameExtension || ""}</span>
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
              <span className="font-semibold border-b border-black inline-block min-w-[80px] px-1"></span>
            </span>
            <span>
              Sex:{" "}
              <span className="font-semibold border-b border-black inline-block min-w-[40px] px-1"></span>
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
              <span className="font-semibold border-b border-black inline-block min-w-[40px] px-1"></span>
            </span>
            <span>
              Citation (If Any):{" "}
              <span className="font-semibold border-b border-black inline-block min-w-[80px] px-1"></span>
            </span>
          </div>
          <div className="flex gap-4 items-baseline mb-1">
            <span>
              Name of Elementary School:{" "}
              <span className="font-semibold border-b border-black inline-block min-w-[120px] px-1"></span>
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
          <ScholasticBlock record={grade7Record} subjects={subjects} />
          <ScholasticBlock record={grade8Record} subjects={subjects} />
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

export function SF10BackPage({ student, subjects, records }: { student: any; subjects: Subject[]; records: ScholasticRecord[] }) {
  const emptyRecord = (gl: number): ScholasticRecord => ({
    school: "", schoolId: "", district: "", division: "", region: "",
    gradeLevel: gl, section: "", schoolYear: "", adviser: "", grades: {}
  });

  const grade9Record = records.find(r => r.gradeLevel === 9) || emptyRecord(9);
  const grade10Record = records.find(r => r.gradeLevel === 10) || emptyRecord(10);

  const summaryRecords = [grade9Record, grade10Record];

  return (
    <div
      className="bg-white text-black"
      style={{ width: "816px", padding: "28px 32px", fontSize: "10px", fontFamily: CALIBRI }}
    >
      {/* ── Header ── */}
      <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-3" style={{ fontFamily: CALIBRI }}>
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
            <ScholasticBlock record={record} subjects={subjects} />
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
        <table className="w-full text-[9px]" style={{ borderCollapse: "collapse", fontFamily: CALIBRI }}>
          <thead>
            <tr>
              <th className={`${TH} text-left`}>Grade Level</th>
              <th className={TH}>School Year</th>
              <th className={TH}>General Average</th>
              <th className={TH}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {[7, 8, 9, 10].map((gl) => {
              const r = records.find(x => x.gradeLevel === gl);
              let avg = r?.generalAvg ? Number(r.generalAvg) : null;
              if (r && (avg == null || isNaN(avg))) {
                 const sortedSubjs = [...(subjects || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
                 const finals = sortedSubjs.map(s => {
                    const name = s.displayName || s.name;
                    return calcFinal(r.grades[name] || r.grades[s.name]);
                 }).filter((v): v is number => v != null);
                 if (finals.length > 0) {
                    avg = Math.round((finals.reduce((a, b) => a + b, 0) / finals.length) * 100) / 100;
                 }
              }
              return (
                <tr key={gl}>
                  <td className={`${TDL} h-5`}>Grade {gl}</td>
                  <td className={TD}>{r?.schoolYear || ""}</td>
                  <td className={TD}>{avg?.toFixed(2) || ""}</td>
                  <td className={TD}>{avg != null ? getRemarks(avg >= 75 ? 75 : 74) : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Certification ── */}
      <div className="text-[9px] mt-4" style={{ fontFamily: CALIBRI }}>
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

// ─── Compile API data into records ─────────────────────────────────────────────

export function compileSF10Records(apiData: any): ScholasticRecord[] {
  if (!apiData) return [];
  const { history = [], records = [] } = apiData;

  const results: Record<number, ScholasticRecord> = {};

  // Process history (prior records)
  for (const h of history) {
    if (!results[h.grade_level]) {
      results[h.grade_level] = {
        school: h.school_name || "",
        schoolId: h.school_id || "",
        district: h.district || "",
        division: h.division || "",
        region: h.region || "",
        gradeLevel: h.grade_level,
        section: h.section_name || "",
        schoolYear: h.school_year || "",
        adviser: h.adviser_name || "",
        generalAvg: h.general_average,
        grades: {}
      };
    }
    if (h.subject_name) {
      results[h.grade_level].grades[h.subject_name] = {
        q1: h.q1_grade,
        q2: h.q2_grade,
        q3: h.q3_grade,
        q4: h.q4_grade,
        final: h.final_rating,
        remarks: h.subject_remarks
      };
    }
  }

  // Process records (current enrollments) - overrides history if same grade level
  for (const r of records) {
    if (!results[r.grade_level]) {
      results[r.grade_level] = {
        school: "Berkeley Student Information System", // default
        schoolId: "Berkeley", // default
        district: "", division: "", region: "",
        gradeLevel: r.grade_level,
        section: r.section_name || "",
        schoolYear: r.school_year || "",
        adviser: "",
        generalAvg: r.general_average,
        grades: {}
      };
    }
    // Update basic info if missing
    results[r.grade_level].section = r.section_name || results[r.grade_level].section;
    results[r.grade_level].schoolYear = r.school_year || results[r.grade_level].schoolYear;

    if (r.subject_name) {
      // Overwrite grade for this subject
      results[r.grade_level].grades[r.subject_name] = {
        q1: r.q1_grade,
        q2: r.q2_grade,
        q3: r.q3_grade,
        q4: r.q4_grade,
        final: r.final_grade,
        remarks: r.subject_remarks
      };
    }
  }

  return Object.values(results).sort((a, b) => a.gradeLevel - b.gradeLevel);
}

// ─── Full Preview with Export Button ──────────────────────────────────────────

import { getSF10Data } from "@/services/api";

export function SF10Preview() {
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [records, setRecords] = useState<ScholasticRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    async function load() {
      setLoading(true);
      try {
        const [det, subjs, sf10] = await Promise.all([
          getStudentDetails(Number(studentId)),
          getSubjects(),
          getSF10Data(Number(studentId))
        ]);
        setStudent(det);
        setSubjects(subjs);
        setRecords(compileSF10Records(sf10));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [studentId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
    </div>
  );

  if (!student) return <div className="p-10 text-center">Student not found</div>;

  const stuGrade: any = {
    name: `${student.lastName}, ${student.firstName}`,
    lrn: student.lrn,
    middleName: student.middleName
  };

  return (
    <>
      {/* ── Print / PDF styles injected into <head> ── */}
      <style>{`
        @media print {
          @page {
            size: 8.5in 13in portrait;
            margin: 0;
          }

          /* Hide the entire app shell — nav, header, sidebars etc */
          body { margin: 0 !important; }
          #root > *:not(#sf10-root) { display: none !important; }
          #sf10-root {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 0 !important;
            gap: 0 !important;
            min-height: unset !important;
            background: none !important;
          }
          .sf10-toolbar { display: none !important; }
          .sf10-page-shadow { box-shadow: none !important; }
          .sf10-page-break { break-before: page !important; }
        }
      `}</style>

      <div id="sf10-root" className="sf10-screen-wrapper flex flex-col items-center gap-6 py-8 bg-slate-100 min-h-screen">
        {/* ── Toolbar (hidden on print) ── */}
        <div className="sf10-toolbar flex items-center gap-3 print:hidden">
          <h2 className="text-lg font-bold text-slate-700 mr-2">SF10-JHS Preview</h2>

          {/* Print button */}
          <button
            onClick={triggerPrint}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900
                       text-white font-semibold text-sm px-4 py-2 rounded-lg shadow
                       transition-colors duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012
                       2v5a2 2 0 01-2 2h-2m-2 0H8v4h8v-4z"/>
            </svg>
            Print / Save as PDF
          </button>

          <p className="text-xs text-slate-400 ml-1">
            Tip: In the print dialog, select <strong>"Save as PDF"</strong> and set paper size to <strong>Legal</strong>.
          </p>
        </div>

        {/* ── Page 1 — Front ── */}
        <div className="sf10-page-shadow shadow-xl">
          <SF10FrontPage student={stuGrade} subjects={subjects} records={records} />
        </div>

        {/* ── Page 2 — Back ── */}
        <div className="sf10-page-shadow sf10-page-break shadow-xl">
          <SF10BackPage student={stuGrade} subjects={subjects} records={records} />
        </div>
      </div>
    </>
  );
}

export default SF10Preview;