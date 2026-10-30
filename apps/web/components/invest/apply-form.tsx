"use client";

import { remainingShares, type Project } from "@sundrop/data/types";
import { Button, Input, Label, formatBdt, useI18n } from "@sundrop/ui";
import { useState } from "react";
import { submitApplication } from "@/lib/actions";

export function ApplyForm({ project }: { project: Project }) {
  const { t, lang } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [shares, setShares] = useState(1);
  const [note, setNote] = useState("");
  const [ack, setAck] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const left = remainingShares(project);

  if (done) {
    return <p className="lede">{t(`Request ${done} is with the demo desk. An admin can approve or decline it. No payment was taken.`, `আবেদন ${done} ডেমো ডেস্কে আছে। অ্যাডমিন অনুমোদন বা প্রত্যাখ্যান করতে পারেন। কোনো পেমেন্ট হয়নি।`)}</p>;
  }

  return (
    <form
      className="field"
      style={{ gap: 12 }}
      onSubmit={async (event) => {
        event.preventDefault();
        if (!ack) {
          setError(t("Tick the box to confirm these figures are placeholders.", "সংখ্যাগুলো প্লেসহোল্ডার, সেটা নিশ্চিত করতে বক্সে টিক দিন।"));
          return;
        }
        setPending(true);
        const result = await submitApplication({ projectSlug: project.slug, name, email, mobile, shares, note });
        setPending(false);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setDone(result.data.id);
      }}
    >
      <h2 style={{ fontSize: 32, color: "inherit" }}>{t("Apply to invest", "বিনিয়োগের আবেদন")}</h2>
      <p className="lede">{t(`${left} sample shares remain. Price per share ${formatBdt(project.pricePerShare, lang)} is a placeholder.`, `${left}টি নমুনা শেয়ার বাকি। প্রতি শেয়ার ${formatBdt(project.pricePerShare, lang)} একটি প্লেসহোল্ডার।`)}</p>
      <Label htmlFor="aname">{t("Full name", "পুরো নাম")}</Label>
      <Input id="aname" value={name} onChange={(event) => setName(event.target.value)} required />
      <Label htmlFor="aemail">Email</Label>
      <Input id="aemail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <Label htmlFor="amobile">{t("Mobile", "মোবাইল")}</Label>
      <Input id="amobile" value={mobile} onChange={(event) => setMobile(event.target.value)} placeholder="01712-345678" required />
      <Label htmlFor="ashares">{t("Number of shares", "শেয়ার সংখ্যা")}</Label>
      <Input id="ashares" type="number" min={1} max={Math.min(40, left)} value={shares} onChange={(event) => setShares(Number(event.target.value))} />
      <p className="help">{t(`Sample notionally ${formatBdt(shares * project.pricePerShare, lang)}. Not payable here.`, `নমুনা হিসাবে ${formatBdt(shares * project.pricePerShare, lang)}। এখানে পরিশোধ নয়।`)}</p>
      <Label htmlFor="anote">{t("Note (optional)", "নোট (ঐচ্ছিক)")}</Label>
      <Input id="anote" value={note} onChange={(event) => setNote(event.target.value)} />
      <label className="help"><input type="checkbox" checked={ack} onChange={(event) => setAck(event.target.checked)} /> {t("I understand this is a demo. The yield label is not a forecast, and no shares are actually issued.", "আমি বুঝেছি এটি একটি ডেমো। রিটার্নের লেবেল পূর্বাভাস নয়, এবং আসলে কোনো শেয়ার ইস্যু হয় না।")}</label>
      {error ? <p className="error">{error}</p> : null}
      <Button type="submit" variant="gold" disabled={pending || left < 1}>{pending ? t("Sending…", "পাঠানো হচ্ছে…") : t("Submit application", "আবেদন পাঠান")}</Button>
    </form>
  );
}
