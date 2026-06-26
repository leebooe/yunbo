---
title: "Private Content Workflow"
description: "Use a public theme repository with a private content repository for personal publishing."
date: "2026-06-25"
category: "Guide"
series: "Deployment"
tags:
  - Deployment
  - GitHub
  - Cloudflare
draft: false
---

Yunbo supports a public code repository and a separate private content repository.

Keep the public repository focused on the theme, components, scripts, and documentation. Store personal Markdown files and article images in a private repository with matching paths:

```text
src/content/posts/private/
public/article-images/private/
```

During deployment, set `YUNBO_CONTENT_REPO` and run:

```bash
npm run sync:private
npm run build
```

The sync script clones the private content repository into `.content-private/` and copies the content into the Astro project before build.
