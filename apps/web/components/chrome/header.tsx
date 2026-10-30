"use client";

import { Button, Mark, Wordmark, useI18n } from "@sundrop/ui";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LangToggle } from "./lang-toggle";

const links = [
  { href: "/villas", en: "Villas", bn: "ভিলা" },
  { href: "/experiences", en: "Experiences", bn: "অভিজ্ঞতা" },
  { href: "/gallery", en: "Gallery", bn: "গ্যালারি" },
  { href: "/invest", en: "Invest", bn: "বিনিয়োগ" },
  { href: "/contact", en: "Contact", bn: "যোগাযোগ" },
];

export function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const home = pathname === "/";
  const [solid, setSolid] = useState(!home);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!home) {
      setSolid(true);
      return;
    }
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`nav ${home ? (solid ? "solid" : "") : "page"}`} id="nav">
      <div className="wrap">
        <Link href="/" className="brand" aria-label="SUNDROP Eco Resort home">
          <Mark />
          <Wordmark />
        </Link>
        <nav className="links" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname.startsWith(link.href) ? "page" : undefined}>
              {t(link.en, link.bn)}
            </Link>
          ))}
        </nav>
        <div className="nav-right">
          <LangToggle />
          <Button asChild size="sm" variant="accent" className="btn-book">
            <Link href="/villas">{t("Book your stay", "বুকিং করুন")}</Link>
          </Button>
          <button className="menu-btn" type="button" aria-expanded={open} aria-label={t("Menu", "মেনু")} onClick={() => setOpen(true)}>
            <Menu />
          </button>
        </div>
      </div>
      {open ? (
        <div className="mobile-drawer" onClick={() => setOpen(false)}>
          <div className="mobile-panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setOpen(false)} aria-label={t("Close", "বন্ধ")} style={{ alignSelf: "flex-end", background: "transparent", color: "white", border: 0 }}>
              <X />
            </button>
            {links.map((link) => (
              <Link key={link.href} href={link.href} style={{ fontSize: 22, fontFamily: "var(--serif)" }}>
                {t(link.en, link.bn)}
              </Link>
            ))}
            <Link href="/about">{t("About", "আমাদের কথা")}</Link>
            <Link href="/dining">{t("Dining", "খাবার")}</Link>
            <Link href="/manage">{t("Manage booking", "বুকিং পরিচালনা")}</Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
