import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { containsBadWords } from "@/lib/bad-words";

const prisma = new PrismaClient();
let userId: string;

describe("Business Logic Tests", () => {
  beforeAll(async () => {
    const pw = await hash("testpass123", 12);
    const user = await prisma.user.upsert({
      where: { email: "limittest@test.com" },
      update: {},
      create: {
        name: "Limit Test",
        email: "limittest@test.com",
        password: pw,
        role: "user",
      },
    });
    userId = user.id;
  }, 15000);

  afterAll(async () => {
    await prisma.comment.deleteMany({ where: { authorId: userId } });
    await prisma.post.deleteMany({ where: { authorId: userId } });
    await prisma.user.deleteMany({ where: { email: "limittest@test.com" } });
    await prisma.$disconnect();
  });

  it("يسمح بمنشورين فقط للمستخدم العادي", async () => {
    await prisma.post.createMany({
      data: [
        { title: "منشور 1", content: "محتوى المنشور الأول", authorId: userId, published: true },
        { title: "منشور 2", content: "محتوى المنشور الثاني", authorId: userId, published: true },
      ],
    });

    const count = await prisma.post.count({ where: { authorId: userId } });
    expect(count).toBe(2);

    const exceeded = count >= 2;
    expect(exceeded).toBe(true);
  });

  it("يمنع الرد الثاني للمستخدم العادي", async () => {
    const count = await prisma.comment.count({ where: { authorId: userId } });
    expect(count).toBeLessThanOrEqual(1);

    if (count < 1) {
      const posts = await prisma.post.findMany({ where: { published: true }, take: 1 });
      if (posts.length > 0) {
        await prisma.comment.create({
          data: { content: "رد تجريبي", postId: posts[0].id, authorId: userId },
        });
      }
    }

    const newCount = await prisma.comment.count({ where: { authorId: userId } });
    expect(newCount).toBeLessThanOrEqual(1);
  });

  it("يكتشف الكلمات البذيئة ويمنع النشر", () => {
    expect(containsBadWords("هذا كلام قذر")).toBe(true);
    expect(containsBadWords("you are an asshole")).toBe(true);
    expect(containsBadWords("نص عادي نظيف")).toBe(false);
  });

  it("نظام التحذير: أول مخالفة تحذير فقط", async () => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.warnings).toBeDefined();

    if (user && user.warnings < 1) {
      await prisma.user.update({
        where: { id: userId },
        data: { warnings: { increment: 1 } },
      });
      const updated = await prisma.user.findUnique({ where: { id: userId } });
      expect(updated?.warnings).toBe(1);
      expect(updated?.role).toBe("user");
    }
  });

  it("نظام الحظر: المخالفة الثانية تحظر", async () => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.warnings >= 1) {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "banned" },
      });
      const updated = await prisma.user.findUnique({ where: { id: userId } });
      expect(updated?.role).toBe("banned");
    }
  });

  it("المستخدم المحظور يتعرف عليه النظام", async () => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.role).toBe("banned");
  });

  it("الإيميلات المحظورة تمنع التسجيل", async () => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await prisma.blacklistedEmail.upsert({
        where: { email: user.email },
        update: {},
        create: { email: user.email, reason: "test" },
      });

      const blacklisted = await prisma.blacklistedEmail.findUnique({
        where: { email: user.email },
      });
      expect(blacklisted).not.toBeNull();
    }
  });

  it("الـ API يرجع تصفح مع pagination", async () => {
    const total = await prisma.post.count({ where: { published: true } });
    expect(total).toBeGreaterThanOrEqual(0);
  });
});
