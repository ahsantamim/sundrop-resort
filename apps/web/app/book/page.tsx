import { getRepo } from "@sundrop/data";
import type { Metadata } from "next";
import { BookingWizard } from "@/components/book/wizard";
import { addDays, todayIso } from "@/lib/dates";

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
    return <main className="wrap page-head"><p className="lede">No villas are loaded.</p></main>;
  }
  const today = todayIso();
  const blocked = await getRepo().blockedDates(villa.slug, today, addDays(today, 430));
  return (
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
  );
}
