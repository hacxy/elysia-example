import { prisma } from "../../common/prisima";
import { hashPassword } from "../../utils/password";
import { ProfileModel } from "./model";

export const updateProfile = async (
  id: number,
  body: ProfileModel.updateUserBody
) => {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: await hashPassword(body.password),
      email: body.email,
      phone: body.phone,
    },
  });
};
