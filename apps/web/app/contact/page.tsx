"use client";

import { photos } from "@sundrop/data/images";
import { Button, Input, Label, useI18n } from "@sundrop/ui";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { PageBanner } from "@/components/chrome/page-banner";
import { Scenery } from "@/components/chrome/scenery";

export default function ContactPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  return (
    <main>
      <PageBanner
        image={photos.beach}
        alt={t("Calm sea at sunrise", "ভোরের শান্ত সমুদ্র")}
        eyebrow={t("Contact", "যোগাযোগ")}
        title={t("We’d love to host you.", "আপনাকে অতিথি করতে চাই।")}
        lede={t("The form stores nothing and sends nothing. It only confirms the screen.", "ফর্ম কিছু জমা রাখে না, কিছু পাঠায় না। শুধু পর্দা নিশ্চিত করে।")}
      />
      <section className="sec tight">
        <Scenery />
        <div className="wrap">
          <div className="bento">
            <article className="tile s7 r2">
              <span className="over">{t("Write to the desk", "ডেস্কে লিখুন")}</span>
              <h3 className="serif-swap">{t("Tell us when you’d like to come.", "কবে আসতে চান, জানান।")}</h3>
              {sent ? (
                <p className="lede" role="status">{t("Noted on this screen only. Nobody was contacted.", "শুধু এই পর্দায় নোট হয়েছে। কাউকে যোগাযোগ করা হয়নি।")}</p>
              ) : (
                <form style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }} onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
                  <div className="field"><Label htmlFor="cname">{t("Name", "নাম")}</Label><Input id="cname" name="name" autoComplete="name" required /></div>
                  <div className="field"><Label htmlFor="cmobile">{t("Mobile", "মোবাইল")}</Label><Input id="cmobile" name="mobile" inputMode="tel" autoComplete="tel" placeholder="01712-345678" required /></div>
                  <div className="field" style={{ gridColumn: "1 / -1" }}><Label htmlFor="cemail">{t("Email", "ইমেইল")}</Label><Input id="cemail" type="email" name="email" autoComplete="email" required /></div>
                  <div className="field" style={{ gridColumn: "1 / -1" }}>
                    <Label htmlFor="cmsg">{t("Message", "বার্তা")}</Label>
                    <textarea id="cmsg" required className="flex min-h-32 w-full rounded-2xl border border-line bg-white px-4 py-3 text-[15px] outline-none focus-visible:border-teal-700 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-coral" />
                  </div>
                  <Button type="submit" style={{ justifySelf: "start" }}>{t("Send message", "বার্তা পাঠান")}</Button>
                </form>
              )}
            </article>
            <article className="tile teal s5">
              <MessageCircle aria-hidden style={{ color: "var(--marigold)" }} />
              <span className="over">{t("WhatsApp · sample", "হোয়াটসঅ্যাপ · নমুনা")}</span>
              <h3>+880 1711-000 245</h3>
              <p className="lede">{t("Answered 8 am – 10 pm on the sample plan.", "নমুনা পরিকল্পনায় সকাল ৮টা – রাত ১০টা।")}</p>
            </article>
            <article className="tile sand s5">
              <Mail aria-hidden style={{ color: "var(--teal-700)" }} />
              <span className="over">{t("Email", "ইমেইল")}</span>
              <h3>stay@sundrop.demo</h3>
              <p className="lede">{t("A placeholder address. Nothing is delivered.", "একটি প্লেসহোল্ডার ঠিকানা। কিছু পৌঁছায় না।")}</p>
            </article>
            <article className="tile s5">
              <MapPin aria-hidden style={{ color: "var(--coral)" }} />
              <span className="over">{t("Getting here", "কীভাবে আসবেন")}</span>
              <p className="lede">{t("Saint Martin’s Island, Cox’s Bazar. Speedboat from the Teknaf jetty on the sample plan.", "সেন্ট মার্টিন দ্বীপ, কক্সবাজার। নমুনা পরিকল্পনায় টেকনাফ জেটি থেকে স্পিডবোট।")}</p>
            </article>
            <div className="tile s7" style={{ padding: 0, border: 0 }}>
              <div className="map-ph"><span>{t("Map placeholder — not an embedded live map", "মানচিত্রের প্লেসহোল্ডার")}</span></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
