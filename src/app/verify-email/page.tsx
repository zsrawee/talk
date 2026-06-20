import { MailCheck } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <MailCheck className="mx-auto h-16 w-16 text-ember dark:text-ember-light" />
      <h1 className="mt-6 font-display text-3xl font-black text-moon-ink dark:text-moon-text">
        تحقق من بريدك الإلكتروني
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-dusk dark:text-dusk-light">
        تم إرسال رابط تأكيد إلى بريدك الإلكتروني. يرجى النقر على الرابط
        لتفعيل حسابك والمتابعة.
      </p>
      <p className="mt-6 text-xs text-dusk/60 dark:text-dusk-light/60">
        لم تستلم البريد؟{" "}
        <Link
          href="/"
          className="font-bold text-ember underline-offset-4 hover:underline dark:text-ember-light"
        >
          إعادة إرسال
        </Link>
      </p>
    </div>
  );
}
