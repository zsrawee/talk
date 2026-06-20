"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CreatePostPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"single" | "bilingual">("single");

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      const form = new FormData(e.currentTarget);

      if (mode === "bilingual") {
        // Bilingual mode: send both translations
        const titleAr = form.get("title_ar") as string;
        const contentAr = form.get("content_ar") as string;
        const titleEn = form.get("title_en") as string;
        const contentEn = form.get("content_en") as string;

        const translations: { language: string; title: string; content: string }[] = [];

        if (titleAr && contentAr) {
          translations.push({ language: "ar", title: titleAr, content: contentAr });
        }
        if (titleEn && contentEn) {
          translations.push({ language: "en", title: titleEn, content: contentEn });
        }

        if (translations.length === 0) {
          setError("Please provide at least one language translation.");
          setLoading(false);
          return;
        }

        try {
          const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              translations,
              published: form.get("published") === "on",
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            setError(data.error || t("registrationError"));
            return;
          }

          router.push("/dashboard");
          router.refresh();
        } catch {
          setError(t("unknownError"));
        } finally {
          setLoading(false);
        }
      } else {
        // Single language mode: send title + content + language
        const lang = (form.get("language") as string) || i18n.language || "ar";

        try {
          const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: form.get("title"),
              content: form.get("content"),
              language: lang,
              published: form.get("published") === "on",
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            setError(data.error || t("registrationError"));
            return;
          }

          router.push("/dashboard");
          router.refresh();
        } catch {
          setError(t("unknownError"));
        } finally {
          setLoading(false);
        }
      }
    },
    [mode, i18n.language, router, t]
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <span className="horizon-rule mb-2 w-16" />
        <h1 className="font-display text-3xl font-black text-moon-ink dark:text-moon-text">
          {t("createPost")}
        </h1>
        <p className="mt-1 text-sm text-dusk dark:text-dusk-light">
          {t("writePostSubtitle")}
        </p>
      </div>

      {/* Mode toggle */}
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("single")}
          className={`rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
            mode === "single"
              ? "bg-ember text-white"
              : "bg-surface text-dusk hover:bg-dusk/10 dark:bg-surface-dark dark:text-dusk-light"
          }`}
        >
          {i18n.language === "ar" ? "لغة واحدة" : "Single Language"}
        </button>
        <button
          type="button"
          onClick={() => setMode("bilingual")}
          className={`rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
            mode === "bilingual"
              ? "bg-ember text-white"
              : "bg-surface text-dusk hover:bg-dusk/10 dark:bg-surface-dark dark:text-dusk-light"
          }`}
        >
          {i18n.language === "ar" ? "ثنائي اللغة (AR + EN)" : "Bilingual (AR + EN)"}
        </button>
      </div>

      <Card>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-sm border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember dark:border-ember/50 dark:bg-ember/20 dark:text-ember-light">
                {error}
              </div>
            )}

            {mode === "single" ? (
              <>
                {/* SINGLE LANGUAGE MODE */}
                <div className="mb-4">
                  <label
                    htmlFor="language"
                    className="mb-1.5 block font-display text-sm font-bold text-moon-ink dark:text-moon-text"
                  >
                    {i18n.language === "ar" ? "اللغة" : "Language"}
                  </label>
                  <select
                    id="language"
                    name="language"
                    defaultValue={i18n.language || "ar"}
                    className="w-full rounded-sm border border-starlight/30 bg-surface px-4 py-2.5 text-sm text-moon-ink focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember dark:bg-surface-dark dark:text-moon-text"
                  >
                    <option value="ar">
                      {i18n.language === "ar" ? "العربية" : "Arabic"}
                    </option>
                    <option value="en">
                      {i18n.language === "ar" ? "الإنجليزية" : "English"}
                    </option>
                  </select>
                </div>
                <Input
                  id="title"
                  name="title"
                  label={t("title")}
                  placeholder={t("title")}
                  required
                />
                <div>
                  <label
                    htmlFor="content"
                    className="mb-1.5 block font-display text-sm font-bold text-moon-ink dark:text-moon-text"
                  >
                    {t("content")}
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={16}
                    className="w-full rounded-sm border border-starlight/30 bg-surface px-4 py-3 text-sm leading-relaxed text-moon-ink placeholder:text-dusk focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember dark:bg-surface-dark dark:text-moon-text dark:placeholder:text-dusk-light"
                    placeholder={t("content")}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                {/* BILINGUAL MODE */}
                {/* Arabic Section */}
                <div className="rounded-sm border border-starlight/20 bg-surface/50 p-4 dark:bg-surface-dark/50">
                  <h3 className="mb-3 font-display text-sm font-bold text-moon-ink dark:text-moon-text">
                    العربية
                  </h3>
                  <Input
                    id="title_ar"
                    name="title_ar"
                    label={i18n.language === "ar" ? "العنوان" : "Title (Arabic)"}
                    placeholder={i18n.language === "ar" ? "العنوان بالعربية" : "Title in Arabic"}
                  />
                  <div className="mt-4">
                    <label
                      htmlFor="content_ar"
                      className="mb-1.5 block font-display text-sm font-bold text-moon-ink dark:text-moon-text"
                    >
                      {i18n.language === "ar" ? "المحتوى" : "Content (Arabic)"}
                    </label>
                    <textarea
                      id="content_ar"
                      name="content_ar"
                      rows={8}
                      className="w-full rounded-sm border border-starlight/30 bg-surface px-4 py-3 text-sm leading-relaxed text-moon-ink placeholder:text-dusk focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember dark:bg-surface-dark dark:text-moon-text dark:placeholder:text-dusk-light"
                      placeholder={i18n.language === "ar" ? "المحتوى بالعربية" : "Content in Arabic"}
                    />
                  </div>
                </div>

                {/* English Section */}
                <div className="rounded-sm border border-starlight/20 bg-surface/50 p-4 dark:bg-surface-dark/50">
                  <h3 className="mb-3 font-display text-sm font-bold text-moon-ink dark:text-moon-text">
                    English
                  </h3>
                  <Input
                    id="title_en"
                    name="title_en"
                    label={i18n.language === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}
                    placeholder={i18n.language === "ar" ? "العنوان بالإنجليزية" : "Title in English"}
                  />
                  <div className="mt-4">
                    <label
                      htmlFor="content_en"
                      className="mb-1.5 block font-display text-sm font-bold text-moon-ink dark:text-moon-text"
                    >
                      {i18n.language === "ar" ? "المحتوى (إنجليزي)" : "Content (English)"}
                    </label>
                    <textarea
                      id="content_en"
                      name="content_en"
                      rows={8}
                      className="w-full rounded-sm border border-starlight/30 bg-surface px-4 py-3 text-sm leading-relaxed text-moon-ink placeholder:text-dusk focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember dark:bg-surface-dark dark:text-moon-text dark:placeholder:text-dusk-light"
                      placeholder={i18n.language === "ar" ? "المحتوى بالإنجليزية" : "Content in English"}
                    />
                  </div>
                </div>

                <p className="text-xs text-dusk/60 dark:text-dusk-light/60">
                  {i18n.language === "ar"
                    ? "يمكنك ملء حقل واحد أو كلا الحقلين. سيتم عرض المحتوى حسب لغة المستخدم."
                    : "You can fill one or both fields. Content will be displayed based on the user's language."}
                </p>
              </>
            )}

            {/* Published toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                name="published"
                defaultChecked
                className="h-4 w-4 rounded-sm border-starlight/30 text-ember focus:ring-ember"
              />
              <label
                htmlFor="published"
                className="text-sm text-moon-ink dark:text-moon-text"
              >
                {t("publish")}
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                {loading ? t("publishing") : t("submit")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
              >
                {t("cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
