# JC2 — Integrar FilterBar y Pagination

## Objetivo

Actualizar la página de lista paginada (creada por Juan) para que incluya FilterBar y Pagination.

## Archivo a modificar

`src/pages/blog/[...page].astro` — **lo crea Juan en J2**

## Qué es esto

Tarea de integración — no creás archivos nuevos, solo modificás uno existente.

## Archivos de referencia

| Archivo | Qué contiene | Para qué lo necesitás |
|---------|-------------|----------------------|
| `src/pages/blog/[...page].astro` | Página paginada — **la crea Juan** | Archivo a modificar |
| `src/components/molecules/FilterBar.astro` | Filtros — lo creaste en JC1 | Se agrega |
| `src/components/molecules/Pagination.astro` | Paginación — lo creaste en JC1 | Se agrega |

## Pasos

### Paso 1: Verificar que exista el archivo

Si `src/pages/blog/[...page].astro` no existe, esperá a que Juan lo cree.

### Paso 2: Agregar imports de FilterBar y Pagination

### Paso 3: Modificar el template

En el contenedor del contenido principal, el orden debe ser: FilterBar primero, ArticleList al medio, Pagination al final.

### Paso 4: Verificar

Corrí build, entrá a `/blog`, y probá que los filtros y la paginación funcionen.

## Criterio de aceptación

- [ ] FilterBar arriba del listado
- [ ] Pagination abajo del listado
- [ ] Filtros funcionan
- [ ] Paginación funciona
- [ ] No hay errores de build

## Commit

```
feat: integrate filter bar and pagination into blog list page
```
