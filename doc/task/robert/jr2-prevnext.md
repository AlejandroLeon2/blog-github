# JR2 — Navegación Prev/Next

## Objetivo

Crear un componente que muestre links a artículo anterior y siguiente al final de cada artículo. También modificar la página de detalle para que le pase esa información.

## Archivos a crear

1. `src/components/molecules/PrevNext.astro`

## Archivos a modificar

1. `src/pages/blog/[...slug].astro` — **lo crea Juan en J1**

## Puntos de Estudio

**Props opcionales** — Si una prop puede no existir, usás `?` en la interfaz. También podés usar `| null` para permitir null explícitamente.

**Renderizado condicional** — `{condición && (<Elemento />)}` solo renderiza si la condición es verdadera.

**Operador ternario** — `{condición ? (<A />) : (<B />)}` elige entre dos opciones.

## Archivos de referencia

| Archivo | Qué contiene | Para qué lo necesitás |
|---------|-------------|----------------------|
| `src/pages/blog/[...slug].astro` | Página de artículo — **la crea Juan** | Hay que modificarla |

## Tarea JR2.1 — PrevNext.astro

### Qué es

Un componente que muestra dos links: "← Anterior" al más reciente y "Siguiente →" al más antiguo.

### Pasos

#### Paso 1: Definir props

Dos props opcionales: `prev` y `next`. Cada uno puede ser un objeto `{ slug, title }` o `null`.

#### Paso 2: Template

Solo se renderiza si `prev` o `next` existen. Un `<nav>` con flexbox que tiene dos lados: izquierdo (prev) y derecho (next). Si uno no existe, poné un `<div />` vacío para mantener el espacio.

---

## Tarea JR2.2 — Modificar [...slug].astro

### Qué es

Hay que cambiar la página de detalle (creada por Juan) para que calcule prev/next y se lo pase a PrevNext.

### Archivo a modificar

`src/pages/blog/[...slug].astro`

### Pasos

#### Paso 1: Importar PrevNext

#### Paso 2: Calcular prev/next en getStaticPaths

Cuando iterás los artículos con `.map()`, también tenés acceso al índice `i` y al array completo `posts`. Pensá: ¿cómo calculás el anterior y el siguiente? El array está ordenado por fecha descendente.

#### Paso 3: Extraer prev y next de Astro.props

#### Paso 4: Renderizar PrevNext después del contenido

## Criterio de aceptación

- [ ] Al final de un artículo se muestran links a prev/next
- [ ] Click en "← Anterior" lleva al más reciente
- [ ] Click en "Siguiente →" lleva al más antiguo
- [ ] Primer artículo: solo muestra "Siguiente →"
- [ ] Último artículo: solo muestra "← Anterior"

## Commits

```
feat: add prev/next navigation component
```

```
feat: integrate prev/next into article detail page
```
