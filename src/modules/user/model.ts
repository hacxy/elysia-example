import { t } from "elysia";
import { throwValidationError } from "@/common/errors";
import { paginationQuerySchema } from "../../common/schema";

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

  export const emailSchema = t.Optional(
    t.String({
      error: throwValidationError("邮箱格式不正确"),
      description: "邮箱",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
    })
  );

  export const phoneSchema = t.Optional(
    t.String({
      error: throwValidationError("手机号格式不正确"),
      pattern: "^1[3-9]\d{9}$",
      description: "手机号",
    })
  );

  export const userCreateBody = t.Object({
    username: usernameSchema,
    password: passwordSchema,
    email: emailSchema,
    phone: phoneSchema,
    roleId: t.Number(),
  });

  export const userListQuery = paginationQuerySchema({
    username: t.Optional(
      t.String({
        examples: "admin123",
        description: "用户名",
      })
    ),
  });

  export type userListQuery = typeof userListQuery.static;
  export type userCreateBody = typeof userCreateBody.static;
}
