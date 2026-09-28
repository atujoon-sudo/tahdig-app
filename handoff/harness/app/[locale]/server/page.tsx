/**
 * SERVER COMPOSITION DEMO — a Server Component page built from server-safe UI sections.
 * Only the islands (Shell, SearchIsland, CartIsland, NewsletterIsland) and the tiny
 * locale leaves inside the sections ship as Client Components.
 */
import {
  BundleGrid, CategoryCarousel, Container, Footer, HomeHero, MealPanel, PolicyPageLayout, ProductGrid, PromoPanels, RecipeGrid, SectionTitle,
} from '@/ui/tahdig/components';
import { banks, bundles, categories, footerLinks, products, recipes } from '@/ui/tahdig/examples/fixtures';
import { CartIsland } from '@/islands/CartIsland';
import { NewsletterIsland } from '@/islands/NewsletterIsland';
import { SearchIsland } from '@/islands/SearchIsland';
import { Shell } from '@/islands/Shell';

export default async function ServerDemo({ params }: PageProps<'/[locale]/server'>) {
  const { locale } = await params;
  const p = (s: string) => `/${locale}/preview/${s}`;
  const cartSlots = Object.fromEntries(products.map((x) => [x.id,
    <CartIsland key={x.id} variantId={x.variantId} title={x.title} available={x.available} notifyHref={`${x.href}#notify`} />]));
  return (
    <>
      <Shell locale={locale} links={[
        { href: `/${locale}/server`, label: 'خانه', icon: 'home', current: true }, { href: p('products'), label: 'محصولات', icon: 'bag' },
        { href: p('recipes'), label: 'غذاها و دستورپخت‌ها', icon: 'bowl' }, { href: p('bundles'), label: 'پکیج‌های آماده', icon: 'gift' },
        { href: p('recurring'), label: 'خرید دوره‌ای', icon: 'repeat' }, { href: p('cart'), label: 'سبد خرید', icon: 'cart' }]} />
      <main>
        <HomeHero title="امـــروز چـی لازم داری ؟" ariaTitle="امروز چی لازم داری؟" subtitle="نام محصول، برند، غذا یا فهرست خریدت را بنویس."
          search={<SearchIsland action={p('products')} />}
          quickSearches={[{ label: 'بـرنج ایرانی', ariaLabel: 'برنج ایرانی', href: `${p('products')}?q=برنج` }, { label: 'زعفـــران', ariaLabel: 'زعفران', href: `${p('products')}?q=زعفران` }]} />
        <CategoryCarousel title="دسته بندی محصولات" categories={categories} />
        <MealPanel title="خرید بر اساس غذا" lines={['غذا را انتخاب کن؛ موادش را یک‌جا بخر', 'مواد لازم هر غذا را ببین و هرچه نیاز داری مستقیم به سبدت اضافه کن']}
          steps={[{ icon: 'pot', label: 'انتخاب غذا' }, { icon: 'listcheck', label: 'بررسی  مواد لازم' }, { icon: 'cart', label: 'افزودن به سبد' }]} ctaLabel="انتخاب غذا" ctaHref={p('recipes')} />
        <Container>
          <SectionTitle className="pt-12">انتخاب‌های ته دیگ</SectionTitle>
          <ProductGrid products={products.slice(0, 4)} cartSlots={cartSlots} />
        </Container>
        <PromoPanels recurring={{ title: 'خریدهای تکراری را یک‌بار تنظیم کن', text: 'محصولات همیشگی‌ات را انتخاب و در زمان دلخواه دوباره تحویل بگیر.', ctaLabel: 'ساخت اشتراک من', href: p('recurring') }}
          bundles={{ title: 'پکیج های آماده', text: 'مجموعه‌های آماده برای خرید سریع‌تر و انتخاب راحت‌تر.', ctaLabel: 'مشاهده پکیج‌ها', href: p('bundles') }} />
        <Container><RecipeGrid recipes={recipes} /><BundleGrid bundles={bundles} /></Container>
        <PolicyPageLayout crumbs={[{ label: 'درباره ما' }]} title="درباره ته‌دیگ" updatedLabel="۱۵ اوت ۲۰۲۶" supportHref={p('policy')}
          sections={[{ title: 'ته‌دیگ', body: 'فروشگاه آنلاین مواد غذایی ایرانی در فنلاند.' }]} related={[{ href: p('policy'), label: 'روش‌های پرداخت' }]} />
      </main>
      <Footer linkGroups={footerLinks} contactHref={p('policy')} banks={banks} newsletter={<NewsletterIsland />}
        social={[{ label: 'واتس‌اپ', icon: 'whatsapp' }, { label: 'تلگرام', icon: 'telegram', highlight: true }, { label: 'یوتیوب', icon: 'youtube' }, { label: 'اینستاگرام', icon: 'instagram' }]} />
    </>
  );
}
