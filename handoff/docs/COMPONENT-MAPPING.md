# Component mapping guide

**How to read this table.** The left column is the approved component in `components/`. We have
**not** seen the production repository, so the production column never names a file. It says
*"map to existing production equivalent"* and describes what to look for. Once the equivalent
is identified, the engineer writes the file name into the last column.

**General rule for every row.** Keep the production component's **data and behaviour**: its hooks,
store selectors, SWR keys, Shopify and Meilisearch calls, analytics events and route params.
Replace only its **rendered markup and styles** with the approved component, or pass the
production data into the approved component through props.

## Shell

| Approved component | Likely production equivalent | What changes visually | Logic that must be preserved | Prod file (fill in) |
|---|---|---|---|---|
| `TahdigUIProvider`, `TahdigRoot` | Map to existing production equivalent: root layout / providers (`app/layout.tsx` or `_app.tsx`) | Adds RTL root, Vazirmatn, gutter variable, page background | Existing providers (SWR config, store providers, auth, i18n, analytics) stay; wrap them or nest inside | |
| `Header` | Map to existing production equivalent: site header / navbar | **Frozen.** Menu (start) · centred logo · green cart with gold badge. 90px on phones, 108px from 481px. Bottom tab bar removed. | Cart count selector (Zustand), route links, any header analytics | |
| `MenuDrawer` | Map to existing production equivalent: mobile menu / nav drawer / category menu | Slide-in panel from the reading-start side: main links, cart count, category chips | Navigation data (collections from Shopify or CMS), open/close state, route change closing | |
| `SearchBar` | Map to existing production equivalent: search input / search box component | **Frozen look.** Cream pill, camera + mic (visual only), green go button | Meilisearch query state, debounce, autocomplete/suggest (if any), submit routing, recent searches | |
| `Footer`, `NewsletterPanel`, `PaymentLogos` | Map to existing production equivalent: footer, newsletter form | Trust grid, newsletter panel, accordion link groups, brand block, contact CTA, social, bank marquee, payment marks. Variants: `full` / `info` / `lite` | Newsletter subscription call (Shopify customer marketing / ESP), footer menu data (Shopify menus), legal links | |
| `Container`, `Breadcrumbs`, `PageHeader` | Map to existing production equivalent: layout wrappers, breadcrumb component | 1200px container with 16/24/32px gutter; one-line scrolling breadcrumbs | Breadcrumb data derived from route/collection | |

## Commerce UI

| Approved component | Likely production equivalent | What changes visually | Logic that must be preserved | Prod file (fill in) |
|---|---|---|---|---|
| `ProductCard` | Map to existing production equivalent: product card / product tile | Image · name + package size · price + unit price (€/kg, €/L) · cart control. One card everywhere | Product → card mapping, variant selection for quick add, analytics (impressions/clicks), link building | |
| `AddToCartControl`, `QtyStepper` | Map to existing production equivalent: add-to-cart button / quantity selector | Cart button turns into an inline stepper; minus at 1 removes. Out of stock shows a bell linking to back-in-stock | Cart store actions (`add`, `update`, `remove`), optimistic updates, error handling/toasts, loading state (`busy`) | |
| `Price`, `UnitPrice` | Map to existing production equivalent: price / money formatter | Persian digits, currency in slate, compare-at struck through, unit price line | Existing money formatting can be injected via `TahdigUIProvider formatAmount` so numbers stay consistent with Shopify | |
| `ProductRail` | Map to existing production equivalent: product carousel / slider (home, related, recommendations) | Native scroll row with gentle start-snap below 1024px. Grid of 3 at 1024px and 4 at 1280px | Data source (collection, recommendations API), no slider library required | |
| `ProductGrid`, `SortBar`, `LoadMoreButton`, `CollectionHeader` | Map to existing production equivalent: PLP / collection page / search results grid, sort dropdown, pagination | 1 → 2 → 3 → 4 columns; cream header band with category tabs + counts; sort select; "محصولات بیشتر" | Meilisearch/Shopify query, facets, sort keys, pagination or infinite loading, URL state, SWR caching | |
| `ProductDetail`, `StickyBuyBar` | Map to existing production equivalent: PDP / product page | Gallery beside information from 768px. Title + latin name, SKU and stock, tags, description box, weight chips, unit price, stepper, CTA with total, trust line, accordions, related rail. Sticky buy bar on phones | Variant resolution + URL `?variant=`, availability, add-to-cart, favourites/wishlist, recurring (selling plan) eligibility, SEO/structured data, metafields mapping | |
| Back-in-stock form (inside `ProductDetail`) | Map to existing production equivalent: notify-me / back-in-stock app integration (if none exists: new) | Sand panel with email field under the price | Actual subscription call (back-in-stock app / Shopify Flow), validation, consent | |
| `CartLayout`, `CartLine`, `DiscountCodeForm`, `CartSummary`, `CartEmpty` | Map to existing production equivalent: cart page / cart drawer | Lines panel + sticky side column from 768px; discount panel; summary with neutral shipping row; payment marks; empty state with suggestions | Cart store + Shopify cart mutations, discount code apply/remove + error messages, `cart.cost` totals, checkout redirect (`cart.checkoutUrl`) | |
| `CartComplements` | Map to existing production equivalent: cart recommendations / upsell (if none exists: new) | Maximum 3 compact rows, one-tap add; hidden when empty | Recommendation source (Shopify product recommendations / Meilisearch / merch rules), add action | |

