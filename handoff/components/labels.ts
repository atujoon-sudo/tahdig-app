/**
 * Default UI copy (Persian, approved). Override any key through
 * <TahdigUIProvider labels={...}> — e.g. from the production i18n layer.
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
  inCartNote: (n: string) => `${n} عدد از این محصول در سبد توست`, viewCart: 'مشاهده سبد',
  addToRecurring: 'افزودن به خرید دوره‌ای', inRecurring: (n: string) => `در فهرست خرید دوره‌ای توست (${n} عدد)`,
  assurePayment: 'پرداخت امن', assureTracking: 'ارسال قابل پیگیری', assureSupport: 'پشتیبانی به زبان خودت',
  productCode: 'کد محصول:', selectOption: (o: string) => `انتخاب ${o}`,
  specs: 'مشخصات محصول', ingredients: 'ترکیبات و اطلاعات تغذیه‌ای', storage: 'شرایط نگهداری', cooking: 'روش پخت', shipping: 'روش ارسال',
  alsoWith: 'همراه این محصول', similar: 'محصولات مشابه',
  sort: 'مرتب سازی:', productsCount: (n: string) => `${n} محصول`, loadMore: 'محصولات بیشتر',
  viewIngredients: 'مشاهده مواد لازم', servingsQ: 'برای چند نفر می‌پزی؟', people: (n: string) => `${n} نفر`,
  buyableIngredients: 'مواد قابل خرید از ته‌دیگ', buyableHint: 'تعداد بسته‌ها بر اساس تعداد نفرات حساب شده است. هر مورد را که نمی‌خواهی بردار.',
  addIngredients: 'افزودن مواد به سبد', otherIngredients: 'مواد دیگر این غذا',
  otherHint: 'این مواد را ته‌دیگ نمی‌فروشد و باید جداگانه تهیه شود؛ آنچه در خانه داری را علامت بزن.',
  soldHere: 'در ته‌دیگ موجود است', iHave: 'دارم', buy: 'خرید', method: 'طرز تهیه',
  discountQ: 'کد تخفیف داری؟', discountHint: 'کد را وارد کن تا تخفیف روی سفارشت اعمال شود.', discountPlaceholder: 'کد تخفیف', applyCode: 'اعمال کد',
  yourCart: 'سبد خرید شما', itemsInCart: (n: string) => `${n} محصول در سبد خرید`, subtotal: 'جمع محصولات', shippingCost: 'هزینه ارسال',
  shippingLater: 'در مرحله بعد', shippingLaterHint: 'هزینه ارسال پس از وارد کردن نشانی محاسبه می‌شود', free: 'رایگان',
  freeRemaining: (m: string) => `${m} تا ارسال رایگان`, freeReached: 'ارسال رایگان برای این سفارش فعال است',
  discount: 'تخفیف', total: 'جمع کل', totalNoShipping: 'جمع کل (بدون ارسال)', taxIncluded: 'مالیات در قیمت محصولات لحاظ شده است',
  checkout: 'ادامه و انتخاب روش ارسال', securePayment: 'پرداخت از مسیرهای امن و معتبر', removeCode: (c: string) => `حذف کد تخفیف ${c}`,
  complementsTitle: 'شاید این‌ها را هم لازم داشته باشی', add: 'افزودن', each: (m: string) => `هر عدد ${m}`, bundleTag: 'پکیج',
  emptyCartTitle: 'سبد خریدت خالی است', emptyCartText: 'محصولات را از فروشگاه یا از مواد لازم یک غذا اضافه کن.', startShopping: 'شروع خرید',
  viewBundle: 'مشاهده پکیج', bundleIncludes: 'شامل این محصولات', separatePrice: 'قیمت جداگانه', bundlePrice: 'قیمت پکیج', yourSaving: 'صرفه‌جویی تو',
  addBundle: 'افزودن پکیج به سبد', savingBadge: (p: string) => `${p}٪ صرفه‌جویی`,
  myList: 'فهرست من', status: 'وضعیت', frequency: 'فاصله ارسال', nextDelivery: 'ارسال بعدی', perDelivery: 'مبلغ هر ارسال (تقریبی)',
  shippingAtOrder: 'هنگام ثبت محاسبه می‌شود', addProduct: 'افزودن محصول', closeProducts: 'بستن فهرست محصولات', searchProduct: 'جستجوی محصول...',
  guest: 'کاربر مهمان', guestHint: 'برای پیگیری آسان‌تر سفارش‌ها وارد حساب شو.', signIn: 'ورود یا ساخت حساب',
  helpTitle: 'هنوز پاسخ را پیدا نکردی؟', helpText: 'پیامت را برای ما بفرست تا پس از بررسی راهنمایی‌ات کنیم.', contactSupport: 'تماس با پشتیبانی',
  updatedOn: (d: string) => `ویرایش در ${d}`, helpPages: 'صفحه‌های راهنما',
  cancel: 'انصراف',
};
export type Labels = typeof defaultLabels;
