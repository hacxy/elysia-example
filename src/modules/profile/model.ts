import { t } from "elysia";
import { throwValidationError } from "../../common/errors";
import { UserModel } from "../user/model";
import { User, UserPlain } from "../../generated/prismabox/User";
import { makeFieldsOptional } from "../../utils/schema";
import { __nullable__ } from "../../generated/prismabox/__nullable__";
import { UserRolePlain } from "../../generated/prismabox/UserRole";
import { RolePlain } from "../../generated/prismabox/Role";

export namespace ProfileModel {
  export const updateUserBody = t.Object(
    {
      password: UserModel.passwordSchema,
      email: UserModel.emailSchema,
      phone: UserModel.phoneSchema,
    },
    {
      error: throwValidationError(),
    }
  );

  export const updateUserResponse = t.Object({
    id: t.Number(),
    username: t.String(),
    email: t.Optional(__nullable__(t.String())),
    phone: t.Optional(__nullable__(t.String())),
    role: t.Object({
      id: t.Number(),
      name: t.String(),
      description: t.Optional(__nullable__(t.String())),
    }),
  });

  export type updateUserBody = typeof updateUserBody.static;
}
