import { getRepo } from "@sundrop/data";
import type { Metadata } from "next";
import Link from "next/link";
import { BookingWizard } from "@/components/book/wizard";

export const metadata: Metadata = { title: "Book your stay" };

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BookPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const slug = one(sp.villa);
  const villas = await getRepo().listVillas();
  const villa = villas.find((item) => item.slug === slug) ?? villas[0];
  if (!villa) {
    return <main className="page-hero wrap"><p>No villas are loaded.</p></main>;
  }
  const today = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 420);
  const iso = (date: Date) => date.toISOString().slice(0, 10);
  const blocked = await getRepo().blockedDates(villa.slug, iso(today), iso(end));
  return (
    <>
      {!slug ? <p className="wrap" style={{ paddingTop: 120 }}><Link href="/villas">Choose a villa first →</Link></p> : null}
      <BookingWizard
        villa={villa}
        blocked={blocked}
        initial={{
          checkIn: one(sp.checkIn),
          checkOut: one(sp.checkOut),
          adults: Number(one(sp.adults) || 2),
          children: Number(one(sp.children) || 0),
        }}
      />
    </>
  );
}
