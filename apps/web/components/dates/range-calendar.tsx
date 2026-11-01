"use client";

import { nightsLabel, useI18n } from "@sundrop/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MAX_NIGHTS, addDays, iso, nights, parseIso, shortDay, todayIso } from "@/lib/dates";

export type Range = { checkIn: string; checkOut: string };
export type Focus = "start" | "end";

const DOW = {
  en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  bn: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"],
};
const AHEAD_MONTHS = 14;

function useMonthCount(fixed?: number) {
  const [count, setCount] = useState(fixed ?? 2);
  useEffect(() => {
    if (fixed) return;
    const media = window.matchMedia("(max-width: 760px)");
    const sync = () => setCount(media.matches ? 1 : 2);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [fixed]);
  return fixed ?? count;
}

function monthStart(value: string) {
  const date = parseIso(value) ?? new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Two-click range picker shared by the hero search, the villas search,
 * the villa reserve card and the booking wizard. `isBlocked` marks nights
 * that cannot be slept; a blocked night can still be a check-out day.
 */
export function RangeCalendar({
  value,
  focus,
  onChange,
  isBlocked,
  months: fixedMonths,
  maxNights = MAX_NIGHTS,
  children,
}: {
  value: Range;
  focus: Focus;
  onChange: (next: Range, meta: { focus: Focus; done: boolean }) => void;
  isBlocked?: (day: string) => boolean;
  months?: number;
  maxNights?: number;
  children?: React.ReactNode;
}) {
  const { t, lang } = useI18n();
  const months = useMonthCount(fixedMonths);
  const today = todayIso();
  const [cursor, setCursor] = useState(() => monthStart(value.checkIn || today));
  const [hover, setHover] = useState<string | null>(null);
  const { checkIn, checkOut } = value;
  const choosingEnd = focus === "end" && Boolean(checkIn);

  // Latest valid check-out from the current check-in: capped by the night limit and the first blocked night.
  const lastOut = useMemo(() => {
    if (!checkIn) return "";
    let day = checkIn;
    for (let i = 0; i < maxNights; i += 1) {
      if (isBlocked?.(day)) return day;
      day = addDays(day, 1);
    }
    return day;
  }, [checkIn, isBlocked, maxNights]);

  const earliest = monthStart(today);
  const latest = new Date(earliest.getFullYear(), earliest.getMonth() + AHEAD_MONTHS, 1);
  const canBack = cursor > earliest;
  const canForward = new Date(cursor.getFullYear(), cursor.getMonth() + months, 1) <= latest;

  function disabled(day: string) {
    if (day < today) return true;
    if (choosingEnd && day > checkIn) return day > lastOut;
    return Boolean(isBlocked?.(day));
  }

  function pick(day: string) {
    if (choosingEnd && day > checkIn) {
      onChange({ checkIn, checkOut: day }, { focus: "start", done: true });
      return;
    }
    const keep = checkOut > day && nights(day, checkOut) <= maxNights && ![...Array(nights(day, checkOut))].some((_, i) => isBlocked?.(addDays(day, i)));
    onChange({ checkIn: day, checkOut: keep ? checkOut : "" }, { focus: "end", done: false });
  }

  const previewEnd = choosingEnd && hover && hover > checkIn && hover <= lastOut ? hover : checkOut;
  const stay = checkIn && checkOut ? nights(checkIn, checkOut) : 0;

  return (
    <div className="rc">
      <div className="rc-months" style={{ gridTemplateColumns: `repeat(${months}, minmax(0, 1fr))` }}>
        {Array.from({ length: months }, (_, offset) => {
          const first = new Date(cursor.getFullYear(), cursor.getMonth() + offset, 1);
          const pad = first.getDay();
          const count = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
          return (
            <div className="rc-month" key={iso(first)}>
              <div className="rc-head">
                {offset === 0 ? (
                  <button type="button" className="rc-nav" disabled={!canBack} aria-label={t("Previous month", "আগের মাস")} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
                    <ChevronLeft size={18} />
                  </button>
                ) : <span className="rc-nav-gap" />}
                <b className="serif-swap">{first.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", { month: "long", year: "numeric" })}</b>
                {offset === months - 1 ? (
                  <button type="button" className="rc-nav" disabled={!canForward} aria-label={t("Next month", "পরের মাস")} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
                    <ChevronRight size={18} />
                  </button>
                ) : <span className="rc-nav-gap" />}
              </div>
              <div className="rc-grid" onPointerLeave={() => setHover(null)}>
                {DOW[lang].map((label) => <span className="rc-dow" key={label}>{label}</span>)}
                {Array.from({ length: pad }, (_, i) => <span key={`pad${i}`} />)}
                {Array.from({ length: count }, (_, i) => {
                  const day = iso(new Date(first.getFullYear(), first.getMonth(), i + 1));
                  const off = disabled(day);
                  const start = day === checkIn;
                  const end = day === previewEnd;
                  const inside = Boolean(checkIn && previewEnd && day > checkIn && day < previewEnd);
                  const classes = [
                    "rc-day",
                    start && previewEnd ? "start" : start ? "solo" : "",
                    end ? "end" : "",
                    inside ? "in" : "",
                    day === today ? "today" : "",
                    off && day >= today ? "blocked" : "",
                  ].filter(Boolean).join(" ");
                  return (
                    <button
                      key={day}
                      type="button"
                      className={classes}
                      disabled={off}
                      aria-pressed={start || day === checkOut}
                      aria-label={shortDay(day, lang)}
                      onPointerEnter={() => setHover(day)}
                      onClick={() => pick(day)}
                    >
                      <span>{lang === "bn" ? (i + 1).toLocaleString("bn-BD") : i + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="rc-foot">
        <p>
          {stay > 0 ? (
            <><b>{shortDay(checkIn, lang)} → {shortDay(checkOut, lang)}</b> · {nightsLabel(stay, lang)}</>
          ) : checkIn ? (
            t(`Now pick a check-out · up to ${maxNights} nights`, `এবার চেক-আউট বেছে নিন · সর্বোচ্চ ${maxNights.toLocaleString("bn-BD")} রাত`)
          ) : (
            t("Pick a check-in date", "চেক-ইনের তারিখ বেছে নিন")
          )}
        </p>
        {children}
      </div>
    </div>
  );
}
