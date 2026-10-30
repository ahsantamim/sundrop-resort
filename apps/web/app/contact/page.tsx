"use client";

import { Button, Input, Label, useI18n } from "@sundrop/ui";
import { useState } from "react";

export default function ContactPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  return (
    <main>
      <div className="wrap page-hero" style={{ paddingBottom: 80 }}>
        <h1>{t("We’d love to host you.", "আপনাকে অতিথি করতে চাই।")}</h1>
        <p className="lede">{t("The form stores nothing and sends nothing. It only confirms the screen.", "ফর্ম কিছু জমা রাখে না, কিছু পাঠায় না। শুধু পর্দা নিশ্চিত করে।")}</p>
        <div className="amen-grid" style={{ marginTop: 28 }}>
          <form className="field" style={{ gap: 12 }} onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
            <Label htmlFor="cname">{t("Name", "নাম")}</Label>
            <Input id="cname" name="name" required />
            <Label htmlFor="cmobile">{t("Mobile", "মোবাইল")}</Label>
            <Input id="cmobile" name="mobile" required />
            <Label htmlFor="cemail">Email</Label>
            <Input id="cemail" type="email" name="email" required />
            <Label htmlFor="cmsg">{t("Message", "বার্তা")}</Label>
            <textarea id="cmsg" required className="flex min-h-28 w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <Button type="submit">{t("Send message", "বার্তা পাঠান")}</Button>
            {sent ? <p>{t("Noted on this screen only. Nobody was contacted.", "শুধু এই পর্দায় নোট হয়েছে। কাউকে যোগাযোগ করা হয়নি।")}</p> : null}
          </form>
          <div>
            <p>WhatsApp · +880 1711-000 245 · {t("sample", "নমুনা")}</p>
            <p>stay@sundrop.demo</p>
            <p>{t("Saint Martin’s Island, Cox’s Bazar. Speedboat note: Teknaf jetty on the sample plan.", "সেন্ট মার্টিন দ্বীপ, কক্সবাজার। স্পিডবোট নোট: নমুনা পরিকল্পনায় টেকনাফ জেটি।")}</p>
            <div className="map-ph" style={{ marginTop: 16 }}><span>{t("Map placeholder — not an embedded live map", "মানচিত্রের প্লেসহোল্ডার")}</span></div>
          </div>
        </div>
      </div>
    </main>
  );
}
