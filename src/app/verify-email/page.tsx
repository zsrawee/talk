"use client";

import { Suspense, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"email" | "code" | "done" | "error">(
    emailParam ? "code" : "email"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  async function handleSendCode() {
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStep("code");
      } else {
        const data = await res.json();
        setError(data.error || "حدث خطأ");
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    }
    setLoading(false);
  }

  async function handleConfirm() {
    const code = digits.join("");
    if (code.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (res.ok) {
        setStep("done");
      } else {
        const data = await res.json();
        setError(data.error || "الرمز غير صحيح");
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    }
    setLoading(false);
  }

  function handleDigitChange(index: number, value: string) {
    if (value && !/^\d$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  if (step === "done") {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          تم تأكيد بريدك الإلكتروني
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          يمكنك الآن تسجيل الدخول إلى حسابك
        </p>
        <Button onClick={() => router.push("/login")}>تسجيل دخول</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/50">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                تأكيد البريد الإلكتروني
              </h1>
              <p className="text-sm text-gray-500">
                {step === "email"
                  ? "أدخل بريدك الإلكتروني لاستلام رمز التحقق"
                  : `أدخل الرمز المرسل إلى ${email}`}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {step === "email" && (
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <Button
                className="w-full"
                onClick={handleSendCode}
                disabled={loading || !email.trim()}
              >
                {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
                إرسال رمز التحقق
              </Button>
            </div>
          )}

          {step === "code" && (
            <div className="space-y-6">
              <div className="flex justify-center gap-2" dir="ltr">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputsRef.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="h-14 w-12 rounded-xl border border-gray-200 bg-white text-center text-xl font-bold text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                ))}
              </div>
              <Button
                className="w-full"
                onClick={handleConfirm}
                disabled={loading || digits.join("").length !== 6}
              >
                {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
                تأكيد
              </Button>
              <button
                onClick={handleSendCode}
                className="w-full text-center text-sm text-violet-600 hover:text-violet-700"
              >
                إعادة إرسال الرمز
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-violet-600" /></div>}>
      <VerifyForm />
    </Suspense>
  );
}
