# 部署指南

本文档说明如何配置 CI/CD 自动部署到服务器。

## 前置要求

1. GitHub 仓库
2. 服务器需要：
   - SSH 访问权限
   - Bun 运行时（用于 Prisma 迁移，可选）
   - systemd（用于服务管理）

## 配置步骤

### 1. 配置 GitHub Secrets

在 GitHub 仓库中，进入 `Settings` -> `Secrets and variables` -> `Actions`，添加以下 secrets：

- `SERVER_HOST`: 服务器 IP 地址或域名
- `SERVER_USER`: SSH 用户名
- `SERVER_SSH_KEY`: SSH 私钥（完整内容，包括 `-----BEGIN OPENSSH PRIVATE KEY-----` 和 `-----END OPENSSH PRIVATE KEY-----`）
- `SERVER_PORT`: SSH 端口（可选，默认为 22）
- `SERVER_DEPLOY_PATH`: 部署路径，例如 `/opt/elysia-app`
- `SERVICE_NAME`: systemd 服务名称（可选，默认为 `elysia-app`）。如果服务器上已有服务（如 `elysia-example`），可以设置为对应的服务名

### 2. 服务器端配置

#### 2.1 创建部署目录

```bash
sudo mkdir -p /opt/elysia-app
sudo chown $USER:$USER /opt/elysia-app
```

#### 2.2 安装 systemd 服务

将 `deploy/elysia-app.service` 复制到服务器：

```bash
sudo cp deploy/elysia-app.service /etc/systemd/system/elysia-app.service
```

编辑服务文件，根据实际情况修改：

- `WorkingDirectory`: 部署目录路径
- `User`: 运行服务的用户
- `Environment`: 环境变量配置

#### 2.3 启用并启动服务

```bash
sudo systemctl daemon-reload
sudo systemctl enable elysia-app
sudo systemctl start elysia-app
```

#### 2.4 配置 SSH 密钥认证

在服务器上创建 SSH 密钥对（如果还没有）：

```bash
ssh-keygen -t ed25519 -C "github-actions"
```

将公钥添加到服务器的 `authorized_keys`：

```bash
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

将私钥内容复制到 GitHub Secrets 的 `SERVER_SSH_KEY` 中。

#### 2.5 配置 sudo 权限（可选）

如果需要以其他用户运行服务，可能需要配置 sudo 权限。创建文件 `/etc/sudoers.d/elysia-app`：

```
your_user ALL=(ALL) NOPASSWD: /usr/bin/systemctl start elysia-app
your_user ALL=(ALL) NOPASSWD: /usr/bin/systemctl stop elysia-app
your_user ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart elysia-app
your_user ALL=(ALL) NOPASSWD: /usr/bin/systemctl status elysia-app
```

### 3. 环境变量配置

在服务器上创建 `.env` 文件（如果需要）：

```bash
cd /opt/elysia-app
nano .env
```

添加必要的环境变量：

```env
NODE_ENV=production
PORT=1118
DATABASE_URL=your_database_url
# 其他环境变量...
```

### 4. Prisma 数据库配置（如果使用）

如果项目使用 Prisma，需要：

1. 在服务器上安装 Bun（用于运行 Prisma 迁移）：

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. 确保 `prisma/schema.prisma` 文件在部署路径中

3. 在部署后运行迁移（CI/CD 会自动执行）

### 5. 验证部署

部署完成后，检查服务状态：

```bash
sudo systemctl status elysia-app
```

查看日志：

```bash
sudo journalctl -u elysia-app -f
```

## 工作流程

1. 推送到 `main` 分支触发构建
2. GitHub Actions 构建 Linux 可执行文件
3. 通过 SSH 上传到服务器
4. 停止旧服务
5. 解压新文件
6. 运行数据库迁移（如果有）
7. 启动新服务

## 手动部署

如果需要手动部署，可以使用以下命令：

```bash
# 构建
bun run build:linux

# 上传到服务器
scp server user@server:/opt/elysia-app/

# 在服务器上重启服务
ssh user@server "sudo systemctl restart elysia-app"
```

## 故障排除

### 服务无法启动

1. 检查日志：`sudo journalctl -u elysia-app -n 50`
2. 检查文件权限：`ls -la /opt/elysia-app/server`
3. 检查端口是否被占用：`sudo netstat -tlnp | grep 1118`

### SSH 连接失败

1. 检查 SSH 密钥是否正确
2. 检查服务器防火墙设置
3. 检查 SSH 服务是否运行：`sudo systemctl status ssh`

### 权限问题

1. 确保部署用户有写入权限：`sudo chown -R $USER:$USER /opt/elysia-app`
2. 确保可执行文件有执行权限：`chmod +x /opt/elysia-app/server`

## 安全建议

1. 使用 SSH 密钥认证，不要使用密码
2. 限制 SSH 访问 IP
3. 定期更新服务器和依赖
4. 使用防火墙限制端口访问
5. 不要在代码中硬编码敏感信息，使用环境变量
