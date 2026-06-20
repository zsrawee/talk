import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { containsBadWords } from "@/lib/bad-words";
import { handleBadWords } from "@/lib/ban-user";
import { getServerTranslations } from "@/lib/server-i18n";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = await prisma.comment.findMany({
    where: { postId: id },
    include: { author: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(comments);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as "ar" | "en") || "ar";
  const { t } = await getServerTranslations(lang);

  if (!session?.user) {
    return NextResponse.json({ error: t("unauthorized") }, { status: 401 });
  }
  if (session.user.role === "banned") {
    return NextResponse.json({ error: t("banned") }, { status: 403 });
  }

  try {
    const { content, parentId } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: t("writeComment") }, { status: 400 });
    }
    if (content.length > 100) {
      return NextResponse.json({ error: "التعليق يجب أن يكون 100 حرف على الأكثر" }, { status: 400 });
    }

    if (containsBadWords(content)) {
      const result = await handleBadWords(session.user.id);
      if (result === "warning") {
        return NextResponse.json(
          { error: t("banned") },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: t("bannedMsg") },
        { status: 403 }
      );
    }

    if (session.user.role !== "admin") {
      const commentCount = await prisma.comment.count({
        where: { authorId: session.user.id },
      });
      if (commentCount >= 1) {
        return NextResponse.json(
          { error: t("commentLimit") },
          { status: 403 }
        );
      }
    }

    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });
      if (!parentComment || parentComment.postId !== (await params).id) {
        return NextResponse.json(
          { error: t("postNotFound") },
          { status: 400 }
        );
      }
    }

    const { id } = await params;
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        authorId: session.user.id,
        parentId: parentId || null,
      },
      include: { author: { select: { name: true, image: true } } },
    });

    const post = await prisma.post.findUnique({ where: { id } });

    if (parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: parentId },
        include: { author: true },
      });
      if (parent && parent.authorId !== session.user.id) {
        await prisma.notification.create({
          data: {
            type: "REPLY_COMMENT",
            message: `@${session.user.name || t("anonymous")} ${t("comments")}`,
            userId: parent.authorId,
            actorId: session.user.id,
            postId: id,
            commentId: comment.id,
          },
        });
      }
    } else if (post && post.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: "REPLY_POST",
          message: `@${session.user.name || t("anonymous")} ${t("comments")}`,
          userId: post.authorId,
          actorId: session.user.id,
          postId: id,
          commentId: comment.id,
        },
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: t("unknownError") },
      { status: 500 }
    );
  }
}
