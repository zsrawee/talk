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

  await prisma.post.createMany({
    data: [
      {
        title: "أهلاً بالعالم",
        content: "هذا أول مقال في الموقع.",
        published: true,
        authorId: user.id,
      },
      {
        title: "مقدمة في Next.js",
        content: "Next.js هو إطار عمل رائع لتطوير تطبيقات React.",
        published: true,
        authorId: user.id,
      },
    ],
  });

  console.log("✓ تم seeding البيانات بنجاح");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
