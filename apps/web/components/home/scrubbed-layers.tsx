"use client";

import Image from "next/image";
import { useEffect, useRef, type RefObject } from "react";

export type ScrubLayer = {
  src: string;
  alt: string;
  depth: number;
};

type ScrubOptions = {
  onPhase?: (phase: number) => void;
};

/**
 * Sticky-frame parallax shared by the investor programme and the mobile
 * experiences section: clip-path reveal, depth drift, and a three-layer crossfade.
 */
export function startScrubbedLayers(root: HTMLElement | null, options?: ScrubOptions): () => void {
  if (!root) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  let ctx: { revert: () => void } | null = null;
  let cancelled = false;

  void (async () => {
    const { default: gsap } = await import("gsap");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    if (cancelled) return;
    gsap.registerPlugin(ScrollTrigger);
    ctx = gsap.context(() => {
      const frame = root.querySelector(".arch");
      if (frame) {
        gsap.fromTo(
          frame,
          { clipPath: "inset(12% 8% 0% 8% round 999px 999px 28px 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 999px 999px 28px 28px)",
            ease: "none",
            scrollTrigger: { trigger: root, start: "top 80%", end: "top 20%", scrub: true },
          },
        );
      }
      root.querySelectorAll<HTMLElement>(".layer").forEach((node) => {
        const depth = Number(node.dataset.depth ?? "0");
        gsap.fromTo(
          node,
          { yPercent: -depth * 0.35 },
          {
            yPercent: depth * 0.45,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      const first = root.querySelector(".l1");
      const second = root.querySelector(".l2");
      const third = root.querySelector(".l3");
      if (first && second && third) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 55%",
              end: "bottom 45%",
              scrub: true,
              onUpdate: (self) => {
                const next = self.progress < 0.34 ? 0 : self.progress < 0.67 ? 1 : 2;
                options?.onPhase?.(next);
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

  return () => {
    cancelled = true;
    ctx?.revert();
  };
}

export function useScrubbedLayers(
  root: RefObject<HTMLElement | null>,
  enabled: boolean,
  onPhase?: (phase: number) => void,
) {
  const onPhaseRef = useRef(onPhase);
  onPhaseRef.current = onPhase;

  useEffect(() => {
    if (!enabled) return;
    return startScrubbedLayers(root.current, {
      onPhase: (phase) => onPhaseRef.current?.(phase),
    });
  }, [enabled, root]);
}

export function ParallaxLayers({
  layers,
  sizes = "(max-width: 900px) 100vw, 46vw",
  eager = false,
  activeIndex,
}: {
  layers: ScrubLayer[];
  sizes?: string;
  eager?: boolean;
  activeIndex?: number;
}) {
  return (
    <div className="ip-layers">
      {layers.map((layer, index) => (
        <div
          className={`layer l${index + 1}`}
          data-depth={layer.depth}
          key={layer.src}
          aria-hidden={activeIndex === undefined ? undefined : index !== activeIndex}
        >
          <Image src={layer.src} alt={layer.alt} fill sizes={sizes} loading={eager ? "eager" : undefined} />
        </div>
      ))}
    </div>
  );
}
