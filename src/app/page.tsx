import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
        <span className="h-2 w-2 rounded-full bg-violet-500" />
        منصة عربية متكاملة
      </div>
      <h1 className="mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
        مرحباً بك في موقعي الاحترافي
      </h1>
      <p className="mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
        منصة متكاملة مبنية بأحدث التقنيات: Next.js، SQLite، Prisma،
        والمزيد. سجل الآن لتتمكن من إنشاء وإدارة المقالات.
      </p>
      <div className="flex gap-4">
        <Link href="/register">
          <Button size="lg">ابدأ الآن</Button>
        </Link>
        <Link href="/posts">
          <Button variant="outline" size="lg">
            تصفح المقالات
          </Button>
        </Link>
      </div>
    </div>
  );
}
