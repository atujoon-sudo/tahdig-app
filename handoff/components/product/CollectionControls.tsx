'use client';
import { tpl } from '../labels';
import { useUI } from '../provider';
import { Icon } from '../primitives/Icon';

/** Result count + sort select. Sorting logic (Meilisearch sort / Shopify sortKey) stays in production. */
export function SortBar({ count, sort, options, onSortChange }: { count: number; sort: string; options: Array<{ value: string; label: string }>; onSortChange: (v: string) => void }) {
  const { labels, formatNumber } = useUI();
  return (
    <div className="pt-7">
      <div className="text-[14.5px] text-tahdig-ink" aria-live="polite">{tpl(labels.productsCount, formatNumber(count))}</div>
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
    <button type="button" onClick={onClick} disabled={busy} className="mx-auto mt-9 flex min-h-12 cursor-pointer items-center justify-center gap-3.5 px-4 text-[16.5px] font-semibold text-tahdig-slate hover:text-tahdig-heading disabled:opacity-60">
      <span>{labels.loadMore}</span><Icon name="arrow-down" size={20} />
    </button>
  );
}
