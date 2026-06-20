"use client";

import { useState, useEffect, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Force re-render on language change so I18nextProvider propagates
  // to all children (including memoised / deeply nested ones).
  const [, forceRender] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      // 1) Trigger React re-render so I18nextProvider re-emits its context
      forceRender(lng);

      // 2) Sync <html> dir/lang attributes
      const html = document.documentElement;
      html.setAttribute("lang", lng);
      html.setAttribute("dir", lng === "ar" ? "rtl" : "ltr");
    };

    // Set initial values
    handleLanguageChange(i18n.language || "ar");

    // Subscribe to future language changes
    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
