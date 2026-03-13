#!/bin/bash

# 数据库初始化脚本

echo "📦 初始化 SQLite 数据库..."

# 生成 Prisma 客户端
npx prisma generate

# 创建数据库表
npx prisma db push

# 初始化同步日志
echo "✅ 数据库初始化完成！"
echo ""
echo "📁 数据库文件位置：prisma/dev.db"
echo ""
echo "🚀 现在可以启动应用：docker-compose up -d"
