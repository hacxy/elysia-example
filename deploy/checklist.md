# 部署检查清单

## GitHub Secrets 配置

在 GitHub 仓库的 `Settings` -> `Secrets and variables` -> `Actions` 中添加：

- [ ] `SERVER_HOST` - 服务器地址（例如: 192.168.1.100 或 example.com）
- [ ] `SERVER_USER` - SSH 用户名（例如: root 或 deploy）
- [ ] `SERVER_SSH_KEY` - SSH 私钥（完整内容）
- [ ] `SERVER_PORT` - SSH 端口（可选，默认 22）
- [ ] `SERVER_DEPLOY_PATH` - 部署路径（例如: /opt/elysia-app）
- [ ] `SERVICE_NAME` - systemd 服务名称（可选，默认 elysia-app）。如果服务器上已有服务（如 elysia-example），设置为对应服务名

## 服务器配置

- [ ] 创建部署目录: `sudo mkdir -p /opt/elysia-app`
- [ ] 设置目录权限: `sudo chown $USER:$USER /opt/elysia-app`
- [ ] 配置 SSH 密钥认证
- [ ] 配置 sudo 权限（用于 systemd 操作）
- [ ] 安装 Bun（如果使用 Prisma）: `curl -fsSL https://bun.sh/install | bash`
- [ ] **注意**: systemd 服务文件会在首次部署时自动创建，无需手动安装

## 环境变量

- [ ] 创建 `.env` 文件: `nano /opt/elysia-app/.env`
- [ ] 配置必要的环境变量（数据库连接等）

## 测试

- [ ] 推送代码到 `main` 分支
- [ ] 检查 GitHub Actions 运行状态
- [ ] 验证服务状态: `sudo systemctl status elysia-app`
- [ ] 查看服务日志: `sudo journalctl -u elysia-app -f`
- [ ] 测试 API 端点

## 故障排除

如果部署失败：

1. 检查 GitHub Actions 日志
2. 检查服务器日志: `sudo journalctl -u elysia-app -n 50`
3. 检查文件权限
4. 检查 SSH 连接
5. 检查端口是否被占用
6. **如果遇到 "Unit not found" 错误**：
   - 查看 `deploy/TROUBLESHOOTING.md` 获取详细解决方案
   - 确保在 GitHub Secrets 中配置了正确的 `SERVICE_NAME`
   - 检查部署用户是否有 sudo 权限
   - 检查服务文件是否成功创建: `sudo systemctl list-unit-files | grep elysia`

