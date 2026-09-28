import * as React from 'react';
import { Icon, type IconName } from './Icon';
import type { SpecRow } from '../types';

export interface AccordionItemData { id: string; icon: IconName; title: string; content: React.ReactNode; defaultOpen?: boolean }

/** Product information group: bordered cream card, sections separated by hairlines. Native <details>. */
export function AccordionGroup({ items }: { items: AccordionItemData[] }) {
  return (
    <div className="mt-7 overflow-hidden rounded-tahdig-card bg-tahdig-cream shadow-[inset_0_0_0_1px_#E3DCCD] lg:mt-8">
      {items.map((it, i) => (
        <details key={it.id} open={it.defaultOpen} className={`t-details ${i ? 'border-t border-tahdig-line' : ''}`}>
          <summary className="flex min-h-16 cursor-pointer items-center gap-3.5 bg-[#F6F2EA] px-5 text-[16px] font-semibold text-tahdig-ink2">
            <Icon name={it.icon} size={24} className="text-tahdig-green" />
            <span>{it.title}</span>
            <Icon name="down" size={18} className="t-chev ms-auto text-tahdig-slate transition-transform duration-200" />
          </summary>
          <div className="border-t border-tahdig-line px-6 pb-5 pt-2 text-[14.5px] leading-[2.05] text-tahdig-slate">{it.content}</div>
        </details>
      ))}
    </div>
  );
}

export function SpecList({ rows }: { rows: SpecRow[] }) {
  return (
    <ul>
      {rows.map((r) => (
        <li key={r.label} className="flex justify-between gap-4 border-b border-tahdig-line py-3.5 last:border-b-0">
          <span className="text-tahdig-slate">{r.label}</span><span className="text-end text-tahdig-ink">{r.value}</span>
        </li>
      ))}
    </ul>
  );
}
