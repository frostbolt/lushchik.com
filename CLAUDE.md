# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server with live reload (http://localhost:8080)
npm run build      # Production build → _site/
npm run debug      # Build with full Eleventy debug output
npm run benchmark  # Build with benchmark timing output
```

## Architecture

This is an [Eleventy](https://www.11ty.dev/) (v3) static site for a personal portfolio/blog. The project uses ES modules (`"type": "module"` in package.json).

### Directory layout

| Path | Purpose |
|---|---|
| `content/` | Eleventy input directory (all pages live here) |
| `_includes/layouts/` | Nunjucks layout templates |
| `_data/` | Global data available to all templates |
| `css/index.css` | Single CSS file, inlined into `<head>` at build time |
| `public/` | Static assets copied as-is to site root |
| `_site/` | Build output (git-ignored) |

### Content collections

Defined in `eleventy.config.js`, three custom collections drive the homepage sections:

- **`blog`** — `content/blog/*.md`, sorted newest-first by date. Each post gets a permalink `/blog/<slug>/` via `content/blog/blog.11tydata.js`.
- **`experience`** — `content/experience/*.md`, sorted by `timeframe.end` desc then `timeframe.start` desc. These entries have `permalink: false` (rendered inline on the homepage only).
- **`sideProjects`** — `content/side-projects/*.md`, sorted by front matter `order` field asc. Also `permalink: false`.

### Front matter schemas

**Experience entries** (`content/experience/*.md`):
```yaml
title: Job Title
company: Company Name
timeframe:
  start: YYYY-MM   # e.g. 2020-04
  end: YYYY-MM     # omit or use 9999-12 for "present"
technologies:
  - TypeScript
```

**Side project entries** (`content/side-projects/*.md`):
```yaml
title: Project Name
description: One-line description shown on the card
github: https://github.com/...   # optional
demo: https://...                 # optional
order: 1                          # controls sort order; lower = first
```

**Blog posts** (`content/blog/*.md`):
```yaml
title: Post Title
date: YYYY-MM-DD
excerpt: Optional override for the auto-generated excerpt  # max 170 chars
```

### Global data

`_data/metadata.js` — site title, description, author name/intro/email, and the sidebar social links array. To add a new social link, add an entry with `label`, `href`, and `icon` (supported icons: `email`, `github`, `instagram`, `linkedin`, `unsplash`).

### Custom filters (eleventy.config.js)

- `displayDate` — formats a JS Date to `"Apr 24, 2026"`
- `displayTimeframe` — formats a `{start, end}` timeframe object to `"Apr 2020 - Mar 2021"` or `"Apr 2020 - present"`
- `excerpt` — strips HTML and truncates to N characters (default 160)

### Layouts

- `layouts/base.njk` — full HTML shell with sidebar (author info + social links) and main content area. CSS is inlined; JS (`public/js/theme-toggle.js`) is deferred.
- `layouts/post.njk` — wraps `layouts/base.njk`, adds back-link nav and `<article>` wrapper for blog posts. Includes post-specific styles inline.

### Theme

Dark/light theme is stored in `localStorage` under `"theme-preference"` and toggled via `data-theme` on `<html>`. The toggle script runs before render to prevent flash.
