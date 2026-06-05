"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import { getFingerprint } from "@/lib/fingerprint";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaQ, setCaptchaQ] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [fingerprint, setFingerprint] = useState("");
  const [fingerprintReady, setFingerprintReady] = useState(false);

  useEffect(() => {
    getFingerprint().then((fp) => {
      setFingerprint(fp);
      setFingerprintReady(true);
    });
    loadCaptcha();
  }, []);

  async function loadCaptcha() {
    const res = await fetch("/api/captcha");
    const data = await res.json();
    setCaptchaQ(data.question);
    setCaptchaToken(data.token);
    setCaptchaAnswer("");
  }

  if (session?.user) {
    router.push("/dashboard");
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      captchaAnswer: parseInt(captchaAnswer),
      captchaToken,
      fingerprint,
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "حدث خطأ");
        setLoading(false);
        return;
      }

      router.push("/login");
      router.refresh();
    } catch {
      setError("حدث خطأ في الاتصال");
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إنشاء حساب</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="text-violet-600 hover:underline">
            تسجيل دخول
          </Link>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}
          <Input
            id="name"
            name="name"
            label="الاسم (20 حرف كحد أقصى)"
            placeholder="الاسم الكامل"
            maxLength={20}
            required
          />
          <Input
            id="email"
            name="email"
            type="email"
            label="البريد الإلكتروني"
            placeholder="example@mail.com"
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="كلمة المرور"
            placeholder="••••••••"
            required
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              حل المسألة: <span dir="ltr" className="font-bold text-violet-600">{captchaQ}</span> = ؟
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                placeholder="الإجابة"
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={loadCaptcha}
                className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 text-gray-500 hover:text-violet-600 dark:border-gray-600 dark:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading || !fingerprintReady}>
            {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
