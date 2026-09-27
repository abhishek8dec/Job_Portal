const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function optimizeDatabase() {
  console.log("Applying SQLite high-concurrency PRAGMAs...");
  try {
    const journalResult = await prisma.$queryRawUnsafe("PRAGMA journal_mode = WAL;");
    console.log("Journal Mode:", journalResult);

    await prisma.$queryRawUnsafe("PRAGMA busy_timeout = 10000;");
    console.log("Busy Timeout: 10000ms set (prevents SQLITE_BUSY under heavy load)");

    await prisma.$queryRawUnsafe("PRAGMA synchronous = NORMAL;");
    console.log("Synchronous: NORMAL set (accelerates write throughput in WAL mode)");

    await prisma.$queryRawUnsafe("PRAGMA cache_size = -64000;");
    console.log("Cache Size: 64MB memory page cache allocated");

    await prisma.$queryRawUnsafe("PRAGMA foreign_keys = ON;");
    console.log("Foreign Keys: ON enforced");

    console.log("Database optimization complete!");
  } catch (err) {
    console.error("Error optimizing database:", err);
  } finally {
    await prisma.$disconnect();
  }
}

optimizeDatabase();
