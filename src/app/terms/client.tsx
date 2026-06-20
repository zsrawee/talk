"use client";

import { useTranslation } from "react-i18next";

export default function TermsContent() {
  const { t, i18n } = useTranslation();

  const sections = [
    {
      title: t("termsSection1Title"),
      text: t("termsSection1Text"),
    },
    {
      title: t("termsSection2Title"),
      text: t("termsSection2Text"),
    },
    {
      title: t("termsSection3Title"),
      text: t("termsSection3Text"),
    },
    {
      title: t("termsSection4Title"),
      text: t("termsSection4Text"),
    },
    {
      title: t("termsSection5Title"),
      text: t("termsSection5Text"),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl py-8">
      <span className="horizon-rule mb-4 w-20" />
      <h1 className="font-display text-4xl font-black text-moon-ink dark:text-moon-text">
        {t("termsTitle")}
      </h1>
      <p className="mt-2 text-sm text-dusk dark:text-dusk-light">
        {t("lastUpdated")}: {new Date().toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US")}
      </p>

      <div className="mt-10 space-y-6">
        {sections.map((section, index) => (
          <section key={index}>
            <h2 className="font-display text-xl font-bold text-moon-ink dark:text-moon-text">
              {section.title}
            </h2>
            <p className="mt-2 leading-relaxed text-dusk dark:text-dusk-light">
              {section.text}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
