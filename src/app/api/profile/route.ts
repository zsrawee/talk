import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  await prisma.comment.deleteMany({ where: { authorId: session.user.id } });
  await prisma.post.deleteMany({ where: { authorId: session.user.id } });
  await prisma.notification.deleteMany({ where: { userId: session.user.id } });
  await prisma.user.delete({ where: { id: session.user.id } });

  return NextResponse.json({ ok: true });
}
