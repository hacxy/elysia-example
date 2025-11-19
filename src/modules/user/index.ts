import { Elysia, t } from "elysia";
import { response, responseSchema } from "../../utils/response";
import { requiredAuth } from "../../common/jwt";
import { createUser, getUsers } from "./service";
import { UserInputCreate, UserPlain } from "../../generated/prismabox/User";
import { UserModel } from "./model";

const user = new Elysia({ prefix: "user" }).use(requiredAuth);

user.get(
  "/list",
  async () => {
    const users = await getUsers();
    return response.success(users);
  },
  {
    tags: ["用户管理"],
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
    tags: ["用户管理"],
    body: UserModel.userCreateBody,
    detail: {
      summary: "创建用户",
      description: "创建用户接口",
    },
    response: responseSchema(),
  }
);

export default user;
