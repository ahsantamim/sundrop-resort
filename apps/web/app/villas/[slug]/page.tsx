import { getRepo, nightCount } from "@sundrop/data";
import { formatBdt } from "@sundrop/ui";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const villa = await getRepo().getVilla(slug);
  return { title: villa?.name ?? "Villa" };
}

export default async function VillaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const villa = await getRepo().getVilla(slug);
  if (!villa) notFound();
  const jar = await cookies();
  const lang = jar.get("lang")?.value === "bn" ? "bn" : "en";
  const checkIn = one(sp.checkIn);
  const checkOut = one(sp.checkOut);
  const adults = one(sp.adults) || "2";
  const children = one(sp.children) || "0";
  const nights = checkIn && checkOut ? nightCount(checkIn, checkOut) : 0;
  const total = nights > 0 ? nights * villa.pricePerNight : villa.pricePerNight;
  const book = new URLSearchParams({ villa: villa.slug, adults, children });
  if (checkIn) book.set("checkIn", checkIn);
  if (checkOut) book.set("checkOut", checkOut);

  return (
    <main className="page-hero" style={{ paddingBottom: 80 }}>
      <div className="wrap">
        <span className="over">{lang === "bn" ? "ভিলা" : "Villas"} / {lang === "bn" ? villa.nameBn : villa.name}</span>
        <h1>{lang === "bn" ? villa.nameBn : villa.name}</h1>
        <p className="lede">{villa.sizeM2} m² · {lang === "bn" ? villa.bedBn : villa.bed} · {lang === "bn" ? `${villa.guests} জন` : `Sleeps ${villa.guests}`}</p>
        <div className="gallery" style={{ marginTop: 28 }}>
          {villa.images.slice(0, 4).map((photo, index) => (
            <figure className={`photo ${["g1", "g2", "g3", "g4"][index]}`} key={photo.src}>
              <Image src={photo.src} alt={lang === "bn" ? photo.altBn : photo.alt} fill sizes="50vw" />
            </figure>
          ))}
        </div>
        <div className="amen-grid" style={{ marginTop: 48 }}>
          <div>
            <h2>{lang === "bn" ? "একটি নমুনা ডেক" : "A sample deck"}</h2>
            <p className="lede">{lang === "bn" ? villa.detailsBn : villa.details}</p>
            <ul>
              {villa.amenities.map((item) => (
                <li key={item.en}>{lang === "bn" ? item.bn : item.en}</li>
              ))}
            </ul>
            <p className="sample" style={{ marginTop: 18 }}>{lang === "bn" ? "নমুনা বিবরণ" : "Sample description"}</p>
          </div>
          <aside className="ip-card" style={{ background: "#fff", color: "var(--ink)", position: "sticky", top: 120 }}>
            <div className="sample">{lang === "bn" ? "নমুনা ভাড়া" : "Sample rate"}</div>
            <div className="price" style={{ marginTop: 8 }}>{formatBdt(villa.pricePerNight, lang)}<small>{lang === "bn" ? "/ রাত" : "/ night"}</small></div>
            <p className="help">{checkIn && checkOut ? `${checkIn} → ${checkOut}` : lang === "bn" ? "তারিখ বুকিং ধাপে বেছে নেবেন।" : "Choose dates in the booking flow."}</p>
            <p><b>{nights > 0 ? formatBdt(total, lang) : "—"}</b> {nights > 0 ? <span className="help">{lang === "bn" ? `${nights} রাত` : `${nights} nights · sample total`}</span> : null}</p>
            <p className="help">{lang === "bn" ? "এখন কোনো পেমেন্ট নেই। রেফারেন্স পেলে বুকিং অপেক্ষমাণ থাকে।" : "No payment now. A confirmed request stays pending until the admin demo accepts it."}</p>
            <Link href={`/book?${book}`} className="more" style={{ marginTop: 12 }}>{lang === "bn" ? "রিজার্ভ করুন — লগইন লাগবে না" : "Reserve — no login needed"} →</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
