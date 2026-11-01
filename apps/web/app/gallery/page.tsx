import { photos } from "@sundrop/data/images";
import { Button } from "@sundrop/ui";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, PageBanner } from "@/components/chrome/page-banner";
import { getLang } from "@/lib/lang";
import { Scenery } from "@/components/chrome/scenery";

export const metadata: Metadata = { title: "Gallery" };

// Spans fill whole 12-column rows: a tall 7 beside two 5s, three 4s, two 6s, then a tall 4 beside an 8 and two 4s.
const shots = [
  { src: photos.walkways, span: "s7 r2", en: "06:10 · First light on the walkways", bn: "০৬:১০ · ভোরের আলো" },
  { src: photos.boats, span: "s5", en: "11:00 · Saint Martin’s boats", bn: "১১:০০ · সেন্ট মার্টিনের নৌকা" },
  { src: photos.bedroom, span: "s5", en: "14:30 · Siesta", bn: "১৪:৩০ · দুপুরের বিশ্রাম" },
  { src: photos.lagoon, span: "s4", en: "The lagoon side", bn: "লেগুনের পাশ" },
  { src: photos.spa, span: "s4", en: "Shapla Spa", bn: "শাপলা স্পা" },
  { src: photos.dining, span: "s4", en: "Ilish & Ember", bn: "ইলিশ অ্যান্ড এম্বার" },
  { src: photos.beach, span: "s6", en: "Sunrise on the east shore", bn: "পূর্ব তীরে সূর্যোদয়" },
  { src: photos.palms, span: "s6", en: "Under the palms", bn: "নারকেল বনের ছায়ায়" },
  { src: photos.deck, span: "s4 r2", en: "Sunset deck", bn: "সানসেট ডেক" },
  { src: photos.island, span: "s8", en: "The island from above", bn: "উপর থেকে দ্বীপ" },
  { src: photos.coast, span: "s4", en: "The long coast", bn: "দীর্ঘ উপকূল" },
  { src: photos.nightPool, span: "s4", en: "21:00 · Pool under the stars", bn: "২১:০০ · তারার নিচে পুল" },
];

export default async function GalleryPage() {
  const { t } = await getLang();
  return (
    <main>
      <PageBanner
        image={photos.island}
        alt={t("Aerial of a small island in clear water", "স্বচ্ছ পানিতে ছোট একটি দ্বীপ, আকাশ থেকে")}
        eyebrow={t("Gallery", "গ্যালারি")}
        title={t("Moments from the island.", "দ্বীপের কিছু মুহূর্ত।")}
        lede={t("Unsplash frames used as the demo gallery. Not a commissioned shoot.", "ডেমো গ্যালারির জন্য Unsplash-এর ছবি। আলাদা করে তোলা নয়।")}
      />
      <section className="sec tight">
        <Scenery />
        <div className="wrap">
          <div className="bento rows pairs">
            {shots.map((shot) => (
              <figure className={`tile media ${shot.span}`} key={shot.src} style={{ margin: 0 }}>
                <div className="photo"><Image src={shot.src} alt={t(shot.en, shot.bn)} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
                <figcaption className="tile-cap"><span className="glass">{t(shot.en, shot.bn)}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        image={photos.beach}
        eyebrow={t("Seen enough?", "যথেষ্ট দেখেছেন?")}
        title={t("Put your own dates on the calendar.", "ক্যালেন্ডারে আপনার তারিখ বসান।")}
        copy={t("Search the 24 sample keys and keep a private booking link. No account needed.", "২৪টি নমুনা কী খুঁজুন আর একটি ব্যক্তিগত বুকিং লিংক রাখুন। অ্যাকাউন্ট লাগবে না।")}
      >
        <Button asChild variant="accent"><Link href="/villas">{t("Check availability", "খালি আছে কিনা দেখুন")} <ArrowRight /></Link></Button>
      </CtaBand>
    </main>
  );
}
