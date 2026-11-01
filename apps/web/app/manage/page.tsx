"use client";

import { Button, Input, Label, useI18n } from "@sundrop/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Scenery } from "@/components/chrome/scenery";

export default function ManageLookupPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="book-shell">
      <Scenery />
      <div className="wrap book-narrow">
        <div className="book-card" style={{ display: "grid", gap: 18 }}>
          <div>
            <span className="over">{t("Manage booking", "বুকিং পরিচালনা")}</span>
            <h1 className="serif-swap">{t("Open your private link", "আপনার ব্যক্তিগত লিংক খুলুন")}</h1>
            <p className="lede" style={{ margin: 0 }}>{t("A booking reference on its own is not enough. Paste the private link or the token from your confirmation.", "শুধু রেফারেন্স যথেষ্ট নয়। নিশ্চিতকরণের ব্যক্তিগত লিংক বা টোকেন দিন।")}</p>
          </div>
          <form
            className="field"
            style={{ gap: 12 }}
            onSubmit={(event) => {
              event.preventDefault();
              const token = value.trim().split("/").filter(Boolean).pop() ?? "";
              if (token.length < 20) {
                setError(t("That does not look like a private token.", "এটি ব্যক্তিগত টোকেনের মতো দেখাচ্ছে না।"));
                return;
              }
              router.push(`/b/${token}`);
            }}
          >
            <Label htmlFor="token">{t("Private link or token", "ব্যক্তিগত লিংক বা টোকেন")}</Label>
            <Input id="token" value={value} onChange={(event) => setValue(event.target.value)} placeholder="SdDemo…" />
            {error ? <p className="notice" role="alert" style={{ margin: 0 }}>{error}</p> : null}
            <Button type="submit">{t("Open booking", "বুকিং খুলুন")}</Button>
          </form>
          <div className="tile sand" style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <p className="help" style={{ color: "var(--ink-600)" }}>{t("Sample booking for the demo: SDR-DEMO-2610.", "ডেমোর নমুনা বুকিং: SDR-DEMO-2610।")}</p>
            <button type="button" className="text-btn" onClick={() => router.push("/b/SdDemoGuestLinkToken0000000001ab")}>{t("Open the sample booking", "নমুনা বুকিং খুলুন")}</button>
          </div>
        </div>
      </div>
    </main>
  );
}
