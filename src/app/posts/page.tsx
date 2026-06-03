"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: { name: string | null };
}

interface PageData {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/posts?page=${pageNum}&limit=9`);
      const data: PageData = await res.json();
      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setHasMore(data.hasMore);
    } catch {
      setError("حدث خطأ في تحميل المقالات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => {
            const next = prev + 1;
            fetchPosts(next);
            return next;
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchPosts]);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        المقالات
        <span className="mr-2 text-lg font-normal text-gray-500">
          ({posts.length > 0 ? `${posts.length} مقال` : ""})
        </span>
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {posts.length === 0 && !loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          لا توجد مقالات منشورة بعد
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    بقلم {post.author.name || "مجهول"} |{" "}
                    {new Date(post.createdAt).toLocaleDateString("ar-SA")}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-gray-600 dark:text-gray-400">
                    {post.content}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      )}

      {hasMore && <div ref={loaderRef} className="h-10" />}
    </div>
  );
}
