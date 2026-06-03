import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminClient } from "./client";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const [users, stats, topPosts] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { posts: true, comments: true } },
      },
    }),
    Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.comment.count(),
      prisma.post.aggregate({ _sum: { views: true } }),
    ]),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { views: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        views: true,
        createdAt: true,
        author: { select: { name: true } },
      },
    }),
  ]);

  const [totalUsers, totalPosts, publishedPosts, totalComments, totalViews] = stats;

  return (
    <AdminClient
      users={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))}
      stats={{
        totalUsers,
        totalPosts,
        publishedPosts,
        totalComments,
        totalViews: totalViews._sum.views || 0,
      }}
      topPosts={topPosts.map((p) => ({
        id: p.id,
        title: p.title,
        views: p.views,
        authorName: p.author.name,
        createdAt: p.createdAt.toISOString(),
      }))}
    />
  );
}
