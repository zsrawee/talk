"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function DeletePostButton({ postId }: { postId: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(t("deletePostConfirm"))) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={handleDelete}
      disabled={deleting}
    >
      {deleting ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Trash2 className="h-3 w-3" />
      )}
    </Button>
  );
}
