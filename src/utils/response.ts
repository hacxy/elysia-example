import { t, TSchema } from "elysia";

export const response = {
  success: <T>(data: T, message: string = "success") => {
    return {
      code: 200,
      data,
      message,
    };
  },
  error: (code: number = 500, message: string) => {
    return {
      code,
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
    data: t.Optional(schema),
    message: t.String({
      default: "success",
      description: "响应信息",
    }),
  });
};
