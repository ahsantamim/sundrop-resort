"use client";

import { photos } from "@sundrop/data/images";
import { Button, useI18n } from "@sundrop/ui";
import Image from "next/image";
import Link from "next/link";

const frames = [
  { src: photos.walkways, className: "g1", en: "06:10 · First light on the walkways", bn: "০৬:১০ · ভোরের আলো", alt: "Aerial of overwater walkways" },
  { src: photos.boats, className: "g2", en: "11:00 · Saint Martin’s boats", bn: "১১:০০ · সেন্ট মার্টিনের নৌকা", alt: "Wooden boats on the Saint Martin’s shore" },
  { src: photos.bedroom, className: "g3", en: "14:30 · Siesta", bn: "১৪:৩০ · দুপুরের বিশ্রাম", alt: "A bright bedroom" },
  { src: photos.nightPool, className: "g4", en: "21:00 · Pool under the stars", bn: "২১:০০ · তারার নিচে পুল", alt: "Pool at night" },
];

export function Closing() {
  const { t } = useI18n();
  return (
    <>
      <section className="sec" id="stories">
        <div className="wrap">
          <div className="head">
            <div>
              <span className="over">{t("Sample stories", "নমুনা গল্প")}</span>
              <h2 className="serif-swap">{t("They came for a weekend. They stayed for the light.", "এসেছিলেন এক সপ্তাহান্তের জন্য। থেকে গেলেন আলোর টানে।")}</h2>
            </div>
            <p className="lede" style={{ maxWidth: 360 }}>{t("Illustrated notes for the layout. These are not guest reviews, and the names are sample personas.", "লেআউটের জন্য আঁকা নোট। এগুলো অতিথির রিভিউ নয়, নামগুলো নমুনা।")}</p>
          </div>
          <div className="quotes">
            <figure className="q feat">
              <div className="stars" aria-hidden="true">★★★★★</div>
              <blockquote>{t("“A sample line for the large card: the desk remembered a birthday that exists only in this demo.”", "“বড় কার্ডের নমুনা লাইন: ডেস্ক এমন একটি জন্মদিন মনে রেখেছে যা শুধু এই ডেমোতে আছে।”")}</blockquote>
              <figcaption className="who"><span className="avatar">FR</span><span><b>Farhana Rahman</b><span>{t("Sample persona · Dhaka", "নমুনা চরিত্র · ঢাকা")}</span></span></figcaption>
            </figure>
            <figure className="q">
              <div className="stars" aria-hidden="true">★★★★★</div>
              <blockquote>“সূর্যাস্তের ডেকে বসে ডাব খাওয়ার এই লাইনটি একটি নমুনা বাক্য — আসল অতিথির কথা নয়।”</blockquote>
              <figcaption className="who"><span className="avatar">TA</span><span><b>Tanvir Ahmed</b><span>{t("Sample persona · Chattogram", "নমুনা চরিত্র · চট্টগ্রাম")}</span></span></figcaption>
            </figure>
            <figure className="q">
              <div className="stars" aria-hidden="true">★★★★★</div>
              <blockquote>{t("“Another sample: a bKash note and a speedboat, written so the card has a shape. No payment was taken.”", "“আরেকটি নমুনা: বিকাশের নোট আর একটি স্পিডবোট, কার্ডের আকারের জন্য লেখা। কোনো পেমেন্ট হয়নি।”")}</blockquote>
              <figcaption className="who"><span className="avatar">SM</span><span><b>Sarah Mitchell</b><span>{t("Sample persona · London", "নমুনা চরিত্র · লন্ডন")}</span></span></figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className="sec" id="gallery" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head">
            <div>
              <span className="over">{t("Gallery", "গ্যালারি")}</span>
              <h2 className="serif-swap">{t("A few hours on the island.", "দ্বীপে কয়েক ঘণ্টা।")}</h2>
            </div>
            <Button asChild variant="ghost" size="sm"><Link href="/gallery">{t("Open full gallery", "পুরো গ্যালারি")}</Link></Button>
          </div>
          <div className="gallery">
            {frames.map((frame) => (
              <figure className={`photo ${frame.className}`} key={frame.className}>
                <Image src={frame.src} alt={frame.alt} fill sizes="(max-width: 760px) 100vw, 40vw" loading="eager" />
                <figcaption>{t(frame.en, frame.bn)}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section className="cta" id="contact">
        <div className="wrap">
          <div className="cta-box">
            <div className="photo"><Image src={photos.beach} alt="Calm sea at sunrise" fill sizes="100vw" loading="eager" /></div>
            <div className="shade" />
            <div className="cta-in">
              <div>
                <span className="over">{t("Plan your escape", "ছুটির পরিকল্পনা")}</span>
                <h2 className="serif-swap">{t("Talk to a real person on the island.", "দ্বীপের একজন মানুষের সাথে কথা বলুন।")}</h2>
                <p>{t("In this demo the desk does not send messages. Use the contact form, or continue a booking and keep the private link.", "এই ডেমোতে ডেস্ক বার্তা পাঠায় না। যোগাযোগ ফর্ম ব্যবহার করুন, অথবা বুকিং চালিয়ে ব্যক্তিগত লিংক রাখুন।")}</p>
              </div>
              <div className="stack">
                <Button asChild variant="accent"><Link href="/contact">{t("Sample desk · +880 1711-000 245", "নমুনা ডেস্ক · +৮৮০ ১৭১১-০০০ ২৪৫")}</Link></Button>
                <Button asChild variant="ghostLight"><Link href="/contact">stay@sundrop.demo</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
