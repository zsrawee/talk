import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardClient } from "./client";
import { getServerTranslations } from "@/lib/server-i18n";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as "ar" | "en") || "ar";
  const { t } = await getServerTranslations(lang);
  return { title: t("dashboard") };
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { posts: { orderBy: { createdAt: "desc" } } },
  });

  if (!user) {
    redirect("/login");
  }

  return <DashboardClient posts={user.posts} />;
}
