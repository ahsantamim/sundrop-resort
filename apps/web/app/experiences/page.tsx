import { photos } from "@sundrop/data/images";
import { Button } from "@sundrop/ui";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, PageBanner } from "@/components/chrome/page-banner";
import { experiences, sampleDay } from "@/lib/content";
import { getLang } from "@/lib/lang";
import { Scenery } from "@/components/chrome/scenery";

export const metadata: Metadata = { title: "Experiences" };

// Spa leads large, the rest share the row below.
const SPANS = ["s8 r2", "s4", "s4", "s4"];

export default async function ExperiencesPage() {
  const { t } = await getLang();
  const [lead, ...rest] = experiences;
  return (
    <main>
      <PageBanner
        image={photos.jetty}
        alt={t("A wooden jetty over clear water", "স্বচ্ছ পানির উপর কাঠের জেটি")}
        eyebrow={t("Experiences", "অভিজ্ঞতা")}
        title={t("Slow days, salt air and very good fish.", "ধীর দিন, নোনা হাওয়া আর দারুণ মাছ।")}
        lede={t("The island’s rhythm, written as a sample day. Nothing on this page is booked or sold.", "দ্বীপের ছন্দ, একটি নমুনা দিন হিসেবে লেখা। এই পাতায় কিছু বুক বা বিক্রি হয় না।")}
      />
      <section className="sec tight">
        <Scenery />
        <div className="wrap">
          <div className="bento rows" style={{ gridAutoRows: "clamp(260px, 24vw, 340px)" }}>
            {lead ? (
              <article className={`tile media ${SPANS[0]}`}>
                <div className="photo"><Image src={lead.image} alt={lead.alt} fill sizes="(max-width: 760px) 100vw, 66vw" /></div>
                <div className="shade" />
                <div className="tile-cap">
                  <span className="glass">{t(lead.tag, lead.tagBn)}</span>
                  <h3 className="serif-swap" style={{ fontSize: "clamp(30px, 3vw, 44px)" }}>{t(lead.title, lead.titleBn)}</h3>
                  <p>{t(lead.copy, lead.copyBn)}</p>
                </div>
              </article>
            ) : null}
            <article className="tile teal s4 r2">
              <span className="over">{t("A sample day", "একটি নমুনা দিন")}</span>
              <h3 className="serif-swap">{t("From first light to the pool at night.", "ভোরের আলো থেকে রাতের পুল।")}</h3>
              <ol className="timeline" style={{ marginTop: "auto" }}>
                {sampleDay.map((moment) => {
                  const [time, label] = t(moment.en, moment.bn).split(" · ");
                  return <li key={moment.src}><b>{time}</b><span>{label}</span></li>;
                })}
              </ol>
            </article>
            {rest.map((item, index) => (
              <article className={`tile media ${SPANS[index + 1]}`} key={item.title}>
                <div className="photo"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
                <div className="shade" />
                <div className="tile-cap">
                  <span className="glass">{t(item.tag, item.tagBn)}</span>
                  <h3 className="serif-swap">{t(item.title, item.titleBn)}</h3>
                  <p>{t(item.copy, item.copyBn)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        image={photos.deck}
        eyebrow={t("Stay for the evenings", "সন্ধ্যার জন্য থাকুন")}
        title={t("Every villa faces the sunset deck.", "প্রতিটি ভিলা সানসেট ডেকের দিকে।")}
        copy={t("Pick dates and a villa. You get a private link and a reference — no account, no payment.", "তারিখ ও ভিলা বেছে নিন। একটি ব্যক্তিগত লিংক ও রেফারেন্স পাবেন — অ্যাকাউন্ট বা পেমেন্ট লাগবে না।")}
      >
        <Button asChild variant="accent"><Link href="/villas">{t("Find a villa", "ভিলা খুঁজুন")} <ArrowRight /></Link></Button>
        <Button asChild variant="ghostLight"><Link href="/dining">{t("Dining notes", "খাবারের কথা")}</Link></Button>
      </CtaBand>
    </main>
  );
}
