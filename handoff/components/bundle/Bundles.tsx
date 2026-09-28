'use client';
import * as React from 'react';
import { faDigits, moneyText } from '../lib/format';
import { useUI } from '../provider';
import type { BundleCardData, Crumb, ImageData, Money } from '../types';
import { Breadcrumbs } from '../primitives/Breadcrumbs';
import { Button } from '../primitives/Button';
import { Icon, type IconName } from '../primitives/Icon';
import { Media } from '../primitives/Media';
import { Price } from '../primitives/Price';
import { QtyStepper } from '../primitives/QtyStepper';
import { Badge, Note, PageHeader, Panel } from '../primitives/Surfaces';
import { Container } from '../layout/Container';

/**
 * پکیج‌های آماده — FIXED curated bundles sold as one cart line at one price.
 * Not editable, unrelated to the customer's recurring list (خرید دوره‌ای).
 */
export function BundleCard({ bundle: b }: { bundle: BundleCardData }) {
  const { Link, labels } = useUI();
  return (
    <article className="flex flex-col rounded-tahdig-card bg-tahdig-cream px-4 pb-[18px] pt-4 shadow-tahdig-card">
      <Link href={b.href} tabIndex={-1} aria-hidden="true" className="relative block overflow-hidden rounded-2xl">
        <Media image={b.image} className="aspect-[16/10] w-full bg-[linear-gradient(160deg,#EFE7D8,#E4DBCA)]" placeholderIcon="gift" iconSize={52} />
        {!!b.savingPercent && <Badge tone="gold" className="absolute start-3 top-3">{labels.savingBadge(faDigits(b.savingPercent))}</Badge>}
      </Link>
      <h3 className="mt-4 px-1 text-[18px] font-extrabold leading-[1.6] text-tahdig-heading"><Link href={b.href}>{b.title}</Link></h3>
      <p className="mt-1 px-1 text-[14px] leading-[1.85] text-tahdig-ink2">{b.description}</p>
      <div className="mt-2.5 px-1 text-[13px] text-tahdig-slate">{faDigits(b.contents.length)} محصول: {b.contents.join('، ')}</div>
      <div className="mt-auto flex items-center justify-between gap-3 px-1 pt-4">
        {b.available ? <Price price={b.price} compareAt={b.compareAtPrice} /> : <span className="text-[16px] text-tahdig-slate">فعلاً ناموجود</span>}
        <Button href={b.href} size="sm">{labels.viewBundle}</Button>
      </div>
    </article>
  );
}

export function BundleGrid({ bundles }: { bundles: BundleCardData[] }) {
  return <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">{bundles.map((b) => <BundleCard key={b.id} bundle={b} />)}</div>;
}

