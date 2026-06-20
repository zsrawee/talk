"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
}

export function CommentSection({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load comments on mount
  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch(() => {})
      .finally(() => setLoadingComments(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        setError(t("unknownError"));
        return;
      }

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setContent("");
    } catch {
      setError(t("unknownError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="font-display text-lg font-bold text-moon-ink dark:text-moon-text">
        {t("comments")} ({comments.length})
      </h3>

      {/* Comment form */}
      {session?.user ? (
        <form onSubmit={handleSubmit} className="mt-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full rounded-sm border border-starlight/30 bg-surface px-4 py-3 text-sm text-moon-ink placeholder:text-dusk focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember dark:bg-surface-dark dark:text-moon-text dark:placeholder:text-dusk-light"
            placeholder={t("commentPlaceholder")}
            required
          />
          {error && (
            <p className="mt-2 text-xs text-ember dark:text-ember-light">{error}</p>
          )}
          <div className="mt-3 flex justify-start">
            <Button type="submit" disabled={loading || !content.trim()}>
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              {loading ? t("sending") : t("postComment")}
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm text-dusk dark:text-dusk-light">
          سجل الدخول لتتمكن من إضافة تعليق.
        </p>
      )}

      {/* Comments list */}
      <div className="mt-8 space-y-4">
        {loadingComments ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-ember dark:text-ember-light" />
          </div>
        ) : comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-dusk dark:text-dusk-light">
            {t("noComments")}
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-starlight/10 bg-surface/50 px-4 py-3 dark:bg-surface-dark/50"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={comment.author.image} />
                  <AvatarFallback className="text-xs">
                    {comment.author.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-display text-xs font-bold text-moon-ink dark:text-moon-text">
                    {comment.author.name || t("anonymous")}
                  </p>
                  <p className="text-xs text-dusk/60 dark:text-dusk-light/60">
                    {new Date(comment.createdAt).toLocaleDateString(i18n.language === "ar" ? "ar-SA" : "en-US")}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-dusk dark:text-dusk-light">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
