# دليل الإعداد والتشغيل

## المتطلبات
- Node.js 18+ أو 20+
- npm أو yarn

## 1. إصلاح مشكلة SSL (إذا ظهرت)

إذا واجهت خطأ `ERR_SSL_CIPHER_OPERATION_FAILED` عند تشغيل `npm install`:

### الطريقة الأولى: استخدام OpenSSL Legacy Provider
```powershell
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm install --legacy-peer-deps
```

### الطريقة الثانية: استخدام yarn
```powershell
yarn install --network-timeout 120000
```

### الطريقة الثالثة: إعادة تثبيت Node.js
1. اذهب إلى https://nodejs.org/ وحمل أحدث إصدار
2. أو استخدم nvm لتثبيت إصدار أحدث

## 2. تثبيت الحزم
```powershell
npm install --legacy-peer-deps
```

## 3. إعداد قاعدة البيانات

### للتطوير المحلي (SQLite - افتراضي):
**لا تحتاج أي إعداد.** SQLite قاعدة بيانات محلية تعمل فوراً بدون تشغيل سيرفر.

### للإنتاج (MongoDB Atlas):
1. أنشئ حساب مجاني على https://mongodb.com
2. أنشئ Cluster
3. احصل على رابط الاتصال
4. غيّر `DATABASE_URL` في ملف `.env` من:
   ```
   DATABASE_URL="file:./dev.db"
   ```
   إلى:
   ```
   DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/professional-site?retryWrites=true&w=majority"
   ```
5. حدّث `provider` في `prisma/schema.prisma` من `sqlite` إلى `mongodb`
6. أضف `@db.ObjectId` للحقول `id` و `authorId` في `schema.prisma`

## 4. إعداد متغيرات البيئة
انسخ ملف `.env` إلى `.env.local` وعدّل القيم:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="<أي نص عشوائي طويل>"
NEXTAUTH_URL="http://localhost:3000"
UPLOADTHING_SECRET="<من لوحة تحكم UploadThing>"
UPLOADTHING_APP_ID="<من لوحة تحكم UploadThing>"
```

## 5. إنشاء جداول قاعدة البيانات
```powershell
npx prisma db push
```

## 6. إضافة بيانات تجريبية (اختياري)
```powershell
npx tsx prisma/seed.ts
```

## 7. تشغيل المشروع
```powershell
npm run dev
```

## المكتبات المستخدمة

| المكتبة | الاستخدام |
|---------|-----------|
| **Next.js 16** | الإطار الرئيسي (App Router) |
| **Prisma** | ORM لقاعدة البيانات (SQLite للتطوير، MongoDB للإنتاج) |
| **Auth.js (NextAuth v5)** | المصادقة وإدارة الجلسات |
| **Tailwind CSS v4** | تصميم الواجهات |
| **Zod** | التحقق من صحة البيانات |
| **TanStack Query** | جلب البيانات من جهة العميل |
| **UploadThing** | رفع الملفات والصور |
| **bcryptjs** | تشفير كلمات المرور |
| **lucide-react** | أيقونات |
| **clsx + tailwind-merge** | إدارة كلاسات CSS |

## هيكل المشروع

```
professional-site/
├── prisma/
│   ├── schema.prisma    # نموذج قاعدة البيانات
│   └── seed.ts          # بيانات تجريبية
├── src/
│   ├── app/
│   │   ├── layout.tsx   # التخطيط الرئيسي
│   │   ├── page.tsx     # الصفحة الرئيسية
│   │   ├── globals.css  # الأنماط العامة
│   │   ├── providers.tsx # مزودي الخدمة
│   │   ├── (auth)/      # صفحات المصادقة
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/   # لوحة التحكم
│   │   ├── posts/       # عرض المقالات
│   │   └── api/         # API Routes
│   ├── components/
│   │   └── ui/          # مكونات واجهة المستخدم
│   ├── lib/
│   │   ├── auth.ts      # إعدادات Auth.js
│   │   ├── prisma.ts    # اتصال Prisma
│   │   ├── uploadthing.ts # إعدادات UploadThing
│   │   └── utils.ts     # دوال مساعدة
│   └── middleware.ts    # حماية المسارات
├── .env                 # متغيرات البيئة
├── package.json
└── next.config.ts
```
