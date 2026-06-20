"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@prisma/client";
import type { LocalizedPost } from "@/lib/localize";
import { Loader2, Users, FileText, Trash2, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdminData {
  users: (User & { _count: { posts: number } })[];
  posts: LocalizedPost[];
  stats: {
    totalUsers: number;
    totalPosts: number;
    publishedPosts: number;
  };
}

export function AdminClient({ data }: { data: AdminData }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [deleting, setDeleting] = useState<string | null>(null);

  if (session?.user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <Shield className="mx-auto h-12 w-12 text-ember dark:text-ember-light" />
        <h1 className="mt-4 font-display text-2xl font-black text-moon-ink dark:text-moon-text">
          {t("unauthorized")}
        </h1>
        <p className="mt-2 text-sm text-dusk dark:text-dusk-light">
          {t("unauthorizedMsg")}
        </p>
      </div>
    );
  }

  async function deleteUser(userId: string) {
    if (!confirm(t("confirmDeleteUser"))) return;
    setDeleting(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  async function deletePost(postId: string) {
    if (!confirm(t("deletePostConfirm"))) return;
    setDeleting(postId);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      if (res.ok) router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <span className="horizon-rule mb-4 w-16" />
      <h1 className="font-display text-3xl font-black text-moon-ink dark:text-moon-text">
        {t("adminPanel")}
      </h1>
      <p className="mt-1 text-sm text-dusk dark:text-dusk-light">
        {t("dashboardTitle")}
      </p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <Users className="h-8 w-8 text-ember dark:text-ember-light" />
            <div>
              <p className="font-mono text-2xl font-bold text-moon-ink dark:text-moon-text">
                {data.stats.totalUsers}
              </p>
              <p className="text-xs text-dusk dark:text-dusk-light">{t("totalUsers")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <FileText className="h-8 w-8 text-ember dark:text-ember-light" />
            <div>
              <p className="font-mono text-2xl font-bold text-moon-ink dark:text-moon-text">
                {data.stats.totalPosts}
              </p>
              <p className="text-xs text-dusk dark:text-dusk-light">{t("totalPosts")}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <FileText className="h-8 w-8 text-starlight dark:text-starlight-light" />
            <div>
              <p className="font-mono text-2xl font-bold text-moon-ink dark:text-moon-text">
                {data.stats.publishedPosts}
              </p>
              <p className="text-xs text-dusk dark:text-dusk-light">{t("publishedPostsLabel")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users */}
      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-moon-ink dark:text-moon-text">
          {t("users")}
        </h2>
        <div className="mt-4 space-y-2">
          {data.users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between border border-starlight/20 bg-surface px-5 py-3 dark:bg-surface-dark"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-bold text-moon-ink dark:text-moon-text">
                    {user.name || t("unnamed")}
                  </span>
                  {user.role === "admin" && (
                    <span className="rounded-sm bg-ember/10 px-2 py-0.5 font-mono text-xs text-ember dark:text-ember-light">
                      {t("adminRole")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-dusk dark:text-dusk-light">{user.email}</p>
                <p className="text-xs text-dusk/60 dark:text-dusk-light/60">
                  {user._count.posts} {t("posts")} · {t("memberSince")} {new Date(user.createdAt).toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US")}
                </p>
              </div>
              {user.id !== session.user.id && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteUser(user.id)}
                  disabled={deleting === user.id}
                >
                  {deleting === user.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Posts */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-moon-ink dark:text-moon-text">
          {t("posts")}
        </h2>
        <div className="mt-4 space-y-2">
          {data.posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between border border-starlight/20 bg-surface px-5 py-3 dark:bg-surface-dark"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold text-moon-ink dark:text-moon-text">
                  {post.title}
                </p>
                <p className="text-xs text-dusk dark:text-dusk-light">
                  {new Date(post.createdAt).toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US")}
                  {" · "}
                  {post.published ? t("published") : t("draft")}
                  {post.availableLanguages.length > 1 && (
                    <span className="mr-2 text-[10px] text-dusk/40 dark:text-dusk-light/40">
                      [{post.availableLanguages.map((l) => l.toUpperCase()).join("/")}]
                    </span>
                  )}
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deletePost(post.id)}
                disabled={deleting === post.id}
              >
                {deleting === post.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
