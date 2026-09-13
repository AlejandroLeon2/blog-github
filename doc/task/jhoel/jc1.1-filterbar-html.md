# JC1.1 — FilterBar: Estructura HTML

## Objetivo

Crear la parte visual del componente de filtros: input de búsqueda, botones de categoría y tags. Sin JavaScript todavía.

## Archivo a crear

`src/components/molecules/FilterBar.astro`

## Qué es esto

La barra que aparece arriba del listado. Tiene un input para buscar, botones para filtrar por categoría, y botones para filtrar por tags. Todo es HTML estático por ahora.

## Puntos de Estudio

**Frontmatter** — El código entre `---` se ejecuta en el servidor. Ahí procesás datos y preparás lo que se va a mostrar.

**`new Set()`** — Como un array sin duplicados. Si tenés `["astro", "deploy", "astro"]`, queda `{"astro", "deploy"}`.

**`.flatMap()`** — Como `.map()` pero aplanma los resultados. Si cada artículo tiene tags, `.flatMap(a => a.tags)` junta todos los tags en un solo array.

**`.filter(Boolean)`** — Elimina valores vacíos (undefined, null, "") de un array.

## Archivos de referencia

| Archivo | Qué contiene | Para qué lo necesitás |
|---------|-------------|----------------------|
| `src/content.config.ts` | Schema de blog — category y tags | Para saber qué campos extraer |

## Pasos

### Paso 1: Definir props

El componente recibe un array de artículos.

### Paso 2: Extraer categorías y tags únicos

Necesitás obtener las categorías únicas de todos los artículos y los tags únicos. Pensá en usar `Set` para eliminar duplicados y `flatMap` para aplanar los arrays de tags.

### Paso 3: Template — Input de búsqueda

Un `<div>` contenedor. Dentro, un `<div>` relativo con un `<input type="search">` y un ícono SVG de lupa posicionado absolutamente a la izquierda.

El input necesita un `id` para que el script lo pueda encontrar después.

### Paso 4: Botones de categoría

Solo si hay categorías. Un botón "Todos" que empieza activo (fondo azul, texto blanco). Después un botón por cada categoría con fondo gris.

Cada botón necesita `data-filter="category"` y `data-value={nombre}` para que el script los identifique.

### Paso 5: Botones de tags

Mismo patrón que categorías pero con `data-filter="tag"`.

### Paso 6: Resumen de filtros activos

Un `<div>` oculto con `class="hidden"` que el script va a mostrar después.

## Criterio de aceptación

- [ ] Input de búsqueda visible con ícono
- [ ] Botones de categoría con "Todos" activo
- [ ] Botones de tags visibles
- [ ] Compila sin errores

## Commit

```
feat: add filter bar HTML structure
```
