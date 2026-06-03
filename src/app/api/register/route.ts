import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { containsBadWords } from "@/lib/bad-words";
import { verifyCaptcha } from "@/lib/captcha";

const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون 2 أحرف على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  captchaAnswer: z.number(),
  captchaToken: z.string(),
  fingerprint: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, captchaAnswer, captchaToken, fingerprint } =
      registerSchema.parse(body);

    if (!verifyCaptcha(captchaAnswer, captchaToken)) {
      return NextResponse.json(
        { error: "إجابة الكابتشا غير صحيحة" },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (fingerprint) {
      const existingWithFingerprint = await prisma.user.findFirst({
        where: { fingerprint },
      });
      if (existingWithFingerprint) {
        return NextResponse.json(
          { error: "لا يمكنك التسجيل" },
          { status: 403 }
        );
      }
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 409 }
      );
    }

    const blacklisted = await prisma.blacklistedEmail.findUnique({
      where: { email },
    });
    if (blacklisted) {
      return NextResponse.json(
        { error: "لا يمكنك التسجيل" },
        { status: 403 }
      );
    }

    if (containsBadWords(name)) {
      return NextResponse.json(
        { error: "الاسم يحتوي على كلمات غير لائقة" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, fingerprint, registrationIp: ip, verified: true },
    });

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "حدث خطأ أثناء التسجيل" },
      { status: 500 }
    );
  }
}
