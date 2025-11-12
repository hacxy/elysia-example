import { Elysia, t, TSchema } from "elysia";
import user from "./modules/user";
import { openapi } from "@elysiajs/openapi";
import auth from "./modules/auth";

export const app = new Elysia().use(
  openapi({
    documentation: {
      info: {
        title: "Elysia API",
        version: "1.0.0",
        description: "Elysia API",
      },
    },
  })
);

app.use(user).use(auth);
app.listen(1118);

if (process.env.NODE_ENV !== "production") {
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}
