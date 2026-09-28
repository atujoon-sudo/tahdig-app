# Responsive specification

The design is mobile-first and real iPhone Safari is the primary reference. Breakpoints are `min-width`:

| Token | Width | Meaning |
|---|---|---|
| (base) | ≤480 | **Approved phone scale** (header 90px, hero 31px, compact search, meal 29px) |
| `xs` | 481 | Large-phone / small-tablet base values of the approved home sections |
| `sm` | 640 | Gutter 24px; 2-column grids |
| `md` | 768 | Gutter 32px; **tablet layout state** (two-column pages) |
| `lg` | 1024 | Desktop composition; rails become grids |
| `xl` | 1280 | 4-column product grid and rail |

The container is at most 1200px wide, with 16px / 24px / 32px side gutters (below 640 / 640–767 / 768 and up).

## Measured layout per width (from the approved prototype)

| | 390 | 430 | 768 | 820 | 1024 | 1280 | 1440 |
|---|---|---|---|---|---|---|---|
| Gutter | 16 | 16 | 32 | 32 | 32 | 32 | 32 |
| Header height | 91 (90 + 1px line) | 91 | 109 | 109 | 109 | 109 | 109 |
| Home picks | swipe row, card 300×371, next card peeks 58px | row, 310×381 | row, 300×383 | row, 300×383 | grid 3 × 304 | grid 4 × 266 | grid 4 × 266 |
| Meal panel | 358×839 stacked | 398×833 | 704×830 | 756×830 | 960×590, text \| collage | 1136×590 | 1136×590 |
| Promo panels | 1 col | 1 col | 2 × 342 | 2 × 368 | 2 × 466 | 2 × 554 | 2 × 554 |
| Trust grid | 2 × 175 | 2 × 195 | 4 × 170 | 4 × 183 | 4 × 234 | 4 × 278 | 4 × 278 |
| Product grid | 1 × 358 | 1 × 398 | 2 × 340 | 2 × 366 | 3 × 301 | 4 × 263 | 4 × 263 |
| PDP | stacked | stacked | image 336 \| info 336 | 362 \| 362 | 463 \| 441 (gap 56) | 553 \| 527 | 553 \| 527 |
| Recipes / bundles grid | 1 col | 1 col | 2 × 342 | 2 × 368 | 3 × 301 | 3 × 360 | 3 × 360 |
| Recipe detail | stacked | stacked | dish 354 \| shop 322 | 381 \| 347 | 478 \| 434 | 570 \| 518 | 570 \| 518 |
| Cart | stacked | stacked | lines 402 \| side 278 | 433 \| 299 | 549 \| 379 | 653 \| 451 | 653 \| 451 |
| Account | profile + nav only | same | side 290 \| main 390 | 290 \| 442 | 340 \| 588 | 340 \| 764 | 340 \| 764 |

## Component behaviour

### Header (frozen)
- ≤480px: bar 90px. Menu button 44px (icon 24px), logo 58px tall, cart button 48px with radius 14px (icon 20px).
- ≥481px: bar 108px. Menu button 48px (icon 28px), logo 70px, cart button 56px with radius 16px (icon 22px).
- The same composition at every width. There is no desktop nav bar; the drawer is the navigation. This is intentional, because the header is frozen.

### Hero + search band (frozen)
- ≤480px:
  - hero padding-top 31px;
  - h1 31px/1.35, weight 900;
  - subtitle margin-top 2px;
  - search zone margin-top 34px, green band starting 28px below its top;
  - search 56px, radius 28px; go button 44px;
  - chips margin-top 20px; band padding-bottom 44px.
- ≥481px: 48px / h1 34px / 6px / 56px (band from 31px) / search 62px, radius 31px, go 48px / chips 24px / band 62px.
- ≥1024px: centred hero, h1 38px, subtitle 16px, search max-width 760px centred, chips centred.

### Category carousel (frozen)
- Native horizontal scroll with `scroll-snap-type: x proximity`, items `snap-start`.
- Item 88px wide, disc 80px, gap 16px (24px from 1024). Centred when the row fits (from 640).
- Section padding-top: 36px on phones after the search band, 48px from 481.

