"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "bn";

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (en: string, bn: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ initial, children }: { initial: Lang; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang: (next) => {
        setLangState(next);
        document.cookie = `lang=${next};path=/;max-age=31536000;samesite=lax`;
        document.documentElement.lang = next;
      },
      t: (en, bn) => (lang === "bn" ? bn : en),
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used within I18nProvider");
  return value;
}
