"use client";

import type { Villa } from "@sundrop/data/types";
import { Button, Input, Label, formatBdt, formatDay, nightsLabel, useI18n } from "@sundrop/ui";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { GuestsPanel } from "@/components/booking/guests";
import { RangeCalendar, type Focus, type Range } from "@/components/dates/range-calendar";
import { placeBooking } from "@/lib/actions";
import { nights as countNights } from "@/lib/dates";
import { guestLabel } from "@/lib/guests";
import { Scenery } from "@/components/chrome/scenery";

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
  const [range, setRange] = useState<Range>({ checkIn: initial.checkIn ?? "", checkOut: initial.checkOut ?? "" });
  const [focus, setFocus] = useState<Focus>(initial.checkIn && !initial.checkOut ? "end" : "start");
  const { checkIn, checkOut } = range;
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
  const isBlocked = useCallback((day: string) => blockedSet.has(day), [blockedSet]);
  const nights = checkIn && checkOut ? countNights(checkIn, checkOut) : 0;
  const total = nights > 0 ? nights * villa.pricePerNight : 0;

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

  const guests = guestLabel(adults, children, lang);

  return (
    <main className="book-shell">
      <Scenery />
      <div className="wrap book-layout">
        <div className="book-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <span className="over">{t(`Step ${step} of 4`, `ধাপ ${step.toLocaleString("bn-BD")} / ৪`)}</span>
            <span className="sample">{t("Sample rate", "নমুনা ভাড়া")}</span>
          </div>
          <div className="progress" aria-hidden="true">{[1, 2, 3, 4].map((item) => <i key={item} className={item <= step ? "on" : ""} />)}</div>

          {step === 1 ? (
            <div style={{ display: "grid", gap: 18 }}>
              <div>
                <h1 className="serif-swap">{t("When are you coming?", "কবে আসছেন?")}</h1>
                <p className="lede" style={{ margin: 0 }}>{t("Crossed-out days are full for this villa. Stays run up to 14 nights.", "কাটা দাগের দিনগুলোতে এই ভিলা পূর্ণ। সর্বোচ্চ ১৪ রাত থাকা যায়।")}</p>
              </div>
              <RangeCalendar
                value={range}
                focus={focus}
                isBlocked={isBlocked}
                onChange={(next, meta) => {
                  setRange(next);
                  setFocus(meta.focus);
                  setError(null);
                }}
              >
                {checkIn ? <button type="button" className="text-btn" onClick={() => { setRange({ checkIn: "", checkOut: "" }); setFocus("start"); }}>{t("Clear", "মুছুন")}</button> : null}
              </RangeCalendar>
              <div>
                <span className="over" style={{ color: "var(--teal-700)" }}>{t("Guests", "অতিথি")}</span>
                <GuestsPanel
                  adults={adults}
                  childCount={children}
                  setAdults={setAdults}
                  setChildren={setChildren}
                  maxAdults={Math.max(1, villa.guests - children)}
                  maxChildren={villa.slug === "honeymoon-sunset" ? 0 : Math.max(0, Math.min(4, villa.guests - adults))}
                />
              </div>
              {error ? <p className="notice" role="alert" style={{ margin: 0 }}>{error}</p> : null}
              <Button type="button" onClick={continueDates} style={{ width: "100%" }}>
                {nights > 0 ? t(`Continue · ${nightsLabel(nights, "en")}`, `চালিয়ে যান · ${nightsLabel(nights, "bn")}`) : t("Continue", "চালিয়ে যান")}
              </Button>
            </div>
          ) : null}

          {step === 2 ? (
            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <h1 className="serif-swap">{t("Where should we send your confirmation?", "কোথায় নিশ্চিতকরণ পাঠাব?")}</h1>
                <p className="lede" style={{ margin: 0 }}>{t("Your name, a mobile number and an email. No account.", "নাম, মোবাইল ও ইমেইল। কোনো অ্যাকাউন্ট নয়।")}</p>
              </div>
              <div className="field"><Label htmlFor="name">{t("Full name", "পুরো নাম")}</Label><Input id="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></div>
              <div className="field"><Label htmlFor="mobile">{t("Mobile number", "মোবাইল নম্বর")}</Label><Input id="mobile" value={mobile} onChange={(event) => setMobile(event.target.value)} inputMode="tel" placeholder="01712-345678" autoComplete="tel" /><span className="help">{t("We’ll show the private link on the next screens. This demo does not send WhatsApp.", "পরের পর্দায় ব্যক্তিগত লিংক দেখাবে। এই ডেমো হোয়াটসঅ্যাপ পাঠায় না।")}</span></div>
              <div className="field"><Label htmlFor="email">{t("Email address", "ইমেইল")}</Label><Input id="email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" /></div>
              <label className="help" style={{ display: "flex", gap: 10, alignItems: "center" }}><input type="checkbox" checked={whatsapp} onChange={(event) => setWhatsapp(event.target.checked)} /> {t("Note that WhatsApp updates were requested (not sent).", "হোয়াটসঅ্যাপ আপডেট চাওয়া হয়েছে — পাঠানো হয় না।")}</label>
              {error ? <p className="notice" role="alert" style={{ margin: 0 }}>{error}</p> : null}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>{t("Back", "পিছনে")}</Button>
                <Button type="button" onClick={() => (name.trim().length < 2 ? setError(t("Enter the guest’s name.", "অতিথির নাম লিখুন।")) : (setError(null), setStep(3)))}>{t("Review booking", "পর্যালোচনা করুন")}</Button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div style={{ display: "grid", gap: 16 }}>
              <h1 className="serif-swap">{t("Review & confirm", "পর্যালোচনা ও নিশ্চিত")}</h1>
              <dl className="kv">
                <Row label={t("Dates", "তারিখ")} value={`${formatDay(checkIn, lang)} – ${formatDay(checkOut, lang)}`} onEdit={() => setStep(1)} edit={t("Edit", "সম্পাদনা")} />
                <Row label={t("Guests", "অতিথি")} value={guests} onEdit={() => setStep(1)} edit={t("Edit", "সম্পাদনা")} />
                <Row label={t("Guest", "অতিথি")} value={[name, mobile, email].filter(Boolean).join(" · ")} onEdit={() => setStep(2)} edit={t("Edit", "সম্পাদনা")} />
              </dl>
              <p className="help" style={{ margin: 0 }}>{t("Boat transfer is listed as free in this demo. VAT is not calculated separately. Total is a sample figure, due nowhere — pay-at-resort is only a label.", "বোট ট্রান্সফার এই ডেমোতে বিনামূল্যে। ভ্যাট আলাদা করা হয়নি। মোট নমুনা সংখ্যা।")}</p>
              <p className="help" style={{ margin: 0 }}>{t("Free cancellation until 72 hours before check-in. After that the demo will refuse a guest cancel.", "চেক-ইনের ৭২ ঘণ্টা আগে পর্যন্ত বিনামূল্যে বাতিল। এরপর ডেমো অতিথির বাতিল নেবে না।")}</p>
              {error ? <p className="notice" role="alert" style={{ margin: 0 }}>{error}</p> : null}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>{t("Back", "পিছনে")}</Button>
                <Button type="button" variant="accent" disabled={pending} onClick={confirm}>{pending ? t("Saving…", "সংরক্ষণ…") : t(`Confirm booking · ${formatBdt(total, lang)}`, `বুকিং নিশ্চিত করুন · ${formatBdt(total, lang)}`)}</Button>
              </div>
            </div>
          ) : null}
        </div>

        <aside className="sticky-card">
          <div className="book-card summary">
            <div className="photo"><Image src={villa.image} alt={t(villa.name, villa.nameBn)} fill sizes="380px" /></div>
            <div className="summary-in">
              <div>
                <span className="over" style={{ color: "var(--teal-700)" }}>{t(villa.category, villa.categoryBn)}</span>
                <h2 className="serif-swap" style={{ margin: "8px 0 0" }}>{t(villa.name, villa.nameBn)}</h2>
                <p className="help" style={{ margin: "6px 0 0" }}>{t(villa.bed, villa.bedBn)} · {villa.sizeM2} m² · <Link className="text-btn" href="/villas">{t("Change villa", "ভিলা বদলান")}</Link></p>
              </div>
              <dl className="kv">
                <div><dt>{t("Check-in", "চেক-ইন")}</dt><dd>{checkIn ? formatDay(checkIn, lang) : "—"}</dd></div>
                <div><dt>{t("Check-out", "চেক-আউট")}</dt><dd>{checkOut ? formatDay(checkOut, lang) : "—"}</dd></div>
                <div><dt>{t("Guests", "অতিথি")}</dt><dd>{guests}</dd></div>
              </dl>
              <div className="total">
                <span className="help">{nights > 0 ? `${formatBdt(villa.pricePerNight, lang)} × ${nightsLabel(nights, lang)}` : `${formatBdt(villa.pricePerNight, lang)} ${t("/ night", "/ রাত")}`}</span>
                <b>{nights > 0 ? formatBdt(total, lang) : "—"}</b>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Row({ label, value, onEdit, edit }: { label: string; value: string; onEdit: () => void; edit: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}<button type="button" className="text-btn" onClick={onEdit}>{edit}</button></dd>
    </div>
  );
}
