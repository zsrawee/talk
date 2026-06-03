"use client";
import { useTranslation } from "@/lib/i18n";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, Scale, Gavel } from "lucide-react";

export function TermsClient() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <Scale className="h-10 w-10 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("termsTitle")}
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Gavel className="h-5 w-5 text-blue-600" /> {t("rules")}
          </h2>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">1</span>
              {t("rule1")}
            </li>
            <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">2</span>
              {t("rule2")}
            </li>
            <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">3</span>
              {t("rule3")}
            </li>
            <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">4</span>
              {t("rule4")}
            </li>
            <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">5</span>
              {t("rule5")}
            </li>
            <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">6</span>
              {t("rule6")}
            </li>
            <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600 dark:bg-red-900 dark:text-red-300">7</span>
              {t("rule7")}
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <AlertTriangle className="h-5 w-5 text-red-500" /> {t("punishments")}
          </h2>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">1</span>
              {t("punish1")}
            </li>
            <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700 dark:bg-orange-900 dark:text-orange-300">2</span>
              {t("punish2")}
            </li>
            <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700 dark:bg-red-900 dark:text-red-300">3</span>
              {t("punish3")}
            </li>
            <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-200 text-xs font-bold text-red-800 dark:bg-red-950 dark:text-red-200">4</span>
              {t("punish4")}
            </li>
            <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-300 text-xs font-bold text-red-900 dark:bg-red-950 dark:text-red-200">5</span>
              {t("punish5")}
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Shield className="h-5 w-5 text-green-500" /> {t("notifications")}
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {t("bannedMsg")} {t("banned")} {t("ban")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
