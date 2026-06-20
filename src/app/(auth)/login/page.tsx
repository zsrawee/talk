"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("invalidCredentials"));
        return;
      }

      router.push("/dashboard");
    } catch {
      setError(t("unknownError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <span className="horizon-rule mb-2 w-12" />
        <h1 className="font-display text-2xl font-black text-moon-ink dark:text-moon-text">
          {t("login")}
        </h1>
        <p className="text-sm text-dusk dark:text-dusk-light">{t("loginSubtitle")}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-sm border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember dark:border-ember/50 dark:bg-ember/20 dark:text-ember-light">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <Input
            id="email"
            name="email"
            type="email"
            label={t("email")}
            placeholder="example@mail.com"
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label={t("password")}
            placeholder="••••••••"
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
            {loading ? t("loggingIn") : t("login")}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-dusk dark:text-dusk-light">
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className="font-bold text-ember underline-offset-4 hover:underline dark:text-ember-light"
          >
            {t("register")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
