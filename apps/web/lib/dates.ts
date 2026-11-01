/** Local-time ISO day helpers. `new Date("YYYY-MM-DD")` parses as UTC, so never use it for stay dates. */

export const MAX_NIGHTS = 14;

export function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseIso(value: string | undefined | null) {
  const match = value ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function todayIso() {
  return iso(new Date());
}

export function addDays(value: string, days: number) {
  const date = parseIso(value) ?? new Date();
  date.setDate(date.getDate() + days);
  return iso(date);
}

export function nights(checkIn: string, checkOut: string) {
  const start = parseIso(checkIn);
  const end = parseIso(checkOut);
  if (!start || !end) return 0;
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

export function shortDay(value: string, lang: "en" | "bn") {
  const date = parseIso(value);
  if (!date) return "—";
  return date.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", { weekday: "short", day: "numeric", month: "short" });
}
