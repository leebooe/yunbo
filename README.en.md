# Yunbo

[简体中文](./README.md)

![Node.js >= 22](https://img.shields.io/badge/Node.js-%3E%3D%2022-339933?logo=node.js&logoColor=white)
![pnpm 11.9.0](https://img.shields.io/badge/pnpm-11.9.0-F69220?logo=pnpm&logoColor=white)
![Astro 7.0.2](https://img.shields.io/badge/Astro-7.0.2-BC52EE?logo=astro&logoColor=white)
![TypeScript 6.0.3](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white)

Yunbo is a quiet Astro blog theme for thoughtful writing. It includes Markdown posts, topic archives, client-side search, RSS, sitemap generation, theme switching, and Pagefind indexing for static deployment.

The name comes from cloud and harbor imagery: ideas gather like clouds, then come to rest as published writing.

## Features

- Astro static site with TypeScript.
- Markdown content from `src/content/posts/**/*.md`.
- Topic pages generated from each post's `series`.
- Blog index with series filter, tag filter, and sorting.
- Article pages with reading time, tags, table of contents, copyable code blocks, and collapsed long code blocks.
- Local search page plus Pagefind assets generated during build.
- RSS endpoint at `/rss.xml`.
- Sitemap through `@astrojs/sitemap`.
- Optional WeChat/Obsidian Markdown import script.

## Requirements

- Node.js >= 22
- pnpm 11.9.0
- Astro 7.0.2
- TypeScript 6.0.3

The project also keeps `package-lock.json`, so npm works for install and build. Cloudflare Pages should use Node.js 22.

## Quick Start

```bash
npm install
npm run dev
```

Astro usually prints this local URL:

```text
http://localhost:4321
```

## Commands

```bash
npm run dev           # Start development server
npm run dev:expressive # Start development server with Expressive Code
npm run build         # Build Astro site and generate Pagefind index
npm run build:expressive # Build Astro site with Expressive Code
npm run preview       # Preview production build
npm run sync:wechat   # Import local WeChat/Obsidian Markdown
```

## Content

Yunbo uses a single public repository by default. Put posts, images, and theme code in the same repository.

Recommended structure:

```text
yunbo/
├── src/content/posts/
│   └── my-real-post.md
└── public/article-images/
    └── image-name.png
```

Add a new post:

```bash
cp src/content/posts/welcome-to-yunbo.md src/content/posts/my-new-post.md
```

## Cloudflare Pages

Recommended settings:

```text
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Root directory: /
Deploy command: empty
Node.js version: 22
```

Environment variables:

```text
PUBLIC_SITE_URL=https://your-domain.com
```

## License

MIT
