# Route-by-route implementation checklist

Route paths are **examples**; keep the production routing. For every route:

- [ ] Data still comes from the existing hooks, stores and API layers.
- [ ] Only presentation is replaced.
- [ ] Checked at 390, 430, 768, 820, 1024, 1280 and 1440px against the prototype (`reference/prototype/index.html#<hash>`).
- [ ] No horizontal page overflow; keyboard focus visible; every icon button has an accessible name.
- [ ] Footer variant is correct: `full`, `info` or `lite`.

Prototype hashes are listed so each route can be compared with the reference directly.

## Home — prototype `#/`
- [ ] `Header` and `HomeHero` (title, subtitle, `SearchBar`, quick-search chips on the green band) match exactly. **Frozen.**
- [ ] `CategoryCarousel`: collections from production, native scroll with gentle snap, 80px discs. **Frozen.**
- [ ] `MealPanel`: copy in two balanced lines, collage, 3 steps, gold CTA to recipes. **Frozen.**
- [ ] "انتخاب‌های ته دیگ" `ProductRail` from the existing merchandising source. Quick add uses the cart store.
- [ ] `PromoPanels`: recurring purchases (green) → recurring route; packages (beige) → packages route.
- [ ] Footer `full`.

## Products (all) — prototype `#/products`
- [ ] Breadcrumbs, `SearchBar` (live search stays Meilisearch), `CollectionHeader` "همه محصولات" with tabs and counts.
- [ ] `SortBar`: production sort options, keys and URL state.
- [ ] `ProductGrid`: 1 / 2 / 3 / 4 columns. Pagination or "load more" using the existing mechanism.
- [ ] Unit price shown when the product has a measurable pack (not for 1 kg or 1 L packs).

## Category (collection) — prototype `#/products?c=rice`
- [ ] Same as Products. Title and description come from the collection; the active tab is the collection.
- [ ] Tabs are links (`CollectionTab.href`) when collections are routes, or buttons if filtering is client-side.

## Search — prototype `#/products?q=…`
- [ ] Results reuse `ProductGrid`. The count reads "N محصول".
- [ ] Query matching stays in Meilisearch. **Recommendation:** index `latinTitle` (English · Finnish) and synonyms
      so "rice", "riisi" and "sahrami" find Persian products (the prototype demonstrates this behaviour).
- [ ] Empty results: `EmptyState` with suggestion chips and "مشاهده همه محصولات".

## Product Detail — prototype `#/product/tarom-hashemi-rice`
- [ ] Breadcrumbs (cream band on phones) → collection → product.
- [ ] Gallery: Shopify media. Thumbnails only when there is more than one image. Favourite and zoom buttons wired or omitted.
- [ ] Title, latin title (from a metafield if available), SKU, availability label, tags, description.
- [ ] Variant chips: selection updates the URL `?variant=` as production does today. Unavailable variants are struck through.
- [ ] Price, compare-at, unit price (Shopify `unitPrice` / `unitPriceMeasurement` where available).
- [ ] Quantity stepper (min 1) and CTA "افزودن به سبد — total" → existing add-to-cart.
- [ ] In-cart note with a cart link after adding. The trust line appears under the CTA.
- [ ] "افزودن به خرید دوره‌ای" only when the variant has a selling plan.
- [ ] Accordions: specs, ingredients, storage, cooking, shipping. Sections without data are hidden.
- [ ] Related rail ("همراه این محصول"). `StickyBuyBar` below 1024px.

## Out-of-stock states
- [ ] Card: grey image, "ناموجود", bell linking to the product's notify form.
- [ ] PDP: back-in-stock form instead of the CTA, and "محصولات مشابه" as the rail title. After a request: confirmation note.
- [ ] Recipe: the ingredient row is disabled, with a warning note. Bundle: unavailable note and disabled CTA.
- [ ] Recurring picker: items stay addable, labelled "فعلاً ناموجود".

## Cart — prototype `#/cart`
- [ ] Lines: `QtyStepper` (min 1) plus remove. Bundles show the "پکیج" tag. Unit price when the quantity is above 1.
- [ ] `DiscountCodeForm`: existing apply/remove mutation. Errors appear inline.
- [ ] `CartSummary`: values from cart cost. **`shipping: null` until shipping rules are confirmed.** No free-shipping bar unless confirmed.
- [ ] `CartComplements`: at most 3 related, in stock, not already in the cart. Hidden when there are none.
- [ ] CTA → checkout entry.

## Cart — empty state
- [ ] `CartEmpty` with "شروع خرید" and a suggestions rail.

## Checkout entry
- [ ] The cart CTA hands off to **Shopify Checkout** (`cart.checkoutUrl`) exactly as production does today.
- [ ] The prototype's in-page checkout steps (`#/checkout`) are **reference only**. They show the intended tone and
      field order for Checkout branding / Checkout Extensibility; they are not to be rebuilt as a custom checkout.
- [ ] Footer `lite` on any storefront-hosted pre-checkout step.

## Recipes — prototype `#/recipes`
- [ ] Breadcrumbs, recipe search, `CollectionHeader` with type tabs, the "چه غذایی می‌خواهی درست کنی؟" title, `RecipeGrid`.
- [ ] Empty search: `EmptyState` + "مشاهده همه غذاها".

## Recipe Detail — prototype `#/recipe/ghormeh-sabzi`
- [ ] Hero, title, meta. Servings chips recompute packs using the existing logic (or new logic, if none exists).
- [ ] Ingredient checklist → one bulk add to cart. After success: "N محصول به سبد اضافه شد · مشاهده سبد".
- [ ] "مواد دیگر این غذا": subtitle states TAHDIG does not sell these items; "در ته‌دیگ موجود است" plus a buy button only for exceptions.
- [ ] Method steps with Persian numerals.

## Packages (ready bundles) — prototype `#/bundles`, `#/bundle/party-pack`
- [ ] `BundleListLayout` + `ConceptNote` linking to recurring purchases.
- [ ] `BundleDetail`: components list, separate vs bundle price, saving, one-line add to cart.

## Recurring purchases — prototype `#/recurring`
- [ ] `RecurringLayout` states: draft (with intro steps), active, paused, cancelled.
- [ ] Line quantity, remove, picker search (production search), frequency and next delivery come from the subscription backend.
- [ ] Cancel uses `ConfirmSheet`. The shipping row stays neutral until the rules are confirmed.
- [ ] `ConceptNote` link to packages.

## Account — prototype `#/account`
- [ ] Phones: profile + navigation only. From 768px: navigation column plus `AccountOverview` cards.
- [ ] Signed-out state shows "ورود یا ساخت حساب" → the existing auth flow.

## Orders — prototype `#/account/orders`
- [ ] `OrderList` from the Customer Account API. Empty state with "شروع خرید".

## Addresses — prototype `#/account/addresses`
- [ ] `AddressForm` wired to the existing address mutations and validation. Errors appear per field.

## Favourites — prototype `#/account/favorites`
- [ ] Existing wishlist → `ProductGrid` (1 column in the account column on tablet, 2 at 1024px, 3 at 1280px). Empty state.

## Policy pages — prototype `#/page/payment`
- [ ] `PolicyPageLayout` with content from Shopify pages / policies / CMS. Footer `info`.
- [ ] Pages without approved content keep a neutral placeholder. Do not invent policy text.

## Global states
- [ ] Toasts through the existing notification system, styled with `Toast`.
- [ ] Loading: keep production's loading and skeleton behaviour. Use the placeholder surfaces (`t-ph`) so layout does not shift.
- [ ] Errors: network or API errors surface through the existing mechanism; forms show inline `role="alert"` messages.
