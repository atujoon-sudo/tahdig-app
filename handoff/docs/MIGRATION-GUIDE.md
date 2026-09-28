# Migration guide

**Goal:** the new TAHDIG design in the existing storefront. Only presentation changes; the data,
commerce and routing layers stay as they are.

**Stack this package targets:**
- Next.js 16.2 (App Router)
- React 19.2
- TypeScript
- Tailwind CSS 4 (`@tailwindcss/postcss`)
- Zustand, SWR, Meilisearch and the Shopify layers

`harness/` is a working Next 16 app that demonstrates every step below.

## 0. Principles
1. **Presentation only.** Change what is rendered and how it is styled. Do not change what data is fetched,
   how the cart is mutated, how search works, or how routes resolve.
2. **Keep the stack.** The UI layer imports only `react`, `next/link` and `next/image`, and only in `lib/next.tsx`.
3. **Reuse when clean, rebuild when blocked.**
   - If an existing component can be restyled to match, restyle it.
   - If its structure fights the design, render the approved component with the existing data.
4. **One route at a time,** behind a flag if the team uses them. Compare with the prototype before moving on.

## 1. Tailwind CSS 4 (CSS-first)
There is no JS config or preset. Tokens are a Tailwind 4 `@theme` block generated from `styles/tokens.ts`.

```css
/* app/globals.css */
@import "tailwindcss";
@import "../src/ui/tahdig/styles/tahdig.theme.css";   /* @theme: --color-tahdig-*, --radius-tahdig-*, --shadow-tahdig-*, --breakpoint-xs … */
@import "../src/ui/tahdig/styles/tahdig.css";         /* scoped globals (.tahdig-root, t-*) */
@source "../src/ui/tahdig";                            /* only needed if the folder is outside the automatic scan */
```

**Theme scope**
- The theme only **adds** namespaced tokens, for example `bg-tahdig-green`, `rounded-tahdig-card`, `shadow-tahdig-card`, `ease-tahdig-drawer` and `animate-tahdig-marquee`.
- It also adds one breakpoint: `xs` = 481px. Tailwind's default breakpoints (`sm` 640, `md` 768, `lg` 1024, `xl` 1280) are unchanged, so the existing UI is not affected.

**Changing tokens:** edit `styles/tokens.ts`, then run `node styles/build-theme.mjs`. Never edit `tahdig.theme.css` by hand.

**Tailwind 4 behaviours the components already account for:**

| Tailwind 4 behaviour | How the components handle it |
|---|---|
| Borders default to `currentColor` | Every border sets its colour explicitly (`border-tahdig-line`). |
| Buttons default to `cursor: default` | Interactive controls carry `cursor-pointer`. |
| Named text sizes set a line-height | The components use arbitrary sizes (`text-[15px]`) to keep the approved line-heights. Keep that convention. |
| `before:` / `after:` add `content` automatically | The hit-area extensions (`after:absolute after:-inset-1`) need no `content-['']`. |
| Opacity modifiers compile to `color-mix()` | The rendered colours were verified against the prototype. |

## 2. The `[locale]` layout: direction, font, provider
`TahdigRoot` does **not** set `lang` or `dir`. It inherits them from the document:

```tsx
// app/[locale]/layout.tsx — Server Component
import { Vazirmatn } from 'next/font/google';
import { TahdigRoot, TahdigUIProvider, dirForLocale } from '@/ui/tahdig/components';
const vazirmatn = Vazirmatn({ subsets: ['arabic', 'latin'], variable: '--font-vazirmatn', display: 'swap' });

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  const dict = await getDictionary(locale);              // production i18n
  return (
    <html lang={locale} dir={dirForLocale(locale)} className={vazirmatn.variable}>
      <body>
        <TahdigUIProvider locale={locale} labels={dict.tahdig}>
          <TahdigRoot>{children}</TahdigRoot>
        </TahdigUIProvider>
      </body>
    </html>
  );
}
```

**Direction:** `fa` renders RTL, identical to the approved design. `fi` and `en` render LTR.

**What mirrors in LTR, and how:**
- Drawer: `rtl:translate-x-full ltr:-translate-x-full`.
- Bank marquee: `ltr:animate-tahdig-marquee-ltr`.
- Directional arrows and chevrons: `ltr:-scale-x-100`.
- Quantity stepper: `ltr:flex-row-reverse`.
- Latin text inside Persian text: `<bdi>`.
- Everything else uses logical properties.

**Provider props must stay serializable:** `locale` and `labels` are plain strings.
- `TahdigUIProvider` formats numbers per locale: Persian digits and the approved price format for `fa`, `Intl` for the others.
- A custom money formatter is a function, so it can only be passed from a Client Component wrapper:
  ```tsx
  'use client';
  export function ShopUIProvider(p) {
    return <TahdigUIProvider {...p} formatAmount={shopFormat} />;
  }
  ```

