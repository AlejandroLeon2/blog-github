# Guía de Estructura del Proyecto

## Vista general

El proyecto sigue el patrón de **Atomic Design** para organizar los componentes. Esto significa que los componentes se ordenan por complejidad, no por función.

```
src/
├── components/    ← dónde vivén los componentes
├── content/       ← dónde vivén los artículos Markdown
├── layouts/       ← cómo se estructuran las páginas
├── lib/           ← utilidades compartidas
├── pages/         ← rutas de la aplicación
├── styles/        ← estilos globales
├── types/         ← tipos TypeScript
└── utils/         ← funciones helper
```

---

## Carpetas de componentes

### `components/atoms/`

**Qué son:** Los componentes más pequeños y básicos. No dependen de otros componentes del proyecto. Son como las "piezas LEGO" más simples.

**Regla para crear uno:** Si el componente no usa ninguno otro del proyecto, va acá.

**Ejemplos:**
- `Badge.astro` — badge de colores para mostrar estados o conteos
- `FormattedDate.astro` — formatea una fecha a formato español
- `Footer.astro` — footer simple con copyright
- `Metadata.astro` — meta tags del `<head>` (SEO, Open Graph)
- `TagList.astro` — lista de tags como badges
- `ReadingTime.astro` — calcula tiempo de lectura

**Qué NO va acá:** Componentes que usen otros componentes del proyecto, o que tengan lógica compleja.

---

### `components/molecules/**

**Qué son:** Componentes que combinan 2 o más atoms. Tienen más lógica y son más específicos.

**Regla para crear uno:** Si el componente usa al menos un atom, va acá.

**Ejemplos:**
- `ArticleMeta.astro` — card de artículo (usa FormattedDate + TagList)
- `ArticleHeader.astro` — encabezado de artículo (usa FormattedDate + TagList)
- `Aside.astro` — sidebar con estadísticas (usa Badge + FormattedDate)
- `Hero.astro` — sección hero con título y CTA
- `FilterBar.astro` — barra de búsqueda y filtros (tiene script cliente)
- `Pagination.astro` — navegación entre páginas
- `PrevNext.astro` — links a artículo anterior/siguiente

---

### `components/organisms/`

**Qué son:** Componentes complejos que combinan molecules y atoms. Son secciones completas de la página.

**Regla para crear uno:** Si el componente combina varios molecules o tiene lógica de layout compleja, va acá.

**Ejemplos:**
- `Header.astro` — barra de navegación completa con links activos
- `ArticleList.astro` — lista de artículos con data attributes para filtrado

---

### `components/admin/`

**Qué son:** Componentes del panel de administración con TinaCMS. **No se usan en el blog público.**

**Regla:** Ignorar esta carpeta para el blog.

---

## `content/`

**Qué es:** Donde viven los artículos del blog en formato Markdown.

**Estructura:**
```
content/
└── blog/
    ├── por-que-astro.md
    ├── vercel-deploy.md
    ├── netlify-vs-vercel.md
    └── github-actions-ci-cd.md
```

**Frontmatter de cada artículo:**
```yaml
---
title: "Título del artículo"        # requerido
description: "Descripción corta"     # requerido
pubDate: 2026-09-07                  # requerido (se coerce a string)
heroImage: "/images/astro.webp"      # opcional
category: "framework"                # requerido (default: "general")
tags: ["astro", "framework"]         # opcional
---
```

**Cómo se accede:** Con `getCollection("blog")` desde el frontmatter de las páginas. Retorna un array de entries con `id` (nombre del archivo sin .md) y `data` (frontmatter parseado).

**Schema:** Se define en `src/content.config.ts` con Zod.

---

## `layouts/`

**Qué son:** Componentes que envuelven páginas completas. Definen la estructura HTML base.

**Jerarquía:**
```
Layout.astro          ← Shell HTML base (html, head, body)
└── PublicLayout.astro  ← Layout público (Header + contenido + Footer)
    └── AdminLayout.astro  ← Layout del admin (no se usa en el blog)
```

**`Layout.astro`:**
- Crea el `<!doctype html>`, `<html>`, `<head>`, `<body>`
- Incluye `Metadata.astro` para SEO
- Importa estilos globales
- Recibe: `title`, `description`

