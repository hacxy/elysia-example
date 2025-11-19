import { PrismaClient } from "@/generated/prisma/client";
import mariadbAdapter from "../../prisma/adapter";

export const prisma = new PrismaClient({ adapter: mariadbAdapter });

// export const prisma = basePrisma.$extends({
//   query: {
//     $allModels: {
//       $allOperations: async ({ args, query }) => {
//         try {
//           return await query(args);
//         } catch (error) {
//         }
//       },
//     },
//   },
// });
