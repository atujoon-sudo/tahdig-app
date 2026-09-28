'use client';
import * as React from 'react';
import { cn } from '../lib/cn';
import { faDigits } from '../lib/format';
import { useUI } from '../provider';
import type { CartControlProps, ProductCardData } from '../types';
import { Icon } from '../primitives/Icon';
import { SectionTitle } from '../primitives/Surfaces';
import { Container } from '../layout/Container';
import { ProductCard } from './ProductCard';

type CartFor = (p: ProductCardData) => CartControlProps;

/**
 * Horizontal rail (home picks, "همراه این محصول", empty-cart suggestions).
 * <1024: native swipe row, gentle start snap, next card peeks.
 * ≥1024: 3-column grid; ≥1280: 4 columns (5th+ hidden).
 */
export function ProductRail({ title, titleId, products, cartFor, className }: { title?: string; titleId?: string; products: ProductCardData[]; cartFor: CartFor; className?: string }) {
  return (
    <section aria-labelledby={titleId} className={cn('pt-9 xs:pt-12', className)}>
      {title && <SectionTitle id={titleId}>{title}</SectionTitle>}
      <div className="t-scroll-x flex snap-x snap-proximity gap-4 px-[var(--t-gutter)] py-7 [scroll-padding-inline:var(--t-gutter)] lg:mx-auto lg:grid lg:max-w-tahdig-container lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pt-8 xl:grid-cols-4 xl:[&>*:nth-child(n+5)]:hidden">
        {products.map((p) => <ProductCard key={p.id} product={p} cart={cartFor(p)} variant="rail" />)}
      </div>
    </section>
  );
}

/** Products / collection / search / favourites grid: 1 → 2 (640) → 3 (1024) → 4 (1280) columns. */
export function ProductGrid({ products, cartFor, className }: { products: ProductCardData[]; cartFor: CartFor; className?: string }) {
  return (
    <div className={cn('mt-[26px] grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4', className)}>
      {products.map((p) => <ProductCard key={p.id} product={p} cart={cartFor(p)} />)}
    </div>
  );
}

export interface CollectionTab { id: string; label: string; count?: number; href?: string }

/** Cream band: title, description, category tabs (Products, Category, Recipes). */
export function CollectionHeader({ title, description, tabs, activeTab, onTabSelect, tabsLabel = 'دسته‌بندی‌ها' }: {
  title: string; description?: string; tabs?: CollectionTab[]; activeTab?: string; onTabSelect?: (id: string) => void; tabsLabel?: string;
}) {
  const { Link } = useUI();
  const tab = (on: boolean) => cn('flex h-12 flex-none items-center gap-[18px] rounded-2xl ps-[18px] text-[15px] font-bold transition-[background-color,color,transform] active:scale-[.97]',
    on ? 'bg-tahdig-green text-white shadow-tahdig-button' : 'bg-tahdig-chip text-tahdig-ink hover:bg-[#E9E4DA]');
  const count = (on: boolean, n?: number) => n == null ? null :
    <span className={cn('grid h-7 min-w-7 place-items-center rounded-[9px] px-1.5 text-[13.5px] font-medium', on ? 'bg-white/[.08] text-white/80' : 'bg-[#E4DFD5] text-tahdig-ink2')}>{faDigits(n)}</span>;
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
              ? <Link key={t.id} href={t.href} aria-current={on ? 'page' : undefined} className={cls}>{inner}</Link>
              : <button key={t.id} type="button" aria-pressed={on} onClick={() => onTabSelect?.(t.id)} className={cls}>{inner}</button>;
          })}
        </div>
      ) : null}
    </section>
  );
}

/** Result count + sort select. Sorting logic (Meilisearch sort / Shopify sortKey) stays in production. */
export function SortBar({ count, sort, options, onSortChange }: { count: number; sort: string; options: Array<{ value: string; label: string }>; onSortChange: (v: string) => void }) {
  const { labels } = useUI();
  return (
    <div className="pt-7">
      <div className="text-[14.5px] text-tahdig-ink" aria-live="polite">{labels.productsCount(faDigits(count))}</div>
      <div className="mt-3 flex items-center justify-between gap-3 rounded-[18px] bg-tahdig-beige2 py-2.5 pe-2.5 ps-4">
        <label htmlFor="tahdig-sort" className="flex items-center gap-2.5 text-[15px] text-tahdig-ink"><Icon name="sort" size={20} className="text-tahdig-green" />{labels.sort}</label>
        <div className="relative">
          <select id="tahdig-sort" value={sort} onChange={(e) => onSortChange(e.target.value)}
            className="h-[42px] min-w-32 cursor-pointer appearance-none rounded-tahdig-control border-0 bg-white pe-9 ps-4 text-[16px] text-tahdig-ink2">
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <Icon name="caret" size={14} className="pointer-events-none absolute end-3 top-1/2 -mt-[7px] text-tahdig-ink2" />
        </div>
      </div>
    </div>
  );
}

export function LoadMoreButton({ onClick, busy }: { onClick: () => void; busy?: boolean }) {
  const { labels } = useUI();
  return (
    <button type="button" onClick={onClick} disabled={busy} className="mx-auto mt-9 flex min-h-12 items-center justify-center gap-3.5 px-4 text-[16.5px] font-semibold text-tahdig-slate hover:text-tahdig-heading disabled:opacity-60">
      <span>{labels.loadMore}</span><Icon name="arrow-down" size={20} />
    </button>
  );
}
