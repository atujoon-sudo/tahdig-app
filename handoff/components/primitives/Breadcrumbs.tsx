import * as React from 'react';
import { cn } from '../lib/cn';
import { useUI } from '../provider';
import type { Crumb } from '../types';
import { Icon } from './Icon';

/** One scrollable line, full-bleed inside the container. `cream` on product/bundle pages (phones). */
export function Breadcrumbs({ items, cream }: { items: Crumb[]; cream?: boolean }) {
  const { Link, labels } = useUI();
  const link = 'inline-flex min-h-10 flex-none items-center gap-1.5 hover:text-tahdig-ink';
  return (
    <nav aria-label="مسیر صفحه"
      className={cn('t-scroll-x -mx-[var(--t-gutter)] flex items-center gap-2 whitespace-nowrap px-[var(--t-gutter)] pb-4 pt-[18px] text-[14.5px] text-tahdig-slate', cream && 'bg-tahdig-cream sm:bg-transparent')}>
      <Link href="/" className={link}><Icon name="home" size={17} />{labels.home}</Link>
      {items.map((c, i) => (
        <React.Fragment key={i}>
          <Icon name="chev-left" size={14} />
          {i === items.length - 1 || !c.href
            ? <span aria-current="page" className="flex-none font-bold text-tahdig-ink">{c.label}</span>
            : <Link href={c.href} className={link}>{c.label}</Link>}
        </React.Fragment>
      ))}
    </nav>
  );
}
