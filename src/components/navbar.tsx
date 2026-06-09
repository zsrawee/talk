"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { NotificationBell } from "@/components/notification-bell";
import { useTranslation } from "@/lib/i18n";

export function Navbar() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const isAdmin = session?.user?.role === "admin";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-lg object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {t("siteName")}
            </span>
          </Link>
          <div className="hidden items-center gap-6 sm:flex">
            <Link
              href="/posts"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
            >
              {t("posts")}
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
            >
              {t("channel")}
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-medium text-purple-600 transition-colors hover:text-violet-700"
              >
                {t("admin")}
              </Link>
            )}
            <Link
              href="/terms"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400"
            >
              {t("terms")}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />

          {session?.user ? (
            <div className="flex items-center gap-3">
              <NotificationBell />
              <Link href="/dashboard">
                <Avatar>
                  <AvatarFallback>
                    {session.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                {t("logout")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">{t("register")}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
