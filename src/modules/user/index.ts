import { Elysia, t } from "elysia";

const user = new Elysia({ prefix: "user" });

user.get(
  "/",
  () => {
    return {
      username: "hacxy",
      email: "hacxy@gmail.com",
    };
  },
  {
    tags: ["user"],
    detail: {
      summary: "用户信息",
      description: "Get user information",
    },
    response: t.Object(
      {
        username: t.String({}),
        email: t.String(),
      },
      {
        description: "User information",
      }
    ),
  }
);

export default user;
