import { t } from "elysia";
import { UserModel } from "../user/model";
import { throwValidationError } from "../../common/errors";

export namespace AuthModel {
  export const AccountBody = t.Object(
    {
      username: UserModel.usernameSchema,
      password: UserModel.passwordSchema,
    },
    {
      error: throwValidationError(),
    }
  );

  export const signInResponse = t.Object({
    token: t.String({
      description: "Token",
      example: "1234567890abcdefghijklmnopqrstuvwxyz",
    }),
  });
}
