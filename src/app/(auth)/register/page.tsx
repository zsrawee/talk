"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("registrationError"));
        return;
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
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
          {t("register")}
        </h1>
        <p className="text-sm text-dusk dark:text-dusk-light">{t("registerSubtitle")}</p>
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
            id="name"
            name="name"
            type="text"
            label={t("name")}
            placeholder={t("name")}
            required
          />
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
            {loading ? t("registering") : t("register")}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-dusk dark:text-dusk-light">
          {t("haveAccount")}{" "}
          <Link
            href="/login"
            className="font-bold text-ember underline-offset-4 hover:underline dark:text-ember-light"
          >
            {t("login")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
