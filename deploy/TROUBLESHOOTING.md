# 故障排除指南

## 问题：Unit elysia-example.service not found

### 原因

这个错误表示 systemd 找不到对应的服务文件。可能的原因：

1. 服务文件没有被创建或安装
2. 服务名称不匹配（例如：使用 `elysia-example` 而不是 `elysia-app`）
3. systemd 没有重新加载配置

### 解决方案

#### 方案 1：使用正确的服务名（推荐）

如果服务器上已经存在 `elysia-example` 服务，可以在 GitHub Secrets 中配置：

1. 进入 GitHub 仓库的 `Settings` -> `Secrets and variables` -> `Actions`
2. 添加一个新的 secret：`SERVICE_NAME`，值为 `elysia-example`

这样部署脚本就会使用 `elysia-example` 作为服务名。

#### 方案 2：手动创建服务文件

在服务器上手动创建服务文件：

```bash
# SSH 连接到服务器
ssh user@your-server

# 创建服务文件
sudo nano /etc/systemd/system/elysia-app.service
```

将以下内容粘贴到文件中（根据实际情况修改路径和用户）：

```ini
[Unit]
Description=Elysia App Server
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/opt/elysia-app
ExecStart=/opt/elysia-app/server
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=elysia-app

Environment=NODE_ENV=production
Environment=PORT=1118

[Install]
WantedBy=multi-user.target
```

保存文件后，执行：

```bash
# 重新加载 systemd
sudo systemctl daemon-reload

# 启用服务
sudo systemctl enable elysia-app

# 启动服务
sudo systemctl start elysia-app

# 检查状态
sudo systemctl status elysia-app
```

#### 方案 3：使用现有服务名

如果服务器上已经有 `elysia-example` 服务，可以：

1. 在 GitHub Secrets 中设置 `SERVICE_NAME=elysia-example`
2. 或者在服务器上重命名服务：

```bash
# 停止服务
sudo systemctl stop elysia-example

# 重命名服务文件
sudo mv /etc/systemd/system/elysia-example.service /etc/systemd/system/elysia-app.service

# 修改服务文件中的路径（如果需要）
sudo nano /etc/systemd/system/elysia-app.service

# 重新加载 systemd
sudo systemctl daemon-reload

# 启用并启动新服务
sudo systemctl enable elysia-app
sudo systemctl start elysia-app
```

#### 方案 4：让部署脚本自动创建

部署脚本已经更新，现在会自动创建服务文件。如果遇到问题：

1. 确保部署用户有 sudo 权限
2. 检查部署路径是否正确
3. 查看 GitHub Actions 日志，确认服务文件是否成功创建

### 验证服务配置

检查服务是否存在：

```bash
# 列出所有 elysia 相关服务
sudo systemctl list-unit-files | grep elysia

# 检查服务状态
sudo systemctl status elysia-app

# 查看服务日志
sudo journalctl -u elysia-app -f
```

### 常见问题

#### Q: 服务启动失败

A: 检查以下几点：

1. **文件权限**：确保 `server` 文件有执行权限
   ```bash
   chmod +x /opt/elysia-app/server
   ```

2. **用户权限**：确保服务文件中指定的用户存在
   ```bash
   id your-user
   ```

3. **路径正确**：确保 `WorkingDirectory` 和 `ExecStart` 路径正确

4. **端口占用**：检查端口是否被占用
   ```bash
   sudo netstat -tlnp | grep 1118
   ```

#### Q: 无法访问服务

A: 检查：

1. **防火墙**：确保防火墙允许端口 1118
   ```bash
   sudo ufw allow 1118
   ```

2. **服务运行**：检查服务是否正在运行
   ```bash
   sudo systemctl status elysia-app
   ```

3. **日志**：查看服务日志
   ```bash
   sudo journalctl -u elysia-app -n 50
   ```

### 回滚

如果部署失败，可以回滚到之前的版本：

```bash
# 查看备份
ls -la /opt/elysia-app/backups/

# 恢复备份
sudo systemctl stop elysia-app
cp /opt/elysia-app/backups/YYYYMMDD_HHMMSS/server /opt/elysia-app/server
sudo systemctl start elysia-app
```

## 其他问题

### SSH 连接失败

1. 检查 SSH 密钥是否正确配置
2. 检查服务器防火墙设置
3. 检查 SSH 服务是否运行

### 权限问题

1. 确保部署用户有写入部署目录的权限
2. 确保部署用户有 sudo 权限（用于 systemd 操作）
3. 检查文件所有权

### 构建失败

1. 检查 Bun 版本是否兼容
2. 检查依赖是否正确安装
3. 查看 GitHub Actions 构建日志

