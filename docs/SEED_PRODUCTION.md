# 生产环境种子数据指南

## 📋 概述

在生产环境中使用种子数据需要格外谨慎。本文档提供了安全的生产环境种子数据填充方案。

## ⚠️ 安全注意事项

1. **备份数据库**：在执行任何操作前，务必备份生产数据库
2. **环境隔离**：确保连接到正确的生产数据库
3. **权限控制**：使用具有最小必要权限的数据库账户
4. **审计日志**：记录所有种子数据操作
5. **测试验证**：在测试环境先验证脚本

## 🚀 使用流程

### 1. 首次部署 - 填充基础角色数据

```bash
# 方式 1: 使用 npm script（推荐）
SEED_CONFIRM=true bun run prisma:seed:prod

# 方式 2: 直接运行
SEED_CONFIRM=true NODE_ENV=production bun run prisma/seed.production.ts
```

**此脚本会：**
- ✅ 创建基础角色（ADMIN, USER）
- ✅ 创建 CRM 业务角色（SALES, MANAGER, SUPPORT）
- ❌ **不会创建任何用户账户**（安全考虑）

### 2. 创建管理员账户

```bash
# 交互式创建管理员账户
bun run prisma:create-admin
```

**此脚本会：**
- 交互式输入用户名和密码
- 自动加密密码
- 分配 ADMIN 角色
- 支持更新现有用户密码

### 3. 数据库迁移

```bash
# 开发环境
bun run prisma:migrate

# 生产环境（仅应用迁移，不生成新迁移）
bun run prisma:migrate:prod
```

## 📊 种子数据内容

### 角色数据

| 角色名称 | 描述 | 用途 |
|---------|------|------|
| ADMIN | 管理员角色，拥有所有权限 | 系统管理员 |
| USER | 普通用户角色，拥有基本权限 | 普通用户 |
| SALES | 销售角色，负责客户管理和销售流程 | CRM 销售团队 |
| MANAGER | 经理角色，负责团队管理和数据分析 | 管理层 |
| SUPPORT | 客服角色，负责客户支持和问题处理 | 客服团队 |

## 🔒 安全最佳实践

### 1. 环境变量配置

确保 `.env.production` 包含：

```env
NODE_ENV=production
DATABASE_HOST=your-production-host
DATABASE_PORT=3306
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-secure-password
DATABASE_NAME=your-db-name
```

### 2. 密码策略

- 管理员密码至少 16 个字符
- 包含大小写字母、数字和特殊字符
- 定期更换密码
- 启用双因素认证（2FA）

### 3. 访问控制

- 限制种子脚本的执行权限
- 使用只读账户进行验证
- 记录所有数据库操作

### 4. 监控和告警

- 监控异常登录尝试
- 设置账户创建告警
- 定期审查角色权限

## 🔄 更新和维护

### 添加新角色

编辑 `prisma/seed.production.ts`，在角色数组中添加新角色：

```typescript
const roles = [
  // ... 现有角色
  { name: "NEW_ROLE", description: "新角色描述" },
];
```

然后重新运行种子脚本（幂等操作，安全）。

### 更新角色描述

种子脚本使用 `upsert`，可以安全地更新角色描述：

```typescript
await prisma.role.upsert({
  where: { name: "ADMIN" },
  update: {
    description: "更新后的描述",
  },
  create: { /* ... */ },
});
```

## 🧪 测试环境验证

在生产环境执行前，先在测试环境验证：

```bash
# 1. 设置测试环境变量
export NODE_ENV=test
export DATABASE_HOST=test-db-host
# ... 其他环境变量

# 2. 运行种子脚本
SEED_CONFIRM=true bun run prisma/seed.production.ts

# 3. 验证数据
# 检查角色是否正确创建
# 检查数据完整性
```

## 📝 检查清单

执行生产环境种子数据前，请确认：

- [ ] 已备份生产数据库
- [ ] 已验证数据库连接信息
- [ ] 已在测试环境验证脚本
- [ ] 已设置 `SEED_CONFIRM=true`
- [ ] 已确认 `NODE_ENV=production`
- [ ] 已通知相关团队成员
- [ ] 已准备回滚方案

## 🆘 故障处理

### 如果脚本执行失败

1. **检查错误信息**：查看详细的错误日志
2. **验证数据库连接**：确认环境变量正确
3. **检查数据库状态**：确认数据库可访问
4. **回滚操作**：如有必要，从备份恢复

### 常见问题

**Q: 脚本提示缺少环境变量**
A: 确保所有必需的环境变量都已设置

**Q: 角色已存在，是否需要更新？**
A: 脚本使用 `upsert`，会自动更新描述，无需手动处理

**Q: 如何删除角色？**
A: 不建议通过脚本删除，应通过应用界面或数据库管理工具谨慎操作

## 📚 相关文档

- [Prisma 迁移指南](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [数据库备份策略](./BACKUP_STRATEGY.md)
- [安全最佳实践](./SECURITY.md)

