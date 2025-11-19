import { t } from "elysia";
import { UserModel } from "../user/model";

export namespace AuthModel {
  export const AccountBody = t.Object({
    username: UserModel.usernameSchema,
    password: UserModel.passwordSchema,
  });

  export const signInResponse = t.Object({
    token: t.String({
      description: "Token",
      example: "1234567890abcdefghijklmnopqrstuvwxyz",
    }),
  });
}
