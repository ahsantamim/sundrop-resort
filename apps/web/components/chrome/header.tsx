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

// Pages that open on a full-bleed photo (hero or PageBanner) get the transparent nav.
const PHOTO_TOPS = ["/villas", "/experiences", "/dining", "/gallery", "/about", "/contact", "/invest"];

export function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const overPhoto = pathname === "/" || PHOTO_TOPS.some((path) => pathname.startsWith(path));
  const invest = pathname.startsWith("/invest");
  const [solid, setSolid] = useState(!overPhoto);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!overPhoto) {
      setSolid(true);
      return;
    }
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overPhoto]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`nav ${invest ? "nav-invest" : ""} ${overPhoto ? (solid ? "solid" : "") : "page"} ${open ? "menu-open" : ""}`} id="nav">
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
          <button className="menu-btn" type="button" aria-expanded={open} aria-label={open ? t("Close", "বন্ধ") : t("Menu", "মেনু")} onClick={() => setOpen((value) => !value)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="mobile-panel" aria-label={t("Menu", "মেনু")}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname.startsWith(link.href) ? "page" : undefined}>
              {t(link.en, link.bn)}
            </Link>
          ))}
          <Link href="/about">{t("About", "আমাদের কথা")}</Link>
          <Link href="/dining">{t("Dining", "খাবার")}</Link>
          <Link href="/manage">{t("Manage booking", "বুকিং পরিচালনা")}</Link>
        </nav>
      ) : null}
    </header>
  );
}
