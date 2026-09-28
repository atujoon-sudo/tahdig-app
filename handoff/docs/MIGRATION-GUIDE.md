# Migration guide

**Goal:** the new TAHDIG design in the existing storefront. The data layer, the commerce layer
and the routing layer stay as they are.

## 0. Principles
1. **Presentation only.** Change what is rendered and how it is styled. Do not change what data is
   fetched, how the cart is mutated, how search works, or how routes resolve.
2. **Keep the stack.** Next.js, React, TypeScript, Tailwind, Zustand, SWR, Meilisearch and the Shopify
   layers stay. The UI layer depends on none of them.
3. **Reuse when clean, rebuild when blocked.** If an existing component's markup can be restyled to match,
   do that. If its structure fights the design (wrong DOM order, hard-coded layout), render the approved
   component and pass it the existing data.
4. **One route at a time,** behind a flag if the team uses them, and compared with the prototype before moving on.

## 1. Install the UI layer
- Copy `components/` and `styles/` to a single folder, e.g. `src/ui/tahdig/`. Keep the internal relative imports.
- Tailwind: add `presets: [tahdigPreset]` and the content glob.
  - The preset only **adds** namespaced tokens (`bg-tahdig-green`, `shadow-tahdig-card`, `rounded-tahdig-card`) and an `xs` (481px) screen.
  - The Tailwind default screens (640 / 768 / 1024 / 1280) are unchanged, so the existing UI is unaffected.
  - If the production config already overrides `screens`, merge `xs: '481px'` into it instead of letting the preset replace it.
- CSS: `@import 'src/ui/tahdig/styles/tahdig.css';` after the Tailwind layers. All rules are scoped (`.tahdig-root`, `t-*`).
- Font: `const vazir = Vazirmatn({ subsets: ['arabic'], weight: ['400','500','600','700','800','900'], variable: '--font-vazirmatn' })`
  on `<html>`. The CSS already falls back to "Vazirmatn" if the variable is missing.
- Tailwind named text sizes set line-height. The components deliberately use arbitrary sizes (`text-[15px]`)
  to keep the approved 1.6 body line-height. Keep that convention in new TAHDIG components.

## 2. Wire the provider (one place)
```tsx
// app/layout.tsx (or the storefront layout)
<TahdigUIProvider link={NextLinkAdapter} image={NextImageAdapter} formatAmount={shopFormat} labels={t?.tahdig}>
  <TahdigRoot>{children}</TahdigRoot>
</TahdigUIProvider>
```
- `link`: a wrapper around `next/link` that accepts `href`, `className` and the aria props.
- `image`: an adapter from `ImageData` to `next/image` (width, height, sizes). Placeholders render when an image is `null`.
- `formatAmount`: optional. Pass the production money formatter so every number matches Shopify.
- `labels`: optional. Override UI copy from the i18n layer. Product and content text always comes from data.

## 3. Map data in containers, not in components
Write thin **mapper functions** next to the existing data hooks:
```ts
toProductCard(shopifyProduct | meiliHit): ProductCardData
toCartLine(cartLine): CartLineData
toCartTotals(cart.cost, shippingConfig): CartTotalsData   // shipping: null until confirmed
toProductDetail(product, selectedVariant): ProductDetailData
```
Then in the existing page or container:
```tsx
const { cart, addLine, updateLine } = useCartStore();        // unchanged
const { data } = useSWR(key, fetcher);                       // unchanged
return <ProductGrid products={data.map(toProductCard)} cartFor={(p) => ({
  quantity: qtyOf(cart, p.variantId),
  onAdd: () => addLine(p.variantId, 1),
  onIncrement: () => updateLine(p.variantId, +1),
  onDecrement: () => updateLine(p.variantId, -1),
  notifyHref: `${p.href}#notify`,
  busy: isMutating,
})} />;
```
`examples/Preview.tsx` shows this pattern end to end with mock state.

## 4. Suggested order of work
1. Provider, tokens, font, `TahdigRoot`; Header, MenuDrawer and Footer (every page benefits at once).
2. ProductCard + AddToCartControl (used everywhere), then Home.
3. Products / Category / Search (ProductGrid, CollectionHeader, SortBar).
4. Product Detail (+ back-in-stock, recurring entry, StickyBuyBar).
5. Cart (+ complements), checkout entry unchanged.
6. Recipes and Recipe Detail, then Packages.
7. Account (layout, overview, orders, addresses, favourites), then Recurring purchases.
8. Policy pages, empty and error states, final pass at all seven widths.

## 5. Things to leave exactly as they are
- Shopify checkout (hosted). The prototype checkout screens are reference only.
- Meilisearch indexing and querying. Add fields and synonyms if you choose (see ROUTE-CHECKLIST), but don't swap the engine.
- Cart store shape and mutations, SWR keys and revalidation, route structure and URL parameters, auth.
- Analytics and tracking hooks. Re-attach them to the new elements, using the same events.

## 6. Business rules — do not hard-code
- Shipping fee, free-shipping threshold, carriers, delivery windows and service areas are unconfirmed.
  Pass `shipping: null` and no `freeShipping` until they are confirmed; the UI is designed for that state.
- Unit prices: prefer Shopify `unitPrice` / `unitPriceMeasurement`. Omit them for 1 kg / 1 L packs.
- Recurring purchases need selling plans. Show the PDP entry only for eligible variants.

## 7. Definition of done per route
- [ ] Visual parity with the prototype at 390, 430, 768, 820, 1024, 1280 and 1440px.
- [ ] Same data, same mutations, same analytics as before.
- [ ] No console errors; no horizontal overflow; keyboard and screen-reader pass (names, focus, `aria-current`, live regions).
- [ ] Real iPhone Safari check for the frozen home sections.
