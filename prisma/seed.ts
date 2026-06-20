import { hash } from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const password = await hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      password,
      role: "admin",
    },
  });

  // Delete existing posts & translations, then recreate
  await prisma.postTranslation.deleteMany();
  await prisma.post.deleteMany();

  const posts = await Promise.all([
    prisma.post.create({
      data: {
        published: true,
        authorId: user.id,
        translations: {
          create: [
            {
              language: "ar",
              title: "أهلاً بالعالم",
              content: "هذا أول مقال في الموقع. مرحباً بكم في منصتنا للمقالات والنقاشات.",
            },
            {
              language: "en",
              title: "Hello World",
              content: "This is the first post on the site. Welcome to our platform for articles and discussions.",
            },
          ],
        },
      },
    }),
    prisma.post.create({
      data: {
        published: true,
        authorId: user.id,
        translations: {
          create: [
            {
              language: "ar",
              title: "مقدمة في Next.js",
              content: "Next.js هو إطار عمل رائع لتطوير تطبيقات React. يوفر أداءً ممتازاً ودعماً للـ SSR والـ SSG.",
            },
            {
              language: "en",
              title: "Introduction to Next.js",
              content: "Next.js is a great framework for building React applications. It provides excellent performance with SSR and SSG support.",
            },
          ],
        },
      },
    }),
    prisma.post.create({
      data: {
        published: true,
        authorId: user.id,
        translations: {
          create: [
            {
              language: "ar",
              title: "كيف تبدأ مع TypeScript",
              content: "TypeScript هو لغة برمجة مبنية على JavaScript تضيف أنواعاً ثابتة. يساعدك على كتابة كود أكثر أماناً وقابلية للصيانة.",
            },
            {
              language: "en",
              title: "Getting Started with TypeScript",
              content: "TypeScript is a programming language built on JavaScript that adds static types. It helps you write safer and more maintainable code.",
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✓ Created ${posts.length} posts with Arabic and English translations`);
  console.log("✓ Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
