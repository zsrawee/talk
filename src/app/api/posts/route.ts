import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { containsBadWords } from "@/lib/bad-words";
import { handleBadWords } from "@/lib/ban-user";

const postSchema = z.object({
  title: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل").max(20, "العنوان يجب أن يكون 20 حرف على الأكثر"),
  content: z.string().min(10, "المحتوى يجب أن يكون 10 أحرف على الأقل"),
  published: z.boolean().default(false),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "9")));
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: { author: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({ where: { published: true } }),
  ]);

  return NextResponse.json({
    posts,
    total,
    page,
    limit,
    hasMore: skip + limit < total,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  if (session.user.role === "banned") {
    return NextResponse.json({ error: "حسابك محظور" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, content, published } = postSchema.parse(body);

    if (session.user.role !== "admin") {
      const postCount = await prisma.post.count({
        where: { authorId: session.user.id },
      });
      if (postCount >= 2) {
        return NextResponse.json(
          { error: "لقد وصلت للحد الأقصى (منشوران فقط)" },
          { status: 403 }
        );
      }
    }

    if (containsBadWords(title) || containsBadWords(content)) {
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

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء المقال" },
      { status: 500 }
    );
  }
}
