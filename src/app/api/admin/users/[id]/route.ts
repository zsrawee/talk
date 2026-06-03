import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await params;
  const { action } = await _req.json();

  if (action === "ban") {
    await prisma.user.update({
      where: { id },
      data: { role: "banned" },
    });
  } else if (action === "unban") {
    await prisma.user.update({
      where: { id },
      data: { role: "user" },
    });
  }

  return NextResponse.json({ ok: true });
}
