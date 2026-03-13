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
    root:    "/grades",
    student: "/grades/student",
  },

  sf10: "/sf10",
} as const;