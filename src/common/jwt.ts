import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { ForbiddenError, UnauthorizedError } from "./errors";

/**
 * JWT Payload Schema 定义
 * 使用 TypeBox 定义，提供类型安全和运行时验证
 *
 * 注意：exp, iat, nbf 等标准字段由 JWT 库自动处理，
 * 不需要在 schema 中定义，它们会自动添加到 payload 中
 */
export const JwtPayloadSchema = t.Object({
  /** 用户 ID */
  id: t.Number(),
  /** 用户名 */
  username: t.String(),
});

/**
 * JWT Plugin
 * 使用 schema 提供类型安全的 JWT 操作
 */
export const jwtPlugin = (app: Elysia) =>
  app.use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      schema: JwtPayloadSchema, // 使用 schema 定义类型，无需类型断言
    })
  );

export const requiredAuth = (app: Elysia) =>
  app.use(jwtPlugin).derive(async ({ jwt, headers, set }) => {
    const accessToken = headers.authorization?.split(" ")[1];

    if (!accessToken) {
      // handle error for access token is not available
      throw new UnauthorizedError("token缺失，禁止访问");
    }

    // 使用 schema 后，verify 返回的类型会自动推断为 JwtPayload
    // 无需类型断言，TypeScript 会自动识别类型
    const jwtPayload = await jwt.verify(accessToken);
    if (!jwtPayload) {
      // handle error for access token is tempted or incorrect
      throw new ForbiddenError("token已过期");
    }

    // const userId = jwtPayload.id;
    // const user = await prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });

    // if (!user) {
    //   // handle error for user not found from the provided access token
    //   set.status = "Forbidden";
    //   throw new Error("Access token is invalid");
    // }

    return {
      user: jwtPayload, // 类型已自动推断为 JwtPayload，无需断言
    };
  });
