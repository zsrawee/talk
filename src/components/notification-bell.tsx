"use client";

import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Bell } from "lucide-react";

export function NotificationBell() {
  const { data: session } = useSession();
  const { t } = useTranslation();

  if (!session?.user) return null;

  return (
    <Link
      href="/notifications"
      className="relative text-dusk transition-colors hover:text-ember dark:text-dusk-light dark:hover:text-ember-light"
      aria-label={t("notificationBellLabel")}
    >
      <Bell className="h-5 w-5" />
    </Link>
  );
}
