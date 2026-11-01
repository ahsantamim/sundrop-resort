import { photos } from "@sundrop/data/images";
import { Button } from "@sundrop/ui";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, PageBanner } from "@/components/chrome/page-banner";
import { getLang } from "@/lib/lang";
import { Scenery } from "@/components/chrome/scenery";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const { t } = await getLang();
  const stats = [
    [t("240", "২৪০"), t("Sample team size", "নমুনা দল")],
    [t("60", "৬০"), t("Sample artisans", "নমুনা কারিগর")],
    [t("100%", "১০০%"), t("Sample daytime solar label", "নমুনা দিনের সৌর লেবেল")],
    [t("0", "০"), t("Sample plastic line", "নমুনা প্লাস্টিক লাইন")],
  ];
  return (
    <main>
      <PageBanner
        image={photos.palms}
        alt={t("Beach house among palms", "নারকেল গাছের মধ্যে সৈকতের বাড়ি")}
        eyebrow={t("About · demo narrative", "আমাদের কথা · ডেমো কাহিনি")}
        title={t("Built by islanders, for everyone who loves the sea.", "দ্বীপের মানুষদের হাতে, সমুদ্র ভালোবাসেন যাঁরা তাদের জন্য।")}
        lede={t("SUNDROP Eco Resort is the name of this demo. The counts below are layout figures, not a real report.", "সানড্রপ ইকো রিসোর্ট এই ডেমোর নাম। নিচের সংখ্যাগুলো লেআউটের জন্য, আসল প্রতিবেদন নয়।")}
      />
      <section className="sec tight">
        <Scenery />
        <div className="wrap">
          <div className="bento">
            <article className="tile sand s6 r2">
              <span className="over">{t("Our story", "আমাদের গল্প")}</span>
              <h3 className="serif-swap" style={{ fontSize: "clamp(30px, 3vw, 44px)" }}>{t("Twenty-four keys, and the rest left to the island.", "চব্বিশটি কী, বাকিটা দ্বীপের হাতে।")}</h3>
              <p className="lede">{t("The plan keeps villas low and spread out, on stilts over the lagoon or under the palms, so the shoreline stays open. Staffing, solar share and plastic claims are layout labels — not measured performance.", "পরিকল্পনায় ভিলাগুলো নিচু ও ছড়ানো — লেগুনের উপর খুঁটিতে বা নারকেল বনের ছায়ায় — যাতে তীর খোলা থাকে। কর্মী, সৌরশক্তি ও প্লাস্টিকের দাবি লেআউটের লেবেল, পরিমাপ করা ফল নয়।")}</p>
              <span className="sample" style={{ alignSelf: "flex-start", marginTop: "auto" }}>{t("Demo narrative", "ডেমো কাহিনি")}</span>
            </article>
            {stats.map(([value, label], index) => (
              <div className={`tile s3 ${index === 1 ? "teal" : ""}`} key={label}>
                <span className="num">{value}</span>
                <span>{label}</span>
              </div>
            ))}
            <figure className="tile media s8" style={{ margin: 0, minHeight: 360 }}>
              <div className="photo"><Image src={photos.jetty} alt={t("A jetty over clear water", "স্বচ্ছ পানির উপর জেটি")} fill sizes="(max-width: 760px) 100vw, 66vw" /></div>
              <div className="shade" />
              <figcaption className="tile-cap"><span className="glass">{t("The jetty · Saint Martin’s", "জেটি · সেন্ট মার্টিন")}</span></figcaption>
            </figure>
            <article className="tile s4">
              <span className="over">{t("Read more", "আরও পড়ুন")}</span>
              <h3 className="serif-swap">{t("What the labels mean.", "লেবেলগুলোর মানে।")}</h3>
              <p className="lede">{t("Every claim on this site is a placeholder. The sustainability note explains which ones.", "এই সাইটের প্রতিটি দাবি প্লেসহোল্ডার। কোনগুলো, তা টেকসইতার নোটে আছে।")}</p>
              <div className="tile-foot">
                <Link className="more" href="/info/sustainability">{t("Sustainability", "টেকসইতা")} <ArrowRight size={16} /></Link>
              </div>
            </article>
          </div>
        </div>
      </section>
      <CtaBand
        image={photos.beach}
        eyebrow={t("Getting here", "কীভাবে আসবেন")}
        title={t("Two hours from Cox’s Bazar, by sea.", "কক্সবাজার থেকে সমুদ্রপথে দুই ঘণ্টা।")}
        copy={t("Speedboat from the Teknaf jetty on the sample plan. The desk can talk you through it.", "নমুনা পরিকল্পনায় টেকনাফ জেটি থেকে স্পিডবোট। ডেস্ক বুঝিয়ে বলবে।")}
      >
        <Button asChild variant="accent"><Link href="/contact">{t("Contact the desk", "ডেস্কে যোগাযোগ")} <ArrowRight /></Link></Button>
      </CtaBand>
    </main>
  );
}
