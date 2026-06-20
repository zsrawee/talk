import { cookies } from "next/headers";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { getServerTranslations } from "@/lib/server-i18n";

export default async function VerifyEmailPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as "ar" | "en") || "ar";
  const { t } = await getServerTranslations(lang);

  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <MailCheck className="mx-auto h-16 w-16 text-ember dark:text-ember-light" />
      <h1 className="mt-6 font-display text-3xl font-black text-moon-ink dark:text-moon-text">
        {t("verifyTitle")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-dusk dark:text-dusk-light">
        {t("verifyMessage")}
      </p>
      <p className="mt-6 text-xs text-dusk/60 dark:text-dusk-light/60">
        {t("verifyNotReceived")}{" "}
        <Link
          href="/"
          className="font-bold text-ember underline-offset-4 hover:underline dark:text-ember-light"
        >
          {t("verifyResend")}
        </Link>
      </p>
    </div>
  );
}
