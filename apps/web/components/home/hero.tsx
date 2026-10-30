"use client";

import { photos } from "@sundrop/data/images";
import { Button, useI18n } from "@sundrop/ui";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { WaterCanvas } from "./water-canvas";

function iso(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function Hero() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const defaults = useMemo(() => {
    const checkIn = new Date(today);
    checkIn.setDate(checkIn.getDate() + 14);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 3);
    return { checkIn: iso(checkIn), checkOut: iso(checkOut) };
  }, [today]);
  const [checkIn, setCheckIn] = useState(defaults.checkIn);
  const [checkOut, setCheckOut] = useState(defaults.checkOut);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [open, setOpen] = useState(false);
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
        tl.fromTo(".hero-over, .hero-lede, .search, .hero-foot", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, "-=0.8");
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

  const format = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return "—";
    return new Date(year, month - 1, day).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const guestLabel =
    lang === "bn"
      ? `${adults.toLocaleString("bn-BD")} জন প্রাপ্তবয়স্ক${children ? `, ${children.toLocaleString("bn-BD")} শিশু` : ""}`
      : `${adults} adult${adults > 1 ? "s" : ""}${children ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}`;

  function submit() {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
    setToast(lang === "bn" ? `${nights.toLocaleString("bn-BD")} রাতের জন্য ভিলা খুঁজছি` : `Looking up villas for ${nights} night${nights > 1 ? "s" : ""}`);
    router.push(`/villas?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`);
  }

  const words = lang === "bn"
    ? ["আপনার", "নিজের", "দ্বীপ,", "যেখানে", "সময়", "রাখে"]
    : ["Your", "own", "island,", "where", "the", "sea", "keeps"];

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div id="preloader" aria-hidden="true">
        <div style={{ textAlign: "center" }}>
          <div className="pl-name">SUNDROP</div>
          <div className="pl-sub">ECO RESORT</div>
        </div>
        <div className="pl-bar" style={{ width: 180, height: 1, background: "rgba(255,255,255,.15)", overflow: "hidden" }}>
          <i style={{ display: "block", height: "100%", width: "100%", background: "var(--gold)", transform: "scaleX(0)", transformOrigin: "left" }} />
        </div>
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
        <form
          className="search"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <label className="cell">
            <div>
              <small>{t("Check-in", "চেক-ইন")}</small>
              <span className="v">{format(checkIn)}</span>
            </div>
            <input type="date" aria-label={t("Check-in date", "চেক-ইনের তারিখ")} min={iso(today)} value={checkIn} onChange={(event) => {
              const next = event.target.value || defaults.checkIn;
              setCheckIn(next);
              if (next >= checkOut) {
                const end = new Date(next);
                end.setDate(end.getDate() + 3);
                setCheckOut(iso(end));
              }
            }} />
          </label>
          <label className="cell">
            <div>
              <small>{t("Check-out", "চেক-আউট")}</small>
              <span className="v">{format(checkOut)}</span>
            </div>
            <input type="date" aria-label={t("Check-out date", "চেক-আউটের তারিখ")} min={checkIn} value={checkOut} onChange={(event) => setCheckOut(event.target.value || defaults.checkOut)} />
          </label>
          <div className="cell" role="button" tabIndex={0} aria-expanded={open} onClick={() => setOpen((value) => !value)} onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setOpen((value) => !value);
            }
          }}>
            <div>
              <small>{t("Guests", "অতিথি")}</small>
              <span className="v">{guestLabel}</span>
            </div>
            <div className={`guests-pop ${open ? "open" : ""}`} onClick={(event) => event.stopPropagation()}>
              <div className="gp-row">
                <div><b>{t("Adults", "প্রাপ্তবয়স্ক")}</b><em>{t("Age 13+", "১৩+ বছর")}</em></div>
                <div className="step">
                  <button type="button" aria-label={t("Fewer adults", "কম প্রাপ্তবয়স্ক")} onClick={() => setAdults((n) => Math.max(1, n - 1))}>−</button>
                  <output>{lang === "bn" ? adults.toLocaleString("bn-BD") : adults}</output>
                  <button type="button" aria-label={t("More adults", "আরও প্রাপ্তবয়স্ক")} onClick={() => setAdults((n) => Math.min(6, n + 1))}>+</button>
                </div>
              </div>
              <div className="gp-row">
                <div><b>{t("Children", "শিশু")}</b><em>{t("Age 2–12", "২–১২ বছর")}</em></div>
                <div className="step">
                  <button type="button" aria-label={t("Fewer children", "কম শিশু")} onClick={() => setChildren((n) => Math.max(0, n - 1))}>−</button>
                  <output>{lang === "bn" ? children.toLocaleString("bn-BD") : children}</output>
                  <button type="button" aria-label={t("More children", "আরও শিশু")} onClick={() => setChildren((n) => Math.min(4, n + 1))}>+</button>
                </div>
              </div>
            </div>
          </div>
          <Button type="submit" size="lg">
            {t("Check availability", "খালি আছে কিনা দেখুন")} <ArrowRight />
          </Button>
        </form>
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
