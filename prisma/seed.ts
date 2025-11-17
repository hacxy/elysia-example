import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { hashPassword } from "../src/utils/password.js";

// 创建 MariaDB 适配器用于种子脚本
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
 * 种子数据脚本
 * 用于初始化数据库的基础数据
 */
async function main() {
  console.log("🌱 开始填充种子数据...");

  // 1. 创建角色数据
  console.log("📝 创建角色数据...");

  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "管理员角色，拥有所有权限",
    },
  });
  console.log(`✅ 角色已创建/更新: ${adminRole.name} (ID: ${adminRole.id})`);

  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: {
      name: "USER",
      description: "普通用户角色，拥有基本权限",
    },
  });
  console.log(`✅ 角色已创建/更新: ${userRole.name} (ID: ${userRole.id})`);

  // 2. 创建示例用户（可选）
  console.log("\n👤 创建示例用户...");

  // 创建管理员用户
  const adminPassword = await hashPassword("admin123");
  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      userRole: {
        create: {
          roleId: adminRole.id,
        },
      },
    },
    include: {
      userRole: {
        include: {
          role: true,
        },
      },
    },
  });
  console.log(
    `✅ 管理员用户已创建/更新: ${adminUser.username} (角色: ${adminUser.userRole?.role.name})`
  );

  // 创建普通用户
  const userPassword = await hashPassword("user123");
  const normalUser = await prisma.user.upsert({
    where: { username: "user" },
    update: {},
    create: {
      username: "user",
      password: userPassword,
      userRole: {
        create: {
          roleId: userRole.id,
        },
      },
    },
    include: {
      userRole: {
        include: {
          role: true,
        },
      },
    },
  });
  console.log(
    `✅ 普通用户已创建/更新: ${normalUser.username} (角色: ${normalUser.userRole?.role.name})`
  );

  // 创建测试用户
  const testPassword = await hashPassword("test123");
  const testUser = await prisma.user.upsert({
    where: { username: "test" },
    update: {},
    create: {
      username: "test",
      password: testPassword,
      userRole: {
        create: {
          roleId: userRole.id,
        },
      },
    },
    include: {
      userRole: {
        include: {
          role: true,
        },
      },
    },
  });
  console.log(
    `✅ 测试用户已创建/更新: ${testUser.username} (角色: ${testUser.userRole?.role.name})`
  );

  console.log("\n✨ 种子数据填充完成！");
  console.log("\n📋 默认账户信息：");
  console.log("   管理员: admin / admin123");
  console.log("   普通用户: user / user123");
  console.log("   测试用户: test / test123");
  console.log("\n⚠️  请在生产环境中修改默认密码！");
}

main()
  .catch((e) => {
    console.error("❌ 种子数据填充失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
