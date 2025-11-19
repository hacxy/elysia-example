import { Elysia, t } from "elysia";
import { response, responseSchema } from "../../utils/response";
import { requiredAuth } from "../../plugins/jwt";
import { createUser, getUsers } from "./service";
import { UserPlain } from "../../generated/prismabox/User";
import { UserModel } from "./model";

const user = new Elysia({
  prefix: "user",
  detail: {
    tags: ["用户管理"],
  },
}).use(requiredAuth);

user.get(
  "/list",
  async () => {
    const users = await getUsers();
    return response.success(users);
  },
  {
    detail: {
      summary: "用户列表",
      description: "获取所有用户列表",
    },
    response: responseSchema(t.Array(t.Omit(UserPlain, ["password"]))),
  }
);

user.post(
  "/create",
  async ({ body }) => {
    await createUser(body);
    return response.success();
  },
  {
    body: UserModel.userCreateBody,
    detail: {
      summary: "创建用户",
      description: "创建用户接口",
    },
    response: responseSchema(),
  }
);

export default user;
