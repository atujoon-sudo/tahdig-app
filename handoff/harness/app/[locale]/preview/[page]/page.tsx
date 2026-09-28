/** Server page that renders the client wiring example for one of the 16 preview pages. */
import { Preview } from '@/ui/tahdig/examples/Preview';
import { locales } from '@/i18n/config';

const PAGES = ['home', 'products', 'product', 'product-oos', 'recipes', 'recipe', 'cart', 'cart-empty', 'bundles', 'bundle',
  'recurring', 'account', 'orders', 'addresses', 'favorites', 'policy'] as const;

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => PAGES.map((page) => ({ locale, page })));
}

export default async function PreviewPage({ params }: PageProps<'/[locale]/preview/[page]'>) {
  const { locale, page } = await params;
  return <Preview page={page} base={`/${locale}/preview`} />;
}
