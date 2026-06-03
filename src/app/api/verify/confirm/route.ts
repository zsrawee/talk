import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "البريد والرمز مطلوبان" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }
    if (user.verified) {
      return NextResponse.json({ error: "الحساب مؤكد بالفعل" }, { status: 400 });
    }

    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!verificationCode) {
      return NextResponse.json({ error: "الرمز غير صحيح أو منتهي الصلاحية" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.verificationCode.update({
        where: { id: verificationCode.id },
        data: { used: true },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { verified: true },
      }),
    ]);

    return NextResponse.json({ message: "تم تأكيد البريد الإلكتروني بنجاح" });
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء تأكيد الرمز" }, { status: 500 });
  }
}
