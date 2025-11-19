import { t, TSchema } from "elysia";
import { HttpStatusEnum } from "elysia-http-status-code/status";

export const response = {
  success: <T>(data?: T, message: string = "ok") => {
    return {
      code: HttpStatusEnum.HTTP_200_OK,
      data,
      message,
    };
  },
  error: (
    code: number = HttpStatusEnum.HTTP_500_INTERNAL_SERVER_ERROR,
    message: string
  ) => {
    return {
      code,
      message,
    };
  },
};

// 基础响应结构定义
const baseResponseSchema = {
  code: t.Number({
    default: HttpStatusEnum.HTTP_200_OK,
    description: "状态码",
  }),
  message: t.String({
    default: "ok",
    description: "响应信息",
  }),
};

/**
 * 生成响应 Schema
 * @param schema 可选的数据 Schema，如果提供则响应包含 data 字段
 * @returns 响应 Schema 对象
 */
export const responseSchema = <T extends TSchema>(schema?: T) => {
  return schema
    ? t.Object({
        ...baseResponseSchema,
        data: t.Optional(schema),
      })
    : t.Object(baseResponseSchema);
};
