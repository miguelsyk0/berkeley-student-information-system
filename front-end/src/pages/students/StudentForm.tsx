import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save, X, User, BookOpen, Award, Plus, Trash2,
  Building2, ClipboardList, ChevronDown, ChevronUp,
  AlertCircle, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useSetHeader } from "@/contexts/HeaderContext";
import { GRADE_COLORS } from "@/utils/gradeUtils";
import {
  getStudentDetails, createStudent, updateStudent,
  addTransfereeTranscript, getStudentTranscriptHistory, getSchoolYears,
} from "@/services/api";
import type { Student, SchoolYear } from "@/services/api";
import { ROUTES } from "@/routes";
import React from "react";

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

export interface SubjectGradeEntry {
  subjectName: string;
  q1: string; q2: string; q3: string; q4: string;
  finalRating: string;
  remarks: string;
  isMapeh?: boolean;
  mapehComponent?: string;
}

export interface GradeYearEntry {
  id: string;
  gradeLevel: string;
  schoolYear: string;
  sectionName: string;
  generalAverage: string;
  remarks: string;
  subjects: SubjectGradeEntry[];
}

export interface SchoolRecord {
  id: string;
  schoolName: string;
  schoolId: string;
  schoolAddress: string;
  district: string;
  division: string;
  region: string;
  adviserName: string;
  gradeYearEntries: GradeYearEntry[];
}

type PersonalForm = {
  lrn: string;
  lastName: string;
  firstName: string;
  middleName: string;
  nameExtension: string;
  sex: "Male" | "Female";
  birthdate: string;
  elementarySchoolName: string;
  elementarySchoolId: string;
  elementarySchoolAddress: string;
  elementaryGeneralAvg: string;
  elementaryCitation: string;
  otherCredential: string;
  otherCredentialRating: string;
  credentialExamDate: string;
  credentialTestingCenter: string;
};

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

