import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function saveVerification({
  userId,
  content,
  result,
}: {
  userId?: string;
  content: string;
  result: any;
}) {
  return prisma.verification.create({
    data: {
      userId,
      content,
      score: result.score,
      result,
    },
  });
}

export async function getVerifications(userId?: string) {
  return prisma.verification.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "desc" },
  });
}
