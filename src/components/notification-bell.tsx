"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Bell, MessageSquare, Heart } from "lucide-react";

export function NotificationBell() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <Link
      href="/notifications"
      className="relative text-dusk transition-colors hover:text-ember dark:text-dusk-light dark:hover:text-ember-light"
      aria-label="الإشعارات"
    >
      <Bell className="h-5 w-5" />
    </Link>
  );
}
