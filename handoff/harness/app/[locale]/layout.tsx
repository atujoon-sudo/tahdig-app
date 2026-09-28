/**
 * Root layout for the [locale] segment — a Server Component.
 * <html lang dir> is set HERE (never inside the UI layer); TahdigRoot inherits it.
 */
import type { Metadata, Viewport } from 'next';
import { Vazirmatn } from 'next/font/google';
import { notFound } from 'next/navigation';
import { TahdigRoot, TahdigUIProvider, dirForLocale } from '@/ui/tahdig/components';
import { dictionaries } from '@/i18n/dictionaries';
import { isLocale, locales } from '@/i18n/config';
import '../globals.css';

const vazirmatn = Vazirmatn({ subsets: ['arabic', 'latin'], variable: '--font-vazirmatn', display: 'swap' });

export const metadata: Metadata = { title: 'TAHDIG — Next 16 harness' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#FBF8F2' };
export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} dir={dirForLocale(locale)} className={vazirmatn.variable}>
      <body>
        <TahdigUIProvider locale={locale} labels={dictionaries[locale]}>
          <TahdigRoot>{children}</TahdigRoot>
        </TahdigUIProvider>
      </body>
    </html>
  );
}
