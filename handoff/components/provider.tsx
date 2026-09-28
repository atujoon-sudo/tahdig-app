'use client';
/**
 * Client context for locale-dependent UI strings and number formatting.
 * Every prop is serializable, so a Server Component layout can render it directly:
 *
 *   // app/[locale]/layout.tsx  (Server Component)
 *   <html lang={locale} dir={dir}>…
 *     <TahdigUIProvider locale={locale} labels={dict.tahdig}>
 *       <TahdigRoot>{children}</TahdigRoot>
 *     </TahdigUIProvider>
 *
 * A custom money formatter (a function) can only be passed from a Client Component
 * wrapper — see docs/MIGRATION-GUIDE.md. Nothing here talks to Shopify, Meilisearch,
 * Zustand or SWR.
 */
import * as React from 'react';
import { defaultLabels, type Labels } from './labels';
import { amountFormatter, numberFormatter } from './lib/format';

interface Ctx { locale: string; labels: Labels; formatAmount: (n: number) => string; formatNumber: (n: number | string) => string }

const UICtx = React.createContext<Ctx>({ locale: 'fa', labels: defaultLabels, formatAmount: amountFormatter('fa'), formatNumber: numberFormatter('fa') });

export function TahdigUIProvider({ locale = 'fa', labels, formatAmount, children }: {
  locale?: string; labels?: Partial<Labels>; formatAmount?: (n: number) => string; children: React.ReactNode;
}) {
  const value = React.useMemo<Ctx>(() => ({
    locale,
    labels: { ...defaultLabels, ...labels },
    formatAmount: formatAmount ?? amountFormatter(locale),
    formatNumber: numberFormatter(locale),
  }), [locale, labels, formatAmount]);
  return <UICtx.Provider value={value}>{children}</UICtx.Provider>;
}

export const useUI = () => React.useContext(UICtx);
