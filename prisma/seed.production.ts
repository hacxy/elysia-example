import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// 环境检查
const NODE_ENV = process.env.NODE_ENV || process.env.BUN_ENV || "development";

if (NODE_ENV !== "production") {
  console.error("❌ 此脚本仅用于生产环境！");
  console.error(`   当前环境: ${NODE_ENV}`);
  console.error("   请使用 prisma/seed.ts 进行开发环境种子数据填充");
  process.exit(1);
}

// 生产环境安全检查
const REQUIRED_ENV_VARS = [
  "DATABASE_HOST",
  "DATABASE_USER",
  "DATABASE_PASSWORD",
  "DATABASE_NAME",
];

const missingVars = REQUIRED_ENV_VARS.filter(
  (varName) => !process.env[varName]
);
if (missingVars.length > 0) {
  console.error("❌ 缺少必需的环境变量：");
  missingVars.forEach((varName) => console.error(`   - ${varName}`));
  process.exit(1);
}

// 创建 MariaDB 适配器用于种子脚本
const adapter = new PrismaMariaDb({
  connectionLimit: 10,
  host: process.env.DATABASE_HOST!,
  port: parseInt(process.env.DATABASE_PORT || "3306"),
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
});

const prisma = new PrismaClient({ adapter });

/**
 * 生产环境种子数据脚本
 *
 * ⚠️ 安全注意事项：
 * 1. 此脚本仅创建基础角色数据，不创建默认用户
 * 2. 管理员账户应通过安全的方式单独创建
 * 3. 所有操作都是幂等的，可以安全地重复运行
 * 4. 建议在首次部署时运行，后续仅用于添加新角色
 */
async function main() {
  console.log("🌱 开始填充生产环境种子数据...");
  console.log(
    `📊 数据库: ${process.env.DATABASE_NAME}@${process.env.DATABASE_HOST}`
  );

  // 确认提示（生产环境）
  if (!process.env.SEED_CONFIRM) {
    console.log("\n⚠️  警告：您即将在生产数据库中填充种子数据！");
    console.log("   请确保：");
    console.log("   1. 已备份数据库");
    console.log("   2. 已确认数据库连接信息正确");
    console.log("   3. 了解此操作的影响");
    console.log("\n   如需继续，请设置环境变量: SEED_CONFIRM=true");
    console.log(
      "   或使用: SEED_CONFIRM=true bun run prisma/seed.production.ts"
    );
    process.exit(1);
  }

  try {
    // 1. 创建角色数据（仅角色，不创建用户）
    console.log("\n📝 创建角色数据...");

    const adminRole = await prisma.role.upsert({
      where: { name: "ADMIN" },
      update: {
        description: "管理员角色，拥有所有权限",
      },
      create: {
        name: "ADMIN",
        description: "管理员角色，拥有所有权限",
      },
    });
    console.log(`✅ 角色已创建/更新: ${adminRole.name} (ID: ${adminRole.id})`);

    const userRole = await prisma.role.upsert({
      where: { name: "USER" },
      update: {
        description: "普通用户角色，拥有基本权限",
      },
      create: {
        name: "USER",
        description: "普通用户角色，拥有基本权限",
      },
    });
    console.log(`✅ 角色已创建/更新: ${userRole.name} (ID: ${userRole.id})`);

    // 2. 可选：创建其他业务角色（根据 CRM 系统需求）
    const roles = [
      { name: "SALES", description: "销售角色，负责客户管理和销售流程" },
      { name: "MANAGER", description: "经理角色，负责团队管理和数据分析" },
      { name: "SUPPORT", description: "客服角色，负责客户支持和问题处理" },
    ];

    for (const roleData of roles) {
      const role = await prisma.role.upsert({
        where: { name: roleData.name },
        update: {
          description: roleData.description,
        },
        create: {
          name: roleData.name,
          description: roleData.description,
        },
      });
      console.log(`✅ 角色已创建/更新: ${role.name} (ID: ${role.id})`);
    }

    console.log("\n✨ 生产环境种子数据填充完成！");
    console.log("\n📋 已创建的角色：");
    const allRoles = await prisma.role.findMany({
      orderBy: { id: "asc" },
    });
    allRoles.forEach((role) => {
      console.log(`   - ${role.name}: ${role.description || "无描述"}`);
    });

    console.log("\n⚠️  重要提示：");
    console.log("   1. 管理员账户请通过应用界面或安全脚本单独创建");
    console.log("   2. 确保使用强密码策略");
    console.log("   3. 定期审查和更新角色权限");
    console.log("   4. 建议启用双因素认证（2FA）");
  } catch (error) {
    console.error("\n❌ 种子数据填充失败:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ 执行失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
