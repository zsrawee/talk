"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="py-24 md:py-32">
      <span className="horizon-rule mb-10 w-24" />

      <h1 className="font-display text-4xl font-bold leading-tight text-moon-ink dark:text-moon-text md:text-6xl lg:text-7xl">
        لا خوارزميات. لا إعلانات.
        <span className="block mt-3 font-display text-3xl leading-tight text-ember dark:text-ember-light md:text-5xl lg:text-6xl">
          فقط كلمات تستحق القراءة.
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-dusk dark:text-dusk-light md:text-lg">
        Talk is a space for serious writing and real conversations.
        No algorithms decide what you see. No ads interrupt your reading.
        Just a community of writers and readers who care about words
        that matter.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/register">
          <Button variant="primary" size="lg">
            ابدأ الكتابة مجاناً
          </Button>
        </Link>
        <Link href="/posts">
          <Button variant="secondary" size="lg">
            تصفح المقالات
          </Button>
        </Link>
      </div>
    </section>
  );
}
