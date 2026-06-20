import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany();
  console.log("Posts:", JSON.stringify(posts, null, 2));
  const ptCount = await prisma.postTranslation.count();
  console.log("Translation count:", ptCount);
}

main()
  .catch((e) => console.error("Error:", e.message))
  .finally(() => prisma.$disconnect());
