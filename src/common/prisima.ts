import { PrismaClient } from "@/generated/prisma/client";
import { PrismaError } from "@/common/errors";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "3306"),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});
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
