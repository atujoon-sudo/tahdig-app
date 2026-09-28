/* Server-safe. Sort + load-more (client) live in CollectionControls.tsx. */
import * as React from 'react';
import { cn } from '../lib/cn';
import { TLink } from '../lib/next';
import type { CartControlProps, ProductCardData } from '../types';
import { Num } from '../primitives/Text';
import { SectionTitle } from '../primitives/Surfaces';
import { Container } from '../layout/Container';
import { ProductCard } from './ProductCard';

type CartFor = (p: ProductCardData) => CartControlProps;
/**
 * Cart control per card. `cartFor` (a function) works from a Client parent only;
 * from a Server Component pass `cartSlots` — a map of product id → client island.
 */
type CartSource = { cartFor?: CartFor; cartSlots?: Record<string, React.ReactNode> };

/**
 * Horizontal rail (home picks, "همراه این محصول", empty-cart suggestions).
 * <1024: native swipe row, gentle start snap, next card peeks.
 * ≥1024: 3-column grid; ≥1280: 4 columns (5th+ hidden).
 */
export function ProductRail({ title, titleId, products, cartFor, cartSlots, className }: { title?: string; titleId?: string; products: ProductCardData[]; className?: string } & CartSource) {
  return (
    <section aria-labelledby={titleId} className={cn('pt-9 xs:pt-12', className)}>
      {title && <SectionTitle id={titleId}>{title}</SectionTitle>}
      <div className="t-scroll-x flex snap-x snap-proximity gap-4 px-[var(--t-gutter)] py-7 [scroll-padding-inline:var(--t-gutter)] lg:mx-auto lg:grid lg:max-w-tahdig-container lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pt-8 xl:grid-cols-4 xl:[&>*:nth-child(n+5)]:hidden">
        {products.map((p) => <ProductCard key={p.id} product={p} cart={cartFor?.(p)} cartSlot={cartSlots?.[p.id]} variant="rail" />)}
      </div>
    </section>
  );
}

/** Products / collection / search / favourites grid: 1 → 2 (640) → 3 (1024) → 4 (1280) columns. */
export function ProductGrid({ products, cartFor, cartSlots, className }: { products: ProductCardData[]; className?: string } & CartSource) {
  return (
    <div className={cn('mt-[26px] grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4', className)}>
      {products.map((p) => <ProductCard key={p.id} product={p} cart={cartFor?.(p)} cartSlot={cartSlots?.[p.id]} />)}
    </div>
  );
}

export interface CollectionTab { id: string; label: string; count?: number; href?: string }

/** Cream band: title, description, category tabs (Products, Category, Recipes). Use `href` tabs from the server; `onTabSelect` only from a Client parent. */
export function CollectionHeader({ title, description, tabs, activeTab, onTabSelect, tabsLabel = 'دسته‌بندی‌ها' }: {
  title: string; description?: string; tabs?: CollectionTab[]; activeTab?: string; onTabSelect?: (id: string) => void; tabsLabel?: string;
}) {
  const tab = (on: boolean) => cn('flex h-12 flex-none cursor-pointer items-center gap-[18px] rounded-2xl ps-[18px] text-[15px] font-bold transition-[background-color,color,transform] active:scale-[.97]',
    on ? 'bg-tahdig-green text-white shadow-tahdig-button' : 'bg-tahdig-chip text-tahdig-ink hover:bg-[#E9E4DA]');
  const count = (on: boolean, n?: number) => n == null ? null :
    <span className={cn('grid h-7 min-w-7 place-items-center rounded-[9px] px-1.5 text-[13.5px] font-medium', on ? 'bg-white/[.08] text-white/80' : 'bg-[#E4DFD5] text-tahdig-ink2')}><Num value={n} /></span>;
  return (
    <section className="mt-[26px] bg-tahdig-cream pb-[22px] pt-7 shadow-tahdig-soft">
      <Container>
        <h1 className="text-[26px] font-black leading-[1.45] text-tahdig-ink md:text-[30px] lg:text-[34px]">{title}</h1>
        {description && <p className="mt-2.5 text-[15px] leading-[2] text-tahdig-slate">{description}</p>}
      </Container>
      {tabs?.length ? (
        <div role="group" aria-label={tabsLabel} className="t-scroll-x mt-[18px] flex gap-2.5 px-[var(--t-gutter)] pb-2.5 pt-1 [scroll-padding-inline:var(--t-gutter)] lg:mx-auto lg:max-w-tahdig-container">
          {tabs.map((t) => {
            const on = t.id === activeTab;
            const cls = cn(tab(on), t.count == null ? 'pe-[18px]' : 'pe-2');
            const inner = <><span>{t.label}</span>{count(on, t.count)}</>;
            return t.href
              ? <TLink key={t.id} href={t.href} aria-current={on ? 'page' : undefined} className={cls}>{inner}</TLink>
              : <button key={t.id} type="button" aria-pressed={on} onClick={() => onTabSelect?.(t.id)} className={cls}>{inner}</button>;
          })}
        </div>
      ) : null}
    </section>
  );
}
