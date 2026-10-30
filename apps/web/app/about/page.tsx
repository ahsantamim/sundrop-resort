import { photos } from "@sundrop/data/images";
import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const lang = (await cookies()).get("lang")?.value === "bn" ? "bn" : "en";
  const bn = lang === "bn";
  return (
    <main>
      <div className="wrap page-hero" style={{ paddingBottom: 80 }}>
        <p className="sample">{bn ? "ডেমো কাহিনি" : "Demo narrative"}</p>
        <h1>{bn ? "দ্বীপের মানুষদের হাতে, সমুদ্র ভালোবাসেন যাঁরা তাদের জন্য।" : "Built by islanders, for everyone who loves the sea."}</h1>
        <p className="lede" style={{ maxWidth: 680 }}>
          {bn
            ? "সানড্রপ ইকো রিসোর্ট এই ডেমোর নাম। নিচের সংখ্যাগুলো লেআউটের জন্য — কর্মীসংখ্যা, সৌরশক্তি বা প্লাস্টিকের দাবি আসল প্রতিবেদন নয়।"
            : "SUNDROP Eco Resort is the name of this demo. The counts below are layout figures — staffing, solar share and plastic claims are not a real report."}
        </p>
        <div className="amen-grid" style={{ marginTop: 36 }}>
          <div className="photo arch">
            <Image src={photos.jetty} alt="A jetty over clear water" fill sizes="50vw" />
          </div>
          <div className="stat-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {[
              ["240", bn ? "নমুনা দল" : "Sample team size"],
              ["60", bn ? "নমুনা কারিগর" : "Sample artisans"],
              ["100%", bn ? "নমুনা দিনের সৌর লেবেল" : "Sample daytime solar label"],
              ["0", bn ? "নমুনা প্লাস্টিক লাইন" : "Sample plastic line"],
            ].map(([value, label]) => (
              <div key={label} className="stat" style={{ background: "white" }}><b style={{ color: "var(--teal-900)" }}>{value}</b><span>{label}</span></div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
