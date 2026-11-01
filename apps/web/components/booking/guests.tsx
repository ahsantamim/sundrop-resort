"use client";

import { useI18n } from "@sundrop/ui";

export function Stepper({ value, set, min, max, less, more }: { value: number; set: (n: number) => void; min: number; max: number; less: string; more: string }) {
  const { lang } = useI18n();
  return (
    <div className="step">
      <button type="button" aria-label={less} disabled={value <= min} onClick={() => set(Math.max(min, value - 1))}>−</button>
      <output>{lang === "bn" ? value.toLocaleString("bn-BD") : value}</output>
      <button type="button" aria-label={more} disabled={value >= max} onClick={() => set(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

export function GuestsPanel({
  adults,
  childCount,
  setAdults,
  setChildren,
  maxAdults = 6,
  maxChildren = 4,
}: {
  adults: number;
  childCount: number;
  setAdults: (n: number) => void;
  setChildren: (n: number) => void;
  maxAdults?: number;
  maxChildren?: number;
}) {
  const { t } = useI18n();
  return (
    <div className="gp">
      <div className="gp-row">
        <div><b>{t("Adults", "প্রাপ্তবয়স্ক")}</b><em>{t("Age 13+", "১৩+ বছর")}</em></div>
        <Stepper value={adults} set={setAdults} min={1} max={maxAdults} less={t("Fewer adults", "কম প্রাপ্তবয়স্ক")} more={t("More adults", "আরও প্রাপ্তবয়স্ক")} />
      </div>
      <div className="gp-row">
        <div><b>{t("Children", "শিশু")}</b><em>{t("Age 2–12", "২–১২ বছর")}</em></div>
        <Stepper value={childCount} set={setChildren} min={0} max={maxChildren} less={t("Fewer children", "কম শিশু")} more={t("More children", "আরও শিশু")} />
      </div>
    </div>
  );
}
