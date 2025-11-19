import { prisma } from "@/common/prisima";
import { BusinessError } from "../../common/errors";
import { hashPassword } from "../../utils/password";
import type { UserModel } from "./model";

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

export const createUser = async (data: UserModel.userCreateBody) => {
  const { username, password, roleId } = data;
  if (await getUserByUsername(username)) {
    throw new BusinessError(400, "用户已存在");
  }
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      userRole: {
        connect: {
          id: roleId,
        },
      },
    },
  });
  return user;
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
};
