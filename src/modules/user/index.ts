import { Elysia } from "elysia";

const user = new Elysia({ prefix: "user" });

user.get("/", () => {
  return {
    name: "hacxy",
  };
});

export default user;
