import { getRepo } from "@sundrop/data";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/chrome/page-banner";
import { ReserveCard } from "@/components/villas/reserve-card";
import { addDays, todayIso } from "@/lib/dates";
import { getLang } from "@/lib/lang";
import { Scenery } from "@/components/chrome/scenery";

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

// Bento spans for 1–4 villa photos.
const PHOTO_SPANS: Record<number, string[]> = {
  1: ["s12 r2"],
  2: ["s8 r2", "s4 r2"],
  3: ["s8 r2", "s4", "s4"],
  4: ["s6 r2", "s6", "s3", "s3"],
};

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
  const { lang, t } = await getLang();
  const today = todayIso();
  const blocked = await getRepo().blockedDates(villa.slug, today, addDays(today, 430));
  const photos = villa.images.slice(0, 4);
  const spans = PHOTO_SPANS[photos.length] ?? [];

  return (
    <main>
      <PageBanner
        image={villa.image}
        alt={t(villa.images[0]?.alt ?? villa.name, villa.images[0]?.altBn ?? villa.nameBn)}
        eyebrow={t(villa.category, villa.categoryBn)}
        title={t(villa.name, villa.nameBn)}
        lede={t(villa.blurb, villa.blurbBn)}
      />
      <section className="sec tight">
        <Scenery />
        <div className="wrap">
          <div className="bento rows pairs">
            {photos.map((photo, index) => (
              <figure className={`tile media ${spans[index]}`} key={photo.src} style={{ margin: 0 }}>
                <div className="photo"><Image src={photo.src} alt={t(photo.alt, photo.altBn)} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
              </figure>
            ))}
          </div>
          <div className="book-layout reserve-first" style={{ marginTop: "clamp(16px, 2vw, 26px)" }}>
            <div className="bento">
              <article className="tile s12 sand">
                <span className="over">{t("The villa", "ভিলা")}</span>
                <h3 className="serif-swap">{t("A sample deck, facing west.", "পশ্চিমমুখী একটি নমুনা ডেক।")}</h3>
                <p className="lede">{t(villa.details, villa.detailsBn)}</p>
                <span className="sample" style={{ alignSelf: "flex-start" }}>{t("Sample description", "নমুনা বিবরণ")}</span>
              </article>
              {[
                [`${villa.sizeM2}`, t("m² of floor, deck included", "বর্গমিটার, ডেকসহ")],
                [`${villa.guests}`, t(`guests · ${villa.bed}`, `জন · ${villa.bedBn}`)],
                [`${villa.units}`, t("sample keys of this type", "এই ধরনের নমুনা কী")],
              ].map(([value, label]) => (
                <div className="tile" key={label}>
                  <span className="num">{lang === "bn" ? Number(value).toLocaleString("bn-BD") : value}</span>
                  <span>{label}</span>
                </div>
              ))}
              <article className="tile s12">
                <span className="over">{t("In the villa", "ভিলায় যা আছে")}</span>
                <ul className="ticks">
                  {villa.amenities.map((item) => <li key={item.en}>{t(item.en, item.bn)}</li>)}
                </ul>
              </article>
              <article className="tile s12 teal">
                <span className="over">{t("Good to know", "জেনে রাখুন")}</span>
                <dl className="kv" style={{ color: "var(--ivory)" }}>
                  {[
                    [t("Check-in", "চেক-ইন"), t("From 2:00 pm", "দুপুর ২টা থেকে")],
                    [t("Check-out", "চেক-আউট"), t("By 12:00 pm", "দুপুর ১২টার মধ্যে")],
                    [t("Cancellation", "বাতিল"), t("Free until 72 hours before", "৭২ ঘণ্টা আগে পর্যন্ত বিনামূল্যে")],
                    [t("Getting here", "যাতায়াত"), t("Speedboat from Teknaf · sample", "টেকনাফ থেকে স্পিডবোট · নমুনা")],
                  ].map(([label, value]) => (
                    <div key={label} style={{ borderColor: "rgba(255,255,255,.14)" }}><dt style={{ color: "var(--teal-100)" }}>{label}</dt><dd>{value}</dd></div>
                  ))}
                </dl>
              </article>
            </div>
            <aside className="sticky-card">
              <ReserveCard
                villa={villa}
                blocked={blocked}
                initial={{
                  checkIn: one(sp.checkIn) ?? "",
                  checkOut: one(sp.checkOut) ?? "",
                  adults: Number(one(sp.adults) || 2),
                  children: Number(one(sp.children) || 0),
                }}
              />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
