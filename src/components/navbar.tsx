"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { NotificationBell } from "@/components/notification-bell";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-starlight/20 bg-paper/90 backdrop-blur-lg dark:bg-night/90 dark:border-starlight-light/20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-moon-ink dark:text-moon-text"
        >
          <span className="text-ember dark:text-ember-light">✦</span>
          منصتي
          <span className="hidden text-sm font-medium text-dusk dark:text-dusk-light sm:inline">
            Talk
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/posts"
            className="font-display text-sm font-bold text-dusk transition-colors hover:text-ember dark:text-dusk-light dark:hover:text-ember-light"
          >
            {t("posts")}
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-4">
              <NotificationBell />
              <Link
                href="/dashboard"
                className="font-display text-sm font-bold text-dusk transition-colors hover:text-ember dark:text-dusk-light dark:hover:text-ember-light"
              >
                {t("dashboard")}
              </Link>
              <div className="flex items-center gap-3 pr-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image} />
                  <AvatarFallback>
                    {session.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                  >
                    {t("signOut")}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {t("signIn")}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  {t("getStarted")}
                </Button>
              </Link>
            </div>
          )}

          <div className="mr-4 flex items-center gap-1 border-r border-starlight/20 pr-4 dark:border-starlight-light/20">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 text-moon-ink dark:text-moon-text md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-starlight/20 bg-paper dark:border-starlight-light/20 dark:bg-night md:hidden">
          <div className="space-y-2 px-4 py-4">
            <Link
              href="/posts"
              className="block font-display text-sm font-bold text-dusk hover:text-ember dark:text-dusk-light dark:hover:text-ember-light"
              onClick={() => setMobileOpen(false)}
            >
              {t("posts")}
            </Link>

            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block font-display text-sm font-bold text-dusk hover:text-ember dark:text-dusk-light dark:hover:text-ember-light"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("dashboard")}
                </Link>
                <div className="flex items-center gap-2 pt-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={session.user.image} />
                    <AvatarFallback>
                      {session.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-display text-sm text-moon-ink dark:text-moon-text">
                    {session.user.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="mt-2 w-full"
                >
                  {t("signOut")}
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    {t("signIn")}
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    {t("getStarted")}
                  </Button>
                </Link>
              </div>
            )}

            <div className="flex items-center gap-2 pt-4">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
