import Elysia, { t } from "elysia";
import { requiredAuth } from "../../plugins/jwt";
import { getUserById } from "../user/service";
import { response, responseSchema } from "../../utils/response";
import { User } from "../../generated/prismabox/User";

const profile = new Elysia({
  prefix: "/profile",
  detail: {
    tags: ["个人信息"],
  },
}).use(requiredAuth);

profile.get(
  "/info",
  async (context) => {
    const { user } = context;
    const userInfo = await getUserById(user.id);
    return response.success(userInfo);
  },
  {
    detail: {
      summary: "个人信息",
      description: "获取当前用户个人信息",
    },
    response: responseSchema(t.Omit(User, ["password"])),
  }
);

export default profile;
