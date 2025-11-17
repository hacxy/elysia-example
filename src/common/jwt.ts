import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { ForbiddenError, UnauthorizedError } from "./errors";

export const jwtPlugin = (app: Elysia) =>
  app.use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  );

export const authPlugin = (app: Elysia) =>
  app.use(jwtPlugin).derive(async ({ jwt, headers, set }) => {
    const accessToken = headers.authorization?.split(" ")[1];

    if (!accessToken) {
      // handle error for access token is not available
      throw new UnauthorizedError("token缺失，禁止访问");
    }
    const jwtPayload = await jwt.verify(accessToken);
    if (!jwtPayload) {
      // handle error for access token is tempted or incorrect
      throw new ForbiddenError("token已过期");
    }

    // const userId = jwtPayload.sub;
    // const user = await prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });

    // if (!user) {
    //   // handle error for user not found from the provided access token
    //   set.status = "Forbidden";
    //   throw new Error("Access token is invalid");
    // }

    return {
      user: jwtPayload,
    };
  });
