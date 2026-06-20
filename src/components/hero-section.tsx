"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 md:py-32">
      <span className="horizon-rule mb-10 w-24" />

      <h1 className="font-display text-4xl font-bold leading-tight text-moon-ink dark:text-moon-text md:text-6xl lg:text-7xl">
        {t("heroHeadline1")}
        <span className="block mt-3 font-display text-3xl leading-tight text-ember dark:text-ember-light md:text-5xl lg:text-6xl">
          {t("heroHeadline2")}
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-dusk dark:text-dusk-light md:text-lg">
        {t("heroDescription")}
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/register">
          <Button variant="primary" size="lg">
            {t("heroStartWriting")}
          </Button>
        </Link>
        <Link href="/posts">
          <Button variant="secondary" size="lg">
            {t("heroBrowsePosts")}
          </Button>
        </Link>
      </div>
    </section>
  );
}
