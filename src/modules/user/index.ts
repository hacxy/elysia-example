import { Elysia, t } from "elysia";
import { response, responseSchema } from "../../utils/response";
import { requiredAuth } from "../../common/jwt";
import { getUsers } from "./service";
import { UserPlain } from "../../generated/prismabox/User";

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

export default user;
