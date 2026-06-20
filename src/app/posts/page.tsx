import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerTranslations } from "@/lib/server-i18n";

async function getPosts() {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true, image: true } },
      },
    });
  } catch {
    return [];
  }
}

export default async function PostsPage() {
  const posts = await getPosts();
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as "ar" | "en") || "ar";
  const { t } = await getServerTranslations(lang);

  return (
    <div className="mx-auto max-w-4xl">
      <span className="horizon-rule mb-4 w-20" />
      <h1 className="font-display text-4xl font-black tracking-tight text-moon-ink dark:text-moon-text">
        {t("posts")}
      </h1>
      <p className="mt-2 text-dusk dark:text-dusk-light">
        {t("latestPostsSubtitle")}
      </p>

      {posts.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-dusk dark:text-dusk-light">{t("noPosts")}</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block font-display text-sm font-bold text-ember underline-offset-4 hover:underline dark:text-ember-light"
          >
            {t("writeFirst")} →
          </Link>
        </div>
      )}

      <div className="mt-10 grid gap-5">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="group border border-starlight/20 bg-surface p-6 transition-all duration-300 hover:border-ember/40 dark:bg-surface-dark"
          >
            <h2 className="font-display text-xl font-bold text-moon-ink underline-offset-4 transition-colors group-hover:text-ember dark:text-moon-text dark:group-hover:text-ember-light">
              {post.title}
            </h2>
            {post.content && (
              <p className="mt-2 text-sm leading-relaxed text-dusk dark:text-dusk-light line-clamp-2">
                {post.content.slice(0, 200)}
              </p>
            )}
            <div className="mt-4 flex items-center gap-3 text-xs text-dusk/60 dark:text-dusk-light/60">
              <span>{post.author?.name || t("anonymous")}</span>
              <span className="text-dusk/30 dark:text-dusk-light/30 mx-1">·</span>
              <span>
                {new Date(post.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
