import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { response, responseSchema } from "../../utils/response";
import { jwtPlugin } from "../../common/jwt";

const auth = new Elysia({ prefix: "auth" });

auth.use(jwtPlugin).post(
  "/sign-in",
  async ({ jwt, body: { username, password } }) => {
    const token = await jwt.sign({
      username,
      exp: "30d",
    });

    return response.success({
      token,
    });
  },
  {
    tags: ["授权"],
    detail: {
      summary: "用户登录",
      description: "用户登录授权接口",
    },
    body: AuthModel.signInBody,
    response: responseSchema(AuthModel.signInResponse),
  }
);

export default auth;
