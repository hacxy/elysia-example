import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { response, responseSchema } from "../../utils/response";

const auth = new Elysia({ prefix: "auth" });

auth.post(
  "/sign-in",
  ({ body: { username, password } }) => {
    console.log(username, password);
    return response.success({
      token: "Loginsuccessful",
    });
  },
  {
    tags: ["auth"],
    detail: {
      summary: "用户登录",
      description: "用户登录授权接口",
    },
    body: AuthModel.signInBody,
    response: responseSchema(AuthModel.signInResponse),
  }
);

export default auth;
