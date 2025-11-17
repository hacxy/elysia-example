import { prisma } from "@/common/prisima";

export const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  return user;
};

export const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};
