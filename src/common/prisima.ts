import { PrismaClient } from "@/generated/prisma/client";
import { PrismaError } from "@/common/errors";

const basePrisma = new PrismaClient();

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