**`PublicLayout.astro`:**
- Usa `Layout.astro` como wrapper
- Agrega `Header.astro` con navegación
- Contenedor principal con `max-w-6xl mx-auto px-4 py-8`
- Agrega `Footer.astro`
- Recibe: `title`, `description`

---

## `lib/`

**Qué es:** Utilidades compartidas que no son componentes.

**Archivos:**
- `routes.ts` — array de rutas de navegación para el Header. Cada ruta tiene `label` y `href`.

---

## `pages/`

**Qué es:** El routing basado en archivos. Cada archivo se convierte en una ruta.

**Estructura:**
```
pages/
├── index.astro              ← /
├── blog/
│   ├── [...page].astro      ← /blog, /blog/2, /blog/3...
│   └── [...slug].astro      ← /blog/por-que-astro, /blog/vercel-deploy...
└── admin/
    └── (admin pages)        ← no se usa en el blog
```

**Rutas dinámicas:**
- `[...slug].astro` — captura un segmento de URL. El valor llega como `Astro.params.slug`. Se usa para artículos individuales.
- `[...page].astro` — captura el número de página. Usa `paginate()` para dividir artículos. Se usa para el listado.

**`getStaticPaths()`:** Función que define qué rutas dinámicas generar. Retorna un array de objetos con `params` (URL) y `props` (datos).

---

## `styles/`

**Qué es:** Estilos globales del proyecto.

**`global.css`:**
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

- Importa Tailwind CSS 4
- Activa el plugin de typography para estilizar Markdown renderizado

---

## Flujo de datos

```
src/content/blog/*.md
        │
        ▼
getCollection("blog")    ← consulta en frontmatter
        │
        ▼
pages/*.astro            ← ordena, filtra, pagina
        │
        ▼
components/*.astro       ← renderiza con props
        │
        ▼
dist/*.html              ← archivos estáticos finales
```

1. Los artículos Markdown se leen de `content/blog/`
2. Las páginas los consultan con `getCollection()` en el frontmatter
3. Los ordenan, filtran y pasan como props a componentes
4. Los componentes los renderizan como HTML
5. Astro genera archivos estáticos en `dist/`

---

## Convenciones de naming

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Archivo de componente | PascalCase + `.astro` | `ArticleMeta.astro` |
| Archivo de página | kebab-case + `.astro` | `[...slug].astro` |
| Archivo de utilidad | kebab-case + `.ts` | `routes.ts` |
| CSS | kebab-case + `.css` | `global.css` |
| Interface de props | `Props` | `interface Props { articles: Article[] }` |
| Interface de modelo | nombre del modelo | `interface Article { slug: string; ... }` |

---

## Dependencias entre carpetas

```
pages/ ──────► layouts/ ──────► components/atoms/
   │              │
   │              └────────────► components/organisms/
   │
   ├──────────────────────────► components/molecules/
   │
   └──────────────────────────► content/
                                    │
                                    └──► content.config.ts
```

- `pages/` importa `layouts/`, `components/`, y `content/`
- `layouts/` importa `components/organisms/Header` y `components/atoms/Footer`
- `components/molecules/` importa `components/atoms/`
- `components/organisms/` importa `components/molecules/`
- Nadie importa `pages/`

---

## Data attributes (para filtrado)

El FilterBar se comunica con el ArticleList a través de atributos `data-*` en el HTML:

| Atributo | Ubicación | Propósito |
|----------|-----------|-----------|
| `data-article-list` | En el contenedor de artículos | FilterBar busca este elemento |
| `data-article` | En cada card de artículo | FilterBar itera estos elementos |
| `data-title` | En cada card | Texto para buscar |
| `data-description` | En cada card | Texto para buscar |
| `data-category` | En cada card | Filtrar por categoría |
| `data-tags` | En cada card | Filtrar por tags (separados por coma) |
| `data-filter` | En botones de filtro | Identifica si es "category" o "tag" |
| `data-value` | En botones de filtro | El valor del filtro |

Esto permite que el script cliente filtre artículos sin recargar la página.
