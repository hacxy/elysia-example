import { t, TSchema } from "elysia";

export const response = {
  success: <T>(data: T, message: string = "success") => {
    return {
      code: 200,
      data,
      message,
    };
  },
  error: (message: string) => {
    return {
      code: 500,
      message,
    };
  },
};

export const responseSchema = <T extends TSchema>(schema: T) => {
  return t.Object({
    code: t.Number({
      default: 200,
      description: "状态码",
    }),
    data: schema,
    message: t.String({
      default: "success",
      description: "响应消息",
    }),
  });
};
