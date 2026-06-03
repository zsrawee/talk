"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Reply, Ban, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommentType {
  id: string;
  content: string;
  authorId: string;
  parentId: string | null;
  createdAt: string;
  author: { name: string | null; image: string | null };
  replies?: CommentType[];
}

export function CommentSection({ postId }: { postId: string }) {
  const { t, lang } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [banned, setBanned] = useState(false);

  async function deleteComment(commentId: string) {
    if (!confirm("هل أنت متأكد من حذف هذا التعليق؟")) return;
    const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setComments((prev) =>
        prev
          .filter((c) => c.id !== commentId)
          .map((c) => ({
            ...c,
            replies: (c.replies || []).filter((r) => r.id !== commentId),
          }))
      );
    }
  }

  useState(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const top = data.filter((c: CommentType) => !c.parentId);
        const replies = data.filter((c: CommentType) => c.parentId);
        const nested = top.map((c: CommentType) => ({
          ...c,
          replies: replies.filter((r: CommentType) => r.parentId === c.id),
        }));
        setComments(nested);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, parentId: replyTo }),
      });
      if (res.ok) {
        setText("");
        setReplyTo(null);
        const newComment = await res.json();
        if (!replyTo) {
          setComments((prev) => [
            { ...newComment, replies: [] },
            ...prev,
          ]);
        } else {
          setComments((prev) =>
            prev.map((c) =>
              c.id === replyTo
                ? { ...c, replies: [...(c.replies || []), newComment] }
                : c
            )
          );
        }
      } else {
        const data = await res.json();
        if (res.status === 403) {
          setBanned(true);
        }
        setError(data.error || "حدث خطأ");
      }
    } catch {}
    setSending(false);
  }

  if (banned) {
    return (
      <div className="mt-12 rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
        <Ban className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <h3 className="mb-2 text-xl font-bold text-red-700 dark:text-red-400">
          {t("banned")}
        </h3>
        <p className="mb-4 text-red-600 dark:text-red-300">
          {t("bannedMsg")}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard")}
        >
          {t("channel")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
        <MessageSquare className="h-5 w-5" /> {t("comments")} ({comments.length})
      </h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {session?.user ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-3">
          {replyTo && (
            <p className="text-sm text-violet-600">
              {t("replyTo")}:{" "}
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-gray-500 underline"
              >
                {t("back")}
              </button>
            </p>
          )}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("writeComment")}
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
          />
          <Button type="submit" disabled={sending || !text.trim()}>
            {sending ? t("publishing") : t("send")}
          </Button>
        </form>
      ) : (
        <p className="mb-8 text-sm text-gray-500">
          {t("login")} {t("addComment")}
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">{t("publishing")}...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">{t("noComments")}</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={setReplyTo}
              onDelete={deleteComment}
              sessionId={session?.user?.id}
              sessionRole={session?.user?.role}
              lang={lang}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  onReply,
  onDelete,
  sessionId,
  sessionRole,
  lang,
}: {
  comment: CommentType;
  onReply: (id: string) => void;
  onDelete: (id: string) => void;
  sessionId?: string;
  sessionRole?: string;
  lang: string;
}) {
  const { t } = useTranslation();
  const canDelete = sessionId && (sessionId === comment.authorId || sessionRole === "admin");

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarFallback>
            {comment.author.name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {comment.author.name || "مجهول"}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
              </span>
            </div>
            {canDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-red-500 hover:text-red-700"
                title="حذف"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            {comment.content}
          </p>
          {sessionId && (
            <button
              onClick={() => onReply(comment.id)}
              className="mt-2 flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700"
            >
              <Reply className="h-3 w-3" /> {t("reply")}
            </button>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3 border-r-2 border-gray-200 pr-4 dark:border-gray-600">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex items-start gap-2">
                  <Avatar>
                    <AvatarFallback>
                      {reply.author.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {reply.author.name || "مجهول"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                        </span>
                      </div>
                      {sessionId && (sessionId === reply.authorId || sessionRole === "admin") && (
                        <button
                          onClick={() => onDelete(reply.id)}
                          className="text-red-500 hover:text-red-700"
                          title="حذف"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
