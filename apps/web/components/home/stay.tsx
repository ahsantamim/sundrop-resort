"use client";

import type { Villa } from "@sundrop/data/types";
import { Button, formatBdt, useI18n } from "@sundrop/ui";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const experiences = [
  {
    title: "Shapla Spa",
    titleBn: "শাপলা স্পা",
    copy: "Turmeric and coconut rituals in open-air pavilions. Sample menu, not a live spa book.",
    copyBn: "খোলা প্যাভিলিয়নে হলুদ ও নারকেলের আচার। নমুনা তালিকা, লাইভ স্পা বুকিং নয়।",
    tag: "Sample · from ৳4,500",
    tagBn: "নমুনা · ৳৪,৫০০ থেকে",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=75",
    alt: "Spa table with linen",
  },
  {
    title: "Ilish & Ember",
    titleBn: "ইলিশ অ্যান্ড এম্বার",
    copy: "A sample dining note: bay seafood and a low-tide chef’s table on the plan.",
    copyBn: "নমুনা খাবারের কথা: উপসাগরের মাছ আর ভাটার সময় শেফের টেবিল।",
    tag: "Breakfast included in the sample rate",
    tagBn: "নমুনা ভাড়ায় সকালের নাস্তা",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=75",
    alt: "A plated dish",
  },
  {
    title: "Reef & Jetty",
    titleBn: "রিফ ও জেটি",
    copy: "Snorkelling, kayaks and boat time with Saint Martin’s boatmen — described here, not sold as a ticket.",
    copyBn: "স্নরকেলিং, কায়াক ও সেন্ট মার্টিনের মাঝিদের সাথে নৌকা — বর্ণনা, টিকিট বিক্রি নয়।",
    tag: "Shown on the sample day plan",
    tagBn: "নমুনা দিনসূচিতে",
    image: "https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=800&q=75",
    alt: "Wooden jetty over clear water",
  },
  {
    title: "Sunset Deck",
    titleBn: "সানসেট ডেক",
    copy: "Daab, a Friday music note, and the west-facing seat. Sample evening plan.",
    copyBn: "ডাব, শুক্রবারের সঙ্গীতের নোট, আর পশ্চিমমুখী আসন। নমুনা সন্ধ্যার পরিকল্পনা।",
    tag: "Every evening on the sample plan",
    tagBn: "নমুনা পরিকল্পনায় প্রতি সন্ধ্যা",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=75",
    alt: "Sun loungers by the water",
  },
];

