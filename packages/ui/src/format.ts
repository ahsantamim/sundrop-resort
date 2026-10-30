const BN = "০১২৩৪৫৬৭৮৯";

export function toBnDigits(value: string | number) {
  return String(value).replace(/\d/g, (digit) => BN[Number(digit)] ?? digit);
}

export function formatBdt(amount: number, lang: "en" | "bn" = "en") {
  const formatted = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);
  const labeled = `৳${formatted}`;
  return lang === "bn" ? toBnDigits(labeled) : labeled;
}

export function formatNumber(amount: number, lang: "en" | "bn" = "en", digits = 0) {
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
  return lang === "bn" ? toBnDigits(formatted) : formatted;
}

export function formatDay(iso: string, lang: "en" | "bn" = "en", withWeekday = true) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  const date = new Date(year, month - 1, day);
  const text = date.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", {
    weekday: withWeekday ? "short" : undefined,
    day: "numeric",
    month: "short",
    year: withWeekday ? undefined : "numeric",
  });
  return text;
}

export function nightsLabel(nights: number, lang: "en" | "bn") {
  if (lang === "bn") return `${toBnDigits(nights)} রাত`;
  return `${nights} night${nights === 1 ? "" : "s"}`;
}
