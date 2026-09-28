# Examples

- `Preview.tsx`: a **wiring example** that shows how a page container maps state into the UI
  components. It uses a local `useState` cart and mock `fixtures.ts`. In production the same
  props come from the Zustand cart store, SWR data, Meilisearch results and the Shopify layers.
- `preview-build/`: a static build of `Preview.tsx` (React 18 + Tailwind 3 + the TAHDIG preset).
  Open `preview-build/index.html?page=home` from disk. The pages are:
  `home, products, product, product-oos, recipes, recipe, cart, cart-empty, bundles, bundle,
  recurring, account, orders, addresses, favorites, policy`.

To render the preview inside the production app, add a dev-only route that renders
`<Preview page={searchParams.page ?? 'home'} />`. It needs no data connections.
