import { getAuth } from "firebase/auth";

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV 
  ? (import.meta.env.VITE_DEVELOPMENT_API_URL || "http://localhost:4000/api")
  : (import.meta.env.VITE_PRODUCTION_API_URL || "/api"));

/**
 * Authenticated fetch wrapper.
 * Automatically attaches the Firebase ID token as a Bearer token.
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const auth = getAuth();
  let token: string | null = null;

  if (auth.currentUser) {
    token = await auth.currentUser.getIdToken();
  }

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  // Only set Content-Type if not already set and not FormData
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, { ...options, headers });
}

// Re-export BASE_URL for use in api.ts
export { BASE_URL };
