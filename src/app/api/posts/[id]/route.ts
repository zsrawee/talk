import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { localizePost, isValidLang, type Lang } from "@/lib/localize";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(req.url);
  const langParam = url.searchParams.get("lang");
  const lang: Lang = isValidLang(langParam) ? langParam : "ar";

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, image: true } },
      translations: true,
      comments: {
        include: {
          author: { select: { name: true, image: true } },
          replies: {
            include: {
              author: { select: { name: true, image: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });
  }

  // Increment view count
  await prisma.post.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  return NextResponse.json(localizePost(post, lang));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });
  }

  if (post.authorId !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json(
      { error: "ليس لديك صلاحية لحذف هذا المقال" },
      { status: 403 }
    );
  }

  // Cascade delete
  await prisma.postTranslation.deleteMany({ where: { postId: id } });
  await prisma.comment.deleteMany({ where: { postId: id } });
  await prisma.notification.deleteMany({ where: { postId: id } });
  await prisma.post.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