**TahdigRoot `dir` / `lang` props:** only for an island that must differ from the document.

**Logo** (`Header` and `MenuDrawer`):
- Default: `logoSrc`.
- To inject an SVG or `next/image`, pass `logo`:
  - Header: `logo={<Image src={logo} width={126} height={70} alt="" priority className="h-full w-auto" />}`
  - MenuDrawer: `logo={<Logo className="h-full w-auto" />}`
- The slot is a fixed box. In the header it is 58px tall on phones and 70px from 481px, at a 126:70 ratio. In the drawer it is 94×52.
- The header geometry cannot change.

**Links and images:**
- The UI uses `next/link` and `next/image` directly, through `TLink` / `TImage` in `components/lib/next.tsx`.
- If production wraps them (locale-prefixed links, a Shopify image loader), change those two exports only.
- Add the Shopify CDN to `images.remotePatterns`.

## 3. Server / Client boundaries (React Server Components)
The storefront does **not** become a client app. Files fall into three groups:

| Kind | Files | Use from |
|---|---|---|
| **Server-safe** (no hooks or context; locale-dependent text via tiny client leaves) | `TahdigRoot`, `Container`, `Footer`, `HomeHero`, `CategoryCarousel`, `MealPanel`, `PromoPanels`, `ProductCard`, `ProductRail`, `ProductGrid`, `CollectionHeader`, `RecipeCard/Grid/Meta`, `BundleCard/Grid/ListLayout`, `ConceptNote`, `AccountLayout`, `AccountOverview`, `OrderList`, `PolicyPageLayout`, `HelpPanel`, `Button`, `Price`, `Media`, `Breadcrumbs`, `Icon`, `Panel/Note/Badge/SectionTitle/EmptyState/PageHeader`, `AccordionGroup` | Server or Client Components |
| **Client** (`'use client'`: state, refs, effects, callbacks) | `TahdigUIProvider`, `Num/Amount/Label/UnitPriceText/JoinedList`, `Header`, `MenuDrawer`, `SearchBar`, `NewsletterPanel`, `QtyStepper`, `AddToCartControl`, `SortBar`, `LoadMoreButton`, `ProductDetail`, `StickyBuyBar`, `RecipeDetail`, `BundleDetail`, `Cart*`, `RecurringLayout`, `AddressForm`, `InlineForm`, `TextField`, `Toast`, `ConfirmSheet` | Server or Client (props must be serializable when rendered from a server file) |
| **Shared** | `ChoiceChips`, `OptionCards` | Client parents (they take `onChange`) |

**Rules**
- **Functions do not cross the boundary.** From a Server Component, pass **slots** (React elements) instead of callbacks:
  - `HomeHero search={<SearchIsland/>}`;
  - `ProductGrid cartSlots={{ [id]: <CartIsland variantId=…/> }}`;
  - `ProductCard cartSlot={…}`;
  - `Footer newsletter={<NewsletterIsland/>}`;
  - quick searches and collection tabs use `href`.
- The callback props (`cartFor`, `onTabSelect`, `onNewsletterSubmit`) remain for Client parents.
- **Islands** are small client files in production that bind a UI component to the stores. `harness/src/islands/` has four:
  - `Shell`: Header + MenuDrawer, with the cart count from Zustand;
  - `SearchIsland`: SearchBar → the router or the Meilisearch client;
  - `CartIsland`: AddToCartControl → the cart store;
  - `NewsletterIsland`.
- `harness/app/[locale]/server/page.tsx` is a complete Server Component page built this way.

