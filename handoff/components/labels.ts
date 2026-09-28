/**
 * Default UI copy (Persian, approved). Override any key through
 * <TahdigUIProvider labels={...}> (client) or the `labels` prop of server-safe
 * components — e.g. from the production i18n dictionaries.
 * All values are plain strings so they can cross the Server → Client boundary.
 * Placeholders: {0}, {1} … filled with tpl().
 * Product/content text always comes from data props, never from here.
 */
export const defaultLabels = {
  menu: 'منو', closeMenu: 'بستن منو', cart: 'سبد خرید', home: 'صفحه اصلی', homeLogo: 'ته‌دیگ، صفحه اصلی',
  search: 'جستجو', searchPlaceholder: 'مثلاً برنج ایرانی، زعفران...', searchLabel: 'جستجوی محصول، برند یا غذا',
  imageSearchSoon: 'جستجو با تصویر (به‌زودی)', voiceSearchSoon: 'جستجوی صوتی (به‌زودی)',
  addToCart: 'افزودن به سبد', addOneMore: 'افزودن یکی دیگر', removeOne: 'کم کردن یکی', remove: 'حذف',
  outOfStock: 'ناموجود', notifyMe: 'خبرم کن', notifyWhenBack: 'وقتی موجود شد خبرم کن',
  notifyIntroTitle: 'فعلاً ناموجود است.', notifyIntro: 'ایمیلت را بگذار تا به محض موجود شدن خبرت کنیم.',
  emailPlaceholder: 'ایمیل شما', invalidEmail: 'یک ایمیل معتبر وارد کن',
  inCartNote: '{0} عدد از این محصول در سبد توست', viewCart: 'مشاهده سبد',
  addToRecurring: 'افزودن به خرید دوره‌ای', inRecurring: 'در فهرست خرید دوره‌ای توست ({0} عدد)',
  assurePayment: 'پرداخت امن', assureTracking: 'ارسال قابل پیگیری', assureSupport: 'پشتیبانی به زبان خودت',
  productCode: 'کد محصول:', selectOption: 'انتخاب {0}',
  specs: 'مشخصات محصول', ingredients: 'ترکیبات و اطلاعات تغذیه‌ای', storage: 'شرایط نگهداری', cooking: 'روش پخت', shipping: 'روش ارسال',
  alsoWith: 'همراه این محصول', similar: 'محصولات مشابه',
  sort: 'مرتب سازی:', productsCount: '{0} محصول', loadMore: 'محصولات بیشتر',
  viewIngredients: 'مشاهده مواد لازم', servingsQ: 'برای چند نفر می‌پزی؟', people: '{0} نفر',
  buyableIngredients: 'مواد قابل خرید از ته‌دیگ', buyableHint: 'تعداد بسته‌ها بر اساس تعداد نفرات حساب شده است. هر مورد را که نمی‌خواهی بردار.',
  addIngredients: 'افزودن مواد به سبد', otherIngredients: 'مواد دیگر این غذا',
  otherHint: 'این مواد را ته‌دیگ نمی‌فروشد و باید جداگانه تهیه شود؛ آنچه در خانه داری را علامت بزن.',
  soldHere: 'در ته‌دیگ موجود است', iHave: 'دارم', buy: 'خرید', method: 'طرز تهیه',
  discountQ: 'کد تخفیف داری؟', discountHint: 'کد را وارد کن تا تخفیف روی سفارشت اعمال شود.', discountPlaceholder: 'کد تخفیف', applyCode: 'اعمال کد',
  yourCart: 'سبد خرید شما', itemsInCart: '{0} محصول در سبد خرید', subtotal: 'جمع محصولات', shippingCost: 'هزینه ارسال',
  shippingLater: 'در مرحله بعد', shippingLaterHint: 'هزینه ارسال پس از وارد کردن نشانی محاسبه می‌شود', free: 'رایگان',
  freeRemaining: '{0} تا ارسال رایگان', freeReached: 'ارسال رایگان برای این سفارش فعال است',
  discount: 'تخفیف', total: 'جمع کل', totalNoShipping: 'جمع کل (بدون ارسال)', taxIncluded: 'مالیات در قیمت محصولات لحاظ شده است',
  checkout: 'ادامه و انتخاب روش ارسال', securePayment: 'پرداخت از مسیرهای امن و معتبر', removeCode: 'حذف کد تخفیف {0}',
  complementsTitle: 'شاید این‌ها را هم لازم داشته باشی', add: 'افزودن', each: 'هر عدد {0}', bundleTag: 'پکیج',
  emptyCartTitle: 'سبد خریدت خالی است', emptyCartText: 'محصولات را از فروشگاه یا از مواد لازم یک غذا اضافه کن.', startShopping: 'شروع خرید',
  viewBundle: 'مشاهده پکیج', bundleIncludes: 'شامل این محصولات', separatePrice: 'قیمت جداگانه', bundlePrice: 'قیمت پکیج', yourSaving: 'صرفه‌جویی تو',
  addBundle: 'افزودن پکیج به سبد', savingBadge: '{0}٪ صرفه‌جویی',
  myList: 'فهرست من', status: 'وضعیت', frequency: 'فاصله ارسال', nextDelivery: 'ارسال بعدی', perDelivery: 'مبلغ هر ارسال (تقریبی)',
  shippingAtOrder: 'هنگام ثبت محاسبه می‌شود', addProduct: 'افزودن محصول', closeProducts: 'بستن فهرست محصولات', searchProduct: 'جستجوی محصول...',
  guest: 'کاربر مهمان', guestHint: 'برای پیگیری آسان‌تر سفارش‌ها وارد حساب شو.', signIn: 'ورود یا ساخت حساب',
  helpTitle: 'هنوز پاسخ را پیدا نکردی؟', helpText: 'پیامت را برای ما بفرست تا پس از بررسی راهنمایی‌ات کنیم.', contactSupport: 'تماس با پشتیبانی',
  updatedOn: 'ویرایش در {0}', helpPages: 'صفحه‌های راهنما',
  cancel: 'انصراف', unitKg: 'کیلو', unitL: 'لیتر', perUnit: 'هر {0} {1}',
  addToFavorites: 'افزودن به علاقه‌مندی‌ها', removeFromFavorites: 'حذف از علاقه‌مندی‌ها', zoomImage: 'بزرگ‌نمایی تصویر',
  breadcrumbs: 'مسیر صفحه', mainMenu: 'منوی اصلی', categoriesTitle: 'دسته‌بندی محصولات', cartWithCount: 'سبد خرید، {0} محصول',
  quantityOf: 'تعداد {0}',
  imageOf: 'تصویر {0} از {1}: {2}', imageN: 'تصویر {0}', productImages: 'تصاویر محصول', purchaseAssurance: 'اطمینان خرید',
  notifyEmailLabel: 'ایمیل برای اطلاع از موجود شدن', notifyConfirmed: 'وقتی «{0}» دوباره موجود شد، به {1} خبر می‌دهیم.', defaultOption: 'وزن', listSep: '، ',
  oosIngredients: '{0} ماده فعلاً ناموجود است و به سبد اضافه نمی‌شود.', selectionSummary: '{0} محصول · {1} بسته', addedToCart: '{0} محصول به سبد اضافه شد',
  buyItem: 'خرید {0}', iHaveItem: '{0} را دارم', cartItems: 'محصولات سبد',
  bundleOos: 'فعلاً ناموجود', savingVsSeparate: '{0}٪ صرفه‌جویی نسبت به خرید جداگانه', unitCount: '{0} عدد', bundlesInCart: '{0} پکیج در سبد توست', orderItems: '{0} قلم',
};

/** Fill {0}, {1} … placeholders. */
export function tpl(template: string, ...values: Array<string | number>): string {
  return template.replace(/\{(\d+)\}/g, (_, i) => String(values[Number(i)] ?? ''));
}
export type Labels = { [K in keyof typeof defaultLabels]: string };
