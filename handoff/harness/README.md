# Next 16 compatibility harness

A minimal **Next.js 16.2 App Router** app that builds and runs the TAHDIG UI layer with:
- React 19.2
- TypeScript (strict)
- Tailwind CSS 4 (`@tailwindcss/postcss`)
- Zustand

It is not the storefront: there is no Shopify, SWR or Meilisearch, and all data is mock fixtures.

```bash
npm install
npm run sync          # copies ../components, ../styles, ../examples → src/ui/tahdig, logos → public/assets
npx next typegen      # PageProps / LayoutProps route types
npm run typecheck     # tsc --noEmit (strict)
npm run build         # next build (Turbopack)
npm start             # http://localhost:3100
```

| Route | What it shows |
|---|---|
| `/fa/preview/home` … `/fa/preview/policy` (16 pages) | The client wiring example (`examples/Preview.tsx`) for every page. RTL. |
| `/en/preview/*`, `/fi/preview/*` | The same pages in LTR, with example English/Finnish UI labels (`src/i18n/dictionaries.ts`). |
| `/fa/server` (also `/en/server`, `/fi/server`) | A **Server Component** page built from server-safe sections. The interactive parts are islands in `src/islands/`. |

Files worth copying into production:
- `app/[locale]/layout.tsx`: `<html lang dir>`, `next/font` Vazirmatn, the provider and `TahdigRoot`;
- `app/globals.css`: the Tailwind 4 imports;
- `postcss.config.mjs`;
- the island pattern in `src/islands/`.
