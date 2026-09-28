import * as React from 'react';
import { defaultLabels } from '../labels';
import { cn } from '../lib/cn';
import { TLink } from '../lib/next';
import type { Crumb } from '../types';
import { Icon } from './Icon';

/**
 * Server-safe. One scrollable line, full-bleed inside the container.
 * `cream` on product/bundle pages (phones). Separators mirror in LTR.
 * Links keep their 40px visual row with a 44px hit area.
 */
export function Breadcrumbs({ items, cream, homeHref = '/', homeLabel = defaultLabels.home, ariaLabel = defaultLabels.breadcrumbs }: {
  items: Crumb[]; cream?: boolean; homeHref?: string; homeLabel?: string; ariaLabel?: string;
}) {
  const link = 'relative inline-flex min-h-10 flex-none items-center gap-1.5 hover:text-tahdig-ink after:absolute after:inset-x-0 after:-inset-y-0.5';
  return (
    <nav aria-label={ariaLabel}
      className={cn('t-scroll-x -mx-[var(--t-gutter)] flex items-center gap-2 whitespace-nowrap px-[var(--t-gutter)] pb-4 pt-[18px] text-[14.5px] text-tahdig-slate', cream && 'bg-tahdig-cream sm:bg-transparent')}>
      <TLink href={homeHref} className={link}><Icon name="home" size={17} />{homeLabel}</TLink>
      {items.map((c, i) => (
        <React.Fragment key={i}>
          <Icon name="chev-left" size={14} />
          {i === items.length - 1 || !c.href
            ? <span aria-current="page" className="flex-none font-bold text-tahdig-ink">{c.label}</span>
            : <TLink href={c.href} className={link}>{c.label}</TLink>}
        </React.Fragment>
      ))}
    </nav>
  );
}
