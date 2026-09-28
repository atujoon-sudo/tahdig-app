'use client';
import * as React from 'react';
import { cn } from '../lib/cn';
import { faDigits } from '../lib/format';
import { useUI } from '../provider';
import { Icon, type IconName } from '../primitives/Icon';

export interface DrawerLink { href: string; label: string; icon: IconName; current?: boolean; count?: number }

/**
 * Slide-in menu from the reading-start side (replaces the removed bottom tab bar).
 * Keep: scroll lock while open, Escape closes, focus moves into the panel and
 * returns to the menu button, Tab stays inside.
 */
export function MenuDrawer({ open, onClose, logoSrc, links, categories, categoriesTitle = 'دسته‌بندی محصولات' }: {
  open: boolean; onClose: () => void; logoSrc: string; links: DrawerLink[]; categories?: Array<{ href: string; label: string }>; categoriesTitle?: string;
}) {
  const { Link, labels } = useUI();
  const panel = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(() => panel.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>('a[href],button'));
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); document.documentElement.style.overflow = ''; prev?.focus?.(); };
  }, [open, onClose]);
  return (
    <div id="tahdig-menu" className={cn('fixed inset-0 z-[70]', open ? 'visible' : 'invisible delay-[260ms]')} aria-hidden={!open}>
      <div className={cn('absolute inset-0 bg-[rgba(20,30,25,.42)] transition-opacity', open ? 'opacity-100 duration-300' : 'opacity-0 duration-200')} onClick={onClose} />
      <div ref={panel} role="dialog" aria-modal="true" aria-label={labels.menu} tabIndex={-1}
        className={cn('absolute inset-y-0 start-0 flex w-[min(86vw,360px)] flex-col overflow-y-auto overscroll-contain bg-tahdig-cream px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))] outline-none transition-transform',
          open ? 'translate-x-0 duration-[400ms] ease-tahdig-drawer' : 'translate-x-full duration-[240ms] ease-tahdig-out')}>
        <div className="flex items-center justify-between border-b border-tahdig-line pb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={94} height={52} alt="ته‌دیگ" className="h-[52px] w-auto" />
          <button type="button" onClick={onClose} aria-label={labels.closeMenu} className="grid h-11 w-11 place-items-center rounded-tahdig-control bg-tahdig-chip text-tahdig-ink"><Icon name="close" /></button>
        </div>
        <nav aria-label="منوی اصلی" className="mt-2 grid">
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={l.current ? 'page' : undefined} onClick={onClose}
              className={cn('flex min-h-14 items-center gap-4 border-b border-tahdig-line px-1 text-[17px] font-bold hover:text-tahdig-gold [&>svg]:text-tahdig-gold', l.current ? 'text-tahdig-gold' : 'text-tahdig-heading')}>
              <Icon name={l.icon} />{l.label}
              {!!l.count && <span className="ms-auto grid h-[22px] min-w-6 place-items-center rounded-[11px] bg-tahdig-gold px-[7px] text-[12px] text-white">{faDigits(l.count)}</span>}
            </Link>
          ))}
        </nav>
        {categories?.length ? <>
          <h2 className="mt-6 text-[13.5px] font-bold text-tahdig-slate">{categoriesTitle}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((c) => <Link key={c.href} href={c.href} onClick={onClose} className="inline-flex min-h-10 items-center rounded-xl bg-tahdig-chip px-3.5 text-[14.5px] text-tahdig-ink">{c.label}</Link>)}
          </div>
        </> : null}
      </div>
    </div>
  );
}
