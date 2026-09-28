/**
 * MOCK DATA for the preview/storybook only — mirrors the reference prototype catalog.
 * In production these view models are produced by mappers from Shopify / Meilisearch data.
 */
import type { BundleCardData, CategoryItem, ProductCardData, ProductDetailData, RecipeCardData } from '../components/types';

const eur = (amount: number) => ({ amount, currencyCode: 'EUR' });
const perKg = (amount: number) => ({ amount, currencyCode: 'EUR', unit: 'kg' as const });

export const categories: CategoryItem[] = [
  { id: 'rice', label: 'برنج و غلات', href: '/collections/rice', count: 1 },
  { id: 'spice', label: 'ادویه و چاشنی', href: '/collections/spice', count: 3 },
  { id: 'pickle', label: 'ترشیجات', href: '/collections/pickle', count: 1 },
  { id: 'legume', label: 'حبوبات', href: '/collections/legume', count: 1 },
  { id: 'canned', label: 'کنسرو و آماده', href: '/collections/canned', count: 1 },
  { id: 'nuts', label: 'خشکبار', href: '/collections/nuts', count: 1 },
];

export const products: ProductCardData[] = [
  { id: 'p1', variantId: 'v103', href: '/products/tarom-hashemi-rice', title: 'برنج طارم هاشمی درجه یک', sizeLabel: '۱۰ کیلوگرم', price: eur(45), unitPrice: perKg(4.5), available: true },
  { id: 'p2', variantId: 'v201', href: '/products/saffron-sargol', title: 'زعفران سرگل ممتاز', sizeLabel: '۱۰ گرم', price: eur(22), compareAtPrice: eur(26), unitPrice: perKg(2200), available: true },
  { id: 'p3', variantId: 'v301', href: '/products/polo-spice-mix', title: 'ادویه مخصوص پلویی', sizeLabel: '۴۰۰ گرم', price: eur(12), unitPrice: perKg(30), available: true },
  { id: 'p4', variantId: 'v401', href: '/products/olive-oil-extra-virgin', title: 'روغن زیتون فرابکر', sizeLabel: '۵۰۰ میلی‌لیتر', price: eur(14), unitPrice: { amount: 28, currencyCode: 'EUR', unit: 'l' }, available: true },
  { id: 'p5', variantId: 'v501', href: '/products/red-kidney-beans', title: 'لوبیا قرمز درجه یک', sizeLabel: '۹۰۰ گرم', price: eur(8), unitPrice: perKg(8.89), available: false },
  { id: 'p6', variantId: 'v601', href: '/products/dried-ghormeh-herbs', title: 'سبزی خشک قورمه‌سبزی', sizeLabel: '۲۰۰ گرم', price: eur(9), unitPrice: perKg(45), available: true },
  { id: 'p7', variantId: 'v701', href: '/products/bulgarian-pickles', title: 'خیارشور بلغاری ممتاز', sizeLabel: '۷۰۰ گرم', price: eur(7), compareAtPrice: eur(9), unitPrice: perKg(10), available: true },
  { id: 'p8', variantId: 'v801', href: '/products/pistachio-akbari', title: 'پسته اکبری درجه یک', sizeLabel: '۵۰۰ گرم', price: eur(19), unitPrice: perKg(38), available: true },
];

export const riceDetail: ProductDetailData = {
  title: 'برنج طارم هاشمی درجه یک', latinTitle: 'Tarom Hashemi rice · Riisi', sku: 'GM1000-41', availabilityLabel: 'موجود در انبار فنلاند', available: true,
  tags: ['برنج', 'غلات', 'معطر', 'اورگانیک', 'ایرانی'],
  description: 'از یک محصول غذایی با کیفیت بالا که با دقت برای راحتی روزمره انتخاب شده است، لذت ببرید. این محصول برای ارائه طعم عالی و تازگی قابل اعتماد انتخاب شده است.',
  images: [], optionName: 'وزن',
  variants: [{ id: 'v101', label: '۱ کیلوگرم', available: true }, { id: 'v102', label: '۵ کیلوگرم', available: true }, { id: 'v103', label: '۱۰ کیلوگرم', available: true }],
  selectedVariantId: 'v103', price: eur(45), unitPrice: perKg(4.5),
  specs: [{ label: 'برند', value: 'ته‌دیگ اورجینال' }, { label: 'تاریخ تولید', value: 'مرداد ۱۴۰۵' }, { label: 'وزن محصول', value: '۱، ۵، ۱۰ کیلوگرم' }, { label: 'تاریخ انقضاء', value: 'مرداد ۱۴۰۷' }, { label: 'نوع بسته‌بندی', value: 'کیسه نخی' }, { label: 'مناسب برای', value: 'چلو و پلوهای مجلسی' }],
  ingredientsText: 'اطلاعات ترکیبات و ارزش غذایی این محصول به‌زودی در این بخش نمایش داده می‌شود.',
  storageText: 'در جای خشک و خنک، دور از نور مستقیم و رطوبت نگهداری شود. پس از بازکردن بسته، آن را کاملاً بسته نگه دارید.',
  cookingText: 'برنج را چند مرتبه با آب سرد بشویید. در صورت تمایل، پیش از پخت در آب و نمک خیس کنید و سپس به روش کته یا آبکش بپزید.',
  shippingText: 'روش‌ها، هزینه و زمان تقریبی تحویل پس از واردکردن نشانی در مرحله پرداخت نمایش داده می‌شود. پس از ارسال، اطلاعات پیگیری سفارش در اختیارت قرار می‌گیرد.',
};

