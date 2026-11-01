"use client";

import { photos } from "@sundrop/data/images";
import type { VillaAvailability } from "@sundrop/data/types";
import { formatBdt, nightsLabel, useI18n } from "@sundrop/ui";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchBar } from "@/components/booking/search-bar";
import { PageBanner } from "@/components/chrome/page-banner";
import { Scenery } from "@/components/chrome/scenery";

export function VillaBrowser({
  villas,
  query,
  error,
}: {
  villas: VillaAvailability[];
  query: { checkIn?: string; checkOut?: string; adults: number; children: number };
  error?: string;
}) {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("featured");
  const categories = ["all", ...Array.from(new Set(villas.map((villa) => villa.category.split("·")[0]?.trim() || villa.category)))];
  const shown = useMemo(() => {
    const rows = villas.filter((villa) => filter === "all" || villa.category.startsWith(filter));
    if (sort === "price") return [...rows].sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sort === "guests") return [...rows].sort((a, b) => b.guests - a.guests);
    return rows;
  }, [filter, sort, villas]);
  const dated = Boolean(query.checkIn && query.checkOut);
  const params = new URLSearchParams();
  if (query.checkIn) params.set("checkIn", query.checkIn);
  if (query.checkOut) params.set("checkOut", query.checkOut);
  params.set("adults", String(query.adults));
  params.set("children", String(query.children));

  return (
    <main>
      <PageBanner
        image={photos.lagoon}
        alt={t("Overwater villas above a turquoise lagoon", "ফিরোজা লেগুনের উপর ওভারওয়াটার ভিলা")}
        eyebrow={t("Stay  ·  24 sample keys", "থাকা  ·  ২৪টি নমুনা কী")}
        title={lang === "bn" ? <>রুম ও <em>ভিলা।</em></> : <>Rooms &amp; <em>villas.</em></>}
        lede={t(
          "Six villa types stand in for 24 keys. Prices are sample rates in BDT. Nothing here is a published tariff.",
          "ছয় ধরনের ভিলা ২৪টি কী-এর জায়গা নিচ্ছে। দাম বিডিটিতে নমুনা ভাড়া। এটি প্রকাশিত তালিকা নয়।",
        )}
      >
        <SearchBar initial={{ checkIn: query.checkIn ?? "", checkOut: query.checkOut ?? "", adults: query.adults, children: query.children }} />
      </PageBanner>
      <section className="sec tight">
        <Scenery />
        <div className="wrap">
          {error ? <p className="notice" role="alert">{error}</p> : null}
          <div className="toolbar">
            <div className="chips" role="group" aria-label={t("Villa type", "ভিলার ধরন")}>
              {categories.map((category) => (
                <button key={category} className={`chip ${filter === category ? "on" : ""}`} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>
                  {category === "all" ? t("All villas", "সব ভিলা") : category}
                </button>
              ))}
            </div>
            <label className="chip">
              {t("Sort", "সাজান")}
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="featured">{t("Recommended", "প্রস্তাবিত")}</option>
                <option value="price">{t("Sample price", "নমুনা দাম")}</option>
                <option value="guests">{t("Guests", "অতিথি")}</option>
              </select>
            </label>
          </div>
          <p className="help" style={{ margin: "-16px 0 24px" }}>
            {dated
              ? t(`Showing ${shown.length} plans for these dates.`, `এই তারিখে ${shown.length}টি প্ল্যান।`)
              : t("Add dates above to see which sample keys are free.", "কোন নমুনা কী খালি, দেখতে উপরে তারিখ দিন।")}
          </p>
          <div className="villas">
            {shown.map((villa) => {
              const sold = dated && villa.unitsLeft <= 0;
              return (
                <article className="villa" key={villa.id} style={sold ? { opacity: 0.72 } : undefined}>
                  <div className="photo">
                    <span className={`badge ${sold ? "out" : dated && villa.unitsLeft <= 2 ? "low" : ""}`}>
                      <i />
                      {sold ? t("Sold out", "খালি নেই") : dated ? t(`${villa.unitsLeft} of ${villa.units} sample keys`, `${villa.unitsLeft}/${villa.units} নমুনা কী`) : t("Sample plan", "নমুনা প্ল্যান")}
                    </span>
                    <Image src={villa.image} alt={lang === "bn" ? villa.images[0]?.altBn ?? villa.nameBn : villa.images[0]?.alt ?? villa.name} fill sizes="(max-width: 760px) 100vw, 33vw" />
                  </div>
                  <div className="body">
                    <span className="over" style={{ color: "var(--teal-700)" }}>{t(villa.category, villa.categoryBn)}</span>
                    <h3 className="serif-swap">{t(villa.name, villa.nameBn)}</h3>
                    <p className="meta">{villa.sizeM2} m² · {t(villa.bed, villa.bedBn)} · {t(`${villa.guests} guests`, `${villa.guests} জন`)}</p>
                    <div className="foot">
                      <div>
                        <div className="sample">{dated && villa.total ? `${nightsLabel(villa.nights, lang)} · ${formatBdt(villa.total, lang)}` : t("Sample rate", "নমুনা ভাড়া")}</div>
                        <div className="price">{formatBdt(villa.pricePerNight, lang)}<small>{t("/ night", "/ রাত")}</small></div>
                      </div>
                      <Link className="more" href={sold ? `/villas/${villa.slug}` : `/villas/${villa.slug}?${params}`}>
                        {t("Details", "বিস্তারিত")} <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {shown.length === 0 ? <p className="lede">{t("No villa matches that filter.", "এই ফিল্টারে কোনো ভিলা নেই।")}</p> : null}
        </div>
      </section>
    </main>
  );
}
