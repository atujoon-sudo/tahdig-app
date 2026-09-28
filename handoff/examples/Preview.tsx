'use client';
/**
 * PREVIEW / WIRING EXAMPLE — not production code.
 * Shows how a page container maps state into the presentational components.
 * Here state is a local useState "cart"; in production it is the existing
 * Zustand cart store + Shopify cart mutations, and data comes from SWR/Meilisearch.
 * Render with ?page=home|products|product|product-oos|recipes|recipe|cart|cart-empty|bundles|bundle|recurring|account|orders|addresses|favorites|policy
 */
import * as React from 'react';
import {
  TahdigUIProvider, TahdigRoot, Header, MenuDrawer, Footer, HomeHero, CategoryCarousel, MealPanel, PromoPanels, ProductRail, ProductGrid,
  CollectionHeader, SortBar, LoadMoreButton, ProductDetail, RecipeGrid, RecipeDetail, CartLayout, CartLine, CartSummary, CartComplements,
  DiscountCodeForm, CartEmpty, BundleListLayout, BundleDetail, ConceptNote, RecurringLayout, AccountLayout, AccountOverview, OrderList,
  AddressForm, PolicyPageLayout, Container, Breadcrumbs, SearchBar, EmptyState, Button, type ProductCardData, type CartControlProps, type AccountNavItem,
} from '../components';
import { banks, bundles, categories, footerLinks, products, recipes, riceDetail } from './fixtures';

const eur = (amount: number) => ({ amount, currencyCode: 'EUR' });

