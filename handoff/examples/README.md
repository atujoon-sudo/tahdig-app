# Examples

- `Preview.tsx` (`'use client'`) is a **wiring example**. It shows how a client page container maps state into the UI
  components for 16 pages:
  `home, products, product, product-oos, recipes, recipe, cart, cart-empty, bundles, bundle,
  recurring, account, orders, addresses, favorites, policy`.
- `cartStore.ts` is a minimal **Zustand** store standing in for the production cart store. The real store also calls the Shopify
  cart mutations.
- `fixtures.ts` holds mock view models mirroring the prototype catalog. In production, mappers build these from Shopify and Meilisearch data.

Run them in the Next 16 harness (`../harness`): `/fa/preview/<page>`, `/en/preview/<page>`, `/fi/preview/<page>`.
For a Server Component page built from the same sections plus client islands, open `/fa/server`.
