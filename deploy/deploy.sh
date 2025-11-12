#!/bin/bash

# 部署脚本
# 使用方法: ./deploy.sh [server_user] [server_host] [server_path]

set -e

SERVER_USER=${1:-"root"}
SERVER_HOST=${2:-"your-server.com"}
SERVER_PATH=${3:-"/opt/elysia-app"}

echo "🚀 开始部署到 $SERVER_USER@$SERVER_HOST:$SERVER_PATH"

# 检查是否构建了可执行文件
if [ ! -f "../server" ]; then
    echo "❌ 未找到 server 可执行文件，请先运行: bun run build:linux"
    exit 1
fi

# 构建应用（如果需要）
if [ "$SKIP_BUILD" != "true" ]; then
    echo "📦 构建应用..."
    cd ..
    bun run build:linux
    cd deploy
fi

# 上传文件
echo "📤 上传文件到服务器..."
scp ../server $SERVER_USER@$SERVER_HOST:$SERVER_PATH/server
scp ../package.json $SERVER_USER@$SERVER_HOST:$SERVER_PATH/package.json

# 如果有 prisma 目录，也上传
if [ -d "../prisma" ]; then
    echo "📤 上传 Prisma 配置..."
    scp -r ../prisma $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
fi

# 执行部署命令
echo "🔧 执行部署命令..."
ssh $SERVER_USER@$SERVER_HOST << EOF
    set -e
    cd $SERVER_PATH
    
    # 备份旧版本
    if [ -f server ]; then
        BACKUP_DIR="backups/\$(date +%Y%m%d_%H%M%S)"
        mkdir -p "\$BACKUP_DIR"
        cp server "\$BACKUP_DIR/" 2>/dev/null || true
        echo "✅ 已备份旧版本到 \$BACKUP_DIR"
    fi
    
    # 停止服务
    echo "⏹️  停止服务..."
    sudo systemctl stop elysia-app || true
    
    # 设置执行权限
    chmod +x server
    
    # 运行 Prisma 迁移（如果需要）
    if [ -d prisma ]; then
        echo "🔄 运行数据库迁移..."
        if command -v bun &> /dev/null; then
            bunx prisma migrate deploy || echo "⚠️  迁移失败，继续部署..."
        else
            echo "⚠️  未安装 Bun，跳过数据库迁移"
        fi
    fi
    
    # 启动服务
    echo "▶️  启动服务..."
    sudo systemctl start elysia-app
    
    # 等待服务启动
    sleep 3
    
    # 检查服务状态
    if sudo systemctl is-active --quiet elysia-app; then
        echo "✅ 部署成功！"
        sudo systemctl status elysia-app --no-pager -l
    else
        echo "❌ 服务启动失败"
        sudo systemctl status elysia-app --no-pager -l
        exit 1
    fi
EOF

echo "🎉 部署完成！"

