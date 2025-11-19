# Elisya Example

ElysiaJS 使用案例

文档： https://elysiajs.com/

## 支持

- [x] JWT授权校验
- [x] 错误处理
- [x] 统一响应数据结构
- [x] 日志系统
- [x] Prisma支持(Mysql适配器)
- [x] openapi 文档自动生成
- [x] CORS
- [ ] 单元测试
- [ ] 分页查询示例
- [ ] 文件上传接口示例
- [ ] 流式响应接口示例

## 安装 Bun

- 已安装可忽略

```sh
curl -fsSL https://bun.sh/install | bash
```

## 安装依赖

```sh
bun install
```

## 创建.env文件

创建`.env`文件于项目根目录下

```
DATABASE_URL='mysql://username:password.@localhost:3306/elysia_example?connection_limit=10'
JWT_SECRET='elysia.example.secret'
```

## 生成Prisma客户端

```sh
bunx prisma generate
```

# 开发模式

```sh
bun run dev
```
