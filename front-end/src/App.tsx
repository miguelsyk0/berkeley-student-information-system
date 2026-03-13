import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Auth ───────────────────────────────────────────────────────────────────────
import Login from "@/pages/auth/Login";
// import ForgotPassword from "@/pages/auth/ForgotPassword";

// ── Dashboard ──────────────────────────────────────────────────────────────────
import Dashboard from "@/pages/Dashboard";

// ── School & Sections ──────────────────────────────────────────────────────────
import SchoolProfile     from "@/pages/school/SchoolProfile";
import SchoolYearList    from "@/pages/school/SchoolYearList";
import SectionList       from "@/pages/school/SectionList";
import AdviserAssignment from "@/pages/school/AdviserAssignment";

// ── Students ───────────────────────────────────────────────────────────────────
import StudentList    from "@/pages/students/StudentList";
import StudentProfile from "@/pages/students/StudentProfile";
import StudentForm    from "@/pages/students/StudentForm";
import EnrollStudent  from "@/pages/students/EnrollStudent";

// ── Subjects ───────────────────────────────────────────────────────────────────
import SubjectList from "@/pages/subjects/SubjectList";
import SubjectForm from "@/pages/subjects/SubjectForm";

// ── Grade Import ───────────────────────────────────────────────────────────────
import ImportDashboard from "@/pages/import/ImportDashboard";
import NewImport       from "@/pages/import/NewImport";
import { ImportHistoryList, ImportLogDetail } from "@/pages/import/ImportHistory";

// ── Grade Encoding ─────────────────────────────────────────────────────────────
import GradeEncodingHome  from "@/pages/encoding/GradeEncodingHome";
import ClassGradeSheet    from "@/pages/encoding/ClassGradeSheet";
import StudentGradeView   from "@/pages/encoding/StudentGradeView";
import GeneralAverageView from "@/pages/encoding/GeneralAverageView";

// ── SF10 Generation ────────────────────────────────────────────────────────────
import SF10Home            from "@/pages/sf10/SF10Home";
import SingleStudentSF10   from "@/pages/sf10/SingleStudentSF10";
import BulkSF10Generation  from "@/pages/sf10/BulkSF10Generation";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Root redirect ── */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ── Auth (no sidebar) ── */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}

        {/* ── Dashboard ── */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ── School & Sections ── */}
        <Route path="/school">
          <Route index           element={<Navigate to="/school/profile" replace />} />
          <Route path="profile"  element={<SchoolProfile />} />
          <Route path="years"    element={<SchoolYearList />} />
          <Route path="sections" element={<SectionList />} />
          <Route path="advisers" element={<AdviserAssignment />} />
        </Route>

        {/* ── Students ── */}
        <Route path="/students">
          <Route index                  element={<StudentList />} />
          <Route path="add"             element={<StudentForm />} />
          <Route path="enroll"          element={<EnrollStudent />} />
          <Route path=":studentId"      element={<StudentProfile />} />
          <Route path=":studentId/edit" element={<StudentForm />} />
        </Route>

        {/* ── Subjects ── */}
        <Route path="/subjects">
          <Route index                    element={<SubjectList />} />
          <Route path="add"               element={<SubjectForm />} />
          <Route path=":subjectId/edit"   element={<SubjectForm />} />
        </Route>

        {/* ── Grade Import ── */}
        <Route path="/import">
          <Route index                element={<ImportDashboard />} />
          <Route path="new"           element={<NewImport />} />
          <Route path="history"       element={<ImportHistoryList />} />
          <Route path="history/:logId" element={<ImportLogDetail />} />
        </Route>

        {/* ── Grade Encoding ── */}
        <Route path="/grades">
          <Route index                          element={<GradeEncodingHome />} />
          <Route path="class"                   element={<ClassGradeSheet />} />
          <Route path="class/:sectionId"        element={<ClassGradeSheet />} />
          <Route path="student"                 element={<StudentGradeView />} />
          <Route path="student/:studentId"      element={<StudentGradeView />} />
          <Route path="general-average"         element={<GeneralAverageView />} />
        </Route>

        {/* ── SF10 Generation ── */}
        <Route path="/sf10">
          <Route index                          element={<SF10Home />} />
          <Route path="student/:studentId"      element={<SingleStudentSF10 />} />
          <Route path="bulk"                    element={<BulkSF10Generation />} />
        </Route>

        {/* ── 404 fallback ── */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}