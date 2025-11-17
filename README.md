# Elisya Example

## 安装 Bun

```sh
curl -fsSL https://bun.sh/install | bash
```

## 安装依赖

```sh
bun install
```

## 创建.env文件

```
DATABASE_URL='file:./dev.db'
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