const DEFAULT_SUBJECTS: SubjectGradeEntry[] = [
  { subjectName: "Filipino", q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "English", q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Mathematics", q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Science", q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Araling Panlipunan (AP)", q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Edukasyon sa Pagpapakatao (EsP)", q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Technology and Livelihood Education (TLE)", q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "MAPEH", isMapeh: true, q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Music", isMapeh: true, mapehComponent: "Music", q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Arts", isMapeh: true, mapehComponent: "Arts", q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Physical Education", isMapeh: true, mapehComponent: "PE", q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
  { subjectName: "Health", isMapeh: true, mapehComponent: "Health", q1: "", q2: "", q3: "", q4: "", finalRating: "", remarks: "" },
];

const EMPTY_GRADE_YEAR_ENTRY = (): GradeYearEntry => ({
  id: crypto.randomUUID(),
  gradeLevel: "",
  schoolYear: "",
  sectionName: "",
  generalAverage: "",
  remarks: "Promoted",
  subjects: DEFAULT_SUBJECTS.map((s) => ({ ...s })),
});

const EMPTY_SCHOOL_RECORD = (): SchoolRecord => ({
  id: crypto.randomUUID(),
  schoolName: "",
  schoolId: "",
  schoolAddress: "",
  district: "",
  division: "",
  region: "",
  adviserName: "",
  gradeYearEntries: [EMPTY_GRADE_YEAR_ENTRY()],
});

const EMPTY_PERSONAL_FORM = (): PersonalForm => ({
  lrn: "", lastName: "", firstName: "", middleName: "",
  nameExtension: "", sex: "Male", birthdate: "",
  elementarySchoolName: "", elementarySchoolId: "", elementarySchoolAddress: "",
  elementaryGeneralAvg: "", elementaryCitation: "",
  otherCredential: "", otherCredentialRating: "", credentialExamDate: "", credentialTestingCenter: "",
});

// ══════════════════════════════════════════════════════════════════════════════
// DATA MAPPING HELPERS
// ══════════════════════════════════════════════════════════════════════════════

function studentToForm(s: Student): PersonalForm {
  return {
    lrn: s.lrn ?? "",
    lastName: s.lastName ?? "",
    firstName: s.firstName ?? "",
    middleName: s.middleName ?? "",
    nameExtension: s.suffix ?? "",
    sex: s.gender ?? "Male",
    birthdate: s.birthdate ?? "",
    elementarySchoolName: s.elemSchoolName ?? "",
    elementarySchoolId: s.elemSchoolId ?? "",
    elementarySchoolAddress: s.elemSchoolAddress ?? "",
    elementaryGeneralAvg: s.elemGenAverage != null ? String(s.elemGenAverage) : "",
    elementaryCitation: s.elemCitation ?? "",
    otherCredential: s.altCredentialType ?? "",
    otherCredentialRating: s.altCredentialRating ?? "",
    credentialExamDate: s.altCredentialExamDate ?? "",
    credentialTestingCenter: s.altCredentialCenter ?? "",
  };
}

function formToStudent(f: PersonalForm): Partial<Student> {
  return {
    lrn: f.lrn,
    lastName: f.lastName,
    firstName: f.firstName,
    middleName: f.middleName || undefined,
    suffix: f.nameExtension === "none" ? "" : f.nameExtension,
    gender: f.sex,
    birthdate: f.birthdate || undefined,
    elemSchoolName: f.elementarySchoolName || undefined,
    elemSchoolId: f.elementarySchoolId || undefined,
    elemSchoolAddress: f.elementarySchoolAddress || undefined,
    elemGenAverage: f.elementaryGeneralAvg ? parseFloat(f.elementaryGeneralAvg) : undefined,
    elemCitation: f.elementaryCitation || undefined,
    altCredentialType: f.otherCredential || undefined,
    altCredentialRating: f.otherCredentialRating || undefined,
    altCredentialExamDate: f.credentialExamDate || undefined,
    altCredentialCenter: f.credentialTestingCenter || undefined,
  };
}

function mapTranscriptHistoryToSchoolRecords(rows: any[]): SchoolRecord[] {
  if (!rows || rows.length === 0) return [EMPTY_SCHOOL_RECORD()];

  // Group by header id (th.id) – each header = one grade-year entry
  const byHeader = new Map<number, { meta: any; subjects: any[] }>();
  for (const row of rows) {
    if (!byHeader.has(row.id)) {
      byHeader.set(row.id, { meta: row, subjects: [] });
    }
    if (row.subject_name) {
      byHeader.get(row.id)!.subjects.push(row);
    }
  }

  // Group headers by school_name + school_id
  const bySchool = new Map<string, { meta: any; entries: Array<{ header: any; subjects: any[] }> }>();
  for (const [, { meta, subjects }] of byHeader) {
    const key = `${meta.school_name}||${meta.school_id || ""}`;
    if (!bySchool.has(key)) {
      bySchool.set(key, { meta, entries: [] });
    }
    bySchool.get(key)!.entries.push({ header: meta, subjects });
  }

  const records: SchoolRecord[] = [];
  for (const [, { meta, entries }] of bySchool) {
    records.push({
      id: crypto.randomUUID(),
      schoolName: meta.school_name || "",
      schoolId: meta.school_id || "",
      schoolAddress: meta.school_address || "",
      district: meta.district || "",
      division: meta.division || "",
      region: meta.region || "",
      adviserName: entries[0]?.header?.adviser_name || "",
      gradeYearEntries: entries.map(({ header, subjects }) => {
        // Build subject list: merge db subjects into the DEFAULT_SUBJECTS template
        const subjectMap = new Map<string, SubjectGradeEntry>();
        for (const def of DEFAULT_SUBJECTS) {
          subjectMap.set(def.subjectName, { ...def });
        }
        for (const s of subjects) {
          const entry: SubjectGradeEntry = {
            subjectName: s.subject_name,
            isMapeh: s.is_mapeh ?? false,
            mapehComponent: s.mapeh_component ?? undefined,
            q1: s.q1_grade != null ? String(s.q1_grade) : "",
            q2: s.q2_grade != null ? String(s.q2_grade) : "",
            q3: s.q3_grade != null ? String(s.q3_grade) : "",
            q4: s.q4_grade != null ? String(s.q4_grade) : "",
            finalRating: s.final_rating != null ? String(s.final_rating) : "",
            remarks: s.remarks || "",
          };
          subjectMap.set(s.subject_name, entry);
        }
        return {
          id: crypto.randomUUID(),
          gradeLevel: header.grade_level != null ? String(header.grade_level) : "",
          schoolYear: header.school_year || "",
          sectionName: header.section_name || "",
          generalAverage: header.general_average != null ? String(header.general_average) : "",
          remarks: header.final_remarks || "Promoted",
          subjects: Array.from(subjectMap.values()),
        };
      }),
    });
  }
  return records;
}

// ══════════════════════════════════════════════════════════════════════════════
// SHARED UI HELPERS
// ══════════════════════════════════════════════════════════════════════════════

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GRADE ENCODING TABLE
// ══════════════════════════════════════════════════════════════════════════════

function computeFinalRating(s: SubjectGradeEntry): string {
  const vals = [s.q1, s.q2, s.q3, s.q4].map(Number).filter((v) => !isNaN(v) && v > 0);
  if (vals.length === 0) return "";
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
}

function GradeEncodingTable({ entry, onUpdateSubject }: {
  entry: GradeYearEntry;
  onUpdateSubject: (entryId: string, subjectIdx: number, field: keyof SubjectGradeEntry, value: string) => void;
}) {
  const qCols = ["q1", "q2", "q3", "q4"] as const;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-xs min-w-[520px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-44">Learning Area</th>
            {qCols.map((q) => (
              <th key={q} className="px-2 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center w-14">Q{q[1]}</th>
            ))}
            <th className="px-2 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center w-16">Final</th>
            <th className="px-2 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-center w-16">Rem.</th>
          </tr>
        </thead>
        <tbody>
          {entry.subjects.map((subj, idx) => {
            const isMapehParent = subj.isMapeh && !subj.mapehComponent;
            const isMapehChild = subj.isMapeh && !!subj.mapehComponent;
            const finalVal = subj.finalRating || computeFinalRating(subj);
            const finalNum = parseFloat(finalVal);
            const passed = !isNaN(finalNum) && finalNum >= 75;
            return (
              <tr key={idx} className={`border-b border-slate-100 last:border-0 transition-colors
                ${isMapehParent ? "bg-slate-50/80 font-semibold" : "bg-white hover:bg-slate-50/40"}`}>
                <td className={`px-3 py-1.5 text-[11px] text-slate-700 ${isMapehChild ? "pl-6 text-slate-500" : ""}`}>
                  {isMapehChild && <span className="text-slate-300 mr-1">└</span>}
                  {subj.subjectName}
                </td>
                {qCols.map((q) => (
                  <td key={q} className="px-1 py-1">
                    {isMapehParent ? (
                      <div className="h-7 flex items-center justify-center text-[10px] text-slate-300 italic">auto</div>
                    ) : (
                      <Input
                        type="number" min={0} max={100} step={1}
                        value={subj[q]}
                        onChange={(e) => onUpdateSubject(entry.id, idx, q, e.target.value)}
                        placeholder="—"
                        className="h-7 text-xs text-center border-slate-200 px-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    )}
                  </td>
                ))}
                <td className="px-1 py-1 text-center">
                  {isMapehParent ? (
                    <span className="text-[11px] text-slate-400 italic">—</span>
                  ) : (
                    <span className={`text-[11px] font-bold ${!finalVal ? "text-slate-300" : passed ? "text-emerald-600" : "text-red-500"}`}>
                      {finalVal || "—"}
                    </span>
                  )}
                </td>
                <td className="px-1 py-1 text-center">
                  {!isMapehParent && finalVal && (
                    <Badge className={`text-[9px] h-4 px-1.5 border-0 ${passed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                      {passed ? "P" : "F"}
                    </Badge>
                  )}
                </td>
              </tr>
            );
          })}
          <tr className="bg-slate-50 border-t-2 border-slate-200">
            <td colSpan={5} className="px-3 py-2 text-[11px] font-black text-slate-600 italic text-right pr-4">General Average</td>
            <td className="px-2 py-2 text-center">
              <span className={`text-sm font-black ${entry.generalAverage ? "text-slate-800" : "text-slate-300"}`}>
                {entry.generalAverage || "—"}
              </span>
            </td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GRADE-YEAR ENTRY PANEL
// ══════════════════════════════════════════════════════════════════════════════

function GradeYearEntryPanel({ entry, entryIndex, schoolId, canRemove, onUpdate, onRemove, onUpdateSubject, allYears }: {
  entry: GradeYearEntry;
  entryIndex: number;
  schoolId: string;
  canRemove: boolean;
  onUpdate: (schoolId: string, entryId: string, field: keyof GradeYearEntry, value: string) => void;
  onRemove: (schoolId: string, entryId: string) => void;
  onUpdateSubject: (schoolId: string, entryId: string, subjectIdx: number, field: keyof SubjectGradeEntry, value: string) => void;
  allYears: SchoolYear[];
}) {
  const [open, setOpen] = useState(true);
  const label = entry.gradeLevel ? `Grade ${entry.gradeLevel}` : `Entry ${entryIndex + 1}`;
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 transition-colors text-left">
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black
          ${entry.gradeLevel ? GRADE_COLORS[Number(entry.gradeLevel)] : "bg-slate-200 text-slate-500"}`}>
          {entry.gradeLevel || "?"}
        </div>
        <div className="flex-1">
          <span className="text-xs font-bold text-slate-700">{label}</span>
          {entry.schoolYear && <span className="ml-2 text-[10px] text-slate-400">S.Y. {entry.schoolYear}</span>}
          {entry.generalAverage && <span className="ml-2 text-[10px] font-bold text-emerald-600">GWA {entry.generalAverage}</span>}
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <button onClick={(e) => { e.stopPropagation(); onRemove(schoolId, entry.id); }}
              className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 transition-colors px-2 py-0.5 rounded">
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-slate-100 bg-slate-50/30 p-4 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <Field label="Grade Level" required>
              <Select value={entry.gradeLevel} onValueChange={(v) => onUpdate(schoolId, entry.id, "gradeLevel", v)}>
                <SelectTrigger className="h-8 text-xs border-slate-200"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {["7","8","9","10"].map((g) => <SelectItem key={g} value={g}>Grade {g}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="School Year" required>
              <Select value={entry.schoolYear} onValueChange={(v) => onUpdate(schoolId, entry.id, "schoolYear", v)}>
                <SelectTrigger className="h-8 text-xs border-slate-200"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {allYears.map((y) => <SelectItem key={y.id} value={y.label}>{y.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Section Name">
              <Input value={entry.sectionName} onChange={(e) => onUpdate(schoolId, entry.id, "sectionName", e.target.value)}
                placeholder="e.g. Rizal" className="h-8 text-xs border-slate-200" />
            </Field>
            <Field label="General Average">
              <Input type="number" min={0} max={100} step={0.01} value={entry.generalAverage}
                onChange={(e) => onUpdate(schoolId, entry.id, "generalAverage", e.target.value)}
                placeholder="e.g. 88.5" className="h-8 text-xs border-slate-200" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Remarks / Status at End of Year">
              <Select value={entry.remarks} onValueChange={(v) => onUpdate(schoolId, entry.id, "remarks", v)}>
                <SelectTrigger className="h-8 text-xs border-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Promoted">Promoted</SelectItem>
                  <SelectItem value="Retained">Retained</SelectItem>
                  <SelectItem value="Transferred">Transferred</SelectItem>
                  <SelectItem value="Dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Subject Grades</p>
            <GradeEncodingTable entry={entry}
              onUpdateSubject={(entryId, subjectIdx, field, value) =>
                onUpdateSubject(schoolId, entryId, subjectIdx, field, value)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCHOOL RECORD CARD
// ══════════════════════════════════════════════════════════════════════════════

function SchoolRecordCard({ record, recordIndex, canRemove, onUpdateSchool, onRemoveSchool,
  onUpdateEntry, onRemoveEntry, onAddEntry, onUpdateSubject, allYears }: {
  record: SchoolRecord;
  recordIndex: number;
  canRemove: boolean;
  onUpdateSchool: (id: string, field: keyof SchoolRecord, value: string) => void;
  onRemoveSchool: (id: string) => void;
  onUpdateEntry: (schoolId: string, entryId: string, field: keyof GradeYearEntry, value: string) => void;
  onRemoveEntry: (schoolId: string, entryId: string) => void;
  onAddEntry: (schoolId: string) => void;
  onUpdateSubject: (schoolId: string, entryId: string, subjectIdx: number, field: keyof SubjectGradeEntry, value: string) => void;
  allYears: SchoolYear[];
}) {
  const hasName = !!record.schoolName.trim();
  return (
    <div className="border-2 border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 text-[11px] font-black flex items-center justify-center">
            {recordIndex + 1}
          </div>
          <div>
            <p className="text-xs font-black text-slate-700">{hasName ? record.schoolName : `School ${recordIndex + 1}`}</p>
            {record.division && <p className="text-[10px] text-slate-400">{record.division}</p>}
          </div>
        </div>
        {canRemove && (
          <button onClick={() => onRemoveSchool(record.id)}
            className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-3 h-3" /> Remove School
          </button>
        )}
      </div>
      <div className="grid grid-cols-[300px_1fr] divide-x divide-slate-200 min-h-0">
        {/* Left: School Details */}
        <div className="p-5 space-y-3 bg-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-3 h-3" /> School Details
          </p>
          <Field label="School Name" required>
            <Input value={record.schoolName} onChange={(e) => onUpdateSchool(record.id, "schoolName", e.target.value)}
              placeholder="e.g. Bagumbayan NHS" className="h-8 text-xs border-slate-200" />
          </Field>
          <Field label="School ID / DepEd ID">
            <Input value={record.schoolId} onChange={(e) => onUpdateSchool(record.id, "schoolId", e.target.value)}
              placeholder="e.g. 300123" className="h-8 text-xs border-slate-200" />
          </Field>
          <Field label="School Address">
            <Input value={record.schoolAddress} onChange={(e) => onUpdateSchool(record.id, "schoolAddress", e.target.value)}
              placeholder="Complete address" className="h-8 text-xs border-slate-200" />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="District">
              <Input value={record.district} onChange={(e) => onUpdateSchool(record.id, "district", e.target.value)}
                placeholder="e.g. District IV" className="h-8 text-xs border-slate-200" />
            </Field>
            <Field label="Division">
              <Input value={record.division} onChange={(e) => onUpdateSchool(record.id, "division", e.target.value)}
                placeholder="Division of QC" className="h-8 text-xs border-slate-200" />
            </Field>
          </div>
          <Field label="Region">
            <Input value={record.region} onChange={(e) => onUpdateSchool(record.id, "region", e.target.value)}
              placeholder="e.g. Region IV-A" className="h-8 text-xs border-slate-200" />
          </Field>
          <Field label="Adviser Name">
            <Input value={record.adviserName} onChange={(e) => onUpdateSchool(record.id, "adviserName", e.target.value)}
              placeholder="e.g. Cruz, Maria S." className="h-8 text-xs border-slate-200" />
          </Field>
          {record.gradeYearEntries.length > 0 && (
            <div className="mt-2 pt-3 border-t border-slate-100 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Encoded Years</p>
              {record.gradeYearEntries.map((e) => (
                <div key={e.id} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black
                    ${e.gradeLevel ? GRADE_COLORS[Number(e.gradeLevel)] : "bg-slate-200 text-slate-500"}`}>
                    {e.gradeLevel || "?"}
                  </div>
                  <span className="text-[11px] text-slate-600">{e.schoolYear || "—"}</span>
                  {e.generalAverage && <span className="text-[10px] text-emerald-600 font-bold">GWA {e.generalAverage}</span>}
                  <Badge className={`ml-auto text-[9px] h-4 px-1.5 border-0 ${e.remarks === "Promoted" ? "bg-emerald-50 text-emerald-700"
                    : e.remarks === "Retained" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                    {e.remarks}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Right: Grade Entries */}
        <div className="p-5 bg-slate-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <ClipboardList className="w-3 h-3" /> Grade Encoding
            </p>
            <button onClick={() => onAddEntry(record.id)}
              className="flex items-center gap-1.5 text-[11px] font-bold text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 transition-colors rounded-lg px-3 py-1.5">
              <Plus className="w-3 h-3" /> Add Year
            </button>
          </div>
          <div className="space-y-3">
            {record.gradeYearEntries.map((entry, idx) => (
              <GradeYearEntryPanel key={entry.id} entry={entry} entryIndex={idx} schoolId={record.id}
                canRemove={record.gradeYearEntries.length > 1}
                onUpdate={onUpdateEntry} onRemove={onRemoveEntry}
                onUpdateSubject={onUpdateSubject} allYears={allYears} />
            ))}
          </div>
          <p className="text-[10px] text-slate-400 italic text-center pt-1">
            If the student attended this school for multiple years, click "Add Year" to encode each grade separately.
          </p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — PERSONAL INFORMATION
// ══════════════════════════════════════════════════════════════════════════════

function PersonalInfoPage({ form, onChange, errors }: {
  form: PersonalForm;
  onChange: <K extends keyof PersonalForm>(key: K, value: PersonalForm[K]) => void;
  errors: Partial<Record<keyof PersonalForm, string>>;
}) {
  const hasCredential = !!form.otherCredential && form.otherCredential !== "none";
  return (
    <div className="max-w-3xl mx-auto space-y-5 py-6 px-6">
      {/* Personal Info */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-0 pt-5 px-6">
          <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-500" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4 space-y-4">
          <Field label="Learner Reference Number (LRN)" required error={errors.lrn}>
            <Input value={form.lrn} onChange={(e) => onChange("lrn", e.target.value.replace(/\D/g, "").slice(0, 12))}
              placeholder="12-digit LRN" maxLength={12}
              className={`h-9 text-sm font-mono border-slate-200 ${errors.lrn ? "border-red-400" : ""}`} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Last Name" required error={errors.lastName}>
              <Input value={form.lastName} onChange={(e) => onChange("lastName", e.target.value)}
                placeholder="Dela Cruz" className={`h-9 text-sm border-slate-200 ${errors.lastName ? "border-red-400" : ""}`} />
            </Field>
            <Field label="First Name" required error={errors.firstName}>
              <Input value={form.firstName} onChange={(e) => onChange("firstName", e.target.value)}
                placeholder="Juan" className={`h-9 text-sm border-slate-200 ${errors.firstName ? "border-red-400" : ""}`} />
            </Field>
            <Field label="Middle Name">
              <Input value={form.middleName} onChange={(e) => onChange("middleName", e.target.value)}
                placeholder="Santos" className="h-9 text-sm border-slate-200" />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Name Extension">
              <Select value={form.nameExtension || "none"} onValueChange={(v) => onChange("nameExtension", v === "none" ? "" : v)}>
                <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Jr.">Jr.</SelectItem>
                  <SelectItem value="Sr.">Sr.</SelectItem>
                  <SelectItem value="II">II</SelectItem>
                  <SelectItem value="III">III</SelectItem>
                  <SelectItem value="IV">IV</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Sex" required>
              <Select value={form.sex} onValueChange={(v) => onChange("sex", v as "Male" | "Female")}>
                <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Birthdate" required error={errors.birthdate}>
              <Input type="date" value={form.birthdate} onChange={(e) => onChange("birthdate", e.target.value)}
                className={`h-9 text-sm border-slate-200 ${errors.birthdate ? "border-red-400" : ""}`} />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* JHS Eligibility */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-0 pt-5 px-6">
          <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-500" />
            JHS Eligibility
            <Badge className="ml-1 bg-slate-100 text-slate-500 border-0 text-[10px]">from Elementary</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Elementary School Name">
              <Input value={form.elementarySchoolName} onChange={(e) => onChange("elementarySchoolName", e.target.value)}
                placeholder="e.g. Quezon City Elementary School" className="h-9 text-sm border-slate-200" />
            </Field>
            <Field label="School ID">
              <Input value={form.elementarySchoolId} onChange={(e) => onChange("elementarySchoolId", e.target.value)}
                placeholder="e.g. 105001" className="h-9 text-sm border-slate-200" />
            </Field>
          </div>
          <Field label="School Address">
            <Input value={form.elementarySchoolAddress} onChange={(e) => onChange("elementarySchoolAddress", e.target.value)}
              placeholder="Complete address" className="h-9 text-sm border-slate-200" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="General Average">
              <Input type="number" min={0} max={100} step={0.01} value={form.elementaryGeneralAvg}
                onChange={(e) => onChange("elementaryGeneralAvg", e.target.value)}
                placeholder="e.g. 92.5" className="h-9 text-sm border-slate-200" />
            </Field>
            <Field label="Honors / Citation">
              <Input value={form.elementaryCitation} onChange={(e) => onChange("elementaryCitation", e.target.value)}
                placeholder="e.g. With Highest Honors" className="h-9 text-sm border-slate-200" />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Credentials */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-0 pt-5 px-6">
          <CardTitle className="text-sm font-black text-slate-700 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Alternative Credentials
            <Badge className="ml-1 bg-slate-100 text-slate-500 border-0 text-[10px]">Optional — PEPT / ALS</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-4 space-y-4">
          <Field label="Credential Type">
            <Select value={form.otherCredential || "none"} onValueChange={(v) => onChange("otherCredential", v === "none" ? "" : v)}>
              <SelectTrigger className="h-9 text-sm border-slate-200">
                <SelectValue placeholder="No alternative credential" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="PEPT">PEPT</SelectItem>
                <SelectItem value="ALS">ALS (A&E)</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {hasCredential && (
            <div className="grid grid-cols-3 gap-3">
              <Field label="Rating / Grade">
                <Input value={form.otherCredentialRating} onChange={(e) => onChange("otherCredentialRating", e.target.value)}
                  placeholder="e.g. 85.0" className="h-9 text-sm border-slate-200" />
              </Field>
              <Field label="Exam Date">
                <Input type="date" value={form.credentialExamDate} onChange={(e) => onChange("credentialExamDate", e.target.value)}
                  className="h-9 text-sm border-slate-200" />
              </Field>
              <Field label="Testing Center">
                <Input value={form.credentialTestingCenter} onChange={(e) => onChange("credentialTestingCenter", e.target.value)}
                  placeholder="Testing center name" className="h-9 text-sm border-slate-200" />
              </Field>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — PRIOR TRANSCRIPT
// ══════════════════════════════════════════════════════════════════════════════

function TranscriptPage({ records, onUpdateSchool, onRemoveSchool, onAddSchool,
  onUpdateEntry, onRemoveEntry, onAddEntry, onUpdateSubject, allYears }: {
  records: SchoolRecord[];
  onUpdateSchool: (id: string, field: keyof SchoolRecord, value: string) => void;
  onRemoveSchool: (id: string) => void;
  onAddSchool: () => void;
  onUpdateEntry: (schoolId: string, entryId: string, field: keyof GradeYearEntry, value: string) => void;
  onRemoveEntry: (schoolId: string, entryId: string) => void;
  onAddEntry: (schoolId: string) => void;
  onUpdateSubject: (schoolId: string, entryId: string, subjectIdx: number, field: keyof SubjectGradeEntry, value: string) => void;
  allYears: SchoolYear[];
}) {
  return (
    <div className="space-y-5 py-6 px-6">
      <div className="flex gap-3 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
        <AlertCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] text-violet-700 leading-relaxed font-semibold mb-0.5">Prior School Transcript (SF10 Scholastic Record)</p>
          <p className="text-[11px] text-violet-600 leading-relaxed">
            Add one card per school the student attended. Within each school card, use <strong>"Add Year"</strong> if they stayed for multiple grade levels.
          </p>
        </div>
      </div>
      {records.map((record, idx) => (
        <SchoolRecordCard key={record.id} record={record} recordIndex={idx} canRemove={records.length > 1}
          onUpdateSchool={onUpdateSchool} onRemoveSchool={onRemoveSchool}
          onUpdateEntry={onUpdateEntry} onRemoveEntry={onRemoveEntry}
          onAddEntry={onAddEntry} onUpdateSubject={onUpdateSubject} allYears={allYears} />
      ))}
      <button onClick={onAddSchool}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-violet-200 text-violet-500 hover:border-violet-400 hover:bg-violet-50/40 transition-all text-xs font-bold">
        <Plus className="w-4 h-4" /> Add Another School
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// WIZARD PROGRESS BAR
// ══════════════════════════════════════════════════════════════════════════════

const STEPS = [
  { label: "Personal Info", page: 1 },
  { label: "Transcript", page: 2 },
];

function WizardProgressBar({ page }: { page: 1 | 2 }) {
  const currentIdx = STEPS.findIndex((s) => s.page === page);
  return (
    <div className="flex items-center gap-0 ml-4">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const current = idx === currentIdx;
        return (
          <div key={step.label} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all
              ${done ? "bg-teal-100 text-teal-600" : current ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              {done && <CheckCircle2 className="w-3 h-3" />}
              {step.label}
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`w-5 h-px mx-0.5 ${done ? "bg-teal-300" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function StudentForm() {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  const isEdit = !!studentId;

  // ── Wizard state ──
  const [page, setPage] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // ── Form state ──
  const [personalForm, setPersonalForm] = useState<PersonalForm>(EMPTY_PERSONAL_FORM());
  const [personalErrors, setPersonalErrors] = useState<Partial<Record<keyof PersonalForm, string>>>({});
  const [schoolRecords, setSchoolRecords] = useState<SchoolRecord[]>([EMPTY_SCHOOL_RECORD()]);

  // ── Resource state ──
  const [allYears, setAllYears] = useState<SchoolYear[]>([]);

  // ── Load years (always) ──
  useEffect(() => {
    getSchoolYears().then(setAllYears).catch(console.error);
  }, []);

  // ── Load student data in edit mode ──
  useEffect(() => {
    if (!isEdit) return;
    async function loadStudentData() {
      try {
        setLoading(true);
        const [student, transcriptRows] = await Promise.all([
          getStudentDetails(Number(studentId)),
          getStudentTranscriptHistory(Number(studentId)),
        ]);
        setPersonalForm(studentToForm(student));
        const mapped = mapTranscriptHistoryToSchoolRecords(transcriptRows);
        setSchoolRecords(mapped);
      } catch (err) {
        console.error("Failed to load student data:", err);
        alert("Failed to load student data.");
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, [studentId]);

  // ── Header ──
  useSetHeader({
    title: isEdit ? "Edit Student" : "Add Student",
    breadcrumbs: [
      { label: "Students", href: ROUTES.students.root },
      { label: isEdit ? "Edit Student" : "Add Student" },
    ],
    actions: (
      <div className="flex items-center gap-2">
        <WizardProgressBar page={page} />
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={handleBack}>
          <X className="w-3.5 h-3.5" /> {page === 1 ? "Cancel" : "Back"}
        </Button>
        {page === 1 ? (
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800" onClick={handleNext}>
            Next: Transcript →
          </Button>
        ) : (
          <>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={handleNext} disabled={submitting}>
              Skip &amp; Save
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-teal-600 hover:bg-teal-800" onClick={() => handleSubmit()} disabled={submitting}>
              <Save className="w-3.5 h-3.5" /> {submitting ? "Saving..." : "Save Student"}
            </Button>
          </>
        )}
      </div>
    )
  });

  // ── Handlers ──
  function setPF<K extends keyof PersonalForm>(key: K, value: PersonalForm[K]) {
    setPersonalForm((p) => ({ ...p, [key]: value }));
    setPersonalErrors((p) => ({ ...p, [key]: undefined }));
  }

  function validatePersonalInfo(): boolean {
    const e: Partial<Record<keyof PersonalForm, string>> = {};
    if (!personalForm.lrn.trim()) e.lrn = "LRN is required.";
    else if (personalForm.lrn.length !== 12) e.lrn = "Must be exactly 12 digits.";
    if (!personalForm.lastName.trim()) e.lastName = "Last name is required.";
    if (!personalForm.firstName.trim()) e.firstName = "First name is required.";
    if (!personalForm.birthdate) e.birthdate = "Birthdate is required.";
    setPersonalErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleBack() {
    if (page === 1) { navigate(ROUTES.students.root); return; }
    setPage(1);
  }

  function handleNext() {
    if (page === 1) {
      if (!validatePersonalInfo()) return;
      setPage(2);
    } else {
      // "Skip & Save" — save with whatever transcript data exists
      handleSubmit();
    }
  }

  async function handleSubmit() {
    if (!validatePersonalInfo()) {
      setPage(1);
      return;
    }
    try {
      setSubmitting(true);
      const studentData = formToStudent(personalForm);
      let targetStudentId: number;

      if (isEdit) {
        await updateStudent(Number(studentId), studentData);
        targetStudentId = Number(studentId);
      } else {
        const result = await createStudent(studentData as Student);
        targetStudentId = result.id;
      }

      // Save transcript if any school has a name filled in
      const hasTranscript = schoolRecords.some(r => r.schoolName.trim() !== "");
      if (hasTranscript) {
        await addTransfereeTranscript(targetStudentId, { records: schoolRecords });
      }

      navigate(isEdit ? ROUTES.students.profile(targetStudentId) : ROUTES.students.root);
    } catch (err) {
      console.error("Save student error:", err);
      alert(err instanceof Error ? err.message : "Failed to save student.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── School record handlers ──
  function updateSchoolField(id: string, field: keyof SchoolRecord, value: string) {
    setSchoolRecords((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  }
  function removeSchool(id: string) {
    setSchoolRecords((prev) => prev.filter((r) => r.id !== id));
  }
  function addSchool() {
    setSchoolRecords((prev) => [...prev, EMPTY_SCHOOL_RECORD()]);
  }
  function updateGradeYearField(schoolId: string, entryId: string, field: keyof GradeYearEntry, value: string) {
    setSchoolRecords((prev) => prev.map((r) =>
      r.id === schoolId ? { ...r, gradeYearEntries: r.gradeYearEntries.map((e) => e.id === entryId ? { ...e, [field]: value } : e) } : r
    ));
  }
  function removeGradeYearEntry(schoolId: string, entryId: string) {
    setSchoolRecords((prev) => prev.map((r) =>
      r.id === schoolId ? { ...r, gradeYearEntries: r.gradeYearEntries.filter((e) => e.id !== entryId) } : r
    ));
  }
  function addGradeYearEntry(schoolId: string) {
    setSchoolRecords((prev) => prev.map((r) =>
      r.id === schoolId ? { ...r, gradeYearEntries: [...r.gradeYearEntries, EMPTY_GRADE_YEAR_ENTRY()] } : r
    ));
  }
  function updateSubjectField(schoolId: string, entryId: string, subjectIdx: number, field: keyof SubjectGradeEntry, value: string) {
    setSchoolRecords((prev) => prev.map((r) =>
      r.id === schoolId ? {
        ...r, gradeYearEntries: r.gradeYearEntries.map((e) =>
          e.id === entryId ? {
            ...e, subjects: e.subjects.map((s, i) => i === subjectIdx ? { ...s, [field]: value } : s)
          } : e
        )
      } : r
    ));
  }

  // ── Loading screen ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-medium">Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Page heading */}
      <div className="px-6 pt-6 pb-0">
        <h1 className="text-2xl font-black text-slate-800">
          {isEdit ? "Edit Student Profile" : "Add Student"}
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {isEdit
            ? "Update the student's personal information and prior transcript records."
            : "Create a new student profile with personal information and prior transcript history."}
        </p>
      </div>

      {page === 1 && (
        <PersonalInfoPage form={personalForm} onChange={setPF} errors={personalErrors} />
      )}
      {page === 2 && (
        <TranscriptPage
          records={schoolRecords}
          onUpdateSchool={updateSchoolField}
          onRemoveSchool={removeSchool}
          onAddSchool={addSchool}
          onUpdateEntry={updateGradeYearField}
          onRemoveEntry={removeGradeYearEntry}
          onAddEntry={addGradeYearEntry}
          onUpdateSubject={updateSubjectField}
          allYears={allYears}
        />
      )}
    </div>
  );
}
