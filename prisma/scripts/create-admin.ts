import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hashPassword } from "../../src/utils/password.js";
import { createInterface } from "node:readline/promises";

// 创建 MariaDB 适配器
const adapter = new PrismaMariaDb({
  connectionLimit: 10,
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "3306"),
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "elysia_app",
});

const prisma = new PrismaClient({ adapter });

/**
 * 创建管理员账户脚本
 *
 * 用于在生产环境中安全地创建管理员账户
 * 支持交互式输入，避免密码出现在命令行历史中
 */
async function main() {
  console.log("🔐 创建管理员账户\n");

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    // 1. 获取用户名
    const username = await rl.question("请输入管理员用户名 (默认: admin): ");
    const finalUsername = username.trim() || "admin";

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username: finalUsername },
      include: { userRole: { include: { role: true } } },
    });

    if (existingUser) {
      console.log(`\n⚠️  用户 "${finalUsername}" 已存在`);
      const update = await rl.question("是否更新密码? (y/N): ");
      if (update.toLowerCase() !== "y") {
        console.log("❌ 操作已取消");
        return;
      }
    }

    // 2. 获取密码
    const password = await rl.question("请输入密码: ");
    if (!password || password.length < 8) {
      console.error("❌ 密码长度至少为 8 个字符");
      process.exit(1);
    }

    const confirmPassword = await rl.question("请再次输入密码确认: ");
    if (password !== confirmPassword) {
      console.error("❌ 两次输入的密码不一致");
      process.exit(1);
    }

    // 3. 查找 ADMIN 角色
    const adminRole = await prisma.role.findUnique({
      where: { name: "ADMIN" },
    });

    if (!adminRole) {
      console.error("❌ 未找到 ADMIN 角色，请先运行种子数据脚本");
      process.exit(1);
    }

    // 4. 加密密码
    console.log("\n⏳ 正在加密密码...");
    const hashedPassword = await hashPassword(password);

    // 5. 创建或更新用户
    if (existingUser) {
      // 更新现有用户
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          userRole: {
            upsert: {
              create: { roleId: adminRole.id },
              update: { roleId: adminRole.id },
            },
          },
        },
      });
      console.log(`\n✅ 用户 "${finalUsername}" 的密码已更新`);
    } else {
      // 创建新用户
      await prisma.user.create({
        data: {
          username: finalUsername,
          password: hashedPassword,
          userRole: {
            create: {
              roleId: adminRole.id,
            },
          },
        },
      });
      console.log(`\n✅ 管理员账户 "${finalUsername}" 创建成功`);
    }

    console.log("\n📋 账户信息：");
    console.log(`   用户名: ${finalUsername}`);
    console.log(`   角色: ADMIN`);

    console.log("\n⚠️  请妥善保管账户信息，建议立即登录并修改密码");
  } catch (error) {
    console.error("\n❌ 创建失败:", error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();
