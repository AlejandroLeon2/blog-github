# Blog Teconológico — Specification (from scratch, no admin)

## Scope

Rebuild this Astro blog from zero. **Exclude** all admin/TinaCMS components and pages.

---

## 1. Project Configuration

| File | Purpose |
| ------ | --------- |
| `package.json` | Astro 7, Tailwind CSS 4, `@tailwindcss/typography` |
| `astro.config.mjs` | Tailwind vite plugin |
| `tsconfig.json` | Astro strict config |
| `src/content.config.ts` | Blog collection schema |

### Content Collection Schema (`blog`)

```ts
{
  title: string (required)
  description: string (required)
  pubDate: string (coerced)
  updatedDate?: string
  heroImage?: string
  category: string (default: "general")
  tags?: string[]
}
```

---

## 2. Styles

| File | Purpose |
|------|---------|
| `src/styles/global.css` | Tailwind import + typography plugin |

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

---

## 3. Shared Utilities

| File | Purpose |
|------|---------|
| `src/lib/routes.ts` | Navigation routes array (Inicio, Blog) |

**Note:** Remove the Admin route from the array.

---

## 4. Components — Atoms

| Component | Props | Purpose |
| ----------- | ------- | --------- |
| `Metadata.astro` | `title`, `description?`, `image?` | `<head>` meta tags, Open Graph, Twitter cards |
| `FormattedDate.astro` | `date: string \| Date`, `class?` | Formats date to `es-AR` locale |
| `TagList.astro` | `tags: string[]`, `class?`, `variant?: "default" \| "interactive"`, `href?` | Renders tags as badges; interactive variant links to `/blog?tag=...` |
| `Badge.astro` | `variant?: "default" \| "success" \| "error" \| "info"`, `class?` | Small colored badge (used in Aside stats) |
| `Footer.astro` | _(none)_ | Simple footer with copyright year |
| `ReadingTime.astro` | `content: string`, `wordsPerMinute?` | Calculates and displays estimated reading time |

### Atoms to EXCLUDE (admin-only)

- `FormField.astro`
- `Input.astro`
- `Select.astro`
- `Textarea.astro`
- `Button.astro`
- `Container.astro`

---

## 5. Components — Molecules