## 4. Map data in containers, not in components
Write thin **mapper functions** next to the existing data hooks:
```ts
toProductCard(shopifyProduct | meiliHit): ProductCardData
toCartLine(cartLine): CartLineData
toCartTotals(cart.cost, shippingConfig): CartTotalsData   // shipping: null until confirmed
toProductDetail(product, selectedVariant): ProductDetailData
```
Client container (unchanged stores and hooks):
```tsx
'use client';
const lines = useCartStore((s) => s.lines);                   // unchanged store
const { data } = useSWR(key, fetcher);                        // unchanged fetching
return <ProductGrid products={data.map(toProductCard)} cartFor={(p) => ({
  quantity: lines[p.variantId] ?? 0,
  onAdd: () => addLine(p.variantId, 1), onIncrement: () => updateLine(p.variantId, +1), onDecrement: () => updateLine(p.variantId, -1),
  notifyHref: `${p.href}#notify`, busy: isMutating,
})} />;
```
`examples/Preview.tsx` + `examples/cartStore.ts` show this pattern for 16 pages.

## 5. Search mapping (Meilisearch) — UI only
There is **no** client search engine in this package. `SearchBar` is an input with three bindings.

| UI | Binds to (production) |
|---|---|
| `SearchBar value` / `onChange` | The existing query state: URL `?q=`, store, or the Meilisearch InstantSearch state. Debounce there, not in the UI. |
| `SearchBar onSubmit(q)` | Navigate to the search route (e.g. `/${locale}/search?q=…`), or run the Meilisearch query. |
| Quick-search chips (`HomeHero quickSearches[].href`) | Links to the search route with a preset `q`. The chips are merchandising copy. |
| Results grid | `hits.map(toProductCard)` → `ProductGrid`. `ProductCardData` fields: `id`, `variantId`, `href`, `title`, `sizeLabel`, `price`, `compareAtPrice`, `unitPrice`, `available`, `image`. |
| Count + sort | `SortBar count={estimatedTotalHits}`. `options` map to Meilisearch `sort` rules, or to Shopify `sortKey` on collection pages. |
| Tabs / facets | `CollectionHeader tabs[]`, where `count` comes from `facetDistribution` and `href` is the filtered URL. |
| Load more | `LoadMoreButton` → the next `offset`/`page`, appending hits. |
| Empty results | `EmptyState` + a link to all products. |
| Recurring product picker | `RecurringLayout picker.query` / `onQueryChange` / `results`, fed by the same Meilisearch index. |
| Camera / mic buttons | Visual only ("coming soon"). They do nothing until those features exist. |

**Recommended index settings.** These are optional and don't change the engine:
- searchable: `title`, `latinTitle` (English · Finnish names), `tags`, `vendor`;
- synonyms for common spellings (e.g. قورمه/قرمه);
- filterable: `collections`, `available`.

## 6. Customer accounts
Account screens are presentational. Sign-in uses **Shopify's Customer Account API** with its **passwordless customer authentication**: the customer receives a one-time email code, signs in on Shopify's hosted page, and Shopify redirects back to the storefront (OAuth 2.0 with PKCE).
- `AccountLayout signInHref` is a plain link to the production login route, which starts the Customer Account API authorization flow. No password fields exist in the UI.
- Orders, addresses and the customer's name come from Customer Account API queries in production containers. `AddressForm onSubmit` maps to the address mutations.
- Protected routes, session refresh and logout stay in production.

## 7. Suggested order of work
1. Tailwind 4 theme and CSS, the `[locale]` layout (font, `dir`, provider, `TahdigRoot`); then the `Shell` island (Header + MenuDrawer) and Footer.
2. ProductCard + CartIsland (used everywhere), then Home (server-rendered sections plus islands).
3. Products / Category / Search (ProductGrid, CollectionHeader, SortBar, Meilisearch mapping).
4. Product Detail (+ back-in-stock, the recurring hook, StickyBuyBar).
5. Cart (+ complements); checkout entry unchanged.
6. Recipes and Recipe Detail, then Packages.
7. Account (layout, overview, orders, addresses, favourites), then Recurring purchases.
8. Policy pages, empty and error states, final pass at all seven widths and in every locale.

## 8. Things to leave exactly as they are
- Shopify checkout (hosted). The prototype's checkout screens are reference only.
- Meilisearch indexing and querying. Don't swap the engine.
- Cart store shape and mutations, SWR keys and revalidation, route structure, URL parameters and auth.
- Analytics and tracking hooks: re-attach them to the new elements with the same events.

## 9. Business rules — do not hard-code
- Shipping fee, free-shipping threshold, carriers, delivery windows and service areas are unconfirmed.
  Pass `shipping: null` and no `freeShipping` until they are confirmed; the UI is designed for that state.
- Unit prices: prefer Shopify `unitPrice` / `unitPriceMeasurement`. Omit them for 1 kg / 1 L packs.
- Recurring purchases need selling plans. Show the PDP hook (`ProductDetail recurring`) only for eligible variants. Product cards have none.

## 10. Definition of done per route
- [ ] Visual parity with the prototype at 390, 430, 768, 820, 1024, 1280 and 1440px (`fa`), and a clean LTR render (`fi`, `en`).
- [ ] Same data, same mutations and same analytics as before.
- [ ] Only the islands are Client Components. The page itself stays a Server Component where production allows.
- [ ] No console errors and no horizontal overflow.
- [ ] Keyboard and screen-reader pass: names, focus, `aria-current`, live regions. Targets at least 44×44 (see ACCESSIBILITY.md).
- [ ] Real iPhone Safari check of the frozen home sections.
