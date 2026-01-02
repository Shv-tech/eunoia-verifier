import { PrismaClient } from "@prisma/client";

// Prevent "too many clients" error in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/* -------------------------------------------------------------------------- */

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
      userId: userId ?? "anonymous",
      content,
      score: result.score,
      result: result as any, // Store JSON
    },
  });
}

export async function getVerifications(userId?: string) {
  return prisma.verification.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

// ⬇️ FIXED: Added this function required by the Report Page
export async function getVerification(id: string) {
  return prisma.verification.findUnique({
    where: { id },
  });
}