export function Preview({ page }: { page: string }) {
  const [cart, setCart] = React.useState<Record<string, number>>(page === 'cart' ? { v103: 2, v201: 1, b2: 1 } : page.startsWith('home') ? {} : {});
  const [menu, setMenu] = React.useState(false);
  const [qty, setQty] = React.useState(1);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartFor = (p: ProductCardData): CartControlProps => ({
    quantity: cart[p.variantId] ?? 0, notifyHref: `${p.href}#notify`,
    onAdd: () => setCart((c) => ({ ...c, [p.variantId]: 1 })),
    onIncrement: () => setCart((c) => ({ ...c, [p.variantId]: (c[p.variantId] ?? 0) + 1 })),
    onDecrement: () => setCart((c) => { const n = (c[p.variantId] ?? 0) - 1; const x = { ...c }; if (n > 0) x[p.variantId] = n; else delete x[p.variantId]; return x; }),
  });
  const accountNav: AccountNavItem[] = [
    { key: 'orders', href: '?page=orders', icon: 'doc', label: 'سفارش‌های من', note: '۱ سفارش' },
    { key: 'addresses', href: '?page=addresses', icon: 'pin', label: 'آدرس‌های من', note: 'Helsinki' },
    { key: 'recurring', href: '?page=recurring', icon: 'repeat', label: 'خرید دوره‌ای من', note: 'هنوز فعال نشده' },
    { key: 'favorites', href: '?page=favorites', icon: 'heart', label: 'علاقه‌مندی‌ها', note: '۱ محصول' },
  ];
  const helpNav: AccountNavItem[] = [
    { key: 'support', href: '?page=policy', icon: 'help', label: 'پشتیبانی' }, { key: 'payment', href: '?page=policy', icon: 'card', label: 'روش‌های پرداخت' },
    { key: 'shipping', href: '?page=policy', icon: 'truck', label: 'ارسال و تحویل' }, { key: 'returns', href: '?page=policy', icon: 'undo', label: 'مرجوعی و بازپرداخت' },
  ];
  const rail = (title: string) => <ProductRail title={title} titleId="rail" products={products.slice(0, 6)} cartFor={cartFor} />;

  let body: React.ReactNode = null;
  let footer: 'full' | 'info' | 'lite' = 'full';
  switch (page) {
    case 'home':
      body = <>
        <HomeHero title="امـــروز چـی لازم داری ؟" ariaTitle="امروز چی لازم داری؟" subtitle="نام محصول، برند، غذا یا فهرست خریدت را بنویس."
          search={{ onSubmit: () => {} }} onQuickSearch={() => {}}
          quickSearches={[{ label: 'بـرنج ایرانی', ariaLabel: 'برنج ایرانی', query: 'برنج' }, { label: 'مواد قرمه سبزی', ariaLabel: 'مواد قرمه سبزی', query: 'قورمه' }, { label: 'روغـن زیتون', ariaLabel: 'روغن زیتون', query: 'روغن زیتون' }, { label: 'زعفـــران', ariaLabel: 'زعفران', query: 'زعفران' }]} />
        <CategoryCarousel title="دسته بندی محصولات" categories={categories} />
        <MealPanel title="خرید بر اساس غذا" lines={['غذا را انتخاب کن؛ موادش را یک‌جا بخر', 'مواد لازم هر غذا را ببین و هرچه نیاز داری مستقیم به سبدت اضافه کن']}
          steps={[{ icon: 'pot', label: 'انتخاب غذا' }, { icon: 'listcheck', label: 'بررسی  مواد لازم' }, { icon: 'cart', label: 'افزودن به سبد' }]} ctaLabel="انتخاب غذا" ctaHref="?page=recipes" />
        {rail('انتخاب‌های ته دیگ')}
        <PromoPanels recurring={{ title: <>خریدهای تکراری را<br />یک‌بار تنظیم کن</>, text: 'محصولات همیشگی‌ات را انتخاب و در زمان دلخواه دوباره تحویل بگیر.', ctaLabel: 'ساخت اشتراک من', href: '?page=recurring' }}
          bundles={{ title: 'پکیج های آماده', text: 'مجموعه‌های آماده برای خرید سریع‌تر و انتخاب راحت‌تر.', ctaLabel: 'مشاهده پکیج‌ها', href: '?page=bundles' }} />
      </>; break;
    case 'products':
      body = <>
        <Container><Breadcrumbs items={[{ label: 'دسته‌بندی', href: '?page=products' }, { label: 'همه محصولات' }]} /><SearchBar onSubmit={() => {}} /></Container>
        <CollectionHeader title="همه محصولات" description="مواد غذایی اصیل ایرانی، منتخب و باکیفیت؛ همه محصولات ته‌دیگ در یک‌جا" activeTab="all" onTabSelect={() => {}}
          tabs={[{ id: 'all', label: 'همه محصولات', count: 8 }, ...categories.map((c) => ({ id: c.id, label: c.label, count: c.count }))]} />
        <Container className="pb-2"><SortBar count={8} sort="popular" onSortChange={() => {}} options={[{ value: 'popular', label: 'محبوب‌ترین' }, { value: 'new', label: 'جدیدترین' }, { value: 'cheap', label: 'ارزان‌ترین' }, { value: 'expensive', label: 'گران‌ترین' }]} />
          <ProductGrid products={products} cartFor={cartFor} /><LoadMoreButton onClick={() => {}} /></Container>
      </>; break;
    case 'product': case 'product-oos': {
      const oos = page === 'product-oos';
      const d = oos ? { ...riceDetail, title: 'لوبیا قرمز درجه یک', latinTitle: 'Red kidney beans · Kidneypavut', sku: 'TD-5001', available: false, availabilityLabel: 'ناموجود', variants: undefined, price: eur(8), unitPrice: { amount: 8.89, currencyCode: 'EUR', unit: 'kg' as const } } : riceDetail;
      body = <ProductDetail crumbs={[{ label: 'دسته‌بندی‌ها', href: '?page=products' }, { label: 'برنج و غلات', href: '?page=products' }, { label: d.title }]} product={d}
        quantity={qty} onQuantityChange={setQty} onVariantChange={() => {}} onAddToCart={() => setCart((c) => ({ ...c, v103: (c.v103 ?? 0) + qty }))}
        inCartQuantity={cart.v103} cartHref="?page=cart" favorite={{ active: false, onToggle: () => {} }} onZoom={() => {}}
        recurring={{ quantity: 0, onAdd: () => {}, href: '?page=recurring' }} notify={{ onSubmit: () => {} }}
        related={rail(oos ? 'محصولات مشابه' : 'همراه این محصول')} />;
      break; }
    case 'recipes':
      body = <>
        <Container><Breadcrumbs items={[{ label: 'غذاها و دستورپخت‌ها' }]} /><SearchBar onSubmit={() => {}} placeholder="مثلاً قورمه‌سبزی، زرشک‌پلو..." /></Container>
        <CollectionHeader title="غذاها و دستورپخت‌ها" description="غذایتان را انتخاب کنید؛ مواد لازم را یکجا بخرید و با دستور پخت ته‌دیگ آماده کنید" activeTab="all" onTabSelect={() => {}}
          tabs={[{ id: 'all', label: 'همه غذاها', count: 5 }, { id: 'rice', label: 'برنجی', count: 3 }, { id: 'stew', label: 'خورشت‌ها', count: 2 }]} />
        <Container className="pb-2"><h2 className="mt-10 text-center text-[26px] font-black text-tahdig-heading lg:text-[28px]">چه غذایی می‌خواهی درست کنی؟</h2><RecipeGrid recipes={recipes} /></Container>
      </>; break;
    case 'recipe':
      body = <RecipeDetail crumbs={[{ label: 'غذاها و دستورپخت‌ها', href: '?page=recipes' }, { label: 'خورشت قورمه‌سبزی' }]} title="خورشت قورمه‌سبزی" difficulty="متوسط" servings={4} time="۲ ساعت"
        servingOptions={[2, 4, 6, 8]} selectedServings={4} onServingsChange={() => {}} onToggleIngredient={() => {}} onAddIngredients={() => {}} cartHref="?page=cart"
        ingredients={[
          { id: 'i1', title: 'سبزی خشک قورمه‌سبزی', href: '#', needLabel: 'نیاز: ۲۰۰ گرم', packLabel: '۱ بسته ۲۰۰ گرم', lineTotal: eur(9), available: true, selected: true },
          { id: 'i2', title: 'لوبیا قرمز درجه یک', href: '#', needLabel: 'نیاز: ۴۵۰ گرم', packLabel: '۱ بسته ۹۰۰ گرم', available: false, selected: false },
          { id: 'i3', title: 'ادویه مخصوص پلویی', href: '#', needLabel: 'نیاز: ۱۲۰ گرم', packLabel: '۱ بسته ۴۰۰ گرم', lineTotal: eur(12), available: true, selected: true }]}
        selection={{ productCount: 2, packCount: 2, total: eur(21) }}
        pantry={[{ id: 'meat', label: 'گوشت خورشتی', have: false }, { id: 'salt', label: 'نمک', have: true }, { id: 'oil', label: 'روغن', have: false, soldHere: true }, { id: 'lemon', label: 'لیمو عمانی', have: false }]}
        onTogglePantry={() => {}} onBuyPantry={() => {}}
        steps={['سبزی‌ها را با روغن تفت دهید تا معطر شوند.', 'گوشت را اضافه کرده و کمی تفت دهید.', 'لوبیا و آب را اضافه کنید و بپزید.', 'لیمو عمانی را اضافه و روی حرارت ملایم دم کنید.']} />;
      break;
    case 'cart':
      body = <CartLayout crumbs={[{ label: 'سبد خرید' }]}
        lines={<>
          <CartLine line={{ id: 'l1', href: '#', title: 'برنج طارم هاشمی درجه یک', variantLabel: '۱۰ کیلوگرم', quantity: 2, unitPrice: eur(45), lineTotal: eur(90) }} onIncrement={() => {}} onDecrement={() => {}} onRemove={() => {}} />
          <CartLine line={{ id: 'l2', href: '#', title: 'زعفران سرگل ممتاز', variantLabel: '۱۰ گرم', quantity: 1, unitPrice: eur(22), lineTotal: eur(22) }} onIncrement={() => {}} onDecrement={() => {}} onRemove={() => {}} />
          <CartLine line={{ id: 'l3', href: '#', title: 'پکیج مهمانی', variantLabel: '۳ محصول', isBundle: true, quantity: 1, unitPrice: eur(74), lineTotal: eur(74) }} onIncrement={() => {}} onDecrement={() => {}} onRemove={() => {}} />
        </>}
        side={<><DiscountCodeForm onApply={() => {}} /><CartSummary checkoutHref="#checkout" totals={{ itemCount: 4, subtotal: eur(186), shipping: null, total: eur(186), totalIncludesShipping: false }} /></>}
        complements={<CartComplements products={[products[2], products[5], products[3]]} onAdd={() => {}} />} />;
      break;
    case 'cart-empty':
      body = <><Container><Breadcrumbs items={[{ label: 'سبد خرید' }]} /></Container><CartEmpty shopHref="?page=products" suggestions={rail('انتخاب‌های ته دیگ')} /></>; break;
    case 'bundles':
      body = <BundleListLayout crumbs={[{ label: 'پکیج‌های آماده' }]} title="پکیج‌های آماده" intro="مجموعه‌های آماده برای خرید سریع‌تر و انتخاب راحت‌تر. محتوای هر پکیج از پیش انتخاب شده و با یک قیمت خریده می‌شود." bundles={bundles}
        note={<ConceptNote icon="repeat" title="می‌خواهی محصولات همیشگی‌ات خودکار برسد؟">برای فهرست شخصی و قابل‌ویرایش، از <a href="?page=recurring">خرید دوره‌ای</a> استفاده کن.</ConceptNote>} />; break;
    case 'bundle':
      body = <BundleDetail crumbs={[{ label: 'پکیج‌های آماده', href: '?page=bundles' }, { label: 'پکیج مهمانی' }]} title="پکیج مهمانی" description="برنج، زعفران و ادویه برای ۸ نفر" savingPercent={6}
        components={[{ id: 'c1', title: 'برنج طارم هاشمی درجه یک', href: '#', sizeLabel: '۱۰ کیلوگرم', quantity: 1, available: true }, { id: 'c2', title: 'زعفران سرگل ممتاز', href: '#', sizeLabel: '۱۰ گرم', quantity: 1, available: true }, { id: 'c3', title: 'ادویه مخصوص پلویی', href: '#', sizeLabel: '۴۰۰ گرم', quantity: 1, available: true }]}
        separatePrice={eur(79)} price={eur(74)} saving={eur(5)} available quantity={qty} onQuantityChange={setQty} onAddToCart={() => {}} cartHref="?page=cart" />; break;
    case 'recurring':
      body = <RecurringLayout crumbs={[{ label: 'خرید دوره‌ای' }]} status="draft" bundlesHref="?page=bundles"
        lines={[{ id: 'v301', href: '#', title: 'ادویه مخصوص پلویی', variantLabel: '۴۰۰ گرم', quantity: 1, lineTotal: eur(12), available: true }, { id: 'v601', href: '#', title: 'سبزی خشک قورمه‌سبزی', variantLabel: '۲۰۰ گرم', quantity: 2, lineTotal: eur(18), available: true }]}
        onLineQuantity={() => {}} onLineRemove={() => {}}
        picker={{ open: false, onToggle: () => {}, query: '', onQueryChange: () => {}, results: products.slice(0, 4).map((p) => ({ ...p, inListQuantity: 0 })), onAdd: () => {} }}
        frequencies={[{ id: '2w', label: 'هر ۲ هفته' }, { id: '1m', label: 'هر ماه' }, { id: '2m', label: 'هر ۲ ماه' }]} frequency="1m" onFrequencyChange={() => {}}
        nextDeliveryLabel="دوشنبه ۵ اکتبر" nextDeliveryCaption="اولین ارسال (پس از فعال‌سازی)" estimate={eur(30)} actions={{ onActivate: () => {} }} />; break;
    case 'account': case 'orders': case 'addresses': case 'favorites': {
      const active = page === 'account' ? undefined : page;
      const title = { account: 'حساب کاربری', orders: 'سفارش‌های من', addresses: 'آدرس‌های من', favorites: 'علاقه‌مندی‌ها' }[page]!;
      const content = page === 'account'
        ? <AccountOverview cards={[
            { icon: 'doc', title: 'سفارش اخیر', href: '?page=orders', linkLabel: 'همه سفارش‌ها', body: <p className="text-tahdig-slate">هنوز سفارشی ثبت نکرده‌ای.</p> },
            { icon: 'repeat', title: 'خرید دوره‌ای', href: '?page=recurring', linkLabel: 'مدیریت', body: <p className="text-tahdig-slate">۲ محصول در فهرست</p> },
            { icon: 'pin', title: 'نشانی تحویل', href: '?page=addresses', linkLabel: 'ویرایش', body: <p><b>Sara Ahmadi</b><br />Mannerheimintie 1، 00100 Helsinki</p> },
            { icon: 'heart', title: 'علاقه‌مندی‌ها', href: '?page=favorites', linkLabel: 'مشاهده', body: <p className="text-tahdig-slate">۱ محصول: زعفران سرگل ممتاز</p> }]} />
        : page === 'orders' ? <OrderList orders={[{ id: 'o1', number: 'TD-482913', dateLabel: '۲۸ سپتامبر ۲۰۲۶', statusLabel: 'در حال آماده‌سازی', itemCount: 4, itemsPreview: 'برنج طارم هاشمی درجه یک، زعفران سرگل ممتاز', total: eur(186) }]} />
        : page === 'addresses' ? <AddressForm value={{ name: 'Sara Ahmadi', contact: 'sara@example.fi', street: 'Mannerheimintie 1', postalCode: '00100', city: 'Helsinki' }} onSubmit={() => {}} />
        : <ProductGrid className="mt-0 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" products={[products[1]]} cartFor={cartFor} />;
      body = <AccountLayout crumbs={active ? [{ label: 'حساب کاربری', href: '?page=account' }, { label: title }] : [{ label: 'حساب کاربری' }]} title={title} active={active}
        customer={null} onSignIn={() => {}} accountNav={accountNav} helpNav={helpNav}>{content}</AccountLayout>;
      break; }
    case 'policy':
      footer = 'info';
      body = <PolicyPageLayout crumbs={[{ label: 'روش‌های پرداخت' }]} title="روش‌های پرداخت" updatedLabel="۱۵ اوت ۲۰۲۶" supportHref="?page=policy"
        intro="روش‌های پرداخت فعال از ابتدای فرایند سفارش و پیش از تأیید نهایی نمایش داده می‌شوند. فقط روشی را انتخاب کن که برایت مناسب است."
        sections={[{ title: 'روش‌های فعال', showPaymentLogos: true }, { title: 'مبلغ قابل پرداخت', body: 'قیمت محصولات به یورو و شامل مالیات قابل اعمال است. هزینه ارسال، تخفیف و مبلغ نهایی پیش از تأیید پرداخت در خلاصه سفارش نمایش داده می‌شوند.' }, { title: 'بازپرداخت', body: 'بازپرداخت اصولاً با همان روش پرداخت اولیه انجام می‌شود، مگر اینکه روش دیگری صریحاً توافق شود.' }]}
        related={[{ href: '#', label: 'روش‌های پرداخت', current: true }, { href: '#', label: 'پشتیبانی' }, { href: '#', label: 'ارسال و تحویل' }, { href: '#', label: 'مرجوعی و بازپرداخت' }]} />;
      break;
    default:
      body = <Container><EmptyState icon="search" title="این صفحه پیدا نشد" text="ممکن است نشانی تغییر کرده باشد."><Button href="?page=home">بازگشت به صفحه اصلی</Button></EmptyState></Container>;
  }

  return (
    <TahdigUIProvider>
      <TahdigRoot>
        <Header logoSrc="assets/tahdig-logo.png" cartCount={count} cartHref="?page=cart" onMenuOpen={() => setMenu(true)} menuOpen={menu} homeHref="?page=home" />
        <main>{body}</main>
        <Footer variant={footer} linkGroups={footerLinks} contactHref="?page=policy" banks={banks} onNewsletterSubmit={() => {}}
          social={[{ label: 'واتس‌اپ', icon: 'whatsapp' }, { label: 'تلگرام', icon: 'telegram', highlight: true }, { label: 'یوتیوب', icon: 'youtube' }, { label: 'اینستاگرام', icon: 'instagram' }]} />
        <MenuDrawer open={menu} onClose={() => setMenu(false)} logoSrc="assets/tahdig-logo-small.png"
          links={[{ href: '?page=home', label: 'خانه', icon: 'home', current: page === 'home' }, { href: '?page=products', label: 'محصولات', icon: 'bag' }, { href: '?page=recipes', label: 'غذاها و دستورپخت‌ها', icon: 'bowl' }, { href: '?page=bundles', label: 'پکیج‌های آماده', icon: 'gift' }, { href: '?page=recurring', label: 'خرید دوره‌ای', icon: 'repeat' }, { href: '?page=cart', label: 'سبد خرید', icon: 'cart', count }, { href: '?page=account', label: 'حساب کاربری', icon: 'user' }]}
          categories={categories.map((c) => ({ href: c.href, label: c.label }))} />
      </TahdigRoot>
    </TahdigUIProvider>
  );
}
