'use client';
/* Client Component file: cart lines, codes and complements are driven by the cart store (Zustand). */
import * as React from 'react';
import { cn } from '../lib/cn';
import { tpl } from '../labels';
import { currencySymbol, moneyText } from '../lib/format';
import { TLink } from '../lib/next';
import { useUI } from '../provider';
import type { CartLineData, CartTotalsData, Crumb, ProductCardData } from '../types';
import { Breadcrumbs } from '../primitives/Breadcrumbs';
import { Button } from '../primitives/Button';
import { InlineForm } from '../primitives/Fields';
import { Icon } from '../primitives/Icon';
import { Media } from '../primitives/Media';
import { Price } from '../primitives/Price';
import { QtyStepper } from '../primitives/QtyStepper';
import { EmptyState, Panel } from '../primitives/Surfaces';
import { Container } from '../layout/Container';
import { PaymentLogos } from '../layout/Footer';

export function CartLine({ line: l, onIncrement, onDecrement, onRemove, busy }: { line: CartLineData; onIncrement: () => void; onDecrement: () => void; onRemove: () => void; busy?: boolean }) {
  const { labels, formatAmount } = useUI();
  return (
    <article className="grid grid-cols-[80px_1fr] gap-x-4 gap-y-3.5 border-b border-tahdig-line py-[18px] [grid-template-areas:'img_info'_'ctl_ctl'] last:border-b-0 sm:grid-cols-[88px_1fr_auto] sm:items-center sm:[grid-template-areas:'img_info_ctl'] md:grid-cols-[80px_1fr] md:items-start md:[grid-template-areas:'img_info'_'ctl_ctl'] lg:grid-cols-[88px_1fr_auto] lg:items-center lg:[grid-template-areas:'img_info_ctl']">
      <TLink href={l.href} tabIndex={-1} aria-hidden="true" className="block h-20 w-20 overflow-hidden rounded-2xl bg-white shadow-[inset_0_0_0_1px_#E3DCCD] [grid-area:img] sm:h-[88px] sm:w-[88px] md:h-20 md:w-20 lg:h-[88px] lg:w-[88px]">
        <Media image={l.image} className="h-full w-full bg-none text-[#C9BFAB]" placeholderIcon={l.isBundle ? 'gift' : 'image'} iconSize={30} />
      </TLink>
      <div className="grid min-w-0 grid-cols-[1fr_auto] content-center gap-x-3 gap-y-1 [grid-area:info]">
        <h3 className="text-[15px] font-semibold leading-[1.6] text-tahdig-ink"><TLink href={l.href} className="hover:text-tahdig-heading">{l.title}</TLink></h3>
        <div className="col-start-1 text-[13.5px] text-tahdig-slate">
          {l.variantLabel}{l.isBundle && <span className="ms-1.5 inline-flex h-[22px] items-center rounded-lg bg-tahdig-sand px-2.5 align-[1px] text-[11.5px] font-bold text-tahdig-ink2">{labels.bundleTag}</span>}
          {l.quantity > 1 && <> · {tpl(labels.each, moneyText(l.unitPrice, formatAmount))}</>}
        </div>
        <Price price={l.lineTotal} size="line" className="col-start-2 row-span-2 row-start-1 self-center" />
      </div>
      <div className="flex items-center justify-between gap-3 [grid-area:ctl]">
        <QtyStepper size="sm" tone="beige" min={1} quantity={l.quantity} label={l.title} onIncrement={onIncrement} onDecrement={onDecrement} disabled={busy} />
        <button type="button" onClick={onRemove} disabled={busy} aria-label={`${labels.remove} ${l.title}`} className="grid h-11 w-11 cursor-pointer place-items-center rounded-xl text-tahdig-ink2 transition-[transform,color] active:scale-90 hover:text-tahdig-danger"><Icon name="trash" /></button>
      </div>
    </article>
  );
}

