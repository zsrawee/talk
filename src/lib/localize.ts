export type Lang = "ar" | "en";

export const VALID_LANGS: Lang[] = ["ar", "en"];

export function isValidLang(val: string | null | undefined): val is Lang {
  return val === "ar" || val === "en";
}

/**
 * Given a post with `translations` array, extract the title + content
 * for the requested language. Falls back to the first available translation.
 *
 * Returns a plain object with the localized fields plus metadata.
 */
export function localizePost(post: any, lang: Lang) {
  const translations = post.translations || [];
  const translation = translations.find((t: any) => t.language === lang);
  const fallback = translations[0];

  return {
    id: post.id,
    image: post.image,
    published: post.published,
    views: post.views,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    authorId: post.authorId,
    author: post.author || null,
    comments: post.comments ?? [],
    title: translation?.title ?? fallback?.title ?? "",
    content: translation?.content ?? fallback?.content ?? "",
    language: lang,
    availableLanguages: translations.map((t: any) => t.language) as Lang[],
  };
}

/**
 * Type for a localized post returned by `localizePost`.
 */
export type LocalizedPost = ReturnType<typeof localizePost>;
