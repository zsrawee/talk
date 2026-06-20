"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type PostData = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  availableLanguages: string[];
};

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<PostData | null>(null);

  // Fetch post data on mount
  useEffect(() => {
    if (!params.id) return;

    async function loadPost() {
      try {
        const res = await fetch(`/api/posts/${params.id}?lang=${i18n.language}`);
        if (!res.ok) {
          setError("Post not found");
          setFetching(false);
          return;
        }
        const data = await res.json();
        setPost(data);
      } catch {
        setError("Failed to load post");
      } finally {
        setFetching(false);
      }
    }

    loadPost();
  }, [params.id, i18n.language]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      const form = new FormData(e.currentTarget);
      const translations: { language: string; title: string; content: string }[] = [];

      const titleAr = form.get("title_ar") as string;
      const contentAr = form.get("content_ar") as string;
      const titleEn = form.get("title_en") as string;
      const contentEn = form.get("content_en") as string;

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
        const res = await fetch(`/api/posts/${params.id}/update`, {
          method: "PATCH",
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
    },
    [params.id, router, t]
  );

  if (fetching) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-ember" />
        <p className="mt-4 text-dusk dark:text-dusk-light">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <p className="text-dusk dark:text-dusk-light">{error || "Post not found"}</p>
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mt-4">
          ← Back to Dashboard
        </Button>
      </div>
    );
  }

  const hasAr = post.availableLanguages.includes("ar");
  const hasEn = post.availableLanguages.includes("en");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <span className="horizon-rule mb-2 w-16" />
        <h1 className="font-display text-3xl font-black text-moon-ink dark:text-moon-text">
          {t("edit")}
        </h1>
        <p className="mt-1 text-sm text-dusk dark:text-dusk-light">
          Update your post translations
        </p>
      </div>

      <Card>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-sm border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember dark:border-ember/50 dark:bg-ember/20 dark:text-ember-light">
                {error}
              </div>
            )}

            {/* Arabic Section */}
            <div className="rounded-sm border border-starlight/20 bg-surface/50 p-4 dark:bg-surface-dark/50">
              <h3 className="mb-3 font-display text-sm font-bold text-moon-ink dark:text-moon-text">
                العربية {hasAr ? "" : "(optional)"}
              </h3>
              <Input
                id="title_ar"
                name="title_ar"
                label={i18n.language === "ar" ? "العنوان" : "Title (Arabic)"}
                placeholder={i18n.language === "ar" ? "العنوان بالعربية" : "Title in Arabic"}
                defaultValue={hasAr ? post.title : ""}
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
                  defaultValue={hasAr ? post.content : ""}
                />
              </div>
            </div>

            {/* English Section */}
            <div className="rounded-sm border border-starlight/20 bg-surface/50 p-4 dark:bg-surface-dark/50">
              <h3 className="mb-3 font-display text-sm font-bold text-moon-ink dark:text-moon-text">
                English {hasEn ? "" : "(optional)"}
              </h3>
              <Input
                id="title_en"
                name="title_en"
                label={i18n.language === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}
                placeholder={i18n.language === "ar" ? "العنوان بالإنجليزية" : "Title in English"}
                defaultValue={hasEn ? (hasAr ? "" : post.title) : ""}
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
                  defaultValue={hasEn ? (hasAr ? "" : post.content) : ""}
                />
              </div>
            </div>

            <p className="text-xs text-dusk/60 dark:text-dusk-light/60">
              {i18n.language === "ar"
                ? "سيتم عرض المحتوى حسب لغة المستخدم. املأ كلا الحقلين لدعم ثنائي اللغة كامل."
                : "Content will be displayed based on the user's language. Fill both fields for full bilingual support."}
            </p>

            {/* Published toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                name="published"
                defaultChecked={post.published}
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
