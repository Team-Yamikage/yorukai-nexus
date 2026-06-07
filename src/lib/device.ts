/**
 * Stable, privacy-light device identifier used for server-side abuse defenses
 * (ban checks + rate limiting). This is NOT a security boundary on its own — it
 * is a deterrent against casual scraping. The raw id never identifies a person;
 * the server hashes it again with a secret before storing/comparing.
 */
const KEY = "yk_device_id";

function randomId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
}

/** Returns a stable per-device id, creating and persisting one if needed. */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // Private mode / storage disabled — fall back to a session-only id.
    return "no-storage";
  }
}
