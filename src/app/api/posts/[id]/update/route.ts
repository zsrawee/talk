import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { containsBadWords } from "@/lib/bad-words";
import { handleBadWords } from "@/lib/ban-user";

const updateSchema = z.object({
  published: z.boolean().optional(),
  image: z.string().nullable().optional(),
  translations: z
    .array(
      z.object({
        language: z.enum(["ar", "en"]),
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .optional(),
});

export async function PATCH(
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

  const { id } = await params;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });
  }
  if (post.authorId !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json(
      { error: "ليس لديك صلاحية لتعديل هذا المقال" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    // Check bad words in all translations
    if (data.translations) {
      for (const t of data.translations) {
        if (containsBadWords(t.title) || containsBadWords(t.content)) {
          const result = await handleBadWords(session.user.id);
          if (result === "warning") {
            return NextResponse.json(
              {
                error:
                  "⚠️ تحذير أول: كلمات غير لائقة. إذا تكرر سيتم حظر حسابك وإدراج بريدك في القائمة السوداء",
              },
              { status: 403 }
            );
          }
          return NextResponse.json(
            {
              error:
                "تم حظر حسابك لاستخدام كلمات غير لائقة - تم إدراج بريدك في القائمة السوداء",
            },
            { status: 403 }
          );
        }
      }
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        published: data.published,
        image: data.image,
      },
      include: { translations: true },
    });

    // Update translations if provided
    if (data.translations) {
      // Delete existing translations
      await prisma.postTranslation.deleteMany({ where: { postId: id } });

      // Create new translations
      await prisma.postTranslation.createMany({
        data: data.translations.map((t) => ({
          postId: id,
          language: t.language,
          title: t.title,
          content: t.content,
        })),
      });

      // Re-fetch with updated translations
      const refreshed = await prisma.post.findUnique({
        where: { id },
        include: { translations: true },
      });

      return NextResponse.json(refreshed);
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Post update error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث المقال" },
      { status: 500 }
    );
  }
}
