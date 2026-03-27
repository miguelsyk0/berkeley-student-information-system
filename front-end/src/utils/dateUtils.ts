/**
 * Utility functions for date and time management.
 */

/**
 * Calculates current age from birthdate.
 */
export function getAge(birthdate: string): number {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/**
 * Formats a date ISO string to a long Philippine Date format (e.g., March 15, 2012).
 */
export function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "long", day: "numeric", year: "numeric",
  });
}

/**
 * Formats a date ISO string to a combined date/time format.
 */
export function formatDateTime(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

/**
 * Returns a human-readable relative time string (e.g., "2 hours ago").
 */
export function relativeTime(iso: string): string {
  if (!iso) return "";
  const dateObj = new Date(iso);
  const diff = Date.now() - dateObj.getTime();
  const hours = Math.floor(diff / 3600000);
  
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  
  return dateObj.toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  });
}
