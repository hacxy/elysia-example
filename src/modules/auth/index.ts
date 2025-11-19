import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { response, responseSchema } from "@/utils/response";
import { jwtPlugin } from "@/plugins/jwt";
import { BusinessError, UserExistsError } from "../../common/errors";
import { createUser } from "./service";
import { getUserByUsername } from "../user/service";
import { verifyPassword } from "@/utils/password";

const auth = new Elysia({ prefix: "auth" }).use(jwtPlugin);

auth.post(
  "sign-up",
  async ({ body }) => {
    const { username, password } = body;

    if (await getUserByUsername(username)) {
      throw new UserExistsError();
    }
    await createUser(username, password);
    return response.success();
  },
  {
    tags: ["授权"],
    detail: {
      summary: "注册",
      description: "用户注册接口",
    },
    body: AuthModel.AccountBody,
    response: responseSchema(),
  }
);

auth.post(
  "/sign-in",
  async ({ jwt, body: { username, password } }) => {
    const user = await getUserByUsername(username);
    if (!user) {
      throw new BusinessError(400, "用户名或密码错误");
    }

    // 使用加密密码进行验证
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new BusinessError(400, "用户名或密码错误");
    }

    const token = await jwt.sign({
      id: user.id,
      username: user.username,
      exp: "30d",
    });

    return response.success(
      {
        token,
      },
      "登录成功"
    );
  },
  {
    tags: ["授权"],
    detail: {
      summary: "登录",
      description: "用户登录授权接口",
    },
    body: AuthModel.AccountBody,
    response: responseSchema(AuthModel.signInResponse),
  }
);

export default auth;
