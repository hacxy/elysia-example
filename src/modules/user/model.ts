import { t } from "elysia";
import { throwValidationError } from "@/common/errors";

export namespace UserModel {
  export const usernameSchema = t.String({
    minLength: 6,
    maxLength: 12,
    pattern: "^[A-Za-z0-9_]+$",
    description: "用户名",
    error: throwValidationError(
      "用户名只能包含字母、数字和下划线，长度为6-12位"
    ),
  });

  export const passwordSchema = t.String({
    minLength: 6,
    maxLength: 12,
    pattern: "^[A-Za-z0-9_]+$",
    description: "密码",
    error: throwValidationError("密码只能包含字母、数字和下划线，长度为6-12位"),
  });

  export const userCreateBody = t.Object({
    username: usernameSchema,
    password: passwordSchema,
    roleId: t.Number(),
  });

  export type userCreateBody = typeof userCreateBody.static;
}
