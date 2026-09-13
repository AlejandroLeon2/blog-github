---
title: "Guía completa: desplegar tu blog en Vercel"
description: "Paso a paso para deployar un proyecto Astro en Vercel, desde la configuración hasta el dominio personalizado."
pubDate: 2026-09-10
heroImage: "/images/vercel-deploy.webp"
category: "deploy"
tags: ["vercel", "astro", "deploy", "hosting"]
---

# Guía completa: desplegar tu blog en Vercel

Vercel es uno de los hosting más populares para proyectos frontend. En esta guía vamos a ver cómo desplegar un blog hecho con Astro de forma sencilla.

## ¿Por qué Vercel?

- Deploy automático al hacer push a `main`
- SSL gratuito incluido
- Edge functions para SSR si las necesitás
- Integración directa con GitHub

## Requisitos

- Una cuenta en [vercel.com](https://vercel.com)
- Tu repo en GitHub conectado a Vercel
- Node.js >= 22.12.0 (lo maneja Vercel automáticamente)

## Paso 1: Conectar el repo

1. Entrá a [vercel.com/new](https://vercel.com/new)
2. Elegí "Import Git Repository"
3. Seleccioná tu repo
4. Vercel detecta Astro automáticamente

## Paso 2: Configurar el proyecto

En el dashboard de tu proyecto en Vercel:

- **Framework Preset:** Astro
- **Build Command:** `pnpm build`
- **Output Directory:** `dist`

## Paso 3: Variables de entorno

Si usás APIs o tokens, agregalas en Settings → Environment Variables.

## Resultado

Cada push a `main` genera un deploy automático. Tu blog está online con HTTPS en menos de 2 minutos.
