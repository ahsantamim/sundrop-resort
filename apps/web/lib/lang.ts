import type { Lang } from "@sundrop/ui";
import { cookies } from "next/headers";

/** Language for server components, with a `t(en, bn)` picker matching useI18n. */
export async function getLang() {
  const lang: Lang = (await cookies()).get("lang")?.value === "bn" ? "bn" : "en";
  return { lang, t: (en: string, bn: string) => (lang === "bn" ? bn : en) };
}
