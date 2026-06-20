import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/comment-section";
import { getTranslations } from "@/lib/i18n";

async function getPost(id: string) {
  try {
    return await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { name: true, image: true } },
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as "ar" | "en") || "ar";
  const { t } = getTranslations(lang);

  if (!post) return { title: t("postNotFound") };

  return {
    title: post.title,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as "ar" | "en") || "ar";
  const { t } = getTranslations(lang);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl">
      {/* Header */}
      <span className="horizon-rule mb-6 w-32" />
      <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-moon-ink dark:text-moon-text md:text-5xl">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-dusk dark:text-dusk-light">
        <span>{post.author?.name || t("anonymous")}</span>
        <span className="text-dusk/30 dark:text-dusk-light/30">·</span>
        <time dateTime={post.createdAt.toISOString()}>
          {new Date(post.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {post.updatedAt > post.createdAt && (
          <>
            <span className="text-dusk/30 dark:text-dusk-light/30">·</span>
            <span>{t("lastUpdated")}</span>
          </>
        )}
      </div>

      {/* Content */}
      <div className="mt-10">
        {post.content ? (
          <div className="prose prose-starlight max-w-none text-moon-ink dark:text-moon-text">
            {post.content.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-dusk dark:text-dusk-light">{t("noContentYet")}</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 border-t border-starlight/20 pt-6 dark:border-starlight-light/20">
        <Link
          href="/posts"
          className="font-display text-sm font-bold text-ember underline-offset-4 hover:underline dark:text-ember-light"
        >
          {t("backToPosts")}
        </Link>
      </div>

      {/* Comments */}
      {post.id && (
        <div className="mt-12 border-t border-starlight/20 pt-8 dark:border-starlight-light/20">
          <CommentSection postId={post.id} />
        </div>
      )}
    </article>
  );
}
