import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationCode } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }
    if (user.verified) {
      return NextResponse.json({ error: "الحساب مؤكد بالفعل" }, { status: 400 });
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationCode.create({
      data: { code, userId: user.id, expiresAt },
    });

    await sendVerificationCode(email, code);

    return NextResponse.json({ message: "تم إرسال الرمز إلى بريدك" });
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء إرسال الرمز" }, { status: 500 });
  }
}
