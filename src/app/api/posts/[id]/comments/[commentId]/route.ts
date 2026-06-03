import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const { id, commentId } = await params;

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!comment || comment.postId !== id) {
    return NextResponse.json({ error: "التعليق غير موجود" }, { status: 404 });
  }

  if (comment.authorId !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json(
      { error: "ليس لديك صلاحية لحذف هذا التعليق" },
      { status: 403 }
    );
  }

  await prisma.comment.delete({ where: { id: commentId } });

  return NextResponse.json({ ok: true });
}
