"use client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) router.push("/posts");
  }

  return (
    <Button variant="danger" size="sm" onClick={handleDelete}>
      <Trash2 className="ml-1 h-4 w-4" /> حذف
    </Button>
  );
}
