import { getRepo } from "@sundrop/data";
import { Button, formatBdt, formatDay, nightsLabel } from "@sundrop/ui";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CancelControl } from "@/components/book/manage";
import { getLang } from "@/lib/lang";
import { guestLabel } from "@/lib/guests";
import { Scenery } from "@/components/chrome/scenery";

export const metadata: Metadata = { title: "Manage booking", robots: { index: false, follow: false } };

export default async function ManageBookingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const booking = await getRepo().getBookingByToken(token);
  if (!booking) notFound();
  const villa = (await getRepo().listVillas()).find((item) => item.id === booking.villaId);
  const { lang, t } = await getLang();
  const deadline = new Date(`${booking.checkIn}T00:00:00`);
  deadline.setHours(deadline.getHours() - 72);
  const openStatus = booking.status === "pending" || booking.status === "confirmed";
  const canCancel = openStatus && new Date() < deadline;

  return (
    <main className="book-shell">
      <Scenery />
      <div className="wrap book-layout">
        <div className="book-card" style={{ display: "grid", gap: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span className="over">{booking.reference}</span>
            <span className={`pill ${booking.status}`}><i />{booking.status}</span>
          </div>
          <h1 className="serif-swap" style={{ margin: 0 }}>{t("Your island stay", "আপনার দ্বীপের থাকা")}</h1>
          <dl className="kv">
            <div><dt>{t("Check-in", "চেক-ইন")}</dt><dd>{formatDay(booking.checkIn, lang)} · {t("2:00 pm", "দুপুর ২টা")}</dd></div>
            <div><dt>{t("Check-out", "চেক-আউট")}</dt><dd>{formatDay(booking.checkOut, lang)} · {t("12:00 pm", "দুপুর ১২টা")}</dd></div>
            <div><dt>{t("Guests", "অতিথি")}</dt><dd>{booking.guestName} · {guestLabel(booking.adults, booking.children, lang)}</dd></div>
            <div><dt>{t("Contact", "যোগাযোগ")}</dt><dd>{booking.mobile}<br />{booking.email}</dd></div>
            {booking.cancelReason ? <div><dt>{t("Reason", "কারণ")}</dt><dd>{booking.cancelReason}</dd></div> : null}
          </dl>
          <p className="help" style={{ margin: 0 }}>
            {t(
              `Free cancellation until ${deadline.toLocaleString("en-GB")}. After that this demo refuses a guest cancel.`,
              `বিনামূল্যে বাতিল ${deadline.toLocaleString("bn-BD")} পর্যন্ত। এরপর ডেমো অতিথির বাতিল নেবে না।`,
            )}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button asChild><Link href={`/b/${token}/voucher`}>{t("Printable voucher", "প্রিন্টযোগ্য ভাউচার")}</Link></Button>
            {canCancel ? <CancelControl token={token} lang={lang} /> : null}
          </div>
        </div>
        <aside className="sticky-card">
          <div className="book-card summary">
            {villa ? <div className="photo"><Image src={villa.image} alt={t(villa.name, villa.nameBn)} fill sizes="380px" /></div> : null}
            <div className="summary-in">
              <h2 className="serif-swap" style={{ margin: 0 }}>{villa ? t(villa.name, villa.nameBn) : t("Villa", "ভিলা")}</h2>
              <div className="total">
                <span className="help">{nightsLabel(booking.nights, lang)} · {t("sample total", "নমুনা মোট")}</span>
                <b>{formatBdt(booking.total, lang)}</b>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
