import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/hero-section";
import { getServerTranslations } from "@/lib/server-i18n";

export default async function Home() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as "ar" | "en") || "ar";
  const { t } = await getServerTranslations(lang);

  const features = [
    {
      number: "01",
      title: t("feature1Title"),
      desc: t("feature1Desc"),
    },
    {
      number: "02",
      title: t("feature2Title"),
      desc: t("feature2Desc"),
    },
    {
      number: "03",
      title: t("feature3Title"),
      desc: t("feature3Desc"),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero — The thesis statement */}
      <HeroSection />

      {/* Features — A sequence: write → connect → own */}
      <section className="grid gap-px bg-starlight/10 py-16 md:grid-cols-3">
        {features.map((feat) => (
          <div
            key={feat.number}
            className="flex flex-col bg-paper p-8 transition-colors hover:bg-surface dark:bg-night dark:hover:bg-night-surface"
          >
            <span className="font-mono text-xs font-bold tracking-wider text-dusk dark:text-dusk-light">
              {feat.number}
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-moon-ink dark:text-moon-text">
              {feat.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-dusk dark:text-dusk-light">
              {feat.desc}
            </p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <span className="horizon-rule mx-auto mb-8 w-16" />
        <h2 className="font-display text-3xl font-bold text-moon-ink dark:text-moon-text">
          {t("ctaTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-dusk dark:text-dusk-light">
          {t("ctaDesc")}
        </p>
        <Link href="/register">
          <Button variant="primary" size="lg" className="mt-6">
            {t("ctaButton")}
          </Button>
        </Link>
      </section>
    </div>
  );
}
