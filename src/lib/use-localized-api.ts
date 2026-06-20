"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

/**
 * Returns the base URL for API calls with the current language appended as `?lang=`.
 * Use this hook in client components that fetch dynamic content from your API.
 *
 * Example:
 *   const { apiLang } = useApiLanguage();
 *   const res = await fetch(`/api/posts${apiLang}`);
 *   const data = await res.json();
 */
export function useApiLanguage() {
  const { i18n } = useTranslation();

  const apiLang = useMemo(() => {
    const lang = i18n.language === "en" ? "en" : "ar";
    return `?lang=${lang}`;
  }, [i18n.language]);

  return { apiLang, currentLang: i18n.language === "en" ? "en" : "ar" };
}

/**
 * Creates a headers object for POST/PUT requests that include the current language.
 */
export function useLocalizedHeaders() {
  const { currentLang } = useApiLanguage();

  return {
    "Content-Type": "application/json",
    "X-Content-Language": currentLang,
  };
}
