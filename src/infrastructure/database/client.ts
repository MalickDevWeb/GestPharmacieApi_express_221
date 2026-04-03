import { PrismaClient } from "@prisma/client";

import { env } from "../../config/env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}
