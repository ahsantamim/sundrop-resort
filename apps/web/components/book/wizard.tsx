"use client";

import type { Villa } from "@sundrop/data/types";
import { Button, Input, Label, formatBdt, formatDay, nightsLabel, useI18n } from "@sundrop/ui";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { placeBooking } from "@/lib/actions";

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function monthMatrix(anchor: Date) {
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const gridStart = new Date(start);
  gridStart.setDate(1 - start.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

export function BookingWizard({
  villa,
  blocked,
  initial,
}: {
  villa: Villa;
  blocked: string[];
  initial: { checkIn?: string; checkOut?: string; adults: number; children: number };
}) {
  const { t, lang } = useI18n();
  const router = useRouter();
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const [cursor, setCursor] = useState(() => {
    const seed = initial.checkIn ? new Date(initial.checkIn) : new Date();
    return new Date(seed.getFullYear(), seed.getMonth(), 1);
  });
  const [checkIn, setCheckIn] = useState(initial.checkIn ?? "");
  const [checkOut, setCheckOut] = useState(initial.checkOut ?? "");
  const [adults, setAdults] = useState(initial.adults);
  const [children, setChildren] = useState(initial.children);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const blockedSet = useMemo(() => new Set(blocked), [blocked]);
  const nights = checkIn && checkOut ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000) : 0;
  const total = nights > 0 ? nights * villa.pricePerNight : 0;
  const days = monthMatrix(cursor);

  function pick(day: Date) {
    const value = iso(day);
    if (day < today || blockedSet.has(value)) return;
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(value);
      setCheckOut("");
      return;
    }
    if (value <= checkIn) {
      setCheckIn(value);
      return;
    }
    const span = Math.round((day.getTime() - new Date(checkIn).getTime()) / 86400000);
    if (span > 14) {
      setError(t("Stays in this demo are limited to 14 nights.", "এই ডেমোতে সর্বোচ্চ ১৪ রাত।"));
      return;
    }
    for (let cursorDay = new Date(checkIn); cursorDay < day; cursorDay.setDate(cursorDay.getDate() + 1)) {
      if (blockedSet.has(iso(cursorDay))) {
        setError(t("That range crosses a full night.", "এই পরিসরে একটি পূর্ণ রাত আছে।"));
        return;
      }
    }
    setError(null);
    setCheckOut(value);
  }

  function continueDates() {
    if (!checkIn || !checkOut || nights < 1) {
      setError(t("Choose a check-in and a check-out.", "চেক-ইন ও চেক-আউট বেছে নিন।"));
      return;
    }
    if (adults + children > villa.guests) {
      setError(t("This villa cannot hold that many guests.", "এই ভিলায় এতজন ধরে না।"));
      return;
    }
    if (villa.slug === "honeymoon-sunset" && children > 0) {
      setError(t("This sample plan is adults only.", "এই নমুনা প্ল্যান শুধু প্রাপ্তবয়স্কদের।"));
      return;
    }
    setError(null);
    setStep(2);
  }

  async function confirm() {
    setPending(true);
    setError(null);
    const result = await placeBooking({
      villaSlug: villa.slug,
      checkIn,
      checkOut,
      adults,
      children,
      guestName: name,
      mobile,
      email,
      whatsappUpdates: whatsapp,
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/booking/done/${result.data.token}`);
  }

  return (
    <main className="book-shell">
      <div className="book-card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span className="over">{t(`Step ${step} of 4`, `ধাপ ${step} / ৪`)}</span>
          <span className="sample">{t("Sample rate", "নমুনা ভাড়া")}</span>
        </div>
        <div className="progress" aria-hidden="true">{[1, 2, 3, 4].map((item) => <i key={item} className={item <= step ? "on" : ""} />)}</div>
        <h1 style={{ fontSize: 36, marginTop: 0 }}>{t(villa.name, villa.nameBn)}</h1>
        <p className="help">{t(villa.bed, villa.bedBn)} · {villa.sizeM2} m² · {formatBdt(villa.pricePerNight, lang)} {t("/ night", "/ রাত")}</p>

        {step === 1 ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <button type="button" className="chip" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>←</button>
              <b>{cursor.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", { month: "long", year: "numeric" })}</b>
              <button type="button" className="chip" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>→</button>
            </div>
            <div className="cal" style={{ marginTop: 12 }}>
              {(lang === "bn" ? ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"] : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]).map((label) => <span className="dow" key={label}>{label}</span>)}
              {days.map((day) => {
                const value = iso(day);
                const outside = day.getMonth() !== cursor.getMonth();
                const disabled = outside || day < today || blockedSet.has(value);
                const edge = value === checkIn || value === checkOut;
                const inside = checkIn && checkOut && value > checkIn && value < checkOut;
                return (
                  <button key={value + outside} type="button" disabled={disabled} className={edge ? "edge" : inside ? "in" : ""} onClick={() => pick(day)}>
                    {lang === "bn" ? day.getDate().toLocaleString("bn-BD") : day.getDate()}
                  </button>
                );
              })}
            </div>
            <div className="gp-row"><div><b>{t("Adults", "প্রাপ্তবয়স্ক")}</b><em>{t("Age 13+", "১৩+")}</em></div><Stepper value={adults} set={setAdults} min={1} max={6} /></div>
            <div className="gp-row"><div><b>{t("Children", "শিশু")}</b><em>{t("Age 2–12", "২–১২")}</em></div><Stepper value={children} set={setChildren} min={0} max={4} /></div>
            <p style={{ fontWeight: 800 }}>{nights > 0 ? `${nightsLabel(nights, lang)} · ${formatBdt(total, lang)}` : t("Select your stay", "থাকার দিন বেছে নিন")}</p>
            {error ? <p className="error">{error}</p> : null}
            <Button type="button" onClick={continueDates} style={{ width: "100%" }}>{t("Continue", "চালিয়ে যান")}</Button>
          </div>
        ) : null}

        {step === 2 ? (
          <div style={{ display: "grid", gap: 14 }}>
            <h2 style={{ fontSize: 32 }}>{t("Where should we send your confirmation?", "কোথায় নিশ্চিতকরণ পাঠাব?")}</h2>
            <p className="lede">{t("Your name, a mobile number and an email. No account.", "নাম, মোবাইল ও ইমেইল। কোনো অ্যাকাউন্ট নয়।")}</p>
            <div className="field"><Label htmlFor="name">{t("Full name", "পুরো নাম")}</Label><Input id="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></div>
            <div className="field"><Label htmlFor="mobile">{t("Mobile number", "মোবাইল নম্বর")}</Label><Input id="mobile" value={mobile} onChange={(event) => setMobile(event.target.value)} inputMode="tel" placeholder="01712-345678" autoComplete="tel" /><span className="help">{t("We’ll show the private link on the next screens. This demo does not send WhatsApp.", "পরের পর্দায় ব্যক্তিগত লিংক দেখাবে। এই ডেমো হোয়াটসঅ্যাপ পাঠায় না।")}</span></div>
            <div className="field"><Label htmlFor="email">{t("Email address", "ইমেইল")}</Label><Input id="email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" /></div>
            <label className="help"><input type="checkbox" checked={whatsapp} onChange={(event) => setWhatsapp(event.target.checked)} /> {t("Note that WhatsApp updates were requested (not sent).", "হোয়াটসঅ্যাপ আপডেট চাওয়া হয়েছে — পাঠানো হয় না।")}</label>
            {error ? <p className="error">{error}</p> : null}
            <div style={{ display: "flex", gap: 10 }}>
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>{t("Back", "পিছনে")}</Button>
              <Button type="button" onClick={() => (name.trim().length < 2 ? setError(t("Enter the guest’s name.", "অতিথির নাম লিখুন।")) : setStep(3))}>{t("Review booking", "পর্যালোচনা করুন")}</Button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div style={{ display: "grid", gap: 10 }}>
            <h2 style={{ fontSize: 32 }}>{t("Review & confirm", "পর্যালোচনা ও নিশ্চিত")}</h2>
            <Row label={t("Dates", "তারিখ")} value={`${formatDay(checkIn, lang)} – ${formatDay(checkOut, lang)} · ${nightsLabel(nights, lang)}`} onEdit={() => setStep(1)} edit={t("Edit", "সম্পাদনা")} />
            <Row label={t("Guests", "অতিথি")} value={t(`${adults} adults${children ? `, ${children} children` : ""}`, `${adults} জন প্রাপ্তবয়স্ক${children ? `, ${children} শিশু` : ""}`)} onEdit={() => setStep(1)} edit={t("Edit", "সম্পাদনা")} />
            <Row label={t("Guest", "অতিথি")} value={`${name} · ${mobile} · ${email}`} onEdit={() => setStep(2)} edit={t("Edit", "সম্পাদনা")} />
            <p>{formatBdt(villa.pricePerNight, lang)} × {nightsLabel(nights, lang)} · <b>{formatBdt(total, lang)}</b></p>
            <p className="help">{t("Boat transfer is listed as free in this demo. VAT is not calculated separately. Total is a sample figure, due nowhere — pay-at-resort is only a label.", "বোট ট্রান্সফার এই ডেমোতে বিনামূল্যে। ভ্যাট আলাদা করা হয়নি। মোট নমুনা সংখ্যা।")}</p>
            <p className="help">{t("Free cancellation until 72 hours before check-in. After that the demo will refuse a guest cancel.", "চেক-ইনের ৭২ ঘণ্টা আগে পর্যন্ত বিনামূল্যে বাতিল। এরপর ডেমো অতিথির বাতিল নেবে না।")}</p>
            {error ? <p className="error">{error}</p> : null}
            <Button type="button" variant="accent" disabled={pending} onClick={confirm}>{pending ? t("Saving…", "সংরক্ষণ…") : t(`Confirm booking · ${formatBdt(total, lang)}`, `বুকিং নিশ্চিত করুন · ${formatBdt(total, lang)}`)}</Button>
            <button type="button" className="more" onClick={() => setStep(2)}>{t("Back", "পিছনে")}</button>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function Stepper({ value, set, min, max }: { value: number; set: (n: number) => void; min: number; max: number }) {
  return (
    <div className="step">
      <button type="button" onClick={() => set(Math.max(min, value - 1))}>−</button>
      <output>{value}</output>
      <button type="button" onClick={() => set(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

function Row({ label, value, onEdit, edit }: { label: string; value: string; onEdit: () => void; edit: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
      <div><b>{label}</b><div>{value}</div></div>
      <button type="button" className="more" onClick={onEdit}>{edit}</button>
    </div>
  );
}
