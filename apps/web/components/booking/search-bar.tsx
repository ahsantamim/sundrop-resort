"use client";

import { Button, useI18n } from "@sundrop/ui";
import { ArrowRight, CalendarDays, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { RangeCalendar, type Focus, type Range } from "@/components/dates/range-calendar";
import { Popover } from "@/components/ui/popover";
import { nights, shortDay } from "@/lib/dates";
import { guestLabel } from "@/lib/guests";
import { GuestsPanel } from "./guests";

type Open = Focus | "guests" | null;

/** The pill search from the landing hero, reused on the villas page. */
export function SearchBar({
  initial,
  onSearch,
  className = "",
}: {
  initial: Range & { adults: number; children: number };
  onSearch?: (nights: number) => void;
  className?: string;
}) {
  const { t, lang } = useI18n();
  const router = useRouter();
  const datesRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLButtonElement>(null);
  const [range, setRange] = useState<Range>({ checkIn: initial.checkIn, checkOut: initial.checkOut });
  const [focus, setFocus] = useState<Focus>("start");
  const [open, setOpen] = useState<Open>(null);
  const [adults, setAdults] = useState(initial.adults);
  const [children, setChildren] = useState(initial.children);
  const close = useCallback(() => setOpen(null), []);
  const datesOpen = open === "start" || open === "end";

  function openDates(which: Focus) {
    setFocus(which === "end" && !range.checkIn ? "start" : which);
    setOpen(which);
  }

  function submit() {
    if (!range.checkIn || !range.checkOut) {
      openDates(range.checkIn ? "end" : "start");
      return;
    }
    setOpen(null);
    onSearch?.(nights(range.checkIn, range.checkOut));
    const params = new URLSearchParams({ ...range, adults: String(adults), children: String(children) });
    router.push(`/villas?${params}`);
  }

  return (
    <>
      <form
        className={`search ${className}`}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="search-dates" ref={datesRef}>
          <button type="button" className={`cell ${datesOpen && focus === "start" ? "active" : ""}`} aria-expanded={datesOpen} onClick={() => openDates("start")}>
            <CalendarDays className="cell-ico" aria-hidden />
            <span>
              <small>{t("Check-in", "চেক-ইন")}</small>
              <span className="v">{range.checkIn ? shortDay(range.checkIn, lang) : t("Add date", "তারিখ দিন")}</span>
            </span>
          </button>
          <button type="button" className={`cell ${datesOpen && focus === "end" ? "active" : ""}`} aria-expanded={datesOpen} onClick={() => openDates("end")}>
            <CalendarDays className="cell-ico" aria-hidden />
            <span>
              <small>{t("Check-out", "চেক-আউট")}</small>
              <span className="v">{range.checkOut ? shortDay(range.checkOut, lang) : t("Add date", "তারিখ দিন")}</span>
            </span>
          </button>
        </div>
        <button type="button" ref={guestsRef} className={`cell ${open === "guests" ? "active" : ""}`} aria-expanded={open === "guests"} onClick={() => setOpen(open === "guests" ? null : "guests")}>
          <Users className="cell-ico" aria-hidden />
          <span>
            <small>{t("Guests", "অতিথি")}</small>
            <span className="v">{guestLabel(adults, children, lang)}</span>
          </span>
        </button>
        <Button type="submit" size="lg">
          {t("Check availability", "খালি আছে কিনা দেখুন")} <ArrowRight />
        </Button>
      </form>
      <Popover anchor={datesRef} open={datesOpen} onClose={close} width={720} label={t("Choose dates", "তারিখ বেছে নিন")}>
        <RangeCalendar
          value={range}
          focus={focus}
          onChange={(next, meta) => {
            setRange(next);
            setFocus(meta.focus);
            if (meta.done) setOpen(null);
          }}
        >
          <button type="button" className="text-btn" onClick={() => { setRange({ checkIn: "", checkOut: "" }); setFocus("start"); }}>
            {t("Clear", "মুছুন")}
          </button>
        </RangeCalendar>
      </Popover>
      <Popover anchor={guestsRef} open={open === "guests"} onClose={close} width={320} label={t("Guests", "অতিথি")}>
        <GuestsPanel adults={adults} childCount={children} setAdults={setAdults} setChildren={setChildren} />
        <Button type="button" size="sm" style={{ width: "100%", marginTop: 12 }} onClick={close}>{t("Done", "হয়েছে")}</Button>
      </Popover>
    </>
  );
}
