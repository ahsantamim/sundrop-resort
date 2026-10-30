"use client";

import { siteUrls, useI18n } from "@sundrop/ui";
import Link from "next/link";
import { LangToggle } from "./lang-toggle";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="site">
      <svg className="stitch" viewBox="0 0 1440 22" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 11h1440" stroke="#C9A227" strokeWidth="1.5" strokeDasharray="10 8" opacity=".55" />
      </svg>
      <div className="wrap f-top">
        <div className="f-brand">
          <b>SUNDROP</b>
          <p>
            {t(
              "A demo of an island eco-resort on Saint Martin’s, Cox’s Bazar. Sample copy, sample rates and sample investment figures — not a real booking engine.",
              "কক্সবাজারের সেন্ট মার্টিনে একটি ইকো-রিসোর্টের ডেমো। নমুনা লেখা, নমুনা ভাড়া ও নমুনা বিনিয়োগ সংখ্যা — এটি আসল বুকিং ইঞ্জিন নয়।",
            )}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span>{t("Language", "ভাষা")}</span>
            <LangToggle />
          </div>
        </div>
        <div>
          <h4>{t("Stay", "থাকা")}</h4>
          <Link href="/villas">{t("All villas", "সব ভিলা")}</Link>
          <Link href="/experiences">{t("Experiences", "অভিজ্ঞতা")}</Link>
          <Link href="/dining">{t("Dining", "খাবার")}</Link>
          <Link href="/info/offers">{t("Offers", "অফার")}</Link>
        </div>
        <div>
          <h4>{t("Island", "দ্বীপ")}</h4>
          <Link href="/about">{t("About", "আমাদের কথা")}</Link>
          <Link href="/gallery">{t("Gallery", "গ্যালারি")}</Link>
          <Link href="/contact">{t("Getting here", "কীভাবে আসবেন")}</Link>
          <Link href="/manage">{t("Manage booking", "বুকিং পরিচালনা")}</Link>
        </div>
        <div>
          <h4>{t("Company", "প্রতিষ্ঠান")}</h4>
          <Link href="/invest">{t("Investors", "বিনিয়োগকারী")}</Link>
          <a href={siteUrls.investor}>{t("Investor login", "বিনিয়োগকারী লগইন")}</a>
          <a href={siteUrls.admin}>{t("Admin demo", "অ্যাডমিন ডেমো")}</a>
          <Link href="/info/sustainability">{t("Sustainability", "টেকসইতা")}</Link>
        </div>
        <div>
          <h4>{t("Contact", "যোগাযোগ")}</h4>
          <Link href="/contact">+880 1711-000 245</Link>
          <Link href="/contact">stay@sundrop.demo</Link>
          <Link href="/contact">{t("Saint Martin’s Island, Cox’s Bazar", "সেন্ট মার্টিন দ্বীপ, কক্সবাজার")}</Link>
        </div>
      </div>
      <div className="wrap f-bot">
        <span>{t("© 2026 SUNDROP Eco Resort · demo. All sample content.", "© ২০২৬ সানড্রপ ইকো রিসোর্ট · ডেমো। সব নমুনা বিষয়বস্তু।")}</span>
        <span>
          <Link href="/info/privacy">{t("Privacy", "গোপনীয়তা")}</Link>
          {" · "}
          <Link href="/info/terms">{t("Terms", "শর্তাবলি")}</Link>
          {" · "}
          <Link href="/info/refunds">{t("Refund policy", "রিফান্ড নীতি")}</Link>
        </span>
      </div>
      <div className="wrap credit">
        Photography via Unsplash (Unsplash License), including the Saint Martin’s boat frame credited to Himel Roy and the island aerial credited to Zunnoon Ahmed in the design reference. Phone numbers, emails, prices, reviews, yields and certificates on this site are placeholders for the demo.
      </div>
    </footer>
  );
}
