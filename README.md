
# Bot Template Frontend (Starter)

Catálogo + carrito + panel admin básico en Next.js 14 (App Router) con TypeScript y Tailwind.

## Requisitos
- Node 20+
- pnpm 9+

## Setup
```bash
pnpm i
pnpm dev
```
- Abre: http://localhost:3000/tienda-de-ventas

## Estructura
- `app/(storefront)/[branch]`: listado de productos por sucursal
- `components/CartDrawer.tsx`: carrito con Zustand
- `mocks/products.json`: datos de ejemplo

## Env (cuando conectes el backend)
Crea `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_DEFAULT_BRANCH=los-tios-central
```
