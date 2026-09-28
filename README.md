# TAHDIG storefront — visual/UX reference build

Static, dependency-free prototype of the TAHDIG webshop (RTL Persian, Vazirmatn).
It is the approved visual and interaction reference for the production React + Shopify build.

## Pages (hash routes)
`#/` home · `#/products?c=&q=&s=` collection · `#/product/:handle?variant=` product ·
`#/recipes` · `#/recipe/:handle` · `#/bundles` · `#/bundle/:handle` (fixed bundles) ·
`#/recurring` (customer's editable recurring list) · `#/cart` · `#/checkout` ·
`#/account`, `#/account/orders|addresses|favorites` · `#/page/:slug` (policy pages).

## Architecture
- `assets/css/tahdig.css`: design tokens → primitives → components → pages → breakpoints.
  Mobile first; the approved home sections keep their exact rules (phone block at the end).
- `assets/js/catalog.js`: mock data shaped like Shopify Storefront API responses.
- `assets/js/commerce.js`: the only module that knows about data. `Catalog`, `Cart`
  (lines keyed by variant id, discount codes, totals like `cart.cost`), `Recurring`
  (selling plans / subscription contracts later), `Customer` (Customer Account API later).
- `assets/js/ui.js`: pure presentational components, 1:1 with future React components
  (ProductCard, AddToCartControl, QtyStepper, Price, Breadcrumbs, RecipeCard, BundleCard…).
- `assets/js/app.js`: hash router, views, delegated `data-action` interactions.

## Two separate purchase concepts
- **خرید دوره‌ای** — a customer-owned, editable recurring list (products, quantities,
  frequency, pause/skip/cancel). Maps to Shopify selling plans + subscription contracts.
- **پکیج‌های آماده** — fixed curated bundles sold as one cart line at one price.
  Maps to Shopify bundle products.

Checkout here is a demonstration only; production hands off to `cart.checkoutUrl`.
