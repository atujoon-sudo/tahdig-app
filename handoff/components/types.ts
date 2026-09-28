/**
 * View models for the TAHDIG UI layer.
 * These are PRESENTATION shapes only. Map production data (Shopify Storefront
 * API, Meilisearch hits, Zustand cart store, SWR responses) into them in the
 * container/page layer — never inside these components.
 */
export type Href = string;

export interface Money { amount: number; currencyCode: string }

export interface ImageData { url: string; alt?: string; width?: number; height?: number }

/** Comparison price, e.g. 4.5 € per kg. Only pass when meaningful (not for 1 kg / 1 L packs). */
export interface UnitPriceData { amount: number; currencyCode: string; unit: 'kg' | 'l' }

export interface ProductCardData {
  id: string;
  href: Href;
  title: string;
  /** package size / selected variant title, e.g. "۱۰ کیلوگرم" */
  sizeLabel: string;
  price: Money;
  compareAtPrice?: Money | null;
  unitPrice?: UnitPriceData | null;
  available: boolean;
  image?: ImageData | null;
  /** merchandise (variant) id used for cart actions */
  variantId: string;
}

/** Cart quantity for a variant + callbacks owned by the production cart store */
export interface CartControlProps {
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  /** href of the product page notify form (out-of-stock) */
  notifyHref?: Href;
  busy?: boolean;
}

export interface VariantOption { id: string; label: string; available: boolean }

export interface SpecRow { label: string; value: string }

export interface ProductDetailData {
  title: string;
  latinTitle?: string;          // English · Finnish name for discovery
  sku?: string;
  availabilityLabel: string;    // e.g. "موجود در انبار فنلاند" / "ناموجود"
  available: boolean;
  tags?: string[];
  description?: string;
  images: ImageData[];
  optionName?: string;          // e.g. "وزن"
  variants?: VariantOption[];
  selectedVariantId?: string;
  price: Money;
  compareAtPrice?: Money | null;
  unitPrice?: UnitPriceData | null;
  specs?: SpecRow[];
  ingredientsText?: string;
  storageText?: string;
  cookingText?: string;
  shippingText?: string;
}

export interface Crumb { label: string; href?: Href }

export interface CategoryItem { id: string; label: string; href: Href; image?: ImageData | null; count?: number }

export interface RecipeCardData { id: string; href: Href; title: string; difficulty: string; servings: number; time: string; image?: ImageData | null }

export interface IngredientRow {
  id: string;
  title: string;
  href: Href;
  needLabel: string;       // "نیاز: ۲۰۰ گرم"
  packLabel: string;       // "۱ بسته ۲۰۰ گرم"
  lineTotal?: Money | null;
  available: boolean;
  selected: boolean;
  image?: ImageData | null;
}

export interface PantryRow { id: string; label: string; have: boolean; soldHere?: boolean }

export interface CartLineData {
  id: string;
  href: Href;
  title: string;
  variantLabel: string;
  isBundle?: boolean;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
  image?: ImageData | null;
}

export interface CartTotalsData {
  itemCount: number;
  subtotal: Money;
  discount?: { amount: Money; codes: string[] } | null;
  /** null = not known before checkout (shipping calculated after address) */
  shipping?: Money | null;
  /** only when the business has confirmed a free-shipping threshold */
  freeShipping?: { remaining: Money; progress: number } | null;
  total: Money;
  totalIncludesShipping: boolean;
}

export interface BundleCardData {
  id: string; href: Href; title: string; description: string;
  contents: string[]; price: Money; compareAtPrice?: Money | null;
  savingPercent?: number | null; available: boolean; image?: ImageData | null;
}

export type RecurringStatus = 'draft' | 'active' | 'paused' | 'cancelled';

export interface RecurringLineData { id: string; href: Href; title: string; variantLabel: string; quantity: number; lineTotal: Money; available: boolean; image?: ImageData | null }

export interface OrderSummaryData { id: string; number: string; dateLabel: string; statusLabel: string; itemCount: number; itemsPreview: string; total: Money; href?: Href }

export interface AddressData { name: string; contact: string; street: string; postalCode: string; city: string }

export interface PolicySection { title: string; body?: string; showPaymentLogos?: boolean }
