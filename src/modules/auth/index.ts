import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { response, responseSchema } from "@/utils/response";
import { jwtPlugin } from "@/common/jwt";
import { prisma } from "../../common/prisima";
import {
  PrismaClientKnownRequestError,
  prismaError,
} from "prisma-better-errors";
import { CommonError, PrismaError } from "../../common/errors";

const auth = new Elysia({ prefix: "auth" }).use(jwtPlugin);

auth.post(
  "sign-up",
  async ({ body }) => {
    const { username, password } = body;
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
      throw new CommonError(400, "用户已存在");
    }

    await prisma.user.create({
      data: {
        username,
        password,
      },
    });
    return response.success("注册成功");
  },
  {
    tags: ["授权"],
    detail: {
      summary: "用户注册",
      description: "用户注册接口",
    },
    body: AuthModel.AccountBody,
    response: responseSchema(),
  }
);

auth.post(
  "/sign-in",
  async ({ jwt, body: { username, password } }) => {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user || password !== user.password) {
      throw new CommonError(400, "用户名或密码错误");
    }

    const token = await jwt.sign({
      username,
      exp: "30d",
    });

    return response.success("登录成功", {
      token,
    });
  },
  {
    tags: ["授权"],
    detail: {
      summary: "用户登录",
      description: "用户登录授权接口",
    },
    body: AuthModel.AccountBody,
    response: responseSchema(AuthModel.signInResponse),
  }
);

export default auth;
