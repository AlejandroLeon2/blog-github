# Blog Teconológico

Blog estático construido con Astro 7 y Tailwind CSS 4. Artículos sobre desarrollo, despliegue y herramientas para programadores.

## Requisitos

- Node >= 22.12.0
- pnpm

## Inicio rápido

```sh
pnpm install
pnpm dev
```

Abrí `localhost:4321` en el navegador.

## Comandos

| Comando | Acción |
|---------|--------|
| `pnpm install` | Instala dependencias |
| `pnpm dev` | Servidor de desarrollo en `localhost:4321` |
| `pnpm build` | Build de producción en `./dist/` |
| `pnpm preview` | Preview del build local |
| `pnpm astro check` | Type check |

## Estructura del proyecto

```
src/
├── components/
│   ├── atoms/          # Componentes base: Badge, FormattedDate, Footer, Metadata, TagList
│   ├── molecules/      # Componentes compuestos: ArticleHeader, ArticleMeta, Aside, FilterBar, Hero, Pagination, PrevNext
│   └── organisms/      # Componentes complejos: ArticleList, Header
├── content/
│   └── blog/           # Artículos en Markdown
├── layouts/
│   ├── Layout.astro    # Shell HTML base
│   └── PublicLayout.astro  # Layout público con Header y Footer
├── lib/
│   └── routes.ts       # Rutas de navegación
├── pages/
│   ├── index.astro     # Home page
│   └── blog/
│       ├── [...page].astro   # Listado paginado
│       └── [...slug].astro   # Detalle de artículo
├── styles/
│   └── global.css      # Tailwind CSS
└── content.config.ts   # Schema de la colección blog
```

## Arquitectura

- **SSG puro** — todo se resuelve en build time, zero runtime
- **Paginación** — `paginate()` genera páginas estáticas de 6 artículos
- **Filtrado** — client-side en el FilterBar (búsqueda, categoría, tags)
- **Contenido** — Markdown con frontmatter, consultado con `getCollection()`

## Funcionalidades

- Listado de artículos con paginación
- Búsqueda por texto
- Filtrado por categoría y tags
- Artículo detalle con Markdown renderizado
- Navegación prev/next entre artículos
- Sidebar con estadísticas, categorías, tags populares y artículos recientes
- Responsive (mobile y desktop)
- SEO: Open Graph, Twitter cards, canonical URL

## Contenido

Los artículos se encuentran en `src/content/blog/`. Para agregar uno nuevo, creá un archivo `.md` con este frontmatter:

```yaml
---
title: "Título del artículo"
description: "Descripción corta"
pubDate: 2026-01-01
category: "framework"
tags: ["astro", "framework"]
---

Contenido del artículo en Markdown.
```

## Deploy

El build genera archivos estáticos en `./dist/`. Subilo a cualquier hosting estático:

- **Vercel**: conectá el repo y detecta Astro automáticamente
- **Netlify**: configurá build command `pnpm build` y publish directory `dist`
- **GitHub Pages**: usá GitHub Actions con `pnpm build`

## Documentación

- [Astro Docs](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com)
