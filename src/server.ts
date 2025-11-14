import { Elysia } from "elysia";
import user from "./modules/user";
import { openapi } from "@elysiajs/openapi";
import auth from "./modules/auth";
import { CommonError } from "./common/errors";
import { SUCCESS, VALIDATION } from "./constants/status-code";
import { response } from "./utils/response";
import { prismaError } from "prisma-better-errors";
import { PrismaClientKnownRequestError } from "./generated/prisma/internal/prismaNamespace";

export const app = new Elysia()
  .error({
    PrismaClientKnownRequestError,
  })
  .onError(({ error, code, status }) => {
    if (code === "VALIDATION") {
      return status(SUCCESS, response.error(VALIDATION, error.message));
    }
    if (error instanceof CommonError) {
      return error.toResponse();
    }
    return error;
  })
  .use(
    openapi({
      documentation: {
        tags: [
          {
            name: "授权",
            description: "授权相关接口",
          },
          {
            name: "用户",
            description: "用户相关接口",
          },
        ],
        info: {
          title: "Elysia example API",
          version: "1.0.0",
          description: "示例项目API文档",
        },
      },
    })
  )
  .get(
    "/",
    () => {
      return {
        message: "Hello World",
      };
    },
    {
      detail: {
        hide: true,
      },
    }
  );

app.use(user).use(auth);
app.listen(1118);

if (process.env.NODE_ENV !== "production") {
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}
