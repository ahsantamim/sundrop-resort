"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

const GAP = 12;
const EDGE = 16;

/**
 * Anchored panel rendered into <body>, so clipped parents (the hero is
 * overflow: hidden) cannot cut it off. Flips above the anchor when there is
 * no room below, and closes on outside press or Escape.
 */
export function Popover({
  anchor,
  open,
  onClose,
  width,
  label,
  children,
}: {
  anchor: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  width: number;
  label: string;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const place = useCallback(() => {
    const box = anchor.current?.getBoundingClientRect();
    const own = panel.current;
    if (!box || !own) return;
    const w = Math.min(width, window.innerWidth - EDGE * 2);
    const h = own.offsetHeight;
    const below = window.innerHeight - box.bottom;
    const up = below < h + GAP && box.top > below;
    const top = (up ? box.top - h - GAP : box.bottom + GAP) + window.scrollY;
    const left = Math.min(Math.max(EDGE, box.left), window.innerWidth - w - EDGE) + window.scrollX;
    setPos({ top, left, width: w });
  }, [anchor, width]);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const observer = new ResizeObserver(place);
    if (panel.current) observer.observe(panel.current);
    const onPress = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panel.current?.contains(target) || anchor.current?.contains(target)) return;
      onClose();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("resize", place);
    document.addEventListener("pointerdown", onPress);
    document.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
      document.removeEventListener("pointerdown", onPress);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, place, onClose, anchor]);

  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div
      ref={panel}
      className="pop"
      role="dialog"
      aria-label={label}
      style={pos ? { top: pos.top, left: pos.left, width: pos.width } : { top: 0, left: 0, width: `min(${width}px, calc(100vw - ${EDGE * 2}px))`, visibility: "hidden" }}
    >
      {children}
    </div>,
    document.body,
  );
}
