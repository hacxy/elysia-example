import { t, TSchema } from "elysia";
import { ERROR, SUCCESS } from "@/constants/status-code";

export const response = {
  success: <T>(data?: T, message: string = "success") => {
    return {
      code: SUCCESS,
      data,
      message,
    };
  },
  error: (code: number = ERROR, message: string) => {
    return {
      code,
      message,
    };
  },
};

// 基础响应结构定义
const baseResponseSchema = {
  code: t.Number({
    default: SUCCESS,
    description: "状态码",
  }),
  message: t.String({
    default: "success",
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