/** Cross-link between the two purchase concepts (quiet, one line). */
export function ConceptNote({ icon, title, children }: { icon: IconName; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 flex items-start gap-3.5 rounded-[18px] bg-tahdig-beige2 px-[18px] py-4 [&_a]:font-bold [&_a]:text-tahdig-heading [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4">
      <Icon name={icon} size={26} className="mt-[3px] text-tahdig-gold" />
      <div><b className="block text-[15px] text-tahdig-ink">{title}</b><p className="mt-0.5 text-[13.5px] leading-[1.85] text-tahdig-ink2">{children}</p></div>
    </div>
  );
}

export function BundleListLayout({ crumbs, title, intro, bundles, note }: { crumbs: Crumb[]; title: string; intro: string; bundles: BundleCardData[]; note?: React.ReactNode }) {
  return <Container className="pb-2"><Breadcrumbs items={crumbs} /><PageHeader title={title} intro={intro} />{note}<BundleGrid bundles={bundles} /></Container>;
}

export interface BundleDetailProps {
  crumbs: Crumb[]; title: string; description: string; image?: ImageData | null; savingPercent?: number | null;
  components: Array<{ id: string; title: string; href: string; sizeLabel: string; quantity: number; available: boolean; image?: ImageData | null }>;
  separatePrice: Money; price: Money; saving?: Money | null; available: boolean;
  quantity: number; onQuantityChange: (q: number) => void; onAddToCart: () => void; addBusy?: boolean;
  inCartQuantity?: number; cartHref: string; unavailableNote?: string;
}

/** Same composition as Product Detail: image | information from 768px. */
export function BundleDetail(p: BundleDetailProps) {
  const { Link, labels, formatAmount } = useUI();
  const total = { ...p.price, amount: p.price.amount * p.quantity };
  const row = 'flex items-baseline justify-between border-b border-tahdig-line px-1 py-3.5 text-[14.5px] text-tahdig-slate';
  return (
    <Container className="pb-2">
      <Breadcrumbs items={p.crumbs} cream />
      <div className="grid grid-cols-1 md:grid-cols-2 md:items-start md:gap-x-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-x-14">
        <div className="-mx-[var(--t-gutter)] bg-tahdig-cream px-[var(--t-gutter)] pb-6 sm:mx-auto sm:w-full sm:max-w-[560px] sm:bg-transparent sm:p-0 md:sticky md:top-5 md:max-w-none">
          <Media image={p.image} className="aspect-square rounded-tahdig-card shadow-[inset_0_0_0_1px_#E3DCCD]" soft placeholderIcon="gift" iconSize={64} />
        </div>
        <div className="pb-2 pt-[26px] md:pt-0">
          <h1 className="text-[22px] font-extrabold leading-[1.6] text-tahdig-heading md:text-[24px] lg:text-[28px]">{p.title}</h1>
          <p className="mt-2.5 text-[14.5px] text-tahdig-ink2">{p.description}</p>
          {!!p.savingPercent && <p className="mt-3"><Badge tone="gold">{faDigits(p.savingPercent)}٪ صرفه‌جویی نسبت به خرید جداگانه</Badge></p>}
          <h2 className="mt-6 text-[16.5px] font-extrabold text-tahdig-heading">{labels.bundleIncludes}</h2>
          <Panel className="mt-3.5 px-4 py-1">
            {p.components.map((c) => (
              <div key={c.id} className="flex items-center gap-3.5 border-b border-tahdig-line py-3.5 last:border-b-0">
                <Media image={c.image} className="h-14 w-14 flex-none rounded-xl" iconSize={22} />
                <div className="min-w-0 flex-1"><Link href={c.href} className="text-[15px] font-semibold leading-[1.6] text-tahdig-ink">{c.title}</Link><small className="block text-[13px] text-tahdig-slate">{c.sizeLabel}{!c.available && ' · ناموجود'}</small></div>
                <span className="whitespace-nowrap text-[14.5px] tabular-nums text-tahdig-ink2">{faDigits(c.quantity)} عدد</span>
              </div>
            ))}
          </Panel>
          <div className="mt-4 border-t border-tahdig-line">
            <div className={row}><span>{labels.separatePrice}</span><s className="font-medium tabular-nums">{moneyText(p.separatePrice, formatAmount)}</s></div>
            <div className={row}><span>{labels.bundlePrice}</span><b className="font-bold tabular-nums text-tahdig-ink">{moneyText(p.price, formatAmount)}</b></div>
            {p.saving && <div className={row}><span>{labels.yourSaving}</span><b className="font-bold tabular-nums text-tahdig-ok">{moneyText(p.saving, formatAmount)}</b></div>}
          </div>
          {p.unavailableNote && <Note tone="warn" className="mt-4">{p.unavailableNote}</Note>}
          <div className="mt-[26px] flex items-end justify-between gap-3">
            <Price price={p.price} size="pdp" />
            {p.available && <QtyStepper tone="beige" min={1} quantity={p.quantity} label={p.title} onIncrement={() => p.onQuantityChange(p.quantity + 1)} onDecrement={() => p.onQuantityChange(Math.max(1, p.quantity - 1))} />}
          </div>
          <div className="mt-4">
            {p.available
              ? <Button block onClick={p.onAddToCart} disabled={p.addBusy}><Icon name="cart" /><span>{labels.addBundle}</span><span aria-hidden="true" className="opacity-60">—</span><span>{moneyText(total, formatAmount)}</span></Button>
              : <Button block variant="ghost" disabled><Icon name="bell" />{labels.notifyWhenBack}</Button>}
          </div>
          {!!p.inCartQuantity && <Note tone="ok" icon="check" className="mt-3">{faDigits(p.inCartQuantity)} پکیج در سبد توست · <Link href={p.cartHref} className="font-bold underline underline-offset-4">{labels.viewCart}</Link></Note>}
        </div>
      </div>
    </Container>
  );
}
