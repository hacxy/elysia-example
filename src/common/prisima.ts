import { PrismaClient } from "@/generated/prisma/client";
import { PrismaError } from "@/common/errors";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSQLite3(process.env.DATABASE_URL);
const basePrisma = new PrismaClient({ adapter });

export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      $allOperations: async ({ args, query }) => {
        try {
          return await query(args);
        } catch (error) {
          throw new PrismaError(error);
        }
      },
    },
  },
});
