import { getRepo } from "@sundrop/data";
import { formatBdt, formatDay } from "@sundrop/ui";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { CancelControl } from "@/components/book/manage";

export const metadata: Metadata = { title: "Manage booking", robots: { index: false, follow: false } };

export default async function ManageBookingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const booking = await getRepo().getBookingByToken(token);
  if (!booking) notFound();
  const villa = (await getRepo().listVillas()).find((item) => item.id === booking.villaId);
  const jar = await cookies();
  const lang = jar.get("lang")?.value === "bn" ? "bn" : "en";
  const deadline = new Date(`${booking.checkIn}T00:00:00`);
  deadline.setHours(deadline.getHours() - 72);
  const openStatus = booking.status === "pending" || booking.status === "confirmed";
  const canCancel = openStatus && new Date() < deadline;

  return (
    <main className="book-shell">
      <div className="book-card">
        <p className="over">{booking.reference}</p>
        <h1 style={{ fontSize: 40 }}>{lang === "bn" ? "আপনার দ্বীপের থাকা" : "Your island stay"}</h1>
        {villa ? (
          <div className="photo" style={{ height: 180, borderRadius: 20 }}>
            <Image src={villa.image} alt={villa.name} fill sizes="560px" />
          </div>
        ) : null}
        <p><span className={`pill ${booking.status}`}>{booking.status}</span></p>
        <h2 style={{ fontSize: 28 }}>{villa ? (lang === "bn" ? villa.nameBn : villa.name) : "Villa"}</h2>
        <p>{lang === "bn" ? "চেক-ইন" : "Check-in"} · {formatDay(booking.checkIn, lang)} · 2:00 PM</p>
        <p>{lang === "bn" ? "চেক-আউট" : "Check-out"} · {formatDay(booking.checkOut, lang)} · 12:00 PM</p>
        <p>{booking.guestName} · {booking.adults} {lang === "bn" ? "প্রাপ্তবয়স্ক" : "adults"}{booking.children ? `, ${booking.children}` : ""}</p>
        <p>{booking.mobile}<br />{booking.email}</p>
        <p><b>{formatBdt(booking.total, lang)}</b> · {lang === "bn" ? "নমুনা মোট" : "sample total"}</p>
        {booking.cancelReason ? <p className="help">{booking.cancelReason}</p> : null}
        <p className="help">
          {lang === "bn"
            ? `বিনামূল্যে বাতিল ${deadline.toLocaleString("bn-BD")} পর্যন্ত। এরপর ডেমো অতিথির বাতিল নেবে না।`
            : `Free cancellation until ${deadline.toLocaleString("en-GB")}. After that this demo refuses a guest cancel.`}
        </p>
        <p><Link href={`/b/${token}/voucher`}>{lang === "bn" ? "প্রিন্টযোগ্য ভাউচার" : "Printable voucher"}</Link></p>
        {canCancel ? <CancelControl token={token} lang={lang} /> : null}
      </div>
    </main>
  );
}