export const recipes: RecipeCardData[] = [
  { id: 'r1', href: '/recipes/sabzi-polo-mahi', title: 'سبزی‌پلو با ماهی', difficulty: 'آسان', servings: 4, time: '۱ ساعت و ۳۰ دقیقه' },
  { id: 'r2', href: '/recipes/ghormeh-sabzi', title: 'خورشت قورمه‌سبزی', difficulty: 'متوسط', servings: 4, time: '۲ ساعت' },
  { id: 'r3', href: '/recipes/gheimeh', title: 'خورشت قیمه', difficulty: 'آسان', servings: 4, time: '۱ ساعت و ۴۵ دقیقه' },
];

export const bundles: BundleCardData[] = [
  { id: 'b1', href: '/bundles/ghormeh-sabzi-kit', title: 'پکیج قورمه‌سبزی', description: 'همه مواد لازم یک خورشت کامل برای ۴ نفر', contents: ['ادویه مخصوص پلویی', 'سبزی خشک قورمه‌سبزی', 'لوبیا قرمز درجه یک'], price: eur(26), compareAtPrice: eur(29), savingPercent: 10, available: false },
  { id: 'b2', href: '/bundles/party-pack', title: 'پکیج مهمانی', description: 'برنج، زعفران و ادویه برای ۸ نفر', contents: ['برنج طارم هاشمی درجه یک', 'زعفران سرگل ممتاز', 'ادویه مخصوص پلویی'], price: eur(74), compareAtPrice: eur(79), savingPercent: 6, available: true },
  { id: 'b3', href: '/bundles/persian-breakfast', title: 'پکیج صبحانه ایرانی', description: 'روغن و ترشی محلی', contents: ['روغن زیتون فرابکر', 'خیارشور بلغاری ممتاز'], price: eur(19), compareAtPrice: eur(21), savingPercent: 10, available: true },
];

export const footerLinks = [
  { title: 'خدمات مشتری', displayTitle: 'خدمـــات مشتـــری', links: [{ href: '/pages/support', label: 'پشتیبانی' }, { href: '/pages/payment', label: 'روش‌های پرداخت' }, { href: '/pages/shipping', label: 'ارسال و تحویل' }, { href: '/pages/returns', label: 'مرجوعی و بازپرداخت' }] },
  { title: 'دسترسی سریع', displayTitle: 'دستـــرسی ســریع', links: [{ href: '/products', label: 'محصولات' }, { href: '/recipes', label: 'غذاها و دستورپخت‌ها' }, { href: '/bundles', label: 'پکیج‌های آماده' }, { href: '/recurring', label: 'خرید دوره‌ای' }, { href: '/cart', label: 'سبد خرید' }, { href: '/account', label: 'حساب کاربری' }] },
  { title: 'درباره ما', displayTitle: 'دربـــاره ما', defaultOpen: true, links: [{ href: '/pages/about', label: 'درباره ته‌دیگ' }, { href: '/pages/contact', label: 'تماس با ما' }, { href: '/pages/privacy', label: 'حریم خصوصی' }, { href: '/pages/terms', label: 'شرایط و قوانین' }] },
];
export const banks = ['OP', 'OmaSP', 'ÅLANDSBANKEN', 'S-Pankki', 'Nordea', 'Danske Bank'];
