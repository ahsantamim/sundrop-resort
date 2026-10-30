"use client";

import { photos } from "@sundrop/data/images";
import { Button, siteUrls, useI18n } from "@sundrop/ui";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const layers = [
  { src: photos.reef, className: "layer l1", alt: "Aerial of a small island in clear water, standing in for Saint Martin’s", depth: 8 },
  { src: photos.coast, className: "layer l2", alt: "A long sandy coastline", depth: 16 },
  { src: photos.land, className: "layer l3", alt: "Aerial of open land, standing in for sample plots", depth: 26 },
];

export function InvestorParallax() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: { revert: () => void } | null = null;
    void (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const frame = root.current?.querySelector(".arch");
        if (frame) {
          gsap.fromTo(
            frame,
            { clipPath: "inset(12% 8% 0% 8% round 999px 999px 28px 28px)" },
            { clipPath: "inset(0% 0% 0% 0% round 999px 999px 28px 28px)", ease: "none", scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 20%", scrub: true } },
          );
        }
        layers.forEach((layer, index) => {
          const node = root.current?.querySelectorAll(".layer")[index];
          if (!node) return;
          gsap.fromTo(
            node,
            { yPercent: -layer.depth * 0.35 },
            { yPercent: layer.depth * 0.45, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
        const first = root.current?.querySelector(".l1");
        const second = root.current?.querySelector(".l2");
        const third = root.current?.querySelector(".l3");
        if (first && second && third) {
          gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top 55%",
              end: "bottom 45%",
              scrub: true,
              onUpdate: (self) => {
                const next = self.progress < 0.34 ? 0 : self.progress < 0.67 ? 1 : 2;
                setPhase((current) => (current === next ? current : next));
              },
            },
          })
            .to(first, { opacity: 0.2, ease: "none" }, 0.34)
            .fromTo(second, { opacity: 0 }, { opacity: 1, ease: "none" }, 0.18)
            .to(second, { opacity: 0.28, ease: "none" }, 0.67)
            .fromTo(third, { opacity: 0 }, { opacity: 1, ease: "none" }, 0.55);
        }
      }, root);
    })();
    return () => ctx?.revert();
  }, []);

  return (
    <section className="sec invest-pin" id="invest" ref={root}>
      <div className="wrap amen-grid">
        <div className="amen-sticky">
          <div className="photo arch" style={{ background: "#0f1e2e" }}>
            <div className="ip-layers">
              {layers.map((layer) => (
                <div className={layer.className} key={layer.src}>
                  <Image src={layer.src} alt={layer.alt} fill sizes="(max-width: 900px) 100vw, 46vw" loading="eager" />
                </div>
              ))}
            </div>
            <div className="shade" />
            <div className="cap">
              <b>{t("Saint Martin’s", "সেন্ট মার্টিন")}</b>
              <span className="dots" aria-hidden="true">
                {[0, 1, 2].map((dot) => <i key={dot} className={phase === dot ? "on" : ""} />)}
              </span>
            </div>
          </div>
        </div>
        <div className="amen-list">
          <div className="ip-card">
            <span className="over">{t("Investor programme", "বিনিয়োগকারী প্রোগ্রাম")}</span>
            <h2 className="serif-swap" style={{ margin: "14px 0" }}>{t("Own a share of the island’s next chapter.", "দ্বীপের পরবর্তী অধ্যায়ের অংশীদার হোন।")}</h2>
            <p className="lede">
              {t(
                "This is a demo of a fractional project desk. Browse sample projects, send an application, and open a dashboard of placeholder holdings and quarterly notes. It is not an offer of securities, and none of the figures are real performance.",
                "এটি একটি আনুপাতিক প্রকল্প ডেস্কের ডেমো। নমুনা প্রকল্প দেখুন, আবেদন পাঠান, এবং প্লেসহোল্ডার হোল্ডিং ও ত্রৈমাসিক নোটের ড্যাশবোর্ড খুলুন। এটি সিকিউরিটিজের অফার নয়, এবং কোনো সংখ্যাই আসল ফল নয়।",
              )}
            </p>
          </div>
          <div className="ip-card">
            <span className="over">{t("How it works", "কীভাবে কাজ করে")}</span>
            <h3 className="serif-swap" style={{ margin: "10px 0 16px" }}>{t("Four steps, no payment.", "চার ধাপ, কোনো পেমেন্ট নেই।")}</h3>
            <ol className="ip-steps">
              {[
                [t("Browse sample projects", "নমুনা প্রকল্প দেখুন"), t("Share counts on the public pages are demo inventory.", "পাবলিক পাতার শেয়ার সংখ্যা ডেমো ইনভেন্টরি।")],
                [t("Send an application", "একটি আবেদন পাঠান"), t("Name, email, mobile and a share count. Nothing is charged.", "নাম, ইমেইল, মোবাইল ও শেয়ার সংখ্যা। কিছু কাটা হয় না।")],
                [t("Admin decides", "অ্যাডমিন সিদ্ধান্ত নেন"), t("Approve or decline the request in the admin demo.", "অ্যাডমিন ডেমোতে আবেদন অনুমোদন বা প্রত্যাখ্যান।")],
                [t("Open the dashboard", "ড্যাশবোর্ড খুলুন"), t("The investor login shows sample holdings and notes.", "বিনিয়োগকারী লগইনে নমুনা হোল্ডিং ও নোট।")],
              ].map(([title, copy], index) => (
                <li key={title}>
                  <span>{index + 1}</span>
                  <div><b>{title}</b><p className="lede" style={{ margin: "4px 0 0", fontSize: 14 }}>{copy}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="ip-card">
            <span className="over">{t("Dashboard & reports", "ড্যাশবোর্ড ও রিপোর্ট")}</span>
            <h3 className="serif-swap" style={{ margin: "10px 0 12px" }}>{t("What the portal actually opens.", "পোর্টালে যা খোলে।")}</h3>
            <p className="lede">
              {t(
                "A portfolio snapshot, project milestones, and a quarterly-note archive. Each file is labelled as a placeholder, not a statement or a certificate.",
                "পোর্টফোলিওর ছবি, প্রকল্পের মাইলস্টোন, এবং ত্রৈমাসিক নোটের আর্কাইভ। প্রতিটি ফাইল প্লেসহোল্ডার — বিবৃতি বা সনদ নয়।",
              )}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 18 }}>
              <Button asChild variant="gold" size="sm">
                <a href={siteUrls.investor}>{t("Open the investor portal", "বিনিয়োগকারী পোর্টাল")} <ArrowRight /></a>
              </Button>
              <Button asChild variant="goldGhost" size="sm">
                <Link href="/invest">{t("View sample projects", "নমুনা প্রকল্প")} <ArrowRight /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
