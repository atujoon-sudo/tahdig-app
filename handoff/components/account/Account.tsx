'use client';
import * as React from 'react';
import { cn } from '../lib/cn';
import { faDigits, moneyText } from '../lib/format';
import { useUI } from '../provider';
import type { AddressData, Crumb, OrderSummaryData } from '../types';
import { Breadcrumbs } from '../primitives/Breadcrumbs';
import { Button } from '../primitives/Button';
import { TextField } from '../primitives/Fields';
import { Icon, type IconName } from '../primitives/Icon';
import { Badge, EmptyState, PageHeader, Panel } from '../primitives/Surfaces';
import { Container } from '../layout/Container';

export interface AccountNavItem { key: string; href: string; icon: IconName; label: string; note?: string }

/**
 * <768: account home shows profile + navigation; sub-pages show only their content.
 * ≥768: profile + navigation column (sticky) | content column. ≥1024: 340px side.
 */
export function AccountLayout({ crumbs, title, active, customer, onSignIn, accountNav, helpNav, children }: {
  crumbs: Crumb[]; title: string; active?: string; customer: { name: string; hint?: string } | null; onSignIn?: () => void;
  accountNav: AccountNavItem[]; helpNav: AccountNavItem[]; children: React.ReactNode;
}) {
  const { Link, labels } = useUI();
  const menu = (items: AccountNavItem[], label: string) => (
    <Panel as="nav" aria-label={label} className="overflow-hidden py-1">
      {items.map((it) => (
        <Link key={it.key} href={it.href} aria-current={active === it.key ? 'page' : undefined}
          className={cn('flex min-h-[60px] w-full items-center gap-3.5 border-b border-tahdig-line px-5 text-[16px] font-semibold last:border-b-0 hover:bg-[#F6F2EA] [&>svg:first-child]:text-tahdig-gold', active === it.key ? 'bg-[#F6F2EA] text-tahdig-heading' : 'text-tahdig-ink')}>
          <Icon name={it.icon} /><span>{it.label}{it.note && <><br /><small className="text-[13px] font-medium text-tahdig-slate">{it.note}</small></>}</span>
          <Icon name="chev-left" size={16} className="ms-auto text-tahdig-slate" />
        </Link>
      ))}
    </Panel>
  );
  return (
    <Container className="pb-2">
      <Breadcrumbs items={crumbs} />
      <PageHeader title={title} />
      <div className="mt-5 grid grid-cols-1 items-start gap-3.5 md:grid-cols-[minmax(0,290px)_minmax(0,1fr)] md:gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-8">
        <aside aria-label="حساب من" className={cn('grid gap-3.5 md:sticky md:top-5', active && 'max-md:hidden')}>
          <Panel className="flex items-center gap-4 p-5">
            <span className="grid h-14 w-14 flex-none place-items-center rounded-full bg-tahdig-beige text-tahdig-green"><Icon name="user" size={26} /></span>
            <div><b className="block text-[17px] text-tahdig-ink">{customer?.name ?? labels.guest}</b><small className="text-[13.5px] text-tahdig-slate">{customer?.hint ?? labels.guestHint}</small></div>
          </Panel>
          {!customer && onSignIn && <Button block onClick={onSignIn}>{labels.signIn}</Button>}
          {menu(accountNav, 'حساب من')}
          {menu(helpNav, 'راهنما')}
        </aside>
        <div className={cn(!active && 'max-md:hidden')}>{children}</div>
      </div>
    </Container>
  );
}