export function DiscountCodeForm({ onApply, error }: { onApply: (code: string) => void; error?: string }) {
  const { labels } = useUI();
  return (
    <Panel aria-labelledby="cart-code" className="px-5 py-[22px]">
      <h2 id="cart-code" className="text-[18px] font-extrabold text-tahdig-heading">{labels.discountQ}</h2>
      <p className="mt-1 text-[13.5px] text-tahdig-slate">{labels.discountHint}</p>
      <InlineForm className="mt-4" tall onSubmit={onApply} error={error} errorId="cart-code-err" buttonLabel={labels.applyCode}
        inputProps={{ id: 'cart-code-input', autoComplete: 'off', autoCapitalize: 'characters', spellCheck: false, enterKeyHint: 'done', placeholder: labels.discountPlaceholder, 'aria-label': labels.discountPlaceholder }} />
    </Panel>
  );
}

/**
 * Totals come from the production cart (Shopify cart.cost). Shipping:
 *  - `shipping: null`  → "در مرحله بعد" + calculated-after-address hint (default until rules are confirmed)
 *  - `freeShipping`    → progress bar, ONLY when a threshold is confirmed by the business
 */
export function CartSummary({ totals: t, checkoutHref, onRemoveCode, showPayments = true }: { totals: CartTotalsData; checkoutHref?: string; onRemoveCode?: (code: string) => void; showPayments?: boolean }) {
  const { labels, formatAmount, formatNumber } = useUI();
  const row = 'flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-tahdig-line px-1 py-3.5 text-[14.5px] text-tahdig-slate';
  return (
    <Panel aria-labelledby="cart-sum" className="px-5 pb-6 pt-[22px]">
      <h2 id="cart-sum" className="text-[18px] font-extrabold text-tahdig-heading">{labels.yourCart}</h2>
      <p className="mt-0.5 text-[13.5px] text-tahdig-slate">{tpl(labels.itemsInCart, formatNumber(t.itemCount))}</p>
      <div className="mt-4 border-t border-tahdig-line">
        <div className={row}><span>{labels.subtotal}</span><b className="font-bold tabular-nums text-tahdig-ink">{moneyText(t.subtotal, formatAmount)}</b></div>
        <div className={row}>
          <span>{labels.shippingCost}</span>
          {t.shipping == null
            ? <><b className="font-semibold text-tahdig-ink2">{labels.shippingLater}</b><span className="basis-full text-[13px]">{labels.shippingLaterHint}</span></>
            : <b className="font-bold tabular-nums text-tahdig-ink">{t.shipping.amount ? moneyText(t.shipping, formatAmount) : labels.free}</b>}
          {t.freeShipping && <>
            <span className="basis-full text-[13px]">{t.freeShipping.remaining.amount > 0 ? tpl(labels.freeRemaining, moneyText(t.freeShipping.remaining, formatAmount)) : labels.freeReached}</span>
            {t.freeShipping.remaining.amount > 0 && <div className="h-1.5 basis-full overflow-hidden rounded-full bg-tahdig-beige2"><i className="block h-full rounded-full bg-tahdig-gold" style={{ width: `${Math.round(t.freeShipping.progress * 100)}%` }} /></div>}
          </>}
        </div>
        {t.discount && (
          <div className={row}>
            <span>{labels.discount}</span><b className="font-bold tabular-nums text-tahdig-danger">−{moneyText(t.discount.amount, formatAmount)}</b>
            {t.discount.codes.map((c) => (
              <span key={c} dir="ltr" className="flex basis-full flex-row-reverse items-center justify-between gap-1.5 text-tahdig-ink">
                <span>{c}</span>
                {onRemoveCode && <button type="button" onClick={() => onRemoveCode(c)} aria-label={tpl(labels.removeCode, c)} className="relative grid h-9 w-9 cursor-pointer place-items-center rounded-[10px] text-tahdig-ink2 after:absolute after:-inset-1"><Icon name="x-circle" /></button>}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-3 flex min-h-14 items-center justify-between rounded-tahdig-control bg-[#EFEDE7] px-4 text-[17px] font-bold text-tahdig-ink">
        <span>{t.totalIncludesShipping ? labels.total : labels.totalNoShipping}</span>
        <b className="inline-flex items-baseline gap-1.5 text-[21px] font-extrabold tabular-nums">{formatAmount(t.total.amount)}<span className="font-semibold text-tahdig-slate">{currencySymbol(t.total.currencyCode)}</span></b>
      </div>
      <p className="mt-2.5 text-[13px] text-tahdig-slate">{labels.taxIncluded}</p>
      {checkoutHref && <Button href={checkoutHref} block className="mt-[22px]">{labels.checkout}</Button>}
      {showPayments && checkoutHref && (
        <div className="mt-4">
          <PaymentLogos columns={3} />
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[12.5px] text-tahdig-slate"><Icon name="lock" size={15} className="text-tahdig-gold" />{labels.securePayment}</p>
        </div>
      )}
    </Panel>
  );
}

/** At most 3 related in-stock products, compact rows, one-tap add. Omit entirely when empty. */
export function CartComplements({ products, onAdd, className }: { products: ProductCardData[]; onAdd: (p: ProductCardData) => void; className?: string }) {
  const { labels, formatAmount } = useUI();
  if (!products.length) return null;
  return (
    <Panel aria-labelledby="cart-comp" className={cn('px-5 pb-2.5 pt-[18px]', className)}>
      <h2 id="cart-comp" className="text-[16.5px] font-extrabold text-tahdig-heading">{labels.complementsTitle}</h2>
      <div className="mt-1.5">
        {products.slice(0, 3).map((p) => (
          <div key={p.id} className="flex items-center gap-3 border-b border-tahdig-line py-2.5 last:border-b-0">
            <Media image={p.image} className="h-11 w-11 flex-none rounded-[10px]" iconSize={18} />
            <div className="min-w-0 flex-1 text-[14.5px] leading-[1.6] text-tahdig-ink">
              <TLink href={p.href}>{p.title}</TLink>
              <small className="block text-[12.5px] text-tahdig-slate">{p.sizeLabel} · {moneyText(p.price, formatAmount)}</small>
            </div>
            <Button variant="ghost" size="sm" className="relative h-10 rounded-xl px-3.5 text-[14px] shadow-none after:absolute after:inset-x-0 after:-inset-y-0.5" onClick={() => onAdd(p)} aria-label={`${labels.add} ${p.title}`}><Icon name="plus" />{labels.add}</Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/**
 * Phone: lines · discount · summary · complements.
 * ≥768: lines (+ complements below) | sticky discount + summary.
 */
export function CartLayout({ crumbs, lines, side, complements }: { crumbs: Crumb[]; lines: React.ReactNode; side: React.ReactNode; complements?: React.ReactNode }) {
  const { labels } = useUI();
  return (
    <Container className="pb-2">
      <Breadcrumbs items={crumbs} />
      <h1 className="sr-only">{labels.cart}</h1>
      <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:gap-x-6 md:[grid-template-areas:'lines_side'_'comp_side'] lg:gap-x-8">
        <Panel aria-label={labels.cartItems} className="px-[18px] py-1 md:[grid-area:lines]">{lines}</Panel>
        <div className="grid gap-5 md:sticky md:top-5 md:self-start md:[grid-area:side]">{side}</div>
        {complements && <div className="md:self-start md:[grid-area:comp]">{complements}</div>}
      </div>
    </Container>
  );
}

export function CartEmpty({ shopHref, suggestions }: { shopHref: string; suggestions?: React.ReactNode }) {
  const { labels } = useUI();
  return (
    <>
      <Container><Panel className="mt-2 px-5 py-2">
        <EmptyState icon="cart" title={labels.emptyCartTitle} text={labels.emptyCartText}>
          <Button href={shopHref}>{labels.startShopping}<Icon name="arrow-left" /></Button>
        </EmptyState>
      </Panel></Container>
      {suggestions}
    </>
  );
}
