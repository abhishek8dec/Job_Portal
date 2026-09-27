import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  walInitialized?: boolean;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Configure SQLite high-concurrency PRAGMAs for 1,000+ simultaneous users (WAL mode + 10s busy timeout)
if (!globalForPrisma.walInitialized) {
  globalForPrisma.walInitialized = true;
  Promise.all([
    prisma.$queryRawUnsafe("PRAGMA journal_mode = WAL;"),
    prisma.$queryRawUnsafe("PRAGMA busy_timeout = 10000;"),
    prisma.$queryRawUnsafe("PRAGMA synchronous = NORMAL;"),
    prisma.$queryRawUnsafe("PRAGMA cache_size = -64000;"),
  ]).catch(() => {});
}
