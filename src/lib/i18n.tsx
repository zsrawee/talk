"use client";

import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { ar, en } from "./dictionaries";

type Lang = "ar" | "en";
type Translations = typeof ar & Record<string, string>;

interface TranslationContextValue {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LangContext = createContext<TranslationContextValue | null>(null);

const allDicts: Record<Lang, Translations> = { ar, en };

function getTranslations(lang: Lang = "ar") {
  const dict = allDicts[lang];
  const t = (key: string, params?: Record<string, string | number>) => {
    let val = dict[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        val = val.replace(`{${k}}`, String(v));
      });
    }
    return val;
  };
  return { t, lang, dir: lang === "ar" ? "rtl" : "ltr" };
}

function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lang");
      if (stored === "ar" || stored === "en") {
        return stored as Lang;
      }
      return navigator.language.startsWith("ar") ? "ar" : "en";
    }
    return "ar";
  });

  const { t, dir } = getTranslations(lang);

  // Sync dir and lang attributes to <html> and persist lang
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("dir", dir);
    html.setAttribute("lang", lang);
    localStorage.setItem("lang", lang);
  }, [lang, dir]);

  const value: TranslationContextValue = { lang, dir, setLang, t };

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
}

function useTranslation() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useTranslation must be used within LangProvider");
  return ctx;
}

export { LangProvider, useTranslation, getTranslations };