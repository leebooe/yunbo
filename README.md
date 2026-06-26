# Yunbo

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
- Private content sync for public-code, private-writing workflows.
- Optional WeChat/Obsidian Markdown import script.

## Tech Stack

- Astro
- TypeScript
- Markdown
- `gray-matter`
- `reading-time`
- `@astrojs/sitemap`
- `pagefind`

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL printed by Astro, usually `http://localhost:4321`.

## Commands

```bash
npm run dev           # Start development server
npm run build         # Build Astro site and generate Pagefind index
npm run preview       # Preview production build
npm run sync:private  # Pull private posts/images before build
npm run sync:wechat   # Import local WeChat/Obsidian Markdown
```

## Project Structure

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

## Content Model

Posts live in `src/content/posts/*.md`.

```yaml
---
title: "Article title"
description: "Short listing and SEO description"
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

Field usage:

- `title`: page title, card title, RSS title, search title.
- `description`: cards, search results, metadata, RSS description.
- `date`: sorting and display date.
- `category`: broad content category.
- `series`: topic grouping.
- `tags`: blog filters and search keywords.
- `source`: optional source links or references.
- `draft`: `true` hides the post from public pages.

Images should use root-relative paths:

```md
![Alt text](/article-images/image-name.png)
```

The first image in a post becomes the card cover.

## Public Theme, Private Content

Yunbo supports an open-source theme repository plus a private content repository.

Recommended public repository:

```text
yunbo/
├── src/content/posts/
│   ├── welcome-to-yunbo.md
│   └── private/              # ignored, created during deploy
├── public/article-images/
│   └── private/              # ignored, created during deploy
└── scripts/
    └── sync-private-content.mjs
```

Recommended private repository:

```text
yunbo-content/
├── src/content/posts/
│   └── my-real-post.md
└── public/article-images/
    └── image-name.png
```

The sync script copies private repository content into ignored paths:

```text
src/content/posts/private/
public/article-images/private/
```

Local usage:

```bash
cp .env.example .env
# edit YUNBO_CONTENT_REPO
npm run sync:private
npm run build
```

CI usage:

```bash
YUNBO_CONTENT_REPO=git@github.com:your-name/yunbo-content.git npm run sync:private
npm run build
```

For HTTPS tokens, use a secret-backed URL:

```text
https://x-access-token:TOKEN@github.com/your-name/yunbo-content.git
```

## GitHub Actions

`.github/workflows/build.yml` installs dependencies, optionally syncs private content through `YUNBO_CONTENT_REPO`, and runs `npm run build`.

Set these values in GitHub:

- Repository secret `YUNBO_CONTENT_REPO`: private content repository URL.
- Repository secret `YUNBO_CONTENT_REF`: branch name, usually `main`.
- Repository variable `PUBLIC_SITE_URL`: production site URL.

## Cloudflare Pages

Use these settings:

```text
Build command: npm run sync:private && npm run build
Build output directory: dist
Node.js version: 22
```

Set Cloudflare environment variables:

```text
PUBLIC_SITE_URL=https://your-domain.com
YUNBO_CONTENT_REPO=https://x-access-token:<token>@github.com/your-name/yunbo-content.git
YUNBO_CONTENT_REF=main
```

## WeChat/Obsidian Import

`scripts/sync-wechat.mjs` imports local Markdown and referenced images.

Configure paths through environment variables:

```bash
WECHAT_SOURCE_DIR=/absolute/path/to/wechat-markdown \
WECHAT_ATTACHMENTS_DIRS="/absolute/path/to/attachments:/absolute/path/to/images" \
npm run sync:wechat
```

The script writes normalized posts to `src/content/posts/` and copied images to `public/article-images/`.

## Configuration

Set the production URL through `PUBLIC_SITE_URL`:

```bash
PUBLIC_SITE_URL=https://your-domain.com npm run build
```

Update visible site copy in:

- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/pages/rss.xml.ts`

## License

MIT
