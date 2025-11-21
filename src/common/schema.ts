// 公共分页的schema
import { t } from "elysia";
import type { TSchema, TObject, TProperties } from "@sinclair/typebox";

const basePaginationFields = {
  page: t.Optional(
    t.Number({
      examples: 1,
      default: 1,
      description: "页码",
    })
  ),
  pageSize: t.Optional(
    t.Number({
      examples: [10, 20, 30, 40, 50],
      default: 10,
      description: "每页条数",
    })
  ),
} satisfies TProperties;

/**
 * 分页查询通用 schema，支持自定义拓展，并保持类型信息
 */
export function paginationQuerySchema(): TObject<typeof basePaginationFields>;
export function paginationQuerySchema<T extends TProperties>(
  extraFields: T
): TObject<typeof basePaginationFields & T>;
export function paginationQuerySchema(extraFields?: TProperties) {
  const mergedFields = {
    ...basePaginationFields,
    ...(extraFields || {}),
  } as typeof basePaginationFields & TProperties;

  return t.Object(mergedFields);
}
