# TAHDIG redesign — production handoff

This package helps the production team replace the old storefront UI with the approved TAHDIG
design **inside the existing codebase**:

- Next.js 16.2 (App Router)
- React / React DOM 19.2
- TypeScript
- Tailwind CSS 4 (`@tailwindcss/postcss`)
- Zustand, SWR, Meilisearch and the Shopify layers

It is a UI layer, not an application.

## Sources of truth

| What | Role |
|---|---|
| **Live approved prototype**: https://claude.ai/artifact/P7Z8u8mhKdSC1DvFDUxoDf (standalone copy in `reference/prototype/`) | **Visual and UX source of truth.** When anything here disagrees with the prototype, the prototype wins, apart from the documented accessibility colour fixes in `docs/ACCESSIBILITY.md`. |
| `reference/prototype/` (HTML/CSS/vanilla JS) | **Reference implementation only.** Shows exact behaviour, states and copy. Not for copying into production. Its data is mock data. |
| `components/` + `styles/` (React 19 / TS / Tailwind 4) | **Integration accelerator.** Presentational components that reproduce the prototype. Data comes in through props; user intent goes out through callbacks. |
| `harness/` | **Compatibility proof.** A minimal Next 16 App Router app that builds and runs the UI layer. |
| Existing production codebase | **Owns all business logic**: Shopify layers, Meilisearch, Zustand stores, SWR, routing, i18n, auth, checkout. Nothing in this package replaces it. |

## What is in the ZIP

```
README-HANDOFF.md
components/                  ← UI layer (no data fetching, no Shopify / Meilisearch calls)
  index.ts                   ← public exports
  types.ts                   ← presentation view models (map production data into these)
  labels.ts                  ← default Persian UI copy + tpl() — plain strings, overridable per locale
  provider.tsx               ← 'use client' — locale, labels, number/money formatting (serializable props)
  lib/next.tsx               ← the ONLY place next/link and next/image are used (TLink, TImage)
  lib/format.ts              ← Persian digits / Intl formatting per locale
  primitives/                ← Button, QtyStepper, AddToCartControl, Price, Text leaves, Media, Breadcrumbs…
  layout/                    ← TahdigRoot, Header, MenuDrawer, SearchBar, Footer, NewsletterPanel, Container
  home/ product/ recipe/ cart/ bundle/ recurring/ account/ policy/
styles/
  tokens.ts                  ← every approved value (single source)
  build-theme.mjs            ← generates tahdig.theme.css from tokens.ts  (node styles/build-theme.mjs)
  tahdig.theme.css           ← Tailwind 4 @theme block: tahdig-* colours, radii, shadows, xs breakpoint, motion
  tahdig.css                 ← the few global rules utilities can't express (root, rails, <details>, marquee…)
docs/
  MIGRATION-GUIDE.md         ← how to integrate: Tailwind 4, RSC boundaries, [locale] layout, search, account
  COMPONENT-MAPPING.md       ← new component → production equivalent → visual change → logic to preserve
  ROUTE-CHECKLIST.md         ← route-by-route implementation + QA checklist
  RESPONSIVE-SPEC.md         ← exact behaviour at 390 / 430 / 768 / 820 / 1024 / 1280 / 1440
  ACCESSIBILITY.md           ← measured contrast + touch-target pass, and the tiny visual changes it made
examples/
  Preview.tsx, fixtures.ts   ← client wiring example for 16 pages (mock data)
  cartStore.ts               ← example Zustand store standing in for the production cart store
harness/                     ← Next 16 App Router harness (see "Verification")
reference/prototype/         ← the approved prototype, runnable from disk
```

## Verification done on this package (harness, production build)

