import Elysia from "elysia";
import { BusinessError } from "../common/errors";
import { HttpStatusEnum } from "elysia-http-status-code/status";

// 统一的错误处理, 业务异常统一返回200状态码
export const errorHandlerPlugin = (app: Elysia) => {
  return app.onError(({ error, set }) => {
    if (error instanceof BusinessError) {
      set.status = HttpStatusEnum.HTTP_200_OK;
      return error.toResponse();
    }
    return error;
  });
};
