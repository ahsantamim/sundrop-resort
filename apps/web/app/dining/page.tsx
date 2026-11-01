import { photos } from "@sundrop/data/images";
import { Button } from "@sundrop/ui";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, PageBanner } from "@/components/chrome/page-banner";
import { getLang } from "@/lib/lang";
import { Scenery } from "@/components/chrome/scenery";

export const metadata: Metadata = { title: "Dining" };

export default async function DiningPage() {
  const { t } = await getLang();
  const tables = [
    [t("Shutki and rice", "শুঁটকি আর ভাত"), t("A sample line for the lunch menu, written for the layout.", "দুপুরের মেনুর একটি নমুনা লাইন, লেআউটের জন্য লেখা।")],
    [t("Low-tide chef’s table", "ভাটার সময় শেফের টেবিল"), t("Described only. No seat is held and nothing is reserved.", "শুধু বর্ণনা। কোনো আসন রাখা হয় না, কিছু রিজার্ভ হয় না।")],
    [t("Breakfast on the deck", "ডেকে সকালের নাস্তা"), t("Folded into the sample villa rate on every plan.", "প্রতিটি প্ল্যানের নমুনা ভাড়ার মধ্যেই ধরা।")],
  ];
  return (
    <main>
      <PageBanner
        image={photos.dining}
        alt={t("A plated dish", "সাজানো একটি খাবার")}
        eyebrow={t("Dining", "খাবার")}
        title={t("Three tables, on paper.", "তিনটি টেবিল, কাগজে-কলমে।")}
        lede={t("Ilish & Ember is the only dining room named in the demo. There is no live menu and no reservation.", "ইলিশ অ্যান্ড এম্বার ডেমোর একমাত্র রেস্তোরাঁ। কোনো লাইভ মেনু বা রিজার্ভেশন নেই।")}
      />
      <section className="sec tight">
        <Scenery />
        <div className="wrap">
          <div className="bento">
            <article className="tile sand s5 r2">
              <span className="over">{t("Ilish & Ember", "ইলিশ অ্যান্ড এম্বার")}</span>
              <h3 className="serif-swap" style={{ fontSize: "clamp(30px, 3vw, 44px)" }}>{t("Bay seafood, cooked over coconut husk.", "নারকেলের ছোবড়ার আঁচে উপসাগরের মাছ।")}</h3>
              <p className="lede">{t("A sample dining note: the catch comes in with Saint Martin’s boats in the morning, and the kitchen writes the evening around it.", "নমুনা খাবারের কথা: সকালে সেন্ট মার্টিনের নৌকায় মাছ আসে, আর রান্নাঘর সন্ধ্যার মেনু সাজায় সেটা দিয়েই।")}</p>
              <dl className="kv" style={{ marginTop: "auto" }}>
                <div><dt>{t("Breakfast", "নাস্তা")}</dt><dd>{t("7 – 10:30 am", "সকাল ৭ – ১০:৩০")}</dd></div>
                <div><dt>{t("Dinner", "রাতের খাবার")}</dt><dd>{t("7 – 10 pm", "সন্ধ্যা ৭ – রাত ১০")}</dd></div>
              </dl>
              <span className="sample" style={{ alignSelf: "flex-start" }}>{t("Sample hours", "নমুনা সময়")}</span>
            </article>
            <figure className="tile media s7" style={{ margin: 0, minHeight: 340 }}>
              <div className="photo"><Image src={photos.dining} alt={t("A plated dish", "সাজানো একটি খাবার")} fill sizes="(max-width: 760px) 100vw, 58vw" /></div>
              <div className="shade" />
              <figcaption className="tile-cap"><span className="glass">{t("Ilish & Ember · sample", "ইলিশ অ্যান্ড এম্বার · নমুনা")}</span></figcaption>
            </figure>
            {/* 3 + 4 columns fill the space beside the tall Ilish & Ember tile. */}
            {tables.slice(0, 2).map(([title, copy], index) => (
              <article className={`tile lift ${index === 0 ? "s3" : "s4"}`} key={title}>
                <span className="num">{`0${index + 1}`}</span>
                <h3 className="serif-swap">{title}</h3>
                <p className="lede">{copy}</p>
              </article>
            ))}
            {tables.slice(2).map(([title, copy]) => (
              <article className="tile teal s12" key={title}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
                  <div style={{ display: "grid", gap: 8 }}>
                    <span className="over">03</span>
                    <h3 className="serif-swap">{title}</h3>
                    <p className="lede">{copy}</p>
                  </div>
                  <Button asChild variant="accent" size="sm"><Link href="/villas">{t("See villa rates", "ভিলার ভাড়া দেখুন")} <ArrowRight /></Link></Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        image={photos.deck}
        eyebrow={t("After dinner", "রাতের খাবারের পর")}
        title={t("Take your daab to the sunset deck.", "ডাব হাতে সানসেট ডেকে চলুন।")}
        copy={t("The rest of the sample day — spa, reef and jetty — is on the experiences page.", "নমুনা দিনের বাকিটা — স্পা, রিফ ও জেটি — অভিজ্ঞতার পাতায়।")}
      >
        <Button asChild variant="accent"><Link href="/experiences">{t("Experiences", "অভিজ্ঞতা")} <ArrowRight /></Link></Button>
      </CtaBand>
    </main>
  );
}
