"use client";

import { photos } from "@sundrop/data/images";
import { useI18n } from "@sundrop/ui";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { SearchBar } from "@/components/booking/search-bar";
import { addDays, todayIso } from "@/lib/dates";
import { WaterCanvas } from "./water-canvas";

export function Hero() {
  const { t, lang } = useI18n();
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const defaults = useMemo(() => {
    const checkIn = addDays(todayIso(), 14);
    return { checkIn, checkOut: addDays(checkIn, 3) };
  }, []);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heroState = { scale: reduced ? 1 : 1.06, mx: 0.5, my: 0.5, mi: 0 };
    (window as Window & { __sundropHero?: typeof heroState }).__sundropHero = heroState;
    if (reduced) {
      window.dispatchEvent(new Event("sundrop:intro-done"));
      return;
    }
    document.body.classList.add("is-loading");
    let ctx: { revert: () => void } | null = null;
    void (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const words = titleRef.current?.querySelectorAll(".w > span");
      ctx = gsap.context(() => {
        const tl = gsap.timeline();
        tl.to("#preloader .pl-bar i", { scaleX: 1, duration: 1.1, ease: "power2.inOut" })
          .to("#preloader > *", { y: -24, opacity: 0, duration: 0.35, stagger: 0.04 })
          .to("#preloader", { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "-=0.1")
          .add(() => {
            document.body.classList.remove("is-loading");
            document.getElementById("preloader")?.remove();
            window.dispatchEvent(new Event("sundrop:intro-done"));
          })
          .to(heroState, {
            scale: 1,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              const image = document.getElementById("heroImg");
              if (image) image.style.transform = `scale(${heroState.scale})`;
            },
          }, "-=0.6");
        if (words?.length) {
          tl.fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06 }, "<0.1");
        }
        tl.fromTo(".hero-over, .hero-lede, .hero-search, .hero-foot", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, "-=0.8");
        gsap.to(".hero-media", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        });
      });
    })();
    return () => {
      document.body.classList.remove("is-loading");
      ctx?.revert();
    };
  }, []);

  const words = lang === "bn"
    ? ["আপনার", "নিজের", "দ্বীপ,", "যেখানে", "সময়", "রাখে"]
    : ["Your", "own", "island,", "where", "the", "sea", "keeps"];

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div id="preloader" aria-hidden="true">
        <div className="pl-scene">
          <div className="pl-orbit">
            <span className="pl-ring r1" />
            <span className="pl-ring r2" />
            <span className="pl-sun" />
            <span className="pl-arm"><span className="pl-dot" /></span>
          </div>
          <svg className="pl-waves" viewBox="0 0 220 48" fill="none">
            <path className="w1" d="M4 18c18 10 28 10 46 0s28-10 46 0 28 10 46 0 28-10 46 0 22 10 28 8" />
            <path className="w2" d="M4 32c18 8 28 8 46 0s28-8 46 0 28 8 46 0 28-8 46 0 22 8 28 6" />
          </svg>
          <div className="pl-name">SUNDROP</div>
          <div className="pl-sub">ECO RESORT</div>
        </div>
        <div className="pl-bar"><i /></div>
      </div>
      <div className="hero-media">
        <Image id="heroImg" src={photos.hero} alt="Overwater villas above a calm lagoon at sunset" fill priority sizes="100vw" style={{ objectFit: "cover", transform: "scale(1.06)" }} />
        <WaterCanvas src={photos.hero} />
      </div>
      <div className="hero-shade" />
      <svg className="palm" style={{ left: -40, top: 70 }} width="300" height="420" viewBox="0 0 300 420" fill="none" aria-hidden="true">
        <g className="sway" stroke="#FBF7F0" strokeWidth="2" strokeLinecap="round">
          <path d="M150 410C160 300 170 210 160 120" />
          <path d="M160 120C120 90 70 90 20 120" />
          <path d="M160 120C130 70 90 50 50 50" />
          <path d="M160 120C170 60 200 30 250 20" />
          <path d="M160 120C210 100 250 110 290 150" />
          <path d="M160 120C190 140 210 180 215 230" />
        </g>
      </svg>
      <div className="wrap hero-inner">
        <span className="over hero-over">{t("Bay of Bengal  ·  2 hours from Cox’s Bazar", "বঙ্গোপসাগর  ·  কক্সবাজার থেকে ২ ঘণ্টা")}</span>
        <h1 className="split serif-swap" id="heroTitle" ref={titleRef}>
          {words.map((word) => (
            <span className="w" key={word}>
              <span>{word}&nbsp;</span>
            </span>
          ))}
          <span className="w">
            <span>
              <em>{t("time.", "সমুদ্র।")}</em>
            </span>
          </span>
        </h1>
        <p className="lede hero-lede">
          {t(
            "Twenty-four overwater and garden villas in this demo, with private sunsets and unhurried hospitality — search, choose a room and get a reference. No account needed.",
            "এই ডেমোতে চব্বিশটি জলের উপর ও বাগান ভিলা — খুঁজুন, ঘর বেছে নিন, একটি রেফারেন্স পান। অ্যাকাউন্ট লাগবে না।",
          )}
        </p>
        <SearchBar
          className="hero-search"
          initial={{ ...defaults, adults: 2, children: 0 }}
          onSearch={(count) => setToast(lang === "bn" ? `${count.toLocaleString("bn-BD")} রাতের জন্য ভিলা খুঁজছি` : `Looking up villas for ${count} night${count > 1 ? "s" : ""}`)}
        />
      </div>
      <div className="hero-foot">
        <div className="wrap">
          <div className="scroll-cue"><i /><span>{t("Scroll to explore", "নিচে দেখুন")}</span></div>
          <div className="weather">
            <span><b>29°C</b> · {t("sample", "নমুনা")} · {t("Calm sea", "শান্ত সমুদ্র")}</span>
            <span>{t("Sunset", "সূর্যাস্ত")} <b>{t("5:21 pm", "বিকাল ৫:২১")}</b> · {t("sample", "নমুনা")}</span>
          </div>
        </div>
      </div>
      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
    </section>
  );
}
