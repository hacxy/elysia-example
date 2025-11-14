import { prismaError } from "prisma-better-errors";
import {
  ERROR,
  SUCCESS,
  UNAUTHORIZED,
  FORBIDDEN,
  VALIDATION,
} from "../constants/status-code";
import { response } from "../utils/response";
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace";

export class CommonError extends Error {
  status: number = SUCCESS;
  constructor(
    public code: number = ERROR,
    public message: string
  ) {
    super(message);
  }
  toResponse() {
    return response.error(this.code, this.message);
  }
}

// 请求头没有携带token 禁止访问
export class UnauthorizedError extends CommonError {
  constructor(public message: string) {
    super(UNAUTHORIZED, message);
  }
}

// 请求头携带token 但是token无效 禁止访问
export class ForbiddenError extends CommonError {
  constructor(public message: string) {
    super(FORBIDDEN, message);
  }
}

// 参数验证失败
export class ValidationError extends CommonError {
  constructor(public message: string = "参数验证失败") {
    super(VALIDATION, message);
  }
}

export class PrismaError extends CommonError {
  constructor(public error: unknown) {
    const pError = new prismaError(error as PrismaClientKnownRequestError);
    super(pError.statusCode, pError.message);
  }
}