| Check | Result |
|---|---|
| `tsc --noEmit` with `strict`, `noUnusedLocals` and `noUnusedParameters` | Passes: 45 UI files, examples and the harness. |
| React 19.2.4 | Builds and renders with no hydration warnings. React 19 `inert` is a boolean; refs use `RefObject<T \| null>`. |
| `next build` (Next 16.2.10, Turbopack) | Passes. 56 static pages: `fa` / `fi` / `en` × 16 preview pages, plus the server-composition page. |
| Tailwind 4.3 via `@tailwindcss/postcss` | CSS-first `@theme`. There is no `tailwind.config`. Every `tahdig-*`, `xs:`, `rtl:` and `ltr:` utility used by the UI is generated. |
| Pages × widths, from `next start` | Persian (RTL): 17 routes × 7 widths (390 / 430 / 768 / 820 / 1024 / 1280 / 1440) = 119 renders. English (LTR): 119 renders. Finnish (LTR): 68 renders. All have no JS errors and no horizontal overflow, and `html lang` / `dir` are correct. |
| Approved home geometry vs the prototype | Header, hero, search, chips, carousel, meal panel, collage, steps, CTA, card and promos match to the pixel in position and size at 390 / 430 / 820 / 1024 / 1440. |
| Frozen-region pixel diff | Same height at every width. About 0.4–0.6% of pixels differ, limited to the accessibility colour fixes and sub-pixel anti-aliasing (see `docs/ACCESSIBILITY.md`). |
| Contrast (WCAG 2.2, measured on 2,662 rendered text nodes) | Passes, apart from two documented non-failures: the quick-chip reading is a measurement artefact (5.61:1 on the green band), and the payment-logo boxes are placeholders to be replaced by the licensed logos. |
| Touch targets | Every control is at least 44×44 effective, except the two "coming soon" camera/mic icons in the frozen search bar (40×44, the most possible without overlapping each other). |

Reproduce: `cd harness && npm i && npm run sync && npx next typegen && npm run typecheck && npm run build && npm start`,
then open `http://localhost:3100/fa/preview/home`, `/en/preview/home` or `/fa/server`.

## Quick start (in the production repo)

1. Copy `components/` and `styles/` to `src/ui/tahdig/`.
2. In the global CSS:
   ```css
   @import "tailwindcss";
   @import "../src/ui/tahdig/styles/tahdig.theme.css";
   @import "../src/ui/tahdig/styles/tahdig.css";
   ```
3. In `app/[locale]/layout.tsx` (a Server Component):
   - set `<html lang={locale} dir={dirForLocale(locale)}>`;
   - load Vazirmatn with `next/font/google` as `--font-vazirmatn`;
   - render `<TahdigUIProvider locale={locale} labels={dict.tahdig}><TahdigRoot>…</TahdigRoot></TahdigUIProvider>`.
4. Replace screens one route at a time, following `docs/ROUTE-CHECKLIST.md` and `docs/MIGRATION-GUIDE.md`.
   Server-safe sections render from Server Components. Interactive parts are small client islands bound to the existing stores.

## Rules that must not be broken

- **Header, hero, search, category carousel and the "خرید بر اساس غذا" meal panel are approved and frozen.** Match them exactly.
- **Two separate purchase concepts.** Never merge them.
  - *خرید دوره‌ای* is the customer's own editable recurring list. Its only product-level entry point is the hook on the product detail page. Product cards have none.
  - *پکیج‌های آماده* are fixed curated bundles, each sold as one line.
- **Do not invent business rules.** Shipping fee, free-shipping threshold, carriers and delivery times are **not confirmed**.
  - `CartSummary` shows "calculated after address" while `shipping` is `null`.
  - Pass `freeShipping` only once the business confirms a threshold.
- **One search engine.** `SearchBar` is presentational. Meilisearch stays the engine (see MIGRATION-GUIDE › Search mapping).
- **A website, not an app.** No bottom tab bar, real links, and browser back works.
- **Direction.** Persian is RTL; Finnish and English are LTR. Direction always comes from `<html dir>`.
  The components use logical properties (`ps-`, `me-`, `start-`), plus `rtl:`/`ltr:` where direction matters. Do not "fix" them to left/right.
