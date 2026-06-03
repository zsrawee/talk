import { prisma } from "./prisma";

export async function banAndBlacklist(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) return;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { role: "banned" },
    }),
    prisma.blacklistedEmail.upsert({
      where: { email: user.email },
      update: {},
      create: { email: user.email, reason: "Auto-ban: inappropriate content" },
    }),
  ]);
}

export async function handleBadWords(userId: string): Promise<"warning" | "banned"> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { warnings: true, email: true },
  });

  if (!user) return "banned";

  if (user.warnings < 1) {
    await prisma.user.update({
      where: { id: userId },
      data: { warnings: { increment: 1 } },
    });
    return "warning";
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { role: "banned" },
    }),
    prisma.blacklistedEmail.upsert({
      where: { email: user.email },
      update: {},
      create: { email: user.email, reason: "Auto-ban: repeated inappropriate content" },
    }),
  ]);
  return "banned";
}
