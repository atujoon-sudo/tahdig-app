/**
 * TAHDIG design tokens — the approved values from the reference prototype
 * (assets/css/tahdig.css). Single source for the Tailwind 4 theme (build-theme.mjs → tahdig.theme.css) and for any
 * JS that needs a value (e.g. matchMedia breakpoints).
 */
export const colors = {
  green: '#1C4A3D',        // primary: buttons, cart, promo panel
  greenDeep: '#25443A',    // meal panel background
  heading: '#1D5243',      // section / page headings
  ink: '#1F2421',          // body text, product names
  ink2: '#4B4F4A',         // secondary body text
  slate: '#576B7C',        // secondary / meta text — AA (≥4.5:1) on every surface it is used on
  slateSoft: '#5B6F7E',    // home hero copy + search placeholder/icons — AA on page and cream
  gold: '#B5892F',         // accent fills: meal CTA (large text), highlighted social icon, gold icons
  goldAA: '#947026',       // gold fill behind WHITE normal-size text (cart/drawer count badges, promo pill) — 4.56:1
  goldText: '#86621F',     // gold-toned small text on the light gold badge (#F4E8CF) — 4.56:1
  goldStep: '#CAA35E',     // meal-step numerals on greenDeep — 4.55:1 (border stays goldSoft)
  goldSoft: '#C9A15A',     // meal-step outlines, bank card border
  goldHighlight: '#E9B45E', // "ته‌دیگ" highlight in newsletter heading
  cream: '#FBF8F2',        // surfaces: header, cards, panels
  page: '#F4EFE4',         // page background
  beige: '#E4DBCA',        // category discs, bundles promo, stepper on beige
  beige2: '#EFEADF',       // sort bar, concept notes
  chip: '#F0ECE4',         // tabs, ghost buttons
  sand: '#F2EDE3',         // notes, recipe meta bar
  line: '#E3DCCD',         // hairlines
  line2: '#D9D0BE',        // outlined controls
  trustBg: '#FAF7F1',      // trust section band
  bottomBg: '#FFF9EE',     // copyright band
  danger: '#B5462F',
  ok: '#2F6B4F',
  okBg: '#E6EFE8',
  warnBg: '#F7EEDB',
  text: '#2A2A26',         // body default
} as const;

export const fontFamily = {
  /** Load Vazirmatn with next/font/google (weights 400–900) and expose it as --font-vazirmatn */
  tahdig: ['var(--font-vazirmatn, Vazirmatn)', 'Vazirmatn', 'Tahoma', 'sans-serif'],
} as const;

/** Type scale in px as used by the approved UI: [size, lineHeight, weight] */
export const type = {
  heroPhone: [31, 1.35, 900], hero: [34, 1.35, 900], heroDesktop: [38, 1.35, 900],
  sectionTitle: [26, 1.45, 900], sectionTitleDesktop: [28, 1.45, 900],
  pageTitle: [26, 1.45, 900], pageTitleTablet: [30, 1.45, 900], pageTitleDesktop: [34, 1.45, 900],
  mealTitlePhone: [29, 1.4, 900], mealTitle: [32, 1.4, 900],
  pdpTitle: [22, 1.6, 800], pdpTitleTablet: [24, 1.6, 800], pdpTitleDesktop: [28, 1.6, 800],
  h2: [19, 1.5, 800], h3: [16.5, 1.5, 800],
  cardName: [15.5, 1.6, 500], cardWeight: [14, 1.6, 400], priceCard: [20, 1.6, 800], pricePdp: [28, 1.6, 800],
  body: [15, 2, 400], bodySmall: [14, 1.8, 400], meta: [13, 1.7, 400], micro: [12.5, 1.5, 400],
  button: [16, 1.2, 700], buttonSmall: [15, 1.2, 700],
} as const;

export const radius = { card: 22, panel: 18, button: 16, control: 14, small: 12, thumb: 16, pill: 22 } as const;

export const shadow = {
  card: '0 14px 28px -14px rgba(150,120,70,.24), 0 2px 5px rgba(150,120,70,.05)',
  soft: '0 10px 16px -12px rgba(120,100,60,.25)',
  button: '0 10px 18px -10px rgba(28,74,61,.7)',
  cartButton: '0 10px 20px -8px rgba(28,74,61,.55)',
  search: '0 12px 26px -12px rgba(60,50,30,.22)',
  contact: '0 14px 26px -14px rgba(28,74,61,.7)',
  toast: '0 14px 28px -12px rgba(20,40,32,.5)',
} as const;

/** min-width breakpoints. `xs` exists because the approved phone scale applies at ≤480px. */
export const screens = { xs: 481, sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

export const layout = {
  containerMax: 1200,
  gutter: { base: 16, sm: 24, md: 32 },   // side padding: <640 / 640–767 / ≥768
} as const;

/** Control and touch-target sizes (px) */
export const size = {
  touchMin: 44,        // minimum interactive target
  control: 52,         // inputs, add-to-cart button, stepper
  cta: 56,             // primary full-width buttons
  ctaFeature: 74,      // meal panel gold CTA
  headerPhone: 90, header: 108,
  cartButtonPhone: 48, cartButton: 56,
  stepperButton: 44, stepperButtonSmall: 36,
  addButton: { w: 56, h: 52 },
} as const;

export const motion = {
  easeOut: 'cubic-bezier(.23,1,.32,1)',
  easeDrawer: 'cubic-bezier(.32,.72,0,1)',
  press: '140ms',
} as const;
