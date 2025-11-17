import { prisma } from "@/common/prisima";
import { hashPassword } from "@/utils/password";

export const createUser = async (username: string, password: string) => {
  // 加密密码后再存储
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
  return user;
};
