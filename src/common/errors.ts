import { prismaError } from "prisma-better-errors";
import { response } from "../utils/response";
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace";
import { HttpStatusEnum } from "elysia-http-status-code/status";

export class BusinessError extends Error {
  status: number = HttpStatusEnum.HTTP_500_INTERNAL_SERVER_ERROR;
  constructor(
    public code: number = HttpStatusEnum.HTTP_500_INTERNAL_SERVER_ERROR,
    public message: string
  ) {
    super(message);
    this.status = code;
  }
  toResponse() {
    return response.error(this.code, this.message);
  }
}

// 请求头没有携带token 禁止访问
export class UnauthorizedError extends BusinessError {
  constructor(public message: string) {
    super(HttpStatusEnum.HTTP_401_UNAUTHORIZED, message);
  }
}

// 请求头携带token 但是token无效 禁止访问
export class ForbiddenError extends BusinessError {
  constructor(public message: string) {
    super(HttpStatusEnum.HTTP_403_FORBIDDEN, message);
  }
}

// 参数验证失败
export class ValidationError extends BusinessError {
  constructor(public message: string = "参数验证失败") {
    super(HttpStatusEnum.HTTP_422_UNPROCESSABLE_ENTITY, message);
  }
}

export class PrismaError extends BusinessError {
  constructor(public error: unknown) {
    const pError = new prismaError(error as PrismaClientKnownRequestError);
    super(pError.statusCode, pError.message);
  }
}

export const throwValidationError = (message: string = "参数验证失败") => {
  return () => {
    throw new ValidationError(message);
  };
};
