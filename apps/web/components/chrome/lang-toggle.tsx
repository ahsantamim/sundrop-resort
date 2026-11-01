"use client";

import { useI18n } from "@sundrop/ui";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

export function LangToggle({ light = true }: { light?: boolean }) {
  const { lang, setLang: setClientLang } = useI18n();
  const router = useRouter();
  // Server-rendered pages read the cookie, so re-render them after switching.
  const setLang = (next: "en" | "bn") => {
    if (next === lang) return;
    setClientLang(next);
    router.refresh();
  };
  const ref = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ width: 34, x: 0 });

  useLayoutEffect(() => {
    const root = ref.current;
    const active = root?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (!active) return;
    setKnob({ width: active.offsetWidth, x: active.offsetLeft - 4 });
  }, [lang]);

  return (
    <div className="lang" ref={ref} role="group" aria-label={lang === "bn" ? "ভাষা" : "Language"} style={light ? undefined : { background: "rgba(11,79,74,.08)", borderColor: "rgba(11,79,74,.2)" }}>
      <span className="knob" style={{ width: knob.width, transform: `translateX(${knob.x}px)` }} />
      <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")} style={light ? undefined : { color: lang === "en" ? undefined : "#0B4F4A" }}>
        EN
      </button>
      <button type="button" className="bn-btn" aria-pressed={lang === "bn"} onClick={() => setLang("bn")} style={light ? undefined : { color: lang === "bn" ? undefined : "#0B4F4A" }}>
        বাংলা
      </button>
    </div>
  );
}
