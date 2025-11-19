import openapi from "@elysiajs/openapi";
import Elysia from "elysia";

export const openapiPlugin = (app: Elysia) => {
  return app.use(
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
  );
};
