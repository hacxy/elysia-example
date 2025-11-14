import { Elysia, t } from "elysia";
import { response, responseSchema } from "../../utils/response";
import { authPlugin } from "../../common/jwt";

const user = new Elysia({ prefix: "user" }).use(authPlugin);

user.get(
  "/list",
  ({ user }) => {
    console.log(user);
    // user 包含 JWT payload 中的信息
    // const { user } = context as any;
    return response.success({
      username: "hacxy",
      email: "hacxy@gmail.com",
    });
  },
  {
    tags: ["用户"],
    detail: {
      summary: "用户信息",
      description: "Get user information (需要认证)",
    },
    response: responseSchema(
      t.Object({
        username: t.String(),
        email: t.String(),
      })
    ),
  }
);

// 可选认证示例 - 使用 verifyJWT 而不是 requireAuth
user.get(
  "/profile",
  (context) => {
    const { user, isAuthenticated } = context as any;
    if (isAuthenticated && user) {
      return response.success({
        username: user.username,
        authenticated: true,
      });
    }
    return response.success({
      username: "游客",
      authenticated: false,
    });
  },
  {
    tags: ["用户"],
    detail: {
      summary: "用户资料（可选认证）",
      description: "Get user profile (可选认证)",
    },
  }
);

export default user;
