/**
 * 密码加密工具函数
 * 使用 Bun 内置的密码加密功能
 *
 * 生产环境推荐配置：
 * - Argon2id: 默认算法，最安全，推荐用于生产环境
 * - bcrypt: 传统算法，如果必须使用，建议 cost >= 12
 */

/**
 * 加密密码
 * @param password 明文密码
 * @returns 加密后的密码哈希值
 *
 * 使用 Argon2id 算法（Bun 默认，最安全）
 * 如果需要在生产环境使用 bcrypt，请使用 hashPasswordWithBcrypt 函数
 */
export async function hashPassword(password: string): Promise<string> {
  // 使用 Argon2id（Bun 默认算法，最安全，适合生产环境）
  // Argon2id 是密码哈希竞赛（PHC）的获胜者，具有内存硬性特性
  return await Bun.password.hash(password, {
    algorithm: "argon2id",
    // 参数说明：
    // memoryCost: 内存成本（KB），值越大越安全但消耗更多内存
    // timeCost: 时间成本（迭代次数），值越大越安全但耗时更长
    // outputLength: 输出长度（字节），默认 32 字节已足够安全
    memoryCost: 65536, // 64 MB，生产环境推荐值
    timeCost: 3, // 3 次迭代，平衡安全性和性能
  });
}

/**
 * 使用 bcrypt 算法加密密码（备选方案）
 * 注意：bcrypt 对密码长度有限制（72 字节），Argon2id 更推荐
 * @param password 明文密码
 * @param cost bcrypt 工作因子，建议 >= 12（生产环境）
 * @returns 加密后的密码哈希值
 */
export async function hashPasswordWithBcrypt(
  password: string,
  cost: number = 12
): Promise<string> {
  return await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost, // 生产环境建议 12-14，cost=10 已不够安全
  });
}

/**
 * 验证密码
 * @param password 明文密码
 * @param hash 加密后的密码哈希值
 * @returns 密码是否匹配
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await Bun.password.verify(password, hash);
}
