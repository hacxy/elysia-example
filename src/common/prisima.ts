import { PrismaClient } from "@/generated/prisma/client";
import { PrismaError } from "@/common/errors";
import mariadbAdapter from "../../prisma/adapter";

const basePrisma = new PrismaClient({ adapter: mariadbAdapter });

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
