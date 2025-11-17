import Elysia, { t } from "elysia";
import { requiredAuth } from "../../common/jwt";
import { getUserByUsername } from "../user/service";
import { response, responseSchema } from "../../utils/response";
import { UserPlain } from "../../generated/prismabox/User";

const profile = new Elysia({ prefix: "/profile" }).use(requiredAuth);

profile.get(
  "/",
  async (context) => {
    const { user } = context;
    const userInfo = await getUserByUsername(user.username);
    return response.success(userInfo);
  },
  {
    tags: ["个人信息"],
    detail: {
      summary: "个人信息",
      description: "获取当前用户个人信息",
    },
    response: responseSchema(t.Omit(UserPlain, ["password"])),
  }
);

export default profile;
