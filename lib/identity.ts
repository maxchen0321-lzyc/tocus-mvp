const ANON_KEY = "tocus_anonymous_id";

export function getAnonymousId() {
  if (typeof window === "undefined") {
    return "server-anon";
  }
  const existing = window.localStorage.getItem(ANON_KEY);
  if (existing) return existing;
  const next = crypto.randomUUID();
  window.localStorage.setItem(ANON_KEY, next);
  return next;
}
