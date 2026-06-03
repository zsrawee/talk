"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslation } from "@/lib/i18n";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenSquare, FileText, Ban, LogOut, Trash2, ShieldAlert, XCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardProps {
  user?: {
    name: string | null;
    email: string | null;
    image: string | null;
    role: string | null;
  } | null;
  stats?: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
  };
  posts?: Array<{
    id: string;
    title: string;
    createdAt: string;
    published: boolean;
  }>;
  banned?: boolean;
}

function BannedScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function handleDelete() {
    if (!confirm(t("bannedConfirm") || "هل أنت متأكد؟ سيتم حذف حسابك نهائياً")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      if (res.ok) {
        setDeleted(true);
      }
    } catch {}
    setDeleting(false);
  }

  if (deleted) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <Trash2 className="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          {t("accountDeleted") || "تم حذف الحساب"}
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {t("accountDeletedMsg") || "تم حذف حسابك بنجاح"}
        </p>
        <Button onClick={() => signOut({ callbackUrl: "/" })}>
          {t("logout")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <ShieldAlert className="mx-auto mb-4 h-20 w-20 text-red-500" />
      <h1 className="mb-2 text-3xl font-bold text-red-700 dark:text-red-400">
        {t("banned")}
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        {t("bannedMsg")}
      </p>
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="ml-2 h-4 w-4" />
          {t("logout")}
        </Button>
        <Button
          variant="danger"
          className="w-full"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="ml-2 h-4 w-4" />
          {deleting ? "..." : (t("deleteAccount") || "حذف الحساب")}
        </Button>
      </div>
    </div>
  );
}

export function DashboardClient({
  user,
  stats,
  posts,
  banned,
}: DashboardProps) {
  const { data: session } = useSession();
  const { t, lang } = useTranslation();
  const router = useRouter();

  const displayName = user?.name || session?.user?.name || t("welcome");

  return (
    <div>
      {banned && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-lg dark:bg-red-800">
            🚫
          </span>
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400">
              {t("banned")}
            </p>
            <p className="text-sm text-red-600 dark:text-red-300">
              {t("bannedMsg")}
            </p>
          </div>
        </div>
      )}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-xl font-bold text-violet-600 dark:bg-violet-900 dark:text-violet-300">
            {displayName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("welcome")}، {displayName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{user?.email?.split("@")[0] || "user"} |{" "}
              {t("channel")}
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/posts/create"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          <PenSquare className="h-4 w-4" />
          {t("createPost")}
        </Link>
      </div>

      {stats && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("totalPosts")}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalPosts}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("publishedPosts")}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {stats.publishedPosts}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("draftPosts")}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.draftPosts}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {posts && (
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <FileText className="h-5 w-5" /> {t("latestPosts")}
            </h2>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                {t("noPosts")}
              </p>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/posts/${post.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                      >
                        {post.title}
                      </Link>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          post.published
                            ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400"
                        }`}
                      >
                        {post.published ? t("published") : t("draft")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString(
                          lang === "ar" ? "ar-SA" : "en-US"
                        )}
                      </span>
                      <button
                        onClick={async () => {
                          if (!confirm("هل أنت متأكد؟")) return;
                          await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
                          router.refresh();
                        }}
                        className="text-red-500 hover:text-red-700"
                        title="حذف"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