/** Account home content (tablet/desktop main column): four quiet summary cards. */
export function AccountOverview({ cards }: { cards: Array<{ icon: IconName; title: string; href: string; linkLabel: string; body: React.ReactNode }> }) {
  const { Link } = useUI();
  return (
    <div className="grid gap-3.5 lg:grid-cols-2">
      {cards.map((c) => (
        <Panel key={c.title} className="px-5 py-[18px]">
          <header className="flex items-center gap-2.5">
            <Icon name={c.icon} className="text-tahdig-gold" /><h2 className="text-[16.5px] font-extrabold text-tahdig-heading">{c.title}</h2>
            <Link href={c.href} className="ms-auto inline-flex min-h-10 items-center gap-2 text-[14px] font-semibold text-tahdig-heading">{c.linkLabel}<Icon name="chev-left" size={18} /></Link>
          </header>
          <div className="mt-2 text-[14.5px] leading-[1.9] text-tahdig-ink">{c.body}</div>
        </Panel>
      ))}
    </div>
  );
}

export function OrderList({ orders, emptyAction }: { orders: OrderSummaryData[]; emptyAction?: React.ReactNode }) {
  const { Link, formatAmount } = useUI();
  if (!orders.length) return <Panel className="px-5 py-2"><EmptyState icon="doc" title="هنوز سفارشی ثبت نکرده‌ای">{emptyAction}</EmptyState></Panel>;
  return (
    <div className="grid gap-3.5 lg:grid-cols-2">
      {orders.map((o) => {
        const body = (<>
          <header className="flex items-center justify-between gap-3"><b dir="ltr" className="text-[16px] text-tahdig-ink">{o.number}</b><Badge tone="gold">{o.statusLabel}</Badge></header>
          <p className="mt-1.5 text-[14px] text-tahdig-slate">{o.dateLabel} · {faDigits(o.itemCount)} قلم</p>
          <p className="mt-1.5 text-[14px] text-tahdig-slate">{o.itemsPreview}</p>
          <p className="mt-2 text-[18px] font-extrabold tabular-nums text-tahdig-ink">{moneyText(o.total, formatAmount)}</p>
        </>);
        return <Panel as="article" key={o.id} className="px-5 py-[18px]">{o.href ? <Link href={o.href} className="block">{body}</Link> : body}</Panel>;
      })}
    </div>
  );
}

/** Presentational address form. Validation rules + persistence (Customer Account API) stay in production. */
export function AddressForm({ value, errors = {}, onSubmit, submitLabel = 'ذخیره نشانی' }: { value: AddressData; errors?: Partial<Record<keyof AddressData, string>>; onSubmit: (a: AddressData) => void; submitLabel?: string }) {
  const read = (f: HTMLFormElement): AddressData => {
    const g = (k: string) => (f.elements.namedItem(k) as HTMLInputElement).value.trim();
    return { name: g('name'), contact: g('contact'), street: g('street'), postalCode: g('postalCode'), city: g('city') };
  };
  return (
    <Panel className="px-5 pb-6 pt-[22px]">
      <h2 className="text-[19px] font-extrabold text-tahdig-heading">نشانی تحویل</h2>
      <p className="mt-0.5 text-[14px] text-tahdig-slate">این نشانی در تکمیل سفارش استفاده می‌شود.</p>
      <form noValidate onSubmit={(e) => { e.preventDefault(); onSubmit(read(e.currentTarget)); }} className="mt-[18px] grid gap-4 lg:grid-cols-2">
        <TextField id="name" name="name" label="نام و نام خانوادگی" autoComplete="name" defaultValue={value.name} error={errors.name} />
        <TextField id="contact" name="contact" label="ایمیل یا شماره تماس" autoComplete="email" ltr defaultValue={value.contact} error={errors.contact} />
        <TextField id="street" name="street" label="نشانی" autoComplete="street-address" defaultValue={value.street} error={errors.street} className="lg:col-span-2" />
        <TextField id="postalCode" name="postalCode" label="کد پستی" autoComplete="postal-code" inputMode="numeric" maxLength={5} ltr defaultValue={value.postalCode} error={errors.postalCode} />
        <TextField id="city" name="city" label="شهر" autoComplete="address-level2" defaultValue={value.city} error={errors.city} />
        <Button block className="lg:col-span-2" type="submit">{submitLabel}</Button>
      </form>
    </Panel>
  );
}
