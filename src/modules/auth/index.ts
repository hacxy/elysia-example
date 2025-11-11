import { Elysia } from "elysia";

const auth = new Elysia({ prefix: "auth" });

auth.post("/login", () => {
  return {
    message: "Login successful",
  };
});

export default auth;
