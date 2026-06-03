import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { CommentSection } from "@/components/comment-section";
import { DeletePostButton } from "@/components/delete-post-button";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { name: true, image: true } } },
  });

  if (!post) notFound();

  const session = await auth();
  const canDelete =
    session?.user &&
    (session.user.id === post.authorId || session.user.role === "admin");

  return (
    <article className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/posts">
          <Button variant="outline" size="sm">
            &larr; العودة للمقالات
          </Button>
        </Link>
        {canDelete && <DeletePostButton postId={id} />}
      </div>

      <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
        {post.title}
      </h1>

      <p className="mb-8 text-sm text-gray-500">
        بقلم {post.author.name || "مجهول"} |{" "}
        {new Date(post.createdAt).toLocaleDateString("ar-SA")}
      </p>

      <div className="prose prose-lg max-w-none whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">
        {post.content}
      </div>

      <CommentSection postId={id} />
    </article>
  );
}
