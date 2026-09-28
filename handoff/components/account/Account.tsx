/* Server-safe account pieces. AddressForm (client) lives in AddressForm.tsx. */
import * as React from 'react';
import { cn } from '../lib/cn';
import { TLink } from '../lib/next';
import type { Crumb, Money, OrderSummaryData } from '../types';
import { Breadcrumbs } from '../primitives/Breadcrumbs';
import { Button } from '../primitives/Button';
import { Icon, type IconName } from '../primitives/Icon';
import { Badge, EmptyState, PageHeader, Panel } from '../primitives/Surfaces';
import { Amount, Label } from '../primitives/Text';
import { currencySymbol } from '../lib/format';
import { Container } from '../layout/Container';

export const defaultAccountCopy = { accountAria: 'حساب من', helpAria: 'راهنما', noOrders: 'هنوز سفارشی ثبت نکرده‌ای' };
export type AccountCopy = typeof defaultAccountCopy;

const MoneyText = ({ m }: { m: Money }) => <><Amount value={m.amount} /> {currencySymbol(m.currencyCode)}</>;

export interface AccountNavItem { key: string; href: string; icon: IconName; label: string; note?: string }

/**
 * <768: account home shows profile + navigation; sub-pages show only their content.
 * ≥768: profile + navigation column (sticky) | content column. ≥1024: 340px side.
 * Sign-in is a plain link to the production login route, which starts Shopify's
 * Customer Account API sign-in (passwordless customer authentication, one-time code).
 */
export function AccountLayout({ crumbs, title, active, customer, signInHref, accountNav, helpNav, copy: o, children }: {
  crumbs: Crumb[]; title: string; active?: string; customer: { name: string; hint?: string } | null;
  /** e.g. "/fa/account/login" → redirects to the Customer Account API authorization endpoint */
  signInHref?: string;
  accountNav: AccountNavItem[]; helpNav: AccountNavItem[]; copy?: Partial<AccountCopy>; children: React.ReactNode;
}) {
  const copy = { ...defaultAccountCopy, ...o };
  const menu = (items: AccountNavItem[], label: string) => (
    <Panel as="nav" aria-label={label} className="overflow-hidden py-1">
      {items.map((it) => (
        <TLink key={it.key} href={it.href} aria-current={active === it.key ? 'page' : undefined}
          className={cn('flex min-h-[60px] w-full items-center gap-3.5 border-b border-tahdig-line px-5 text-[16px] font-semibold last:border-b-0 hover:bg-[#F6F2EA] [&>svg:first-child]:text-tahdig-gold', active === it.key ? 'bg-[#F6F2EA] text-tahdig-heading' : 'text-tahdig-ink')}>
          <Icon name={it.icon} /><span>{it.label}{it.note && <><br /><small className="text-[13px] font-medium text-tahdig-slate">{it.note}</small></>}</span>
          <Icon name="chev-left" size={16} className="ms-auto text-tahdig-slate" />
        </TLink>
      ))}
    </Panel>
  );
  return (
    <Container className="pb-2">
      <Breadcrumbs items={crumbs} />
      <PageHeader title={title} />
      <div className="mt-5 grid grid-cols-1 items-start gap-3.5 md:grid-cols-[minmax(0,290px)_minmax(0,1fr)] md:gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-8">
        <aside aria-label={copy.accountAria} className={cn('grid gap-3.5 md:sticky md:top-5', active && 'max-md:hidden')}>
          <Panel className="flex items-center gap-4 p-5">
            <span className="grid h-14 w-14 flex-none place-items-center rounded-full bg-tahdig-beige text-tahdig-green"><Icon name="user" size={26} /></span>
            <div><b className="block text-[17px] text-tahdig-ink">{customer?.name ?? <Label k="guest" />}</b><small className="text-[13.5px] text-tahdig-slate">{customer?.hint ?? <Label k="guestHint" />}</small></div>
          </Panel>
          {!customer && signInHref && <Button block href={signInHref}><Label k="signIn" /></Button>}
          {menu(accountNav, copy.accountAria)}
          {menu(helpNav, copy.helpAria)}
        </aside>
        <div className={cn(!active && 'max-md:hidden')}>{children}</div>
      </div>
    </Container>
  );
}

/** Account home content (tablet/desktop main column): four quiet summary cards. */
export function AccountOverview({ cards }: { cards: Array<{ icon: IconName; title: string; href: string; linkLabel: string; body: React.ReactNode }> }) {
  return (
    <div className="grid gap-3.5 lg:grid-cols-2">
      {cards.map((c) => (
        <Panel key={c.title} className="px-5 py-[18px]">
          <header className="flex items-center gap-2.5">
            <Icon name={c.icon} className="text-tahdig-gold" /><h2 className="text-[16.5px] font-extrabold text-tahdig-heading">{c.title}</h2>
            <TLink href={c.href} className="relative ms-auto inline-flex min-h-10 items-center gap-2 text-[14px] font-semibold text-tahdig-heading after:absolute after:inset-x-0 after:-inset-y-0.5">{c.linkLabel}<Icon name="chev-left" size={18} /></TLink>
          </header>
          <div className="mt-2 text-[14.5px] leading-[1.9] text-tahdig-ink">{c.body}</div>
        </Panel>
      ))}
    </div>
  );
}

export function OrderList({ orders, emptyAction, emptyTitle = defaultAccountCopy.noOrders }: { orders: OrderSummaryData[]; emptyAction?: React.ReactNode; emptyTitle?: string }) {
  if (!orders.length) return <Panel className="px-5 py-2"><EmptyState icon="doc" title={emptyTitle}>{emptyAction}</EmptyState></Panel>;
  return (
    <div className="grid gap-3.5 lg:grid-cols-2">
      {orders.map((o) => {
        const body = (<>
          <header className="flex items-center justify-between gap-3"><b className="text-[16px] text-tahdig-ink"><bdi>{o.number}</bdi></b><Badge tone="gold">{o.statusLabel}</Badge></header>
          <p className="mt-1.5 text-[14px] text-tahdig-slate">{o.dateLabel} · <Label k="orderItems" values={[o.itemCount]} /></p>
          <p className="mt-1.5 text-[14px] text-tahdig-slate">{o.itemsPreview}</p>
          <p className="mt-2 text-[18px] font-extrabold tabular-nums text-tahdig-ink"><MoneyText m={o.total} /></p>
        </>);
        return <Panel as="article" key={o.id} className="px-5 py-[18px]">{o.href ? <TLink href={o.href} className="block">{body}</TLink> : body}</Panel>;
      })}
    </div>
  );
}
