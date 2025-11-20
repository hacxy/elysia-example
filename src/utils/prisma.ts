/**
 * 将 Prisma 查询结果中的嵌套关系提升到第一层
 *
 * @param data - Prisma 查询结果
 * @param path - 嵌套路径，例如 ["userRole", "role"] 表示 data.userRole.role
 * @param targetKey - 目标键名，例如 "role"
 * @returns 转换后的数据
 *
 * @example
 * ```ts
 * const user = await prisma.user.findUnique({
 *   include: { userRole: { include: { role: true } } }
 * });
 *
 * // 将 userRole.role 提升为 role
 * const flattened = flattenRelation(user, ["userRole", "role"], "role");
 * ```
 */
export function flattenRelation<T extends Record<string, any>>(
  data: T | null,
  path: string[],
  targetKey: string
): T | null {
  if (!data) {
    return null;
  }

  let value: any = data;
  for (const key of path) {
    value = value?.[key];
    if (value === null || value === undefined) {
      break;
    }
  }

  const { [path[0]]: removed, ...rest } = data;
  return {
    ...rest,
    [targetKey]: value || null,
  } as T;
}
