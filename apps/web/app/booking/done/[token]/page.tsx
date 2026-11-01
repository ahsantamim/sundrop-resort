import { getRepo } from "@sundrop/data";
import { Button, formatBdt, formatDay, nightsLabel } from "@sundrop/ui";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLink } from "@/components/book/copy-link";
import { getLang } from "@/lib/lang";
import { Scenery } from "@/components/chrome/scenery";

export const metadata: Metadata = { title: "Booking received", robots: { index: false, follow: false } };

export default async function DonePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const booking = await getRepo().getBookingByToken(token);
  if (!booking) notFound();
  const villa = (await getRepo().listVillas()).find((item) => item.id === booking.villaId);
  const { lang, t } = await getLang();
  const first = booking.guestName.split(" ")[0] || booking.guestName;
  const link = `/b/${booking.token}`;

  return (
    <main className="book-shell">
      <Scenery />
      <div className="wrap book-narrow">
        <div className="book-card" style={{ display: "grid", gap: 18 }}>
          <div className="progress" aria-hidden="true">{[1, 2, 3, 4].map((item) => <i key={item} className="on" />)}</div>
          <div style={{ textAlign: "center" }}>
            <span className="over">{t("Step 4 of 4 · Done", "ধাপ ৪ / ৪ · সম্পন্ন")}</span>
            <div className="check" aria-hidden="true"><Check size={32} /></div>
            <h1 className="serif-swap">{t(`See you on the island, ${first}.`, `দ্বীপে আপনাকে স্বাগতম, ${first}।`)}</h1>
            <p className="lede" style={{ margin: "0 auto", maxWidth: 460 }}>{t("This demo does not send email or WhatsApp. The private link below is your confirmation.", "এই ডেমো ইমেইল বা হোয়াটসঅ্যাপ পাঠায় না। নিচের ব্যক্তিগত লিংকই আপনার নিশ্চিতকরণ।")}</p>
          </div>
          <div className="tile sand" style={{ alignItems: "center", textAlign: "center" }}>
            <span className="over">{t("Your reference", "আপনার রেফারেন্স")}</span>
            <span className="ref">{booking.reference}</span>
            <span className={`pill ${booking.status}`}><i />{booking.status}</span>
          </div>
          <dl className="kv">
            <div><dt>{t("Villa", "ভিলা")}</dt><dd>{villa ? t(villa.name, villa.nameBn) : "—"}</dd></div>
            <div><dt>{t("Dates", "তারিখ")}</dt><dd>{formatDay(booking.checkIn, lang)} – {formatDay(booking.checkOut, lang)} · {nightsLabel(booking.nights, lang)}</dd></div>
            <div><dt>{t("Sample total", "নমুনা মোট")}</dt><dd>{formatBdt(booking.total, lang)}</dd></div>
          </dl>
          <CopyLink href={link} label={t("Copy private link", "ব্যক্তিগত লিংক কপি করুন")} copied={t("Copied", "কপি হয়েছে")} />
          <p className="help" style={{ margin: 0 }}>{t("Keep it private. Anyone with this link can view and cancel the booking.", "লিংকটি গোপন রাখুন। যার কাছে এটি আছে, সে বুকিং দেখতে ও বাতিল করতে পারে।")}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button asChild><Link href={link}>{t("Manage booking", "বুকিং পরিচালনা করুন")}</Link></Button>
            <Button asChild variant="ghost"><Link href={`${link}/voucher`}>{t("Printable voucher", "প্রিন্টযোগ্য ভাউচার")}</Link></Button>
          </div>
        </div>
      </div>
    </main>
  );
}
