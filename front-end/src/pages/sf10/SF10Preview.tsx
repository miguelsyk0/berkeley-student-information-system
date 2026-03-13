import { SUBJECTS, QUARTERLY_MOCK, computeAvg } from "../encoding/MockData";
import type { StudentGrade } from "../types";

// ── Front Page ─────────────────────────────────────────────────────────────────

export function SF10FrontPage({ student }: { student: StudentGrade }) {
  return (
    <div
      className="bg-white border border-slate-300 shadow-sm p-8 text-xs font-sans"
      style={{ width: "720px", minHeight: "1000px" }}
    >
      {/* DepEd Header */}
      <div className="text-center mb-4 border-b-2 border-slate-800 pb-3">
        <p className="text-[10px] font-semibold text-slate-600">Republic of the Philippines</p>
        <p className="text-[10px] font-semibold text-slate-600">Department of Education</p>
        <div className="flex items-center justify-center gap-4 my-2">
          <div className="w-14 h-14 rounded-full border-2 border-slate-300 flex items-center justify-center bg-slate-50">
            <span className="text-[10px] text-slate-400 font-bold">DepEd</span>
          </div>
          <div>
            <p className="text-base font-black text-slate-800 uppercase tracking-wide">School Form 10</p>
            <p className="text-[11px] font-bold text-slate-600">(SF10) Learner's Permanent Academic Record</p>
            <p className="text-[10px] text-slate-500">For Junior High School</p>
          </div>
          <div className="w-14 h-14 rounded-full border-2 border-slate-300 flex items-center justify-center bg-slate-50">
            <span className="text-[10px] text-slate-400 font-bold">School</span>
          </div>
        </div>
      </div>

      {/* School info */}
      <div className="grid grid-cols-2 gap-x-8 mb-4 text-[10px]">
        {[
          ["School Name",    "DepEd JHS Model School"],
          ["School ID",      "301028"],
          ["District",       "Quezon City District IV"],
          ["Division",       "Quezon City"],
          ["Region",         "NCR"],
          ["Address",        "Quezon City, Metro Manila"],
        ].reduce<[string, string][][]>((rows, item, i) => {
          if (i % 3 === 0) rows.push([]);
          rows[rows.length - 1].push(item as [string, string]);
          return rows;
        }, []).flatMap((col) => col).map(([label, value], i) => (
          <div key={i} className="flex gap-2 border-b border-slate-200 pb-1 mb-1">
            <span className="text-slate-500 w-24 flex-shrink-0">{label}:</span>
            <span className="font-semibold text-slate-800">{value}</span>
          </div>
        ))}
      </div>

      {/* Learner info */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
          Learner Information
        </p>
        <div className="grid grid-cols-3 gap-3 text-[10px]">
          {[
            { label: "LRN",          value: student.lrn },
            { label: "Last Name",    value: student.name.split(",")[0]?.trim() },
            { label: "First Name",   value: student.name.split(",")[1]?.trim().split(" ")[0] ?? "" },
            { label: "Middle Name",  value: "Santos" },
            { label: "Sex",          value: "Male" },
            { label: "Birthdate",    value: "March 15, 2010" },
            { label: "Age",          value: "14" },
            { label: "Place of Birth", value: "Quezon City" },
            { label: "Nationality",  value: "Filipino" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-slate-400 mb-0.5">{label}</p>
              <p className="font-semibold text-slate-800 border-b border-slate-300 pb-0.5">{value || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* JHS Eligibility */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
          JHS Admission Basis
        </p>
        <div className="grid grid-cols-2 gap-3 text-[10px]">
          {[
            ["Elementary School Completed", "QC Elementary School"],
            ["General Average",             "92.50"],
            ["School Year Completed",       "2022–2023"],
            ["Honors / Award Received",     "With High Honors"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-slate-400 mb-0.5">{label}</p>
              <p className="font-semibold text-slate-800 border-b border-slate-300 pb-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scholastic Record */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
          Scholastic Record
        </p>
        <table className="w-full border border-slate-300 text-[9px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 px-2 py-1.5 text-left font-bold text-slate-700">
                Learning Areas
              </th>
              <th className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-700" colSpan={4}>
                Grade 8 — S.Y. 2025–2026
              </th>
              <th className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-700">Final</th>
              <th className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-700">Rem.</th>
            </tr>
            <tr className="bg-slate-50">
              <th className="border border-slate-300 px-2 py-1" />
              {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                <th key={q} className="border border-slate-300 px-2 py-1 text-center text-slate-600">{q}</th>
              ))}
              <th className="border border-slate-300 px-2 py-1" />
              <th className="border border-slate-300 px-2 py-1" />
            </tr>
          </thead>
          <tbody>
            {SUBJECTS.map((subj) => {
              const qs      = [1, 2, 3, 4].map((q) => QUARTERLY_MOCK[subj.code]?.[q] ?? null);
              const validQs = qs.filter((v): v is number => v !== null);
              const final   = validQs.length >= 2
                ? Math.round(validQs.reduce((a, b) => a + b) / validQs.length)
                : null;
              return (
                <tr key={subj.code} className="hover:bg-slate-50">
                  <td className="border border-slate-200 px-2 py-1.5 font-medium text-slate-700">{subj.name}</td>
                  {qs.map((q, i) => (
                    <td key={i} className="border border-slate-200 px-2 py-1.5 text-center text-slate-700">
                      {q ?? "—"}
                    </td>
                  ))}
                  <td className="border border-slate-200 px-2 py-1.5 text-center font-bold text-slate-800">
                    {final ?? "—"}
                  </td>
                  <td className="border border-slate-200 px-2 py-1.5 text-center text-slate-600">
                    {final !== null ? (final >= 75 ? "P" : "F") : "—"}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-slate-100 font-bold">
              <td className="border border-slate-300 px-2 py-2 font-black text-slate-700">General Average</td>
              {[1, 2, 3, 4].map((q) => {
                const vals = SUBJECTS
                  .map((s) => QUARTERLY_MOCK[s.code]?.[q])
                  .filter((v): v is number => v !== null);
                return (
                  <td key={q} className="border border-slate-300 px-2 py-2 text-center text-slate-700">
                    {vals.length > 0
                      ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(0)
                      : "—"}
                  </td>
                );
              })}
              <td className="border border-slate-300 px-2 py-2 text-center font-black text-slate-800">
                {computeAvg(student.grades)?.toFixed(2) ?? "—"}
              </td>
              <td className="border border-slate-300 px-2 py-2 text-center text-emerald-700 font-bold">P</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signature */}
      <div className="mt-6 flex items-end justify-between text-[10px] text-slate-500">
        <div>
          <p className="font-semibold border-b border-slate-400 pb-1 w-48 mb-1">R. Dela Cruz</p>
          <p>Registrar's Signature over Printed Name</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Date Printed: {new Date().toLocaleDateString("en-PH")}</p>
        </div>
      </div>
    </div>
  );
}

// ── Back Page ──────────────────────────────────────────────────────────────────

export function SF10BackPage({ student }: { student: StudentGrade }) {
  // Simulate a Grade 7 prior record
  const priorGradeLevels = [7];

  return (
    <div
      className="bg-white border border-slate-300 shadow-sm p-8 text-xs font-sans"
      style={{ width: "720px", minHeight: "1000px" }}
    >
      <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
        <p className="text-base font-black text-slate-800 uppercase">School Form 10 — Continuation</p>
        <p className="text-[11px] text-slate-600 font-bold">
          {student.name} · LRN: {student.lrn}
        </p>
      </div>

      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
        Prior Grade Level Records
      </p>

      {priorGradeLevels.map((gl) => (
        <div key={gl} className="mb-6">
          <p className="text-[11px] font-black text-slate-700 mb-2 bg-slate-50 px-3 py-1.5 rounded-lg">
            Grade {gl} — S.Y. 2024–2025
          </p>
          <table className="w-full border border-slate-300 text-[9px]">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 px-2 py-1.5 text-left font-bold text-slate-700">Learning Areas</th>
                {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                  <th key={q} className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-700">{q}</th>
                ))}
                <th className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-700">Final</th>
                <th className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-700">Rem.</th>
              </tr>
            </thead>
            <tbody>
              {SUBJECTS.map((subj) => {
                const fakeQs = [1, 2, 3, 4].map(() => Math.round(78 + Math.random() * 20));
                const final  = Math.round(fakeQs.reduce((a, b) => a + b, 0) / 4);
                return (
                  <tr key={subj.code} className="hover:bg-slate-50">
                    <td className="border border-slate-200 px-2 py-1.5 font-medium text-slate-700">{subj.name}</td>
                    {fakeQs.map((q, i) => (
                      <td key={i} className="border border-slate-200 px-2 py-1.5 text-center text-slate-700">{q}</td>
                    ))}
                    <td className="border border-slate-200 px-2 py-1.5 text-center font-bold text-slate-800">{final}</td>
                    <td className="border border-slate-200 px-2 py-1.5 text-center text-emerald-700">P</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      <div className="mt-8 flex items-end justify-between text-[10px] text-slate-500">
        <div>
          <p className="font-semibold border-b border-slate-400 pb-1 w-48 mb-1">R. Dela Cruz</p>
          <p>Registrar's Signature over Printed Name</p>
        </div>
      </div>
    </div>
  );
}