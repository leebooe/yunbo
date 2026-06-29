# Yunbo Agents Guide

This file is the operating guide for AI agents and developers working in this repository.

## Project Snapshot

- Framework: Astro static site.
- Language: TypeScript, Astro components, Markdown posts.
- Content source: `src/content/posts/**/*.md`.
- Public media: `public/article-images/` and `public/images/`.
- Styling: single global stylesheet at `src/styles/global.css`.
- Search: custom client-side search page plus Pagefind assets generated during build.
- Feeds: `/rss.xml` route plus sitemap integration.

## Architecture Map

```text
.
├── astro.config.mjs
├── package.json
├── scripts/
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

## Core Data Flow

1. Markdown files in `src/content/posts/` are loaded by `import.meta.glob` in `src/lib/posts.ts`.
2. `getAllPosts()` normalizes title, date, category, series, tags, draft state, reading time, description, and first image.
3. Page routes call `getAllPosts()` and `getTopics()` to render home, blog, topics, article pages, search data, RSS, and sitemap.
4. `npm run build` creates `dist/` through Astro, then runs Pagefind against `dist/`.

## Commands

- `npm install`: install dependencies.
- `npm run dev`: start local Astro dev server.
- `npm run build`: build the static site and generate Pagefind search assets.
- `npm run preview`: preview the generated site.
- `npm run sync:wechat`: import Markdown from configured local WeChat/Obsidian folders.

## Content Rules

Markdown posts live in `src/content/posts/` and use this frontmatter shape:

```yaml
---
title: "Article title"
description: "Short search and listing description"
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

- `title` drives page titles, cards, RSS, and search.
- `description` appears in cards, search results, article metadata, and RSS.
- `date` sorts articles. Invalid or missing dates fall back to `2026-01-01`.
- `series` powers topic pages.
- `tags` power filters and search facets. Use 3 to 6 focused tags.
- `draft: true` hides a post from public routes.
- Article images should use root-relative paths such as `/article-images/image-name.png`.
- The first Markdown or HTML image becomes the card cover.

## Code Rules

- Keep post metadata logic in `src/lib/posts.ts`.
- Keep shared layout changes in `src/layouts/BaseLayout.astro`.
- Keep repeated article list UI in `src/components/PostCard.astro`.
- Keep page-specific browser scripts inside the owning `.astro` page.
- Preserve the TypeScript path alias `@/*` for `src/*`.
- Keep global design tokens in `:root` inside `src/styles/global.css`.
- Use CSS variables already defined in `global.css` before adding new colors.
- Use root-relative public asset URLs: `/images/...` and `/article-images/...`.
- Run `npm run build` after changing routes, post loading, content metadata, or search behavior.

## Agent Routing

Use the smallest agent scope that can complete the task.

### Project Steward Agent

Owns repository orientation, documentation, scripts, build commands, and release readiness.

Use this agent for:

- Updating `README.md`, `AGENTS.md`, or setup docs.
- Changing npm scripts or build behavior.
- Checking build output and deployment readiness.
- Coordinating cross-file changes.

### Content Agent

Owns Markdown posts, frontmatter quality, tags, series, image references, and sync behavior.

Use this agent for:

- Adding, editing, or bulk-normalizing posts.
- Fixing `description`, `date`, `series`, `tags`, `draft`, or `source`.
- Updating `scripts/sync-wechat.mjs`.
- Auditing missing article images.

### Frontend Agent

Owns Astro pages, components, navigation, responsive layout, theme behavior, and article reading UX.

Use this agent for:

- Updating pages in `src/pages/`.
- Updating `BaseLayout.astro` or `PostCard.astro`.
- Editing `src/styles/global.css`.
- Improving filters, sorting, theme switching, article TOC, and code blocks.

### Search And Feed Agent

Owns search, RSS, sitemap, and generated indexing behavior.

Use this agent for:

- Updating `src/pages/search/index.astro`.
- Updating `src/pages/rss.xml.ts`.
- Adjusting Pagefind build assumptions.
- Verifying search content coverage after content or route changes.

## Review Checklist

- `npm run build` succeeds.
- New posts appear in `/blog/`, topic pages, `/search/`, and `/rss.xml`.
- Topic slugs work with Chinese and English names.
- Card cover images load from `public/`.
- Mobile and desktop layouts remain readable.
- Generated folders `dist/`, `.astro/`, and `node_modules/` stay treated as build artifacts.

## Deployment Notes

- Set `PUBLIC_SITE_URL` to the production domain.