## Content & programs

| Approved component | Likely production equivalent | What changes visually | Logic that must be preserved | Prod file (fill in) |
|---|---|---|---|---|
| `HomeHero`, `CategoryCarousel`, `MealPanel` | Map to existing production equivalent: home page sections | **Frozen.** Exact geometry verified (see RESPONSIVE-SPEC) | Collections list, quick-search terms (CMS or config), meal CTA route | |
| `PromoPanels` | Map to existing production equivalent: home banners / promo blocks | Green panel = recurring purchases, beige panel = ready packages | CMS content (if managed), links | |
| `RecipeCard`, `RecipeGrid`, `RecipeMeta` | Map to existing production equivalent: recipe list / blog-style listing | Card: 4:3 image, meta bar (difficulty, servings, time), title, "مشاهده مواد لازم" | Recipe data source (Shopify metaobjects / CMS), filtering and search | |
| `RecipeDetail` | Map to existing production equivalent: recipe page / "shop the recipe" | Dish column + sticky shopping column from 768px. Servings chips, buyable ingredient checklist with pack count and price, add-all CTA, "other ingredients" checklist stating TAHDIG does not sell them, numbered method | Ingredient → product/variant mapping, pack calculation, bulk add to cart (single cart mutation if possible), availability | |
| `BundleCard`, `BundleGrid`, `BundleListLayout`, `BundleDetail`, `ConceptNote` | Map to existing production equivalent: bundles / kits / packages pages | Saving badge, contents list, separate price vs bundle price, add bundle as one line | Bundle product data (Shopify Bundles / fixed components), availability of components, add-to-cart | |
| `RecurringLayout` | Map to existing production equivalent: subscriptions / recurring order management (if none exists: new) | "فهرست من" editable list, product picker, frequency chips, next delivery, per-delivery estimate, status actions (activate, skip, pause, resume, cancel with confirm sheet) | Selling plans, subscription contracts, Customer Account API, pause/skip/cancel mutations, date calculation | |

## Account & pages

| Approved component | Likely production equivalent | What changes visually | Logic that must be preserved | Prod file (fill in) |
|---|---|---|---|---|
| `AccountLayout`, `AccountOverview` | Map to existing production equivalent: account dashboard / account layout | Profile + navigation column beside content from 768px; overview cards (latest order, recurring, address, favourites) | Auth/session, Customer Account API queries, protected routes, sign-in flow | |
| `OrderList` | Map to existing production equivalent: order history | Order cards (number, status badge, date, items, total), 2 columns from 1024px | Orders query, pagination, order detail links | |
| `AddressForm` | Map to existing production equivalent: address book / address form | Field styling, 2-column form from 1024px | Validation rules, address mutations, default address handling | |
| Favourites (`ProductGrid` inside `AccountLayout`) | Map to existing production equivalent: wishlist | Same product card | Wishlist store/API | |
| `PolicyPageLayout`, `HelpPanel` | Map to existing production equivalent: Shopify pages / CMS pages / policy routes | Article card + help panel + related pages column | Page content source (Shopify pages / policies API / CMS), SEO | |
| `Toast`, `ConfirmSheet`, `EmptyState`, `Note`, `Badge` | Map to existing production equivalent: notification/toast system, modal/dialog, empty states | Visual only | Existing notification queue / dialog manager | |
