"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function CreatePostPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const title = form.get("title") as string;
    const excerpt = form.get("excerpt") as string;
    const content = form.get("content") as string;

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, excerpt, content }),
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

      <Card>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-sm border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember dark:border-ember/50 dark:bg-ember/20 dark:text-ember-light">
                {error}
              </div>
            )}
            <Input
              id="title"
              name="title"
              label={t("title")}
              placeholder={t("title")}
              required
            />
            <div>
              <label
                htmlFor="excerpt"
                className="mb-1.5 block font-display text-sm font-bold text-moon-ink dark:text-moon-text"
              >
                {t("excerpt")}
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                className="w-full rounded-sm border border-starlight/30 bg-surface px-4 py-2.5 text-sm text-moon-ink placeholder:text-dusk focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember dark:bg-surface-dark dark:text-moon-text dark:placeholder:text-dusk-light"
                placeholder={t("excerpt")}
              />
            </div>
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
