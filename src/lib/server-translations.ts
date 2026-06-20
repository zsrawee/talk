import { ar, en } from "./dictionaries";

export type Lang = "ar" | "en";
export type Translations = Record<string, string>;

const allDicts: Record<Lang, Translations> = { ar, en };

export function getTranslations(lang: Lang = "ar") {
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