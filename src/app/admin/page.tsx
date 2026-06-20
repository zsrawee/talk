import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminClient } from "./client";
import { getServerTranslations } from "@/lib/server-i18n";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as "ar" | "en") || "ar";
  const { t } = await getServerTranslations(lang);
  return { title: t("adminPanel") };
}

export default async function AdminPage() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/login");
  }

  const [users, posts] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { posts: true } } },
    }),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const stats = {
    totalUsers: users.length,
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.published).length,
  };

  return <AdminClient data={{ users, posts, stats }} />;
}
