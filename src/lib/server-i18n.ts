import { createInstance } from "i18next";
import ar from "@/locales/ar.json";
import en from "@/locales/en.json";

export type Lang = "ar" | "en";

export async function getServerTranslations(lang: Lang = "ar") {
  const instance = createInstance();

  await instance.init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    fallbackLng: "ar",
    lng: lang,
    interpolation: {
      escapeValue: false,
    },
  });

  return {
    t: instance.t,
    lang,
    dir: lang === "ar" ? "rtl" as const : "ltr" as const,
  };
}
