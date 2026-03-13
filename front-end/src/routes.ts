// ── Route constants ────────────────────────────────────────────────────────────
// Single source of truth for all route paths.
// Use these everywhere instead of raw strings.

export const ROUTES = {
  dashboard: "/dashboard",
  login:     "/login",
  forgotPassword: "/forgot-password",
  settings:  "/settings",

  school: {
    root:     "/school",
    profile:  "/school/profile",
    years:    "/school/years",
    sections: "/school/sections",
    advisers: "/school/advisers",
  },

  students: {
    root:    "/students",
    add:     "/students/add",
    enroll:  "/students/enroll",
    profile: (id: number | string) => `/students/${id}`,
    edit:    (id: number | string) => `/students/${id}/edit`,
  },

  subjects: {
    root: "/subjects",
    add:  "/subjects/add",
    edit: (id: number | string) => `/subjects/${id}/edit`,
  },

  import: {
    root:      "/import",
    new:       "/import/new",
    history:   "/import/history",
    logDetail: (id: number | string) => `/import/history/${id}`,
  },

  grades: {
    root:           "/grades",
    generalAverage: "/grades/general-average",
    classSheet:     (sectionId?: number | string) =>
      sectionId ? `/grades/class/${sectionId}` : "/grades/class",
    studentView:    "/grades/student",
    studentDetail:  (studentId: number | string) => `/grades/student/${studentId}`,
  },

  sf10: {
    root:    "/sf10",
    student: (studentId: number | string) => `/sf10/student/${studentId}`,
    bulk:    "/sf10/bulk",
  },
} as const;