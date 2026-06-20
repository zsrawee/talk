import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/hero-section";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero — The thesis statement */}
      <HeroSection />

      {/* Features — A sequence: write → connect → own */}
      <section className="grid gap-px bg-starlight/10 py-16 md:grid-cols-3">
        {[
          {
            number: "01",
            title: "اكتب بلا تشتيت",
            desc: "محرر نظيف يضع كلماتك في المركز. لا خوارزميات، لا إعلانات، لا إشعارات. أنت وكلماتك فقط.",
          },
          {
            number: "02",
            title: "تواصل مع قراء حقيقيين",
            desc: "كل مقال يبدأ محادثة. تعليقات مدروسة من أشخاص يقرؤون ما تكتب لأنهم يريدون، لا لأن خوارزمية قالت لهم.",
          },
          {
            number: "03",
            title: "امتلك مساحتك",
            desc: "موقعك الخاص بمحتواك. أنت من تتحكم — في الوصول، في المظهر، في من يقرأ. لا خوارزميات تقرر نيابة عنك.",
          },
        ].map((feat, i) => (
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
          اكتب اليوم.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-dusk dark:text-dusk-light">
          Talk هو المكان الذي تلتقي فيه الكلمات الجادة بقرّاء حقيقيين.
          لا خوارزميات. لا ضجيج. فقط أنت وصفحتك البيضاء.
        </p>
        <Link href="/register">
          <Button variant="primary" size="lg" className="mt-6">
            إنشاء حساب مجاني
          </Button>
        </Link>
      </section>
    </div>
  );
}