export function Stay({ villas }: { villas: Villa[] }) {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: { revert: () => void } | null = null;
    void (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const frame = root.current?.querySelector("#archPhoto");
        const image = frame?.querySelector("img");
        if (frame) {
          gsap.fromTo(
            frame,
            { clipPath: "inset(14% 10% 0% 10% round 999px 999px 28px 28px)" },
            { clipPath: "inset(0% 0% 0% 0% round 999px 999px 28px 28px)", ease: "none", scrollTrigger: { trigger: "#amenities", start: "top 85%", end: "top 15%", scrub: true } },
          );
        }
        if (image) {
          gsap.fromTo(image, { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "#amenities", start: "top bottom", end: "bottom top", scrub: true } });
        }
      }, root);
    })();
    return () => ctx?.revert();
  }, []);

  return (
    <>
      <section className="trust" aria-label={t("Why this demo is straightforward", "এই ডেমো কেন সহজ")}>
        <div className="wrap">
          {[
            [t("Sample rates", "নমুনা ভাড়া"), t("marked on every villa", "প্রতিটি ভিলায় চিহ্নিত"), "M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18l.9-5.4L4.2 8.7l5.4-.8z"],
            [t("bKash · Nagad · cards", "বিকাশ · নগদ · কার্ড"), t("shown as pay-at-resort options", "রিসোর্টে পেমেন্টের নমুনা"), "M4 7h16v11H4zM4 11h16"],
            [t("Free cancellation", "ফ্রি বাতিল"), t("until 72 hours before check-in", "চেক-ইনের ৭২ ঘণ্টা আগে পর্যন্ত"), "M12 3l8 3v6c0 4.5-3.2 7.6-8 8.8C7.2 19.6 4 16.5 4 12V6z"],
            [t("Speedboat note", "স্পিডবোট নোট"), t("Teknaf jetty, on the sample plan", "টেকনাফ জেটি, নমুনা পরিকল্পনায়"), "M3 16c3 0 3-2 6-2s3 2 6 2 3-2 6-2"],
            [t("A real reference", "আসল রেফারেন্স"), t("issued when you confirm in the demo", "ডেমোতে নিশ্চিত করলে পাবেন"), "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-1 4h2v5h-2zm0 6h2v2h-2z"],
          ].map(([title, copy, path]) => (
            <div className="t-item" key={title}>
              <span className="t-ico" aria-hidden>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B4F4A" strokeWidth="1.7"><path d={path} /></svg>
              </span>
              <div><b>{title}</b><span>{copy}</span></div>
            </div>
          ))}
        </div>
      </section>
      <section className="sec" id="villas">
        <div className="wrap">
          <div className="head">
            <div>
              <span className="over">{t("Featured villas", "বাছাই করা ভিলা")}</span>
              <h2 className="serif-swap">{t("Stay above the water, or under the palms.", "জলের উপরে থাকুন, বা নারকেল বনের ছায়ায়।")}</h2>
            </div>
            <div style={{ maxWidth: 420 }}>
              <p className="lede">{t("Every plan faces west on the drawing. Rates below are sample figures for this demo, not a tariff.", "প্রতিটি প্ল্যান পশ্চিমমুখী। নিচের ভাড়া এই ডেমোর নমুনা, প্রকাশিত তালিকা নয়।")}</p>
              <Button asChild variant="ghost" size="sm" style={{ marginTop: 22 }}>
                <Link href="/villas">{t("View all 24 villas", "২৪টি ভিলা দেখুন")} <ArrowRight /></Link>
              </Button>
            </div>
          </div>
          <div className="villas">
            {villas.map((villa) => (
              <article className="villa" key={villa.id}>
                <div className="photo">
                  <span className="badge"><i />{t("Sample plan", "নমুনা প্ল্যান")}</span>
                  <Image src={villa.image} alt={lang === "bn" ? villa.images[0]?.altBn ?? villa.nameBn : villa.images[0]?.alt ?? villa.name} fill sizes="(max-width: 760px) 100vw, 33vw" />
                </div>
                <div className="body">
                  <span className="over" style={{ color: "var(--teal-700)" }}>{t(villa.category, villa.categoryBn)}</span>
                  <h3 className="serif-swap">{t(villa.name, villa.nameBn)}</h3>
                  <p className="meta">{villa.sizeM2} m² · {t(villa.bed, villa.bedBn)} · {t(`${villa.guests} guests`, `${villa.guests} জন`)}</p>
                  <div className="foot">
                    <div>
                      <div className="sample">{t("Sample rate", "নমুনা ভাড়া")}</div>
                      <div className="price">{formatBdt(villa.pricePerNight, lang)}<small>{t("/ night", "/ রাত")}</small></div>
                    </div>
                    <Link className="more" href={`/villas/${villa.slug}`}>{t("Details", "বিস্তারিত")} <ArrowRight size={16} /></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="amen" id="amenities" ref={root}>
        <div className="wave" aria-hidden="true">
          <svg viewBox="0 0 2880 90" preserveAspectRatio="none"><path fill="#F3E9DA" d="M0 50 C240 10 480 10 720 50 S1200 90 1440 50 S1920 10 2160 50 S2640 90 2880 50 V90 H0Z" /></svg>
        </div>
        <div className="wrap amen-grid">
          <div className="amen-sticky">
            <div className="photo arch" id="archPhoto">
              <div className="shade" />
              <Image src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=75" alt={t("Resort pool framed by coconut palms", "নারকেল গাছে ঘেরা রিসোর্টের পুল")} fill sizes="(max-width: 900px) 100vw, 45vw" />
              <div className="cap"><b>{t("The Lagoon Pool", "লেগুন পুল")}</b><span>{t("Sample hours 6 am – 10 pm", "নমুনা সময় সকাল ৬টা – রাত ১০টা")}</span></div>
            </div>
          </div>
          <div className="amen-list">
            <div>
              <span className="over">{t("Experiences", "অভিজ্ঞতা")}</span>
              <h2 className="serif-swap">{t("Slow days, salt air and very good fish.", "ধীর দিন, নোনা হাওয়া আর দারুণ মাছ।")}</h2>
              <p className="lede">{t("The island’s rhythm, written as a sample day. You choose how much of the demo to walk through.", "দ্বীপের ছন্দ, একটি নমুনা দিন হিসেবে লেখা। ডেমোর কতটা দেখবেন, সেটা আপনার।")}</p>
            </div>
            {experiences.map((item) => (
              <article className="a-card" key={item.title}>
                <div className="photo"><Image src={item.image} alt={item.alt} fill sizes="160px" loading="eager" /></div>
                <div>
                  <h3 className="serif-swap">{t(item.title, item.titleBn)}</h3>
                  <p>{t(item.copy, item.copyBn)}</p>
                  <span className="tag">{t(item.tag, item.tagBn)}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
