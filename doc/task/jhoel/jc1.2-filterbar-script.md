# JC1.2 — FilterBar: Script Cliente

## Objetivo

Agregar el JavaScript que hace que el FilterBar funcione: buscar, filtrar por categoría, filtrar por tags.

## Archivo a modificar

`src/components/molecules/FilterBar.astro` — **ya creaste la estructura en JC1.1**

## Puntos de Estudio

**`<script>` en Astro** — Se ejecuta en el navegador. No tiene acceso al frontmatter. Es JavaScript normal.

**`document.getElementById("id")`** — Busca un elemento por ID.

**`document.querySelectorAll("selector")`** — Busca todos los elementos que coinciden con un selector CSS.

**`el.dataset.atributo`** — Accede a atributos `data-*`. `data-filter` se accede como `el.dataset.filter`.

**`el.style.display = "none"`** — Oculta. `el.style.display = ""` muestra.

**`Set`** — `.has()`, `.add()`, `.delete()` para verificar, agregar, quitar.

## Archivos de referencia

| Archivo | Qué contiene | Para qué lo necesitás |
|---------|-------------|----------------------|
| `src/components/organisms/ArticleList.astro` | Contenedor con `data-article-list` y artículos con `data-article`, `data-title`, `data-description`, `data-category`, `data-tags` | Los selectores que usa el script |

## Pasos

### Paso 1: Agregar `<script>` al final del archivo

### Paso 2: Obtener referencias al DOM

Buscá el input de búsqueda, los botones de filtro, el contenedor de artículos, y el elemento de filtros activos.

### Paso 3: Definir estado

Dos variables: una para la categoría activa (string vacío = sin filtro) y un Set para los tags activos.

### Paso 4: Crear función que obtenga todos los artículos

Necesitás una función que retorne todos los elementos `[data-article]` dentro de `[data-article-list]`. Usá `querySelectorAll` y convertí el resultado a array.

### Paso 5: Crear función de filtrado

Para cada artículo:
1. Leé sus data attributes (título, descripción, categoría, tags)
2. Para tags, hacé split por coma para obtener un array
3. Compara contra los filtros activos:
   - ¿El título, descripción o algún tag incluyen el texto de búsqueda?
   - ¿La categoría coincide con la activa?
   - ¿Al menos un tag está en el Set de tags activos?
4. Si coincide con todo, mostralo. Si no, ocultalo.

### Paso 6: Crear función para actualizar filtros activos

Muestra u oculta el resumen de filtros y lista los filtros activos como badges.

### Paso 7: Agregar event listeners

- Input de búsqueda: cada vez que cambia el texto, llamá a la función de filtrado
- Botones de categoría: al hacer click, actualizá la categoría activa y cambiá los estilos de todos los botones de categoría
- Botones de tag: al hacer click, agregá o quitá del Set y cambiá el estilo del botón

## Criterio de aceptación

- [ ] Buscar filtra por título, descripción y tags
- [ ] Click en categoría filtra
- [ ] Click en tag activa/desactiva
- [ ] Los filtros se combinan
- [ ] Se muestra resumen de filtros activos

## Commit

```
feat: add client-side filtering to filter bar
```
