# J2 — Página de Lista Paginada

## Objetivo

Crear la página principal del blog que muestra los artículos divididos en páginas de 6. Es la página a la que se llega cuando se hace click en "Blog" del menú.

## Archivo a crear

`src/pages/blog/[...page].astro`

## Qué es esto

El `[...page]` captura el número de página. `/blog/` es página 1, `/blog/2/` es página 2. Usás `paginate()` de Astro para dividir el array de artículos en páginas.

## Puntos de Estudio

**`paginate()`** — Recibe un array de datos y un objeto con `pageSize`. Retorná un array de rutas, cada una con un objeto `page` en las props. Ese objeto `page` tiene: `page.data` (artículos de esta página), `page.currentPage`, `page.lastPage`, `page.url.prev`, `page.url.next`.

**`PaginateFunction`** — Es el tipo que se importa desde `astro` para tipar el parámetro `paginate` en `getStaticPaths`.

## Archivos de referencia

| Archivo | Qué contiene | Para qué lo necesitás |
|---------|-------------|----------------------|
| `src/content.config.ts` | Schema de blog | Para mapear los campos |
| `src/layouts/PublicLayout.astro` | Layout con Header/Footer | Wrapper |
| `src/components/organisms/ArticleList.astro` | Lista de artículos con data attributes | Para mostrar artículos |
| `src/components/molecules/FilterBar.astro` | Filtros — **lo crea Jhoel** | Arriba del listado |
| `src/components/molecules/Pagination.astro` | Paginación — **lo crea Jhoel** | Abajo del listado |
| `src/components/molecules/Aside.astro` | Sidebar — **lo crea Robert** | Al lado |

## Pasos

### Paso 1: Crear el archivo e imports

Creá el archivo con los imports necesarios. Acordate de importar `PaginateFunction` desde `astro`.

### Paso 2: Exportar getStaticPaths con paginate

La función recibe `paginate` como parámetro. Dentro:
1. Traé los artículos con `getCollection`
2. Ordenalos por fecha descendente
3. Mapéalos a un formato simple (slug, title, date, tags, category, description)
4. Retorná `paginate(articles, { pageSize: 6 })`

### Paso 3: Extraer props

Sacá `page` de `Astro.props`. Creá una variable `allArticles` con `page.data`.

### Paso 4: Crear el template

Layout flex con sidebar: contenido principal a la izquierda (FilterBar, ArticleList, Pagination) y Aside a la derecha. El título incluye el número de página si no es la primera.

### Paso 5: Verificar

Corrí `pnpm build`. Si falta algún componente, creá una versión vacía temporal para que compile.

## Criterio de aceptación

- [ ] `/blog` muestra artículos
- [ ] Máximo 6 por página
- [ ] FilterBar arriba, Aside al lado, Pagination abajo
- [ ] No hay errores de build

## Commit

```
feat: add paginated blog list page
```
