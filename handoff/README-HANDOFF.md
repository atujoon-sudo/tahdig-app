# TAHDIG redesign — production handoff

This package helps the production team replace the old storefront UI with the
approved TAHDIG design **inside the existing Next.js + React + TypeScript +
Tailwind codebase**. It is a UI layer, not an application.

## Sources of truth

| What | Role |
|---|---|
| **Live approved prototype** — https://claude.ai/artifact/P7Z8u8mhKdSC1DvFDUxoDf (and the standalone `reference/prototype/` copy in this ZIP) | **Visual and UX source of truth.** When anything here disagrees with the prototype, the prototype wins. |
| `reference/prototype/` (HTML/CSS/vanilla JS) | **Reference implementation only.** Shows exact behaviour, states and copy. Not for copying into production. Its data layer is mock data. |
| `components/` + `styles/` (React/TS/Tailwind) | **Integration accelerator.** Presentational components that reproduce the prototype. They take data through props and report user intent through callbacks. |
| Existing production codebase | **Owns all business logic**: Shopify integration layers, Meilisearch, Zustand stores, SWR fetching, routing, auth, checkout. Nothing in this package replaces them. |

## What is in the ZIP

```
README-HANDOFF.md            ← this file
components/                  ← React + TS + Tailwind UI layer (no data fetching, no Shopify calls)
  index.ts                   ← public exports
  types.ts                   ← presentation view models (map production data into these)
  provider.tsx               ← integration seam: Link, Image, money formatting, UI copy
  labels.ts                  ← default Persian UI copy (overridable, e.g. from i18n)
  primitives/                ← Button, QtyStepper, AddToCartControl, Price, Media, Breadcrumbs, Accordion, fields, Toast, ConfirmSheet…
  layout/                    ← Header, MenuDrawer, SearchBar, Footer, Container
  home/ product/ recipe/ cart/ bundle/ recurring/ account/ policy/
styles/
  tokens.ts                  ← every approved value (colors, type, radius, shadows, breakpoints, sizes, motion)
  tailwind.preset.ts         ← Tailwind preset built from tokens (namespaced `tahdig-*`)
  tahdig.css                 ← the few global rules utilities can't express (RTL root, scroll rails, <details> animation…)
docs/
  COMPONENT-MAPPING.md       ← new component → existing production equivalent → visual change → logic to preserve
  ROUTE-CHECKLIST.md         ← route-by-route implementation + QA checklist, including empty / out-of-stock states
  RESPONSIVE-SPEC.md         ← exact behaviour at 390 / 430 / 768 / 820 / 1024 / 1280 / 1440
  MIGRATION-GUIDE.md         ← how to integrate safely
examples/
  Preview.tsx, fixtures.ts   ← wiring example: how a page container feeds the components (mock state)
  preview-build/             ← static build of Preview.tsx (open index.html?page=home|products|product|cart|…)
reference/prototype/         ← the approved prototype, runnable from disk
```

## Verification done on this package

- `tsc --strict` passes on all components, the preset and the examples (TypeScript 5, React 18 types).
- The components were built with Tailwind 3 + this preset and rendered side by side with the prototype.
  The approved home sections match the prototype geometry exactly at 390, 430, 820, 1024 and 1440px:
  header, hero, search, quick chips, category carousel, meal panel, collage, steps and CTA, product
  cards and promo panels, each checked for position, height and width.
- Product detail, cart, account, recipe detail and policy pages were compared visually at 390 and 820px.

## Quick start (in the production repo)

1. Copy `components/` and `styles/` to e.g. `src/ui/tahdig/`.
2. `tailwind.config.ts`: add the preset and the content glob (see `styles/tailwind.preset.ts` header).
3. Global CSS: `@import` `styles/tahdig.css` after the Tailwind layers.
4. Load Vazirmatn with `next/font/google` (weights 400–900) as `--font-vazirmatn`.
5. Wrap the storefront: `<TahdigUIProvider link={NextLink} image={NextImageAdapter}><TahdigRoot>…</TahdigRoot></TahdigUIProvider>`.
6. Replace screens one route at a time, following `docs/ROUTE-CHECKLIST.md` and `docs/MIGRATION-GUIDE.md`.

## Rules that must not be broken

- **Header, hero, search, category carousel and the "خرید بر اساس غذا" meal panel are approved and frozen.** Match them exactly.
- **Two separate purchase concepts:** *خرید دوره‌ای* (the customer's own editable recurring list) and *پکیج‌های آماده* (fixed curated bundles sold as one line). Never merge them.
- **Do not invent business rules.** Shipping fee, free-shipping threshold, carriers and delivery times are **not confirmed**. `CartSummary` shows "calculated after address" when `shipping` is `null`. Only pass `freeShipping` once the business confirms a threshold.
- The storefront is a **website, not an app**: no bottom tab bar, real links, browser back works.
- RTL throughout; logical properties (`ps-`, `me-`, `start-`) are used everywhere, so do not "fix" them to left/right.
