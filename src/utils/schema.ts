import { t, type TSchema } from "elysia";

/**
 * 将 schema 中的指定字段转换为可选字段
 *
 * @param schema - 原始 schema 对象
 * @param optionalKeys - 需要转换为可选的字段名数组
 * @param optionalFields - 可选字段的定义对象，用于定义这些字段的可选版本
 *                         如果不提供，将从 originalFields 中提取对应字段并包装为 Optional
 * @param originalFields - 原始字段定义对象，用于自动提取字段类型（当 optionalFields 未提供时）
 * @returns 新的 schema，其中指定字段为可选
 *
 * @example
 * ```ts
 * const schema = t.Object({
 *   id: t.Integer(),
 *   name: t.String(),
 *   email: t.Union([t.Null(), t.String()]),
 * });
 *
 * // 方式1: 手动指定可选字段定义
 * const result1 = makeFieldsOptional(schema, ["email"], {
 *   email: t.Optional(t.Union([t.Null(), t.String()])),
 * });
 *
 * // 方式2: 从原始字段定义中自动提取
 * const result2 = makeFieldsOptional(
 *   schema,
 *   ["email"],
 *   undefined,
 *   { email: t.Union([t.Null(), t.String()]) }
 * );
 * ```
 */
export function makeFieldsOptional<
  T extends TSchema,
  K extends keyof T["static"],
>(
  schema: T,
  optionalKeys: K[],
  optionalFields?: Partial<Record<K, TSchema>>,
  originalFields?: Partial<Record<K, TSchema>>
): TSchema {
  // 移除需要转换为可选的字段
  const omittedSchema = t.Omit(schema, optionalKeys as string[]) as TSchema;

  // 如果提供了可选字段定义，直接使用
  if (optionalFields) {
    return t.Intersect([
      omittedSchema,
      t.Object(optionalFields as Record<string, TSchema>),
    ]);
  }

  // 如果没有提供可选字段定义，尝试从 originalFields 中提取
  if (originalFields) {
    const fields: Record<string, TSchema> = {};
    for (const key of optionalKeys) {
      const originalField = originalFields[key];
      if (originalField) {
        // 将原始字段包装为 Optional
        fields[key as string] = t.Optional(originalField);
      }
    }
    return t.Intersect([omittedSchema, t.Object(fields)]);
  }

  // 如果都没有提供，抛出错误
  throw new Error("必须提供 optionalFields 或 originalFields 参数之一");
}
