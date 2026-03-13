# 公司培训管理系统

基于 Next.js + 飞书多维表格的企业培训管理系统。

## 技术栈

- **前端**: Next.js 14 + React 18 + TypeScript
- **UI 组件**: Ant Design 5
- **状态管理**: Zustand
- **后端**: Next.js API Routes
- **数据存储**: 飞书多维表格
- **部署**: Docker Compose

## 功能特性

- ✅ 课程管理（公开/授权二级权限）
- ✅ 学习任务管理（跨表关联查询）
- ✅ 培训项目管理
- ✅ 证书管理（到期预警）
- ✅ 员工培训档案
- ✅ 多租户支持
- ✅ 讲师/学员/管理员三级权限

## 快速开始

### 开发环境

```bash
# 启动 Docker 容器
docker-compose up -d

# 访问 http://localhost:33333
```

### 停止服务

```bash
docker-compose down
```

## 项目结构

```
.
├── app/                    # Next.js 14 App Router
│   ├── api/               # API Routes
│   ├── courses/           # 课程管理页面
│   ├── tasks/             # 学习任务页面
│   ├── dashboard/         # 数据统计页面
│   └── layout.tsx         # 根布局
├── lib/                    # 工具库
│   ├── feishu.ts          # 飞书 API 封装
│   └── store.ts           # Zustand 状态管理
├── components/             # React 组件
├── types/                  # TypeScript 类型定义
└── docker-compose.yml      # Docker 配置
```

## 环境配置

复制 `.env.example` 到 `.env.local` 并填写配置：

```bash
cp .env.example .env.local
```

## 开发文档

详细需求文档：https://www.feishu.cn/docx/FRapdydMfopMAcxYIZQcYzSdnyg
