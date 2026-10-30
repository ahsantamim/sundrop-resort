import { getRepo } from "@sundrop/data";
import { formatBdt, formatDay } from "@sundrop/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { CopyLink } from "@/components/book/copy-link";

export const metadata: Metadata = { title: "Booking received", robots: { index: false, follow: false } };

export default async function DonePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const booking = await getRepo().getBookingByToken(token);
  if (!booking) notFound();
  const villa = (await getRepo().listVillas()).find((item) => item.id === booking.villaId);
  const jar = await cookies();
  const lang = jar.get("lang")?.value === "bn" ? "bn" : "en";
  const first = booking.guestName.split(" ")[0] || booking.guestName;
  const link = `/b/${booking.token}`;

  return (
    <main className="book-shell">
      <div className="book-card" style={{ textAlign: "center" }}>
        <div className="progress">{[1, 2, 3, 4].map((item) => <i key={item} className="on" />)}</div>
        <p className="over">{lang === "bn" ? "ধাপ ৪ / ৪ · সম্পন্ন" : "Step 4 of 4 · Done"}</p>
        <div aria-hidden="true" style={{ width: 72, height: 72, margin: "12px auto", borderRadius: "50%", border: "2px solid var(--coral)", display: "grid", placeItems: "center", fontSize: 28 }}>✓</div>
        <h1 style={{ fontSize: 40 }}>{lang === "bn" ? `দ্বীপে আপনাকে স্বাগতম, ${first}।` : `See you on the island, ${first}.`}</h1>
        <p className="lede">{lang === "bn" ? "এই ডেমো ইমেইল বা হোয়াটসঅ্যাপ পাঠায় না। নিচের ব্যক্তিগত লিংকই আপনার নিশ্চিতকরণ।" : "This demo does not send email or WhatsApp. The private link below is your confirmation."}</p>
        <p className="sample">SDR</p>
        <p style={{ fontFamily: "var(--serif)", fontSize: 28 }}>{booking.reference}</p>
        <span className={`pill ${booking.status}`}>{booking.status}</span>
        <p>{villa ? (lang === "bn" ? villa.nameBn : villa.name) : "Villa"} · {formatDay(booking.checkIn, lang)} – {formatDay(booking.checkOut, lang)}</p>
        <p><b>{formatBdt(booking.total, lang)}</b> · {lang === "bn" ? "নমুনা মোট" : "sample total"}</p>
        <CopyLink href={link} label={lang === "bn" ? "ব্যক্তিগত লিংক কপি করুন" : "Copy private link"} />
        <p className="help">{lang === "bn" ? "লিংকটি গোপন রাখুন। যার কাছে এটি আছে, সে বুকিং দেখতে ও বাতিল করতে পারে।" : "Keep it private. Anyone with this link can view and cancel the booking."}</p>
        <p><Link className="more" href={link}>{lang === "bn" ? "বুকিং পরিচালনা করুন" : "Manage booking"} →</Link></p>
        <p><Link className="more" href={`${link}/voucher`}>{lang === "bn" ? "প্রিন্টযোগ্য ভাউচার" : "Printable voucher"} →</Link></p>
      </div>
    </main>
  );
}
