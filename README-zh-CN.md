# React Router Chakra Starter Kit

<p align="center">
  <img src="app/assets/logo.svg" alt="Logo" width="120" height="120">
</p>

<p align="center">
  一个现代化、生产就绪的全栈 React 模板，由 React Router v7、Chakra UI 和 Cloudflare Workers 驱动。
</p>

<p align="center">
  简体中文 | <a href="./README.md">English</a>
</p>

<p align="center">
  <strong>🚀 在线演示:</strong> <a href="https://asuk.app/gallery/react-router-chakra-starter-kit">https://asuk.app/gallery/react-router-chakra-starter-kit</a>
</p>

---

## ✨ 特性

| 分类 | 技术栈 |
|------|-------|
| **框架** | [React Router v7](https://reactrouter.com/) 支持 SSR |
| **UI** | [Chakra UI v3](https://chakra-ui.com/) - 现代化、无障碍设计系统 |
| **认证** | [Better Auth](https://www.better-auth.com/) - GitHub OAuth 集成 |
| **数据库** | [Cloudflare D1](https://developers.cloudflare.com/d1) + [Drizzle ORM](https://orm.drizzle.team/) |
| **部署** | [Cloudflare Workers](https://workers.cloudflare.com/) - 边缘计算 |
| **语言** | TypeScript - 完整类型安全 |
| **构建工具** | [Vite](https://vitejs.dev/) - 极速 HMR |

### 为什么选择这个技术栈？

- 🌍 **边缘优先架构** - 通过 Cloudflare 的边缘网络全球部署
- ⚡ **极致性能** - 支持流式传输的服务端渲染
- 🔐 **默认安全** - 内置认证与会话管理
- 📦 **零配置数据库** - Cloudflare D1 支持自动迁移
- 🎨 **精美 UI** - 无障碍组件支持深色模式
- 🔄 **全栈类型安全** - 从数据库到 UI 的端到端 TypeScript

## 📁 项目结构

```
├── app/
│   ├── components/       # 可复用 UI 组件
│   │   ├── auth-provider.tsx
│   │   ├── chakra-provider.tsx
│   │   ├── sign-in-button.tsx
│   │   └── ...
│   ├── db/
│   │   ├── client.ts     # 数据库客户端
│   │   └── schema.ts     # Drizzle ORM 模式
│   ├── lib/
│   │   ├── auth.server.ts    # 服务端认证配置
│   │   ├── auth-client.ts    # 客户端认证钩子
│   │   └── environment.ts    # 环境工具
│   ├── routes/           # 基于文件的路由
│   │   ├── _app.tsx      # 应用布局
│   │   ├── _app._index.tsx   # 首页
│   │   └── api.auth.*.ts     # 认证 API 路由
│   └── root.tsx          # 根组件
├── drizzle/
│   └── migrations/       # 数据库迁移
├── workers/
│   └── app.ts            # Cloudflare Worker 入口
└── wrangler.jsonc        # Cloudflare 配置
```

## 🚀 快速开始

### 前置要求

- Node.js >= 20.x
- pnpm >= 10.x
- Cloudflare 账号（用于部署）
- GitHub OAuth 应用（用于认证）

### 安装

```bash
# 克隆仓库
git clone https://github.com/your-username/react-router-chakra-starter-kit.git
cd react-router-chakra-starter-kit

# 安装依赖
pnpm install

# 复制环境变量
cp .dev.vars.example .dev.vars
```

### 开发

```bash
# 启动开发服务器
pnpm dev
```

在浏览器中访问 `http://localhost:5173/gallery/react-router-chakra-starter-kit`。

### 数据库设置

```bash
# 从模式生成迁移
pnpm run db:generate

# 应用迁移到本地数据库
pnpm run db:migrate:local

# 在 Drizzle Studio 中查看数据库
pnpm run db:studio
```

## 🔐 认证设置

此模板使用 Better Auth 配合 GitHub OAuth。请按照 [认证设置指南](./AUTH_SETUP.md) 配置：

1. 创建 GitHub OAuth 应用
2. 配置环境变量
3. 设置 D1 数据库

## 📦 可用脚本

| 脚本 | 描述 |
|-----|------|
| `pnpm dev` | 启动带 HMR 的开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm preview` | 本地预览生产构建 |
| `pnpm deploy` | 部署到 Cloudflare Workers |
| `pnpm db:generate` | 生成数据库迁移 |
| `pnpm db:migrate:local` | 本地应用迁移 |
| `pnpm db:migrate:remote` | 生产环境应用迁移 |
| `pnpm db:studio` | 打开 Drizzle Studio |
| `pnpm typecheck` | 运行 TypeScript 类型检查 |
| `pnpm format` | 使用 Biome 格式化代码 |

## 🌐 部署

### 配置生产密钥

```bash
# 设置 GitHub OAuth 凭证
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET

# 设置健康检查令牌
npx wrangler secret put HEALTH_CHECK_TOKEN
```

### 部署到 Cloudflare Workers

```bash
# 完整部署（迁移 + 构建 + 部署）
pnpm deploy
```

### 预览部署

```bash
# 上传预览版本
npx wrangler versions upload

# 推送到生产
npx wrangler versions deploy
```

## 🛠️ 配置

### 子路径部署

此模板支持子路径部署。配置集中在 `app/lib/environment.ts`：

- `APP_BASENAME` - 路由基础路径
- `APP_DOMAIN` - 生产域名
- `APP_BASE_URL` - 完整生产 URL
- `APP_TRUSTED_ORIGINS` - CORS 信任源

### 构建时配置

- `react-router.config.ts` - React Router 基础名
- `vite.config.ts` - Vite 资源基础路径
- `wrangler.jsonc` - Cloudflare Workers 路由模式

## 📚 文档

- [认证设置](./AUTH_SETUP.md) - 详细的认证配置指南
- [认证架构](./AUTHENTICATION.md) - 技术概述
- [数据库迁移](./DATABASE_MIGRATION.md) - 迁移工作流指南
- [贡献指南](./AGENTS.md) - 代码风格与约定

## 🔗 资源

- [React Router 文档](https://reactrouter.com/)
- [Chakra UI 文档](https://chakra-ui.com/)
- [Better Auth 文档](https://www.better-auth.com/)
- [Drizzle ORM 文档](https://orm.drizzle.team/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)

## 📄 许可证

MIT 许可证 - 可自由用于您自己的项目。

---

<p align="center">
  使用 React Router v7 用 ❤️ 构建
</p>