### Meal panel (frozen)
- ≤480px:
  - margin-top 12px; h2 29px with no side padding;
  - copy 13px/2, two balanced lines;
  - collage square of `min(260px, 50vw + 45px)`, margin 20 / 24;
  - step boxes 74px, dotted connector 46px;
  - CTA 74px full width, margin-top 40px.
- ≥481px: margin-top 64px, h2 32px (8px side padding), copy 13.5px/2.05, collage `min(290px, 80%)` at 290:220, step boxes 80px, connector 52px, CTA margin 32px with 8px inset.
- ≥1024px: two columns (text, steps and CTA | collage 360px), padding 40 / 40 / 32, column gap 48px.

### Product rail
- <1024px: swipe row with `x proximity` start snap and 28px vertical padding.
  - Card width `calc(25vw + 202.5px)` at ≤480px (300px at 390, 310px at 430), 300px above that.
  - Image width `min(240px, 25vw + 131px)`.
- ≥1024px: grid of 3 with 24px gap; ≥1280px: 4 columns and the 5th+ card is hidden.

### Product card
- Padding 16 / 16 / 20, radius 22px, soft card shadow.
- Image square, max 240px in rails and 260px in the phone/tablet grid.
- Name 15.5px/500; size 14px slate; price 20px/800; unit price 12.5px slate.
- Cart button 56×52px, radius 16px; stepper 52px tall with 44px buttons.

### Product grid
- 1 column below 640px, 2 from 640, 3 from 1024, 4 from 1280.
- Gap 20px, 24px from 768, 28px from 1024.
- 3 columns was tested at 768 and rejected: cards became about 207px and prices wrapped.

### Product detail
- <640px:
  - breadcrumbs and gallery sit on a full-bleed cream band;
  - the information follows on the page background;
  - title 22px.
- 640–767px: stacked, gallery max 560px centred.
- ≥768px: image | information (1fr / 1fr, 32px gap), gallery sticky at top 20px, title 24px, 4 thumbnails.
- ≥1024px: 1.05fr / 1fr, 56px gap, title 28px.
- Sticky buy bar <1024px only. It appears once the main CTA is above the viewport and is `visibility:hidden` + `inert` when hidden.

### Recipe detail
- <768px: hero (4:3; 16:8 from 640) · title + meta · servings · ingredients · other ingredients · method.
- ≥768px: grid areas `hero shop / head shop / method shop`, columns 1.1fr / 1fr, gap 28px, shopping column sticky.
- ≥1024px: 1.2fr / 1fr, gap 48px, hero 16:10.

### Cart
- <768px: lines · discount · summary · complements.
- ≥768px: areas `lines side / comp side`, columns 1.45fr / 1fr, gap 24px (32px from 1024), side column sticky.
- Cart line layouts:
  - <640px: image + info, controls on a second row;
  - 640–767px: one row (image, info, controls);
  - 768–1023px: stacked again, because the column is narrow;
  - ≥1024px: one row.

### Account
- <768px: the account home shows profile + navigation; sub-pages show only their content, with breadcrumbs back.
- ≥768px: side 290px (340px from 1024), sticky | content.
  - Overview cards: 1 column, 2 from 1024.
  - Orders: 2 columns from 1024.
  - Favourites: 1, 2 and 3 columns (tablet, 1024, 1280).
  - Address form: 2 columns from 1024.

### Recurring
- <768px: list, then settings.
- ≥768px: list | sticky settings (1.45fr / 1fr). Action buttons stack in the side column and sit in 2 columns from 1024.
- Intro steps: 1 column, 3 from 640.

### Policy pages
- <768px: article, then help and related pages stacked.
- 768–1023px: help and related side by side under the article.
- ≥1024px: article | sticky 340px column.

### Footer
- Trust grid: 2 columns, 4 from 640.
- Newsletter | link accordions side by side from 768 (1.1fr / 1fr, gap 32px; 56px from 1024).
- Brand, contact and social stay centred at max 640px.

## Touch targets and sizes
- Minimum interactive target 44px: crumbs 40px tall rows plus spacing, trash 44px, `TextAction` 44px, footer links 44px.
- Controls: inputs 52px, primary CTA 56px, choice chips 48px, add-to-cart 56×52px, stepper buttons 44px (36px in cart lines).
- Inputs use 16px text so iOS Safari does not zoom.
