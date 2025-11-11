import { Elysia } from "elysia";
import user from "./modules/user";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(user)
  .listen(1118);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