| Component | Props | Purpose |
| ----------- | ------- | --------- |
| `Hero.astro` | `title`, `description`, `ctaText?`, `ctaHref?` | Landing hero section with CTA button |
| `ArticleMeta.astro` | `slug`, `title`, `date`, `tags?`, `category?`, `description?` | Card for article list (title, description, date, category link, tag links) |
| `ArticleHeader.astro` | `title`, `date`, `tags?` | Header inside article detail page |
| `Aside.astro` | `articles: Article[]` | Sidebar: stats (count articles/categories/tags), category list, top tags, recent articles |
| `FilterBar.astro` | `articles: Article[]` | Search input + category buttons + tag buttons + client-side filtering script |
| `Pagination.astro` | `page: Page` (Astro's `Page` type) | Previous/next links + numbered page links with ellipsis |
| `PrevNext.astro` | `prev?: { slug, title } \| null`, `next?: { slug, title } \| null` | Navigation between articles in detail view |

### Molecule to EXCLUDE (admin-only)

- `ShareButtons.astro` — **Evaluate:** currently not used in any public page. Can be excluded or kept as optional.

---

## 6. Components — Organisms

| Component | Props | Purpose |
|-----------|-------|---------|
| `Header.astro` | `currentPath?: string` | Sticky nav bar with routes from `lib/routes.ts`, active state highlight |
| `ArticleList.astro` | `articles: Article[]` | Renders article cards inside `data-article-list` container with `data-article` attributes for FilterBar |

---

## 7. Layouts

| Layout | Props | Purpose |
|--------|-------|---------|
| `Layout.astro` | `title?`, `description?` | Base HTML shell: `<html>`, `<head>` with Metadata, `<body>` |
| `PublicLayout.astro` | `title?`, `description?` | Wraps Layout + Header + main content container + Footer |

### Layout to EXCLUDE

- `AdminLayout.astro`

---

## 8. Pages

| Page | Route | Purpose |
| ------ | ------- | --------- |
| `index.astro` | `/` | Home page with Hero component |
| `[...page].astro` | `/blog`, `/blog/2`, ... | Paginated article list with FilterBar, ArticleList, Pagination, Aside |
| `[...slug].astro` | `/blog/{slug}` | Individual article detail with ArticleHeader, rendered Markdown content, PrevNext navigation |

### Pages to EXCLUDE

- `admin/` (entire directory)

---

## 9. Sample Content (4 Markdown files)

| File | Title | Category | Tags |
| ------ | ------- | ---------- | ------ |
| `por-que-astro.md` | Tu primer blog con Astro | framework | astro, framework, inicio |
| `vercel-deploy.md` | Guía completa: desplegar tu blog en Vercel | deploy | vercel, astro, deploy, hosting |
| `netlify-vs-vercel.md` | Netlify vs Vercel | deploy | netlify, vercel, hosting, comparativa |
| `github-actions-ci-cd.md` | CI/CD con GitHub Actions | devops | github-actions, ci-cd, automatización |

---

## 10. Implementation Order

### Phase 1 — Foundation

1. Initialize Astro project (`pnpm create astro@latest`)
2. Install dependencies: `tailwindcss`, `@tailwindcss/typography`, `@tailwindcss/vite`
3. Configure `astro.config.mjs` with Tailwind vite plugin
4. Create `src/styles/global.css`
5. Create `src/content.config.ts` with blog schema
6. Create `src/lib/routes.ts` (without Admin)

### Phase 2 — Atoms

7. `Metadata.astro`
2. `FormattedDate.astro`
3. `TagList.astro`
4. `Badge.astro`
5. `Footer.astro`
6. `ReadingTime.astro`

### Phase 3 — Layouts
 1. `Layout.astro` (base HTML shell)
 2. `PublicLayout.astro` (Layout + Header + Footer)

### Phase 4 — Molecules + Organisms
 1. `Header.astro`
 2. `Hero.astro`
 3. `ArticleMeta.astro`
 4. `ArticleHeader.astro`
 5. `ArticleList.astro`
 6. `Aside.astro`
 7. `PrevNext.astro`

### Phase 5 — Pages
 1. `src/pages/index.astro` (home with Hero)
 2. `src/pages/blog/[...slug].astro` (article detail)
 3. `src/pages/blog/[...page].astro` (paginated list)

### Phase 6 — Interactive Features
 1. `FilterBar.astro` (search + category/tag filters + client-side script)
 2. `Pagination.astro` (page navigation links)

### Phase 7 — Content
 1. Create 4 sample Markdown files in `src/content/blog/`

### Phase 8 — Verify
 1. `pnpm build` — verify all pages generate
 2. `pnpm astro check` — zero type errors
 3. Manual test: navigation, filtering, pagination, article detail

---

## 11. Architecture Decisions

- **SSG only** — everything resolved at build time, zero server runtime
- **Pagination** via `paginate()` in `getStaticPaths` — generates static pages
- **Filtering** is client-side only (FilterBar script) — filters within current page's articles
- **Aside** shows stats for the current page's articles (not global)
- **No JavaScript** except FilterBar's client-side filtering script
- **Tailwind CSS 4** with `@tailwindcss/typography` for prose styling

---

## 12. File Count (excluding admin)

| Layer | Count |
| ------- | ------- |
| Config files | 4 |
| Styles | 1 |
| Lib | 1 |
| Atoms | 6 |
| Molecules | 7 |
| Organisms | 2 |
| Layouts | 2 |
| Pages | 3 |
| Content | 4 |
| **Total** | **30 files** |
