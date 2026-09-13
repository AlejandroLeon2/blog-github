# JR1 — Home Page + Componente Aside

## Objetivo

Crear la página de inicio (la que se ve al entrar a `/`) y el componente de sidebar que muestra resumen del blog.

## Archivos a crear

1. `src/pages/index.astro`
2. `src/components/molecules/Aside.astro`

## Puntos de Estudio

**Componentes Astro** — Tienen dos partes: el frontmatter (lógica en JavaScript) y el template (HTML). Las props se reciben con `Astro.props`.

**`<slot />`** — Espacio donde se inyecta el contenido hijo de un componente. Útil para wrappers.

**`Map`** — Estructura de datos clave-valor. Se usa para contar: `map.set("deploy", 2)` significa que hay 2 artículos de deploy.

**`new Set(array)`** — Elimina duplicados de un array.

## Tarea JR1.1 — Aside.astro

### Qué es

El sidebar que muestra: cuántos artículos hay, cuántas categorías, tags más populares, y los 4 artículos recientes.

### Archivo a crear

`src/components/molecules/Aside.astro`

### Archivos de referencia

| Archivo | Qué contiene | Para qué lo necesitás |
|---------|-------------|----------------------|
| `src/components/atoms/Badge.astro` | Badge de colores | Para mostrar conteos |
| `src/components/atoms/FormattedDate.astro` | Formatea fechas a español | Para fechas de recientes |

### Pasos

#### Paso 1: Definir props

El componente recibe un array de artículos. Cada uno tiene slug, title, date, tags, category, description.

#### Paso 2: Importar Badge y FormattedDate

#### Paso 3: Calcular estadísticas

Necesitás contar cuántas veces aparece cada categoría y cada tag. Pensá en usar un Map donde la clave es el nombre y el valor es la cantidad. Después ordená por cantidad descendente.

Para los tags, necesitás "aplanar" los arrays de tags de cada artículo en un solo array. ¿Qué método de array hace eso?

#### Paso 4: Crear el template

El sidebar tiene 4 secciones:
1. Stats grid — 3 columnas con números
2. Categorías — lista con nombre y badge de cantidad
3. Tags populares — badges con tag y cantidad
4. Recientes — links a los 4 artículos más recientes

#### Paso 5: Verificar

Corrí `pnpm build` y revisá que compile.

---

## Tarea JR1.2 — index.astro

### Qué es

La home page. Es la más simple — solo muestra un hero.

### Archivo a crear

`src/pages/index.astro`

### Archivos de referencia

| Archivo | Qué contiene | Para qué lo necesitás |
|---------|-------------|----------------------|
| `src/layouts/PublicLayout.astro` | Layout con Header/Footer | Wrapper |
| `src/components/molecules/Hero.astro` | Hero con título, descripción y CTA | Componente principal |

### Pasos

#### Paso 1: Imports

Importá PublicLayout y Hero.

#### Paso 2: Template

Un PublicLayout que envuelve un Hero con título "Blog Teconológico" y una descripción.

## Criterio de aceptación

- [ ] `/` muestra home page con hero
- [ ] Hero tiene botón que lleva a `/blog`
- [ ] Aside muestra estadísticas correctas
- [ ] Aside muestra categorías y tags
- [ ] Aside muestra 4 artículos recientes con links

## Commits

```
feat: add aside sidebar component with stats
```

```
feat: add home page with hero
```
