import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { containsBadWords } from "@/lib/bad-words";
import { handleBadWords } from "@/lib/ban-user";

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
  if (!session?.user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  if (session.user.role === "banned") {
    return NextResponse.json({ error: "حسابك محظور" }, { status: 403 });
  }

  try {
    const { content, parentId } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "المحتوى مطلوب" }, { status: 400 });
    }
    if (content.length > 100) {
      return NextResponse.json({ error: "التعليق يجب أن يكون 100 حرف على الأقل" }, { status: 400 });
    }

    if (containsBadWords(content)) {
      const result = await handleBadWords(session.user.id);
      if (result === "warning") {
        return NextResponse.json(
          { error: "⚠️ تحذير أول: كلمات غير لائقة. إذا تكرر سيتم حظر حسابك وإدراج بريدك في القائمة السوداء" },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: "تم حظر حسابك لاستخدام كلمات غير لائقة - تم إدراج بريدك في القائمة السوداء" },
        { status: 403 }
      );
    }

    if (session.user.role !== "admin") {
      const commentCount = await prisma.comment.count({
        where: { authorId: session.user.id },
      });
      if (commentCount >= 1) {
        return NextResponse.json(
          { error: "يمكنك الرد على منشور واحد فقط" },
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
          { error: "التعليق الأصلي غير موجود" },
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
            message: `@${session.user.name || "مستخدم"} رد على تعليقك في "${post?.title || "المقال"}"`,
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
          message: `@${session.user.name || "مستخدم"} علق على مقالك "${post.title}"`,
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
      { error: "حدث خطأ أثناء إرسال التعليق" },
      { status: 500 }
    );
  }
}
