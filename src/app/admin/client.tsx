"use client";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Shield, Ban, CheckCircle, Users, FileText,
  MessageSquare, Eye, TrendingUp, BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserType {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count: { posts: number; comments: number };
}

interface TopPost {
  id: string;
  title: string;
  views: number;
  authorName: string | null;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalPosts: number;
  publishedPosts: number;
  totalComments: number;
  totalViews: number;
}

export function AdminClient({
  users,
  stats,
  topPosts,
}: {
  users: UserType[];
  stats: Stats;
  topPosts: TopPost[];
}) {
  const { t, lang } = useTranslation();
  const router = useRouter();

  async function handleAction(userId: string, action: "ban" | "unban") {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    router.refresh();
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Shield className="h-8 w-8 text-violet-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("adminPanel")}
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/50">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">إجمالي المستخدمين</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.totalUsers}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/50">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">جميع المقالات</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.totalPosts}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/50">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">منشورة</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.publishedPosts}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/50">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">التعليقات</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.totalComments}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/50">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">المشاهدات</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.totalViews.toLocaleString("ar-SA")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts */}
      {topPosts.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <BarChart3 className="h-5 w-5 text-violet-600" /> أكثر المنشورات مشاهدة
            </h2>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {topPosts.map((post, i) => (
                <div key={post.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                      {i + 1}
                    </span>
                    <div>
                      <Link
                        href={`/posts/${post.id}`}
                        className="font-medium text-gray-900 hover:text-violet-600 dark:text-white dark:hover:text-violet-400"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {post.authorName || "مجهول"} |{" "}
                        {new Date(post.createdAt).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Eye className="h-4 w-4" />
                    {post.views.toLocaleString("ar-SA")}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                {t("profile")}
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                البريد
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-900 dark:text-white">
                الحالة
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-900 dark:text-white">
                المقالات
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-900 dark:text-white">
                التعليقات
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-900 dark:text-white">
                إجراء
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {user.name || "—"}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "banned"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {user.role === "admin"
                      ? "أدمن"
                      : user.role === "banned"
                        ? "محظور"
                        : "نشط"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">
                  {user._count.posts}
                </td>
                <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">
                  {user._count.comments}
                </td>
                <td className="px-4 py-3 text-center">
                  {user.role !== "admin" && (
                    <Button
                      variant={user.role === "banned" ? "outline" : "danger"}
                      size="sm"
                      onClick={() =>
                        handleAction(
                          user.id,
                          user.role === "banned" ? "unban" : "ban"
                        )
                      }
                    >
                      {user.role === "banned" ? (
                        <><CheckCircle className="ml-1 h-3 w-3" /> {t("unban")}</>
                      ) : (
                        <><Ban className="ml-1 h-3 w-3" /> {t("ban")}</>
                      )}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
