# Qué es este proyecto

## Descripción general

Blog_teconológico es un blog personal de tecnología construido con **Astro 7**. Publica artículos sobre desarrollo web, despliegue, DevOps y herramientas para programadores.

Lo que lo hace diferente de un blog común es que tiene un **panel de administración propio** que permite crear, editar y eliminar artículos directamente desde el navegador, sin tocar la línea de comandos.

## Stack tecnológico

| Capa | Tecnología | Para qué |
|------|-----------|----------|
| Framework | Astro 7 | Generación de sitio estático (SSG) |
| Estilos | Tailwind CSS 4 | Utility-first CSS |
| Tipos | TypeScript | Type safety |
| Contenido | Markdown | Artículos del blog |
| Editor | Milkdown | Editor WYSIWYG en el admin |
| API | GitHub API | CRUD de archivos e imágenes |
| Deploy | Vercel/Netlify | Hosting estático |

## Cómo funciona el blog

El blog es un sitio **100% estático**. Cuando hacés `pnpm build`, Astro toma todos los artículos Markdown de `src/content/blog/`, los procesa, y genera archivos HTML puros en `dist/`. No hay servidor, no hay base de datos, no hay JavaScript en el cliente (excepto el filtrado del blog).

El flujo es:

1. Escribís un artículo en Markdown con frontmatter
2. Astro lo lee en el build
3. Genera HTML estático
4. Subís los archivos a un hosting estático
5. El usuario ve HTML puro, carga instantánea

## Cómo funciona el admin

El admin es una aplicación client-side que vive en `/admin`. Usa la **GitHub API** para interactuar con los artículos directamente en el repositorio.

### Autenticación

- El usuario ingresa un **Personal Access Token** de GitHub
- El token se guarda en `localStorage`
- Se valida contra la API de GitHub (`/user`)
- Si es válido, se muestra el panel de administración

### Operaciones CRUD

| Operación | Qué hace | Endpoint de GitHub |
|-----------|----------|-------------------|
| **Listar** artículos | Trae todos los `.md` de `src/content/blog/` | `GET /repos/{owner}/{repo}/contents/{path}` |
| **Leer** artículo | Decodifica el contenido Base64 y parsea frontmatter | `GET /repos/{owner}/{repo}/contents/{file}` |
| **Crear** artículo | Codifica el contenido y lo sube al repo | `PUT /repos/{owner}/{repo}/contents/{path}/{file}` |
| **Actualizar** artículo | Actualiza el archivo con su SHA actual | `PUT /repos/{owner}/{repo}/contents/{file}` |
| **Eliminar** artículo | Elimina el archivo con su SHA | `DELETE /repos/{owner}/{repo}/contents/{file}` |

### Editor

- Usa **Milkdown** (editor WYSIWYG basado en ProseMirror)
- El usuario escribe en un editor visual con toolbar
- El contenido se serializa a Markdown antes de guardarse
- Soporta: headings, bold, italic, links, código, listas

### Imágenes

- Se suben directamente al repositorio en `public/images/`
- Se codifican en Base64 para la API de GitHub
- Se listan las imágenes existentes para seleccionar como hero image
- Las imágenes quedan versionadas en el repo

### Frontmatter

El admin parsea y genera frontmatter automáticamente:

```yaml
---
title: "Título del artículo"
description: "Descripción para SEO"
pubDate: 2026-09-07
heroImage: "/images/astro-blog.webp"
category: "framework"
tags: ["astro", "framework"]
---
```

## Flujo completo de publicación

```
Usuario abre /admin
        │
        ▼
Ingresa token de GitHub
        │
        ▼
Panel muestra artículos existentes
        │
        ▼
Usuario crea/edita artículo en el editor
        │
        ▼
Click en "Guardar"
        │
        ▼
CMS serializa Markdown + frontmatter
        │
        ▼
GitHub API crea/actualiza archivo en src/content/blog/
        │
        ▼
GitHub detecta el cambio en la rama main
        │
        ▼
Vercel/Netlify detecta el push y rebuilda
        │
        ▼
Nuevo artículo visible en el blog
```

## Repositorio y GitHub

El proyecto está alojado en GitHub:

- **Owner:** AlejandroLeon2
- **Repo:** blog-github
- **Branch principal:** main
- **Rama de contenido:** `src/content/blog/`

### Configuración

La configuración del repo está en `src/lib/config.ts`:

```ts
OWNER = "AlejandroLeon2"
REPO = "blog-github"
BRANCH = "main"
CONTENT_PATH = "src/content/blog"
IMAGES_PATH = "public/images"
```

### GitHub API

El admin usa la GitHub API REST v2022-11-28. Las operaciones principales:

- `GET /user` — validar token
- `GET /repos/{owner}/{repo}/contents/{path}` — listar archivos
- `GET /repos/{owner}/{repo}/contents/{file}` — leer archivo
- `PUT /repos/{owner}/{repo}/contents/{file}` — crear/actualizar
- `DELETE /repos/{owner}/{repo}/contents/{file}` — eliminar

### Personal Access Token

El usuario necesita un PAT de GitHub con permisos:
- `repo` — acceso total a repositorios (para CRUD de archivos)

Se genera en: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens

## Deploy

### Vercel (recomendado)

1. Conectar el repo de GitHub en Vercel
2. Vercel detecta Astro automáticamente
3. Cada push a `main` triggera un rebuild automático
4. Los previews de PR muestran cambios antes de merge

### Netlify

1. Conectar el repo en Netlify
2. Build command: `pnpm build`
3. Publish directory: `dist`
4. Deploy automático en cada push

### GitHub Actions (opcional)

Se puede configurar CI/CD con GitHub Actions para:
- Ejecutar `pnpm astro check` en cada PR
- Ejecutar tests si los hay
- Build de verificación antes de merge

## Seguridad

- El token de GitHub **nunca se sube al repo** — se guarda en `localStorage` del navegador
- El admin solo funciona con un token válido
- Los artículos se modifican directamente en GitHub (con audit log)
- No hay base de datos vulnerable — todo está en el repo

## Limitaciones conocidas

- No hay autenticación de usuario para el blog (es público)
- El admin usa localStorage — si el usuario limpia el storage, pierde la sesión
- No hay drafts — al guardar, el artículo queda público inmediatamente
- No hay programación de publicación (no se puede programar para publicar mañana)
- Las imágenes se suben como Base64 al repo (puede inflarlo)
