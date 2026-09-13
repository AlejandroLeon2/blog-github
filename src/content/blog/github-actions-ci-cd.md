---
title: "CI/CD con GitHub Actions para tu blog"
description: "Automatizá el build y deploy de tu blog usando GitHub Actions, con tests y linting incluidos."
pubDate: 2026-09-09
heroImage: "/images/github-actions.webp"
category: "devops"
tags: ["github-actions", "ci-cd", "automatización"]
---

# CI/CD con GitHub Actions para tu blog

GitHub Actions te permite automatizar todo el pipeline: lint, typecheck, test y deploy. Vamos a crear un workflow completo.

## Estructura del workflow

Creamos `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

## Agregar linting

Agregamos una step antes del build:

```yaml
      - run: pnpm astro check
```

## Deploy a Vercel

Vercel ya maneja el deploy con GitHub Actions nativo, pero si preferís control total, usá la CLI:

```yaml
      - run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Tips

- Usá `--frozen-lockfile` para evitar problemas con el lockfile
- Cacheá `pnpm` para builds más rápidos
- Separá lint y build en jobs distintos si querés paralelismo
