"use client";

import type { VillaAvailability } from "@sundrop/data/types";
import { formatBdt, useI18n } from "@sundrop/ui";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

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
    <main className="page-hero" style={{ paddingBottom: 80 }}>
      <div className="wrap">
        <span className="over">{t("Home  /  Villas", "হোম  /  ভিলা")}</span>
        <h1 className="serif-swap">{t("Rooms & villas", "রুম ও ভিলা")}</h1>
        <p className="lede" style={{ maxWidth: 640 }}>
          {t(
            "Six villa types stand in for 24 keys. Prices are sample rates in BDT, including a pretend VAT line. Nothing here is a published tariff.",
            "ছয় ধরনের ভিলা ২৪টি কী-এর জায়গা নিচ্ছে। দাম বিডিটিতে নমুনা ভাড়া। এটি প্রকাশিত তালিকা নয়।",
          )}
        </p>
        <form className="filters" action="/villas">
          <label className="chip">{t("Check-in", "চেক-ইন")}<input type="date" name="checkIn" defaultValue={query.checkIn} /></label>
          <label className="chip">{t("Check-out", "চেক-আউট")}<input type="date" name="checkOut" defaultValue={query.checkOut} /></label>
          <label className="chip">{t("Adults", "প্রাপ্তবয়স্ক")}<input name="adults" type="number" min={1} max={6} defaultValue={query.adults} style={{ width: 48, border: 0, background: "transparent" }} /></label>
          <label className="chip">{t("Children", "শিশু")}<input name="children" type="number" min={0} max={4} defaultValue={query.children} style={{ width: 48, border: 0, background: "transparent" }} /></label>
          <button className="chip on" type="submit">{t("Update", "আপডেট")}</button>
        </form>
        {error ? <p className="error">{error}</p> : null}
        <div className="filters">
          {categories.map((category) => (
            <button key={category} className={`chip ${filter === category ? "on" : ""}`} type="button" onClick={() => setFilter(category)}>
              {category === "all" ? t("All villas", "সব ভিলা") : category}
            </button>
          ))}
          <label className="chip">
            {t("Sort", "সাজান")}
            <select value={sort} onChange={(event) => setSort(event.target.value)} style={{ border: 0, background: "transparent", font: "inherit" }}>
              <option value="featured">{t("Recommended", "প্রস্তাবিত")}</option>
              <option value="price">{t("Sample price", "নমুনা দাম")}</option>
              <option value="guests">{t("Guests", "অতিথি")}</option>
            </select>
          </label>
        </div>
        <p className="help" style={{ marginBottom: 18 }}>
          {dated
            ? t(`Showing ${shown.length} plans for these dates.`, `এই তারিখে ${shown.length}টি প্ল্যান।`)
            : t("Add dates to see which sample keys are free.", "কোন নমুনা কী খালি, দেখতে তারিখ দিন।")}
        </p>
        <div className="villas">
          {shown.map((villa) => {
            const sold = dated && villa.unitsLeft <= 0;
            return (
              <article className="villa" key={villa.id} style={sold ? { opacity: 0.72 } : undefined}>
                <div className="photo">
                  <span className={`badge ${sold ? "out" : villa.unitsLeft <= 2 ? "low" : ""}`}>
                    <i />
                    {sold ? t("Sold out", "খালি নেই") : t(`${villa.unitsLeft} of ${villa.units} sample keys`, `${villa.unitsLeft}/${villa.units} নমুনা কী`)}
                  </span>
                  <Image src={villa.image} alt={villa.name} fill sizes="(max-width:760px) 100vw, 33vw" />
                </div>
                <div className="body">
                  <span className="over" style={{ color: "var(--teal-700)" }}>{t(villa.category, villa.categoryBn)}</span>
                  <h3>{t(villa.name, villa.nameBn)}</h3>
                  <p className="meta">{t(`${villa.guests} guests`, `${villa.guests} জন`)} · {t(villa.bed, villa.bedBn)} · {villa.sizeM2} m²</p>
                  <div className="foot">
                    <div>
                      <div className="sample">{t("Sample", "নমুনা")}</div>
                      <div className="price">{formatBdt(villa.pricePerNight, lang)}<small>{t("/ night", "/ রাত")}</small></div>
                    </div>
                    <Link className="more" href={sold ? `/villas/${villa.slug}` : `/villas/${villa.slug}?${params}`}>
                      {t("View villa", "ভিলা দেখুন")} <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {shown.length === 0 ? <p>{t("No villa matches that filter.", "এই ফিল্টারে কোনো ভিলা নেই।")}</p> : null}
      </div>
    </main>
  );
}
