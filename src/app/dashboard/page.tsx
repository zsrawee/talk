import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardClient } from "./client";
import { getServerTranslations } from "@/lib/server-i18n";
import { localizePost, isValidLang, type Lang } from "@/lib/localize";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const langParam = cookieStore.get("lang")?.value;
  const lang: Lang = isValidLang(langParam) ? langParam : "ar";
  const { t } = await getServerTranslations(lang);
  return { title: t("dashboard") };
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const langParam = cookieStore.get("lang")?.value;
  const lang: Lang = isValidLang(langParam) ? langParam : "ar";

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      posts: {
        include: { translations: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Localize posts for the dashboard display
  const localizedPosts = user.posts.map((post) => localizePost(post, lang));

  return <DashboardClient posts={localizedPosts} />;
}
