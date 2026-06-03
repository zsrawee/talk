import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DashboardClient } from "./client";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (session.user.role === "banned") {
    return <DashboardClient banned />;
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, image: true, role: true },
  });

  const [totalPosts, publishedPosts, latestPosts] = await Promise.all([
    prisma.post.count({ where: { authorId: userId } }),
    prisma.post.count({ where: { authorId: userId, published: true } }),
    prisma.post.findMany({
      where: { authorId: userId },
      select: { id: true, title: true, createdAt: true, published: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const draftPosts = totalPosts - publishedPosts;

  return (
    <DashboardClient
      user={{
        name: user?.name ?? null,
        email: user?.email ?? null,
        image: user?.image ?? null,
        role: user?.role ?? null,
      }}
      stats={{ totalPosts, publishedPosts, draftPosts }}
      posts={latestPosts.map((p) => ({
        id: p.id,
        title: p.title,
        createdAt: p.createdAt.toISOString(),
        published: p.published,
      }))}
    />
  );
}
