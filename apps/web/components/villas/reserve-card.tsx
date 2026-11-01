"use client";

import type { Villa } from "@sundrop/data/types";
import { Button, formatBdt, nightsLabel, useI18n } from "@sundrop/ui";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { GuestsPanel } from "@/components/booking/guests";
import { RangeCalendar, type Focus, type Range } from "@/components/dates/range-calendar";
import { Popover } from "@/components/ui/popover";
import { nights, shortDay } from "@/lib/dates";
import { guestLabel } from "@/lib/guests";

export function ReserveCard({
  villa,
  blocked,
  initial,
}: {
  villa: Villa;
  blocked: string[];
  initial: Range & { adults: number; children: number };
}) {
  const { t, lang } = useI18n();
  const router = useRouter();
  const datesRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLButtonElement>(null);
  const [range, setRange] = useState<Range>({ checkIn: initial.checkIn, checkOut: initial.checkOut });
  const [focus, setFocus] = useState<Focus>("start");
  const [open, setOpen] = useState<Focus | "guests" | null>(null);
  const [adults, setAdults] = useState(Math.min(initial.adults, villa.guests));
  const [children, setChildren] = useState(Math.min(initial.children, Math.max(0, villa.guests - 1)));
  const blockedSet = useMemo(() => new Set(blocked), [blocked]);
  const isBlocked = useCallback((day: string) => blockedSet.has(day), [blockedSet]);
  const close = useCallback(() => setOpen(null), []);
  const stay = range.checkIn && range.checkOut ? nights(range.checkIn, range.checkOut) : 0;
  const datesOpen = open === "start" || open === "end";

  function openDates(which: Focus) {
    setFocus(which === "end" && !range.checkIn ? "start" : which);
    setOpen(which);
  }

  function reserve() {
    if (!stay) {
      openDates(range.checkIn ? "end" : "start");
      return;
    }
    const params = new URLSearchParams({ villa: villa.slug, ...range, adults: String(adults), children: String(children) });
    router.push(`/book?${params}`);
  }

  return (
    <div className="book-card" style={{ display: "grid", gap: 16 }}>
      <div>
        <div className="sample">{t("Sample rate", "নমুনা ভাড়া")}</div>
        <div className="price" style={{ marginTop: 8 }}>{formatBdt(villa.pricePerNight, lang)}<small>{t("/ night", "/ রাত")}</small></div>
      </div>
      <div className="date-pair" ref={datesRef}>
        <button type="button" className={datesOpen && focus === "start" ? "active" : ""} onClick={() => openDates("start")}>
          <small>{t("Check-in", "চেক-ইন")}</small>
          <span>{range.checkIn ? shortDay(range.checkIn, lang) : t("Add date", "তারিখ দিন")}</span>
        </button>
        <button type="button" className={datesOpen && focus === "end" ? "active" : ""} onClick={() => openDates("end")}>
          <small>{t("Check-out", "চেক-আউট")}</small>
          <span>{range.checkOut ? shortDay(range.checkOut, lang) : t("Add date", "তারিখ দিন")}</span>
        </button>
      </div>
      <button type="button" ref={guestsRef} className={`guest-btn ${open === "guests" ? "active" : ""}`} onClick={() => setOpen(open === "guests" ? null : "guests")}>
        <small>{t("Guests", "অতিথি")}</small>
        <span>{guestLabel(adults, children, lang)}</span>
      </button>
      {stay > 0 ? (
        <div className="total">
          <span className="help">{formatBdt(villa.pricePerNight, lang)} × {nightsLabel(stay, lang)}</span>
          <b>{formatBdt(stay * villa.pricePerNight, lang)}</b>
        </div>
      ) : null}
      <Button type="button" onClick={reserve} style={{ width: "100%" }}>
        {stay ? t("Reserve — no login needed", "রিজার্ভ করুন — লগইন লাগবে না") : t("Choose dates", "তারিখ বেছে নিন")} <ArrowRight />
      </Button>
      <p className="help" style={{ margin: 0 }}>
        {t("No payment now. A request stays pending until the admin demo accepts it.", "এখন কোনো পেমেন্ট নেই। অ্যাডমিন গ্রহণ না করা পর্যন্ত অনুরোধ অপেক্ষমাণ থাকে।")}
      </p>
      <Popover anchor={datesRef} open={datesOpen} onClose={close} width={720} label={t("Choose dates", "তারিখ বেছে নিন")}>
        <RangeCalendar
          value={range}
          focus={focus}
          isBlocked={isBlocked}
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
        <GuestsPanel
          adults={adults}
          childCount={children}
          setAdults={setAdults}
          setChildren={setChildren}
          maxAdults={villa.guests - children}
          maxChildren={Math.min(4, villa.guests - adults)}
        />
        <p className="help" style={{ margin: "4px 0 12px" }}>{t(`Sleeps up to ${villa.guests}.`, `সর্বোচ্চ ${villa.guests.toLocaleString("bn-BD")} জন।`)}</p>
        <Button type="button" size="sm" style={{ width: "100%" }} onClick={close}>{t("Done", "হয়েছে")}</Button>
      </Popover>
    </div>
  );
}
