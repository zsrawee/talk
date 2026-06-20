import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import {
  Amiri,
  Noto_Naskh_Arabic,
  Source_Serif_4,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "./providers";
import { auth } from "@/lib/auth";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-naskh",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as "ar" | "en") || "ar";

  return {
    title: lang === "ar" ? "منصتي | Talk" : "Talk | MyPlatform",
    description:
      lang === "ar"
        ? "منصة للمقالات والنقاشات — where ideas find their voice"
        : "A platform for articles and discussions — where ideas find their voice",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Read language from cookie so the initial HTML matches the client-side i18n
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as "ar" | "en") || "ar";
  const dir = lang === "ar" ? "rtl" : "ltr";

  let session = null;
  try {
    session = await auth();
  } catch (e) {
    console.error("Auth error in RootLayout:", e);
  }

  return (
    <html
      dir={dir}
      lang={lang}
      suppressHydrationWarning
      className={`${amiri.variable} ${notoNaskhArabic.variable} ${sourceSerif4.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: "(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t)}catch(e){}})();",
          }}
        />
      </head>
      <body className="min-h-screen font-body antialiased">
        <Providers session={session}>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
