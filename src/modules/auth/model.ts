import { t } from "elysia";

export namespace AuthModel {
  export const AccountBody = t.Object({
    username: t.String({
      minLength: 6,
      maxLength: 12,
      pattern: "^[A-Za-z0-9_]+$",
      description: "用户名",
      error: "用户名只能包含字母、数字和下划线，长度为6-12位",
    }),
    password: t.String({
      minLength: 6,
      maxLength: 12,
      pattern: "^[A-Za-z0-9_]+$",
      description: "密码",
      error: "密码只能包含字母、数字和下划线，长度为6-12位",
    }),
  });

  export const signInResponse = t.Object({
    token: t.String({
      description: "Token",
      example: "1234567890abcdefghijklmnopqrstuvwxyz",
    }),
  });
  export const signUpResponse = t.Object({
    id: t.Number({
      description: "ID",
      example: 1,
    }),
    username: t.String({
      description: "用户名",
      example: "admin",
    }),
    createdAt: t.String({
      description: "创建时间",
      example: "2021-01-01 00:00:00",
    }),
  });
}
