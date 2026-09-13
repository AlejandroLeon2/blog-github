# JC1.3 — Pagination: Navegación de Páginas

## Objetivo

Crear el componente que muestra links para navegar entre páginas del listado.

## Archivo a crear

`src/components/molecules/Pagination.astro`

## Qué es esto

Cuando hay más de 6 artículos, se generan varias páginas. Este componente muestra: "← Anterior", números de página, "Siguiente →".

## Puntos de Estudio

**`Page` type de Astro** — Tipo del objeto de paginación. Tiene `currentPage`, `lastPage`, `url.prev`, `url.next`.

**`Array.from({ length: n }, (_, i) => i + 1)`** — Crea un array de números del 1 al n.

## Archivos de referencia

| Archivo | Qué contiene | Para qué lo necesitás |
|---------|-------------|----------------------|
| `astro` | Exporta el tipo `Page` | Para tipar props |

## Pasos

### Paso 1: Definir props

Importá `Page` desde `astro`. El componente recibe un `page` de tipo `Page`.

### Paso 2: Crear función de números de página

Necesitás generar los números que se muestran. Si hay pocas páginas (7 o menos), mostrá todas. Si hay muchas, poné elipsis "..." entre los números que no se muestran.

Pensá en: primera página, ..., página actual-1, página actual, página actual+1, ..., última página.

### Paso 3: Template

Solo se renderiza si `lastPage > 1`. Un `<nav>` centrado con:
- Botón anterior: si `page.url.prev` existe, es un `<a>`. Si no, un `<span>` deshabilitado.
- Números: itera los números generados. Si es "...", muestra elipsis. Si es la página actual, estilo activo. Si no, un link.
- Botón siguiente: mismo patrón que anterior.

Página 1 va a `/blog`, las demás a `/blog/{page}`.

## Criterio de aceptación

- [ ] Si solo hay 1 página, no se muestra nada
- [ ] Página actual con fondo azul
- [ ] Links funcionan
- [ ] Elipsis cuando hay muchas páginas
- [ ] Primera/última: anterior/siguiente deshabilitado

## Commit

```
feat: add pagination component
```
