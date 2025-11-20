import Elysia from "elysia";

/**
 * 递归移除对象中值为 null 的字段
 * @param obj - 要处理的对象
 * @returns 移除 null 值后的新对象
 */
function removeNullFields<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeNullFields) as T;
  }

  if (typeof obj === "object") {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null) {
        result[key] = removeNullFields(value);
      }
    }
    return result as T;
  }

  return obj;
}

/**
 * Null 值过滤插件
 * 自动过滤响应中所有值为 null 的字段
 */
export const nullFilterPlugin = (app: Elysia) => {
  return app.onAfterHandle(({ responseValue }) => {
    if (responseValue && typeof responseValue === "object") {
      return removeNullFields(responseValue);
    }
    return responseValue;
  });
};
