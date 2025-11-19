import { Elysia } from "elysia";
import user from "./modules/user";
import { openapi } from "@elysiajs/openapi";
import auth from "./modules/auth";
import { CommonError } from "./common/errors";
import { SUCCESS, VALIDATION } from "./constants/status-code";
import { response } from "./utils/response";
import { PrismaClientKnownRequestError } from "./generated/prisma/internal/prismaNamespace";
import logixlysia from "logixlysia";
import { ip } from "elysia-ip";
import profile from "./modules/profile";

export const app = new Elysia({ name: "elysia-example" })
  .use(ip())
  .use(
    logixlysia({
      config: {
        showStartupMessage: true,
        startupMessageFormat: "simple",
        timestamp: {
          translateTime: "yyyy-mm-dd HH:MM:ss",
        },
        ip: true,
        logFilePath:
          process.env.NODE_ENV === "production"
            ? "/var/log/elysia-example/elysia-example.log"
            : "./logs/elysia-example.log",
        logRotation: {
          maxSize: "10m",
          interval: "1d",
          maxFiles: "7d",
          compress: true,
        },
        customLogFormat:
          "🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip} {epoch}",
        logFilter: {
          level: ["ERROR", "WARNING"],
          status: [500, 404],
          method: "GET",
        },
      },
    })
  )
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
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
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

app.use(user).use(auth).use(profile);
app.listen(1118);
