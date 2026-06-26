# Yunbo（云泊）

[English](./README.en.md)

![Node.js >= 22](https://img.shields.io/badge/Node.js-%3E%3D%2022-339933?logo=node.js&logoColor=white)
![pnpm 11.9.0](https://img.shields.io/badge/pnpm-11.9.0-F69220?logo=pnpm&logoColor=white)
![Astro 7.0.2](https://img.shields.io/badge/Astro-7.0.2-BC52EE?logo=astro&logoColor=white)
![TypeScript 6.0.3](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white)

Yunbo 是一个安静、轻量的 Astro 博客主题，适合长期写作、文章归档、专题整理、本地搜索、RSS 和静态部署。

Yunbo 取自「云」与「泊」的意象：想法像云一样聚合，最终以文章的形式停泊下来。

## 功能

- 基于 Astro 的静态博客。
- 使用 TypeScript 和 Astro 组件开发。
- Markdown 内容来源为 `src/content/posts/**/*.md`。
- 根据文章 `series` 自动生成专题页。
- 文章列表支持专题筛选、标签筛选和排序。
- 文章详情支持阅读时间、标签、目录、代码复制和长代码折叠。
- 搜索页支持本地前端搜索。
- 生产构建后生成 Pagefind 索引。
- `/rss.xml` RSS 输出。
- 通过 `@astrojs/sitemap` 生成站点地图。
- 支持公开主题仓库 + 私有内容仓库的部署方式。
- 提供可选的微信/Obsidian Markdown 导入脚本。

## 环境要求

- Node.js >= 22
- pnpm 11.9.0
- Astro 7.0.2
- TypeScript 6.0.3

本项目也保留 `package-lock.json`，使用 npm 可以正常安装和构建。Cloudflare Pages 推荐 Node.js 22。

## 快速开始

```bash
npm install
npm run dev
```

Astro 默认本地地址通常是：

```text
http://localhost:4321
```

## 常用命令

```bash
npm run dev           # 启动开发服务器
npm run build         # 构建静态站点并生成 Pagefind 索引
npm run preview       # 预览生产构建结果
npm run sync:private  # 构建前同步私有文章和图片
npm run sync:wechat   # 导入本地微信/Obsidian Markdown
```

## 目录结构

```text
.
├── astro.config.mjs
├── package.json
├── scripts/
│   ├── sync-private-content.mjs
│   └── sync-wechat.mjs
├── public/
│   ├── article-images/
│   └── images/
├── src/
│   ├── components/
│   │   └── PostCard.astro
│   ├── content/
│   │   └── posts/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   └── posts.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── rss.xml.ts
│   │   ├── blog/
│   │   ├── search/
│   │   └── topics/
│   └── styles/
│       └── global.css
└── dist/
```

## 文章格式

文章放在 `src/content/posts/*.md`。

```yaml
---
title: "文章标题"
description: "用于列表、搜索和 SEO 的短描述"
date: "2026-06-26"
category: "Guide"
series: "Yunbo"
tags:
  - Astro
  - Blog
source: []
draft: false
---
```

字段说明：

- `title`：页面标题、文章卡片标题、RSS 标题、搜索标题。
- `description`：文章卡片、搜索结果、页面元信息、RSS 描述。
- `date`：排序和展示日期。
- `category`：文章大类。
- `series`：专题分组。
- `tags`：文章筛选和搜索关键词。
- `source`：可选来源链接或参考资料。
- `draft`：设为 `true` 后从公开页面隐藏。

图片使用根路径：

```md
![图片说明](/article-images/image-name.png)
```

文章中的第一张 Markdown 或 HTML 图片会作为卡片封面。

## 公开主题 + 私有内容

Yunbo 支持开源主题仓库和私有内容仓库分离。

公开仓库建议结构：

```text
yunbo/
├── src/content/posts/
│   ├── welcome-to-yunbo.md
│   └── private/              # 忽略，部署时生成
├── public/article-images/    # 忽略私有同步图片
└── scripts/
    └── sync-private-content.mjs
```

私有仓库建议结构：

```text
yunbo-content/
├── src/content/posts/
│   └── my-real-post.md
└── public/article-images/
    └── image-name.png
```

同步脚本会把私有文章复制到忽略目录，把图片复制到公共图片根目录，保持 Markdown 图片路径可用：

```text
src/content/posts/private/
public/article-images/
```

本地使用：

```bash
cp .env.example .env
# 编辑 YUNBO_CONTENT_REPO
npm run sync:private
npm run build
```

CI 使用：

```bash
YUNBO_CONTENT_REPO=git@github.com:your-name/yunbo-content.git npm run sync:private
npm run build
```

HTTPS token 地址示例：

```text
https://your-name:TOKEN@github.com/your-name/yunbo-content.git
```

## GitHub Actions

`.github/workflows/build.yml` 会安装依赖、按需同步私有内容，然后执行 `npm run build`。

需要设置：

- Repository secret `YUNBO_CONTENT_REPO`：私有内容仓库地址。
- Repository secret `YUNBO_CONTENT_REF`：分支名，通常是 `main`。
- Repository variable `PUBLIC_SITE_URL`：生产站点 URL。

## Cloudflare Pages

推荐配置：

```text
Framework preset: Astro
Build command: npm run sync:private && npm run build
Build output directory: dist
Root directory: /
Deploy command: 留空
Node.js version: 22
```

环境变量：

```text
PUBLIC_SITE_URL=https://your-domain.com
YUNBO_CONTENT_REPO=https://your-name:<token>@github.com/your-name/yunbo-content.git
YUNBO_CONTENT_REF=main
```

`YUNBO_CONTENT_REPO` 建议使用加密变量。

## 微信/Obsidian 导入

`scripts/sync-wechat.mjs` 可以导入本地 Markdown 和引用图片。

通过环境变量配置路径：

```bash
WECHAT_SOURCE_DIR=/absolute/path/to/wechat-markdown \
WECHAT_ATTACHMENTS_DIRS="/absolute/path/to/attachments:/absolute/path/to/images" \
npm run sync:wechat
```

脚本会把规范化后的文章写入 `src/content/posts/`，把图片复制到 `public/article-images/`。

## 站点配置

通过 `PUBLIC_SITE_URL` 设置生产域名：

```bash
PUBLIC_SITE_URL=https://your-domain.com npm run build
```

常见站点文案位置：

- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/pages/rss.xml.ts`

## 许可证

MIT
