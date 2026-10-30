import { getRepo, nightCount, type VillaAvailability } from "@sundrop/data";
import type { Metadata } from "next";
import { VillaBrowser } from "@/components/villas/browser";

export const metadata: Metadata = { title: "Rooms & villas" };

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function VillasPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const checkIn = one(sp.checkIn);
  const checkOut = one(sp.checkOut);
  const adults = Math.min(6, Math.max(1, Number(one(sp.adults) || 2)));
  const children = Math.min(4, Math.max(0, Number(one(sp.children) || 0)));
  let error: string | undefined;
  let villas: VillaAvailability[];
  if (checkIn && checkOut) {
    const result = await getRepo().search({ checkIn, checkOut, adults, children });
    if (result.ok) villas = result.data;
    else {
      error = result.error;
      villas = (await getRepo().listVillas()).map((villa) => ({ ...villa, nights: nightCount(checkIn, checkOut), total: 0, unitsLeft: villa.units }));
    }
  } else {
    villas = (await getRepo().listVillas()).map((villa) => ({ ...villa, nights: 0, total: 0, unitsLeft: villa.units }));
  }
  return <VillaBrowser villas={villas} query={{ checkIn, checkOut, adults, children }} error={error} />;
}
