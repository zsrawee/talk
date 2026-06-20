import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/comment-section";
import { getServerTranslations } from "@/lib/server-i18n";
import { localizePost, isValidLang, type Lang } from "@/lib/localize";

async function getPost(id: string, lang: Lang) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, image: true } },
        translations: true,
      },
    });
    if (!post) return null;
    return localizePost(post, lang);
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
  const cookieStore = await cookies();
  const langParam = cookieStore.get("lang")?.value;
  const lang: Lang = isValidLang(langParam) ? langParam : "ar";
  const { t } = await getServerTranslations(lang);
  const post = await getPost(id, lang);

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
  const cookieStore = await cookies();
  const langParam = cookieStore.get("lang")?.value;
  const lang: Lang = isValidLang(langParam) ? langParam : "ar";
  const { t } = await getServerTranslations(lang);

  const post = await getPost(id, lang);

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
        {post.availableLanguages.length > 1 && (
          <>
            <span className="text-dusk/30 dark:text-dusk-light/30">·</span>
            <span className="text-xs text-dusk/50 dark:text-dusk-light/50">
              📖 {post.availableLanguages.map((l: string) => l.toUpperCase()).join(" / ")}
            </span>
          </>
        )}
      </div>

      {/* Content */}
      <div className="mt-10">
        {post.content ? (
          <div className="prose prose-starlight max-w-none text-moon-ink dark:text-moon-text">
            {post.content.split("\n").map((paragraph: string, i: number) => (
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
