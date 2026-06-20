"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeletePostButton } from "@/components/delete-post-button";
import { useTranslation } from "react-i18next";
import type { LocalizedPost } from "@/lib/localize";

export function DashboardClient({
  posts: initialPosts,
}: { posts: LocalizedPost[] }) {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="horizon-rule mb-2 w-16" />
          <h1 className="font-display text-3xl font-black text-moon-ink dark:text-moon-text">
            {t("dashboard")}
          </h1>
          <p className="mt-1 text-sm text-dusk dark:text-dusk-light">
            {session?.user?.name
              ? t("welcomeUser", { name: session.user.name })
              : t("guest")}
          </p>
        </div>
        <Link href="/dashboard/posts/create">
          <Button variant="primary" size="sm">
            {t("newPost")}
          </Button>
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-bold text-moon-ink dark:text-moon-text">
          {t("myPosts")}
        </h2>

        {initialPosts.length === 0 ? (
          <div className="mt-6 border border-starlight/20 bg-surface p-12 text-center dark:bg-surface-dark">
            <p className="text-dusk dark:text-dusk-light">{t("noPosts")}</p>
            <Link href="/dashboard/posts/create">
              <Button variant="primary" size="sm" className="mt-4">
                {t("writeFirstPost")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {initialPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between border border-starlight/20 bg-surface p-4 transition-all hover:border-ember/30 dark:bg-surface-dark"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/posts/${post.id}`}
                      className="font-display text-sm font-bold text-moon-ink underline-offset-4 hover:text-ember hover:underline dark:text-moon-text dark:hover:text-ember-light"
                    >
                      {post.title}
                    </Link>
                    <span
                      className={`rounded-sm px-2 py-0.5 font-mono text-xs ${
                        post.published
                          ? "bg-ember/10 text-ember dark:text-ember-light"
                          : "bg-dusk/10 text-dusk dark:text-dusk-light"
                      }`}
                    >
                      {post.published ? t("published") : t("draft")}
                    </span>
                    {post.availableLanguages.length > 1 && (
                      <span className="text-[10px] text-dusk/40 dark:text-dusk-light/40">
                        {post.availableLanguages.map((l) => l.toUpperCase()).join("/")}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-dusk dark:text-dusk-light">
                    {new Date(post.createdAt).toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US")}
                    {post.updatedAt > post.createdAt &&
                      ` · ${i18n.language === "ar" ? "آخر تعديل" : "last edit"} ${new Date(post.updatedAt).toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US")}`}
                  </p>
                </div>
                <div className="mr-4 flex items-center gap-2">
                  <Link href={`/dashboard/posts/edit/${post.id}`}>
                    <Button variant="ghost" size="sm">
                      {t("edit")}
                    </Button>
                  </Link>
                  <DeletePostButton postId={post.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
