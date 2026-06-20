"use client";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { i18n: i18nHook } = useTranslation();
  const router = useRouter();
  const currentLang = i18nHook.language;

  const toggleLanguage = useCallback(() => {
    const next = currentLang === "ar" ? "en" : "ar";

    // 1) Change i18next language – triggers ALL useTranslation subscribers instantly
    i18nHook.changeLanguage(next);

    // 2) Sync the cookie so server components pick up the new language
    document.cookie = `lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    // 3) Refresh server components so they re-render with the new language
    router.refresh();
  }, [currentLang, i18nHook, router]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
    >
      {currentLang === "ar" ? "EN" : "AR"}
    </Button>
  );
}
