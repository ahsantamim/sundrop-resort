"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.documentElement.classList.add("reduce");
      return;
    }
    let destroyed = false;
    let lenis: { destroy: () => void; start: () => void; stop: () => void; raf: (time: number) => void; on: (event: "scroll", cb: () => void) => void } | null = null;
    let ticker: ((time: number) => void) | null = null;
    let gsapRef: { ticker: { add: (fn: (time: number) => void) => void; remove: (fn: (time: number) => void) => void; lagSmoothing: (n: number) => void } } | null = null;

    void (async () => {
      const [{ default: Lenis }, gsapMod, stMod] = await Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]);
      if (destroyed) return;
      const gsap = gsapMod.default;
      gsap.registerPlugin(stMod.ScrollTrigger);
      gsapRef = gsap;
      const instance = new Lenis({ lerp: 0.1 });
      lenis = instance;
      instance.on("scroll", stMod.ScrollTrigger.update);
      ticker = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
      const start = () => instance.start();
      if (document.body.classList.contains("is-loading")) {
        instance.stop();
        window.addEventListener("sundrop:intro-done", start, { once: true });
      }
      stMod.ScrollTrigger.refresh();
    })();

    return () => {
      destroyed = true;
      if (ticker && gsapRef) gsapRef.ticker.remove(ticker);
      lenis?.destroy();
    };
  }, [pathname]);

  return children;
}
