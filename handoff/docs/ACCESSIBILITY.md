# Accessibility pass (measured)

The final pass was measured on the Next 16 production build (`harness/`), not estimated.

- **Contrast:** every visible text node on all 16 preview pages, at 390 and 1024px, in `fa` and `en`, against its real composited background, to WCAG 2.2 AA:
  - normal text needs 4.5:1;
  - large text (24px+, or 18.66px+ bold) needs 3:1.
- **Touch targets:** every link, button and checkbox in `main` and `header` on 8 key pages at 390px. "Effective" size includes the invisible hit-area extension.

Only failing combinations were changed. Nothing was redesigned, and no geometry moved: the frozen home region keeps identical height and element boxes at 390 / 430 / 820 / 1024 / 1440.

## Colour changes (tiny, intentional)

All values live in `styles/tokens.ts`, which generates `tahdig.theme.css`.

| Where | Before → after | Measured before → after |
|---|---|---|
| Home hero subtitle, search placeholder, camera/mic icons (`slateSoft`) | `#6A8193` → `#5B6F7E` | 3.54 / 3.83 → ≥ 4.6 on page and cream |
| Secondary/meta text on sand, beige and total boxes (`slate`) | `#5A6F80` → `#576B7C` | 4.31–4.48 → ≥ 4.5 everywhere it is used |
| Gold badge text, e.g. "۶٪ صرفه‌جویی" (`goldText`) | `#8A6520` → `#86621F` | 4.36 → 4.56 on `#F4E8CF` |
| Meal-step numerals ۱ ۲ ۳ on the dark meal panel (`goldStep`; the ring stays `goldSoft`) | `#C9A15A` → `#CAA35E` | 4.44 → 4.55 on `greenDeep` |
| White 12–15px text on gold: header cart badge, drawer count, green promo pill "ساخت اشتراک من" (`goldAA`) | `#B5892F` → `#947026` | 3.19 → 4.56 |

The rename `goldText` (#E9B45E) → `goldHighlight` is not a colour change. It is the "ته‌دیگ" highlight in the newsletter heading.

**Unchanged on purpose**
- The gold meal CTA "انتخاب غذا" is 20px bold, which counts as large text, and passes 3:1 with `#B5892F`.
- Gold icons are non-text.
- The highlighted social tile uses icons only.

**Visible effect.** At a glance these are indistinguishable. Side by side:
- the header cart badge (when the cart has items), the drawer count and the promo pill are a slightly deeper gold;
- the hero subtitle and search placeholder are a touch darker.

## Remaining audit findings (not failures)

| Finding | Why it stays |
|---|---|
| Quick-search chips reported at 1.08:1 | Measurement artefact. The script picks the transparent stop of the green-band gradient. The real background is `#1C4A3D` (chip fill 6% white), where the text measures 5.61:1. |
| Payment-method placeholder boxes ("VISA"…) at 2.51:1 | Neutral stand-ins for the licensed logos, which `PaymentLogos logos={…}` replaces. Logotypes are exempt from contrast requirements. |

## Touch targets

Every control has an effective area of at least 44×44 CSS px, with no layout drift. The small controls keep their visible size and get a transparent `::after` extension (`relative after:absolute after:-inset-*`):

| Control | Visible | Effective |
|---|---|---|
| Cart/recurring `QtyStepper size="sm"` ± | 36×36 | 44×44 |
| Remove discount code (×) | 36×36 | 44×44 |
| Home quick-search chips | 32 high | 44 high |
| Breadcrumb links | 40 high | 44 high |
| Recipe "دارم" toggle, account card links, complement/picker "افزودن" | 40 high | 44 high |
| Recipe ingredient checkbox | 26×26 | 46×46 |
| Search bar camera / mic (visual "coming soon" buttons, phone) | 36×40 | **40×44** — adjacent to each other, so 44 wide is impossible without overlap. This meets WCAG 2.5.8 (24px); both buttons are inert placeholders. |

**Icon-only controls.** Menu, search, cart, favourite, zoom and remove keep **no visible text**. Their accessible names come from `aria-label` and are localized through `labels`:
- the cart link reads "سبد خرید، ۲ محصول" / "Cart, 2 items";
- quantity controls read "تعداد <product>".

## Other checks
- `html lang` and `dir` come from the `[locale]` layout: `fa`/rtl, `fi`/ltr, `en`/ltr. Latin names inside Persian text use `<bdi>`.
- The hidden sticky buy bar uses React 19's boolean `inert` plus `aria-hidden`, so it never traps focus.
- Drawer and confirm sheet: Escape closes, focus moves in and returns, Tab is trapped while open, and the page scroll is locked.
- Visible focus ring (`2px #B5892F`, offset 2px) on every focusable element.
- `prefers-reduced-motion`: transitions and the marquee stop.
