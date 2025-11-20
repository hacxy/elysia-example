import Elysia, { t } from "elysia";
import { requiredAuth } from "../../plugins/jwt";
import { getUserById } from "../user/service";
import { response, responseSchema } from "../../utils/response";
import {
  User,
  UserPlain,
  UserPlainInputCreate,
} from "../../generated/prismabox/User";
import { ProfileModel } from "./model";
import { updateProfile } from "./service";
import { UserRolePlain } from "../../generated/prismabox/UserRole";

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
      summary: "获取个人信息",
      description: "获取当前用户个人信息",
    },
    response: responseSchema(ProfileModel.updateUserResponse),
  }
);

profile.post(
  "/update",
  async ({ body, user }) => {
    await updateProfile(user.id, body);
    return response.success();
  },
  {
    detail: {
      summary: "更新个人信息",
      description: "更新当前用户个人信息",
    },
    body: ProfileModel.updateUserBody,
    response: responseSchema(),
  }
);

export default profile;
