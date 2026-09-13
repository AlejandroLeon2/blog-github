# J1 — Página de Detalle de Artículo

## Objetivo

Crear la página que muestra un artículo completo. Cuando el usuario hace click en "por-que-astro" del listado, esta página se encarga de mostrar todo ese contenido.

## Archivo a crear

`src/pages/blog/[...slug].astro`

## Qué es esto

El `[...slug]` en el nombre del archivo es una ruta dinámica. Significa: "Astro, captura lo que venga después de `/blog/` en la URL y pasámelo como parámetro". Si el usuario navega a `/blog/por-que-astro`, el parámetro `slug` vale `"por-que-astro"`.

## Puntos de Estudio

**`getCollection("blog")`** — Trae todos los artículos Markdown de la carpeta de contenido. Cada artículo tiene un `id` (el nombre del archivo sin .md) y `data` (el frontmatter parseado: title, description, pubDate, tags, category).

**`getStaticPaths()`** — Es una función que le dice a Astro: "estas son todas las rutas que tenés que generar". Por cada artículo, creás una ruta. Retornás un array de objetos con `params` (la URL) y `props` (los datos).

**`render(post)`** — Convierte un entry de la collection en un componente renderizable. Retornás `Content` y lo usás en el template como `<Content />`.

## Archivos de referencia

| Archivo | Qué contiene | Para qué lo necesitás |
|---------|-------------|----------------------|
| `src/content.config.ts` | Schema de la colección — define qué campos tiene cada artículo | Para saber qué campos podés usar (title, description, pubDate, tags, category) |
| `src/layouts/PublicLayout.astro` | Layout con Header y Footer | Para envolver tu página y que tenga navegación |
| `src/components/molecules/ArticleHeader.astro` | Componente que muestra título, fecha y tags | Para el encabezado del artículo |

## Pasos

### Paso 1: Crear el archivo

Creá `src/pages/blog/[...slug].astro` con los imports necesarios (getCollection, render, PublicLayout, ArticleHeader).

### Paso 2: Exportar getStaticPaths

Pensá en esto: ¿cómo le decís a Astro qué páginas crear? Necesitás una función que itere todos los artículos y retorne un array. Cada elemento del array tiene `params` con el slug y `props` con el artículo.

El `id` del post es el nombre del archivo Markdown sin extensión. Eso es lo que va en `params.slug`.

### Paso 3: Extraer props y renderizar

Después de los `---`, sacá el artículo de `Astro.props` y llamá a `render` para obtener el componente `Content`.

### Paso 4: Crear el template

Usá `PublicLayout` como wrapper. Dentro, un `<article>` con clases de prosa de Tailwind. Renderizá `ArticleHeader` pasándole los datos del artículo, y después `<Content />` para el Markdown.

### Paso 5: Verificar

Corrí `pnpm build` y navegá a `/blog/por-que-astro`. Deberías ver el artículo completo.

## Criterio de aceptación

- [ ] `/blog/por-que-astro` muestra el artículo completo
- [ ] Se muestra título, fecha y tags
- [ ] El contenido Markdown se ve bien
- [ ] La página tiene Header y Footer

## Commit

```
feat: add article detail page with dynamic routing
```
