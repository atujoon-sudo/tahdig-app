'use client';
/* Client Component: gallery index, sticky-bar observer and quantity state wiring. */
import * as React from 'react';
import { cn } from '../lib/cn';
import { tpl } from '../labels';
import { moneyText } from '../lib/format';
import { TLink } from '../lib/next';
import { useUI } from '../provider';
import type { Crumb, ProductDetailData } from '../types';
import { AccordionGroup, SpecList, type AccordionItemData } from '../primitives/Accordion';
import { Breadcrumbs } from '../primitives/Breadcrumbs';
import { Button, TextAction } from '../primitives/Button';
import { ChoiceChips } from '../primitives/Choices';
import { InlineForm } from '../primitives/Fields';
import { Icon } from '../primitives/Icon';
import { Media } from '../primitives/Media';
import { Price, UnitPrice } from '../primitives/Price';
import { QtyStepper } from '../primitives/QtyStepper';
import { Note } from '../primitives/Surfaces';
import { Container } from '../layout/Container';

export interface ProductDetailProps {
  crumbs: Crumb[];
  product: ProductDetailData;
  /** quantity chosen on the page (not yet in cart) */
  quantity: number;
  onQuantityChange: (q: number) => void;
  onVariantChange?: (variantId: string) => void;
  onAddToCart: () => void;
  addBusy?: boolean;
  /** quantity of the selected variant already in the cart (shows a quiet confirmation) */
  inCartQuantity?: number;
  cartHref: string;
  favorite?: { active: boolean; onToggle: () => void };
  onZoom?: () => void;
  /** recurring purchase (خرید دوره‌ای) — only when the variant supports a selling plan */
  recurring?: { quantity: number; onAdd: () => void; href: string };
  /** back-in-stock request for out-of-stock variants */
  notify?: { requestedEmail?: string; onSubmit: (email: string) => void; error?: string };
  /** related products rail (ProductRail) */
  related?: React.ReactNode;
}

/**
 * <768: stacked (image band on cream, then info). ≥768: image | information,
 * gallery sticky. ≥1024: wider gutter (56px) and 28px title.
 */
export function ProductDetail(props: ProductDetailProps) {
  const { crumbs, product: p, quantity, onQuantityChange, onVariantChange, onAddToCart, addBusy, inCartQuantity, cartHref, favorite, onZoom, recurring, notify, related } = props;
  const { labels, formatAmount, formatNumber } = useUI();
  const [img, setImg] = React.useState(0);
  const ctaRef = React.useRef<HTMLDivElement>(null);
  const total = { ...p.price, amount: p.price.amount * quantity };

  const acc: AccordionItemData[] = [
    { id: 'specs', icon: 'spec', title: labels.specs, defaultOpen: true, content: <SpecList rows={p.specs ?? []} /> },
    { id: 'ingredients', icon: 'list', title: labels.ingredients, content: <p>{p.ingredientsText}</p> },
    ...(p.storageText ? [{ id: 'storage', icon: 'box' as const, title: labels.storage, content: <p>{p.storageText}</p> }] : []),
    ...(p.cookingText ? [{ id: 'cooking', icon: 'pot' as const, title: labels.cooking, content: <p>{p.cookingText}</p> }] : []),
    ...(p.shippingText ? [{ id: 'shipping', icon: 'truck' as const, title: labels.shipping, content: <p>{p.shippingText}</p> }] : []),
  ];

  return (
    <>
      <Container>
        <Breadcrumbs items={crumbs} cream />
        <div className="grid grid-cols-1 md:grid-cols-2 md:items-start md:gap-x-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-x-14">
          {/* gallery */}
          <div className="-mx-[var(--t-gutter)] bg-tahdig-cream px-[var(--t-gutter)] pb-6 sm:mx-auto sm:w-full sm:max-w-[560px] sm:bg-transparent sm:p-0 md:sticky md:top-5 md:max-w-none">
            <div className="t-ph-soft relative grid aspect-square place-items-center overflow-hidden rounded-tahdig-card shadow-[inset_0_0_0_1px_#E3DCCD]"
              role="img" aria-label={tpl(labels.imageOf, formatNumber(img + 1), formatNumber(Math.max(p.images.length, 1)), p.title)}>
              {p.images[img] ? <Media image={p.images[img]} className="h-full w-full bg-none" priority /> : <Icon name="image" size={64} strokeWidth={1.2} />}
              <div className="pointer-events-none absolute inset-x-3.5 top-3.5 flex justify-between">
                {favorite && (
                  <button type="button" onClick={favorite.onToggle} aria-pressed={favorite.active} aria-label={favorite.active ? labels.removeFromFavorites : labels.addToFavorites}
                    className={cn('pointer-events-auto grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-white shadow-[0_4px_10px_-6px_rgba(60,50,30,.35)] active:scale-[.92]', favorite.active ? 'text-tahdig-danger [&_path]:fill-current' : 'text-tahdig-slate')}>
                    <Icon name="heart" />
                  </button>
                )}
                {onZoom && <button type="button" onClick={onZoom} aria-label={labels.zoomImage} className="pointer-events-auto grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-white text-tahdig-slate shadow-[0_4px_10px_-6px_rgba(60,50,30,.35)] active:scale-[.92]"><Icon name="zoom" /></button>}
              </div>
            </div>
            {p.images.length > 1 && (
              <div role="group" aria-label={labels.productImages} className="mt-3 grid grid-cols-4 gap-2.5">
                {p.images.slice(0, 5).map((im, i) => (
                  <button key={i} type="button" onClick={() => setImg(i)} aria-label={tpl(labels.imageN, formatNumber(i + 1))} aria-current={img === i}
                    className={cn('t-ph-soft grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-2xl', img === i ? 'shadow-[inset_0_0_0_1.5px_#1C4A3D]' : 'shadow-[inset_0_0_0_1px_#E3DCCD]')}>
                    <Media image={im} className="h-full w-full bg-none" iconSize={24} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* information */}
          <div className="pb-2 pt-[26px] md:pt-0">
            <h1 className="text-[22px] font-extrabold leading-[1.6] text-tahdig-heading [text-wrap:balance] md:text-[24px] lg:text-[28px]">{p.title}</h1>
            {p.latinTitle && <p className="mt-0.5 text-[14px] text-tahdig-slate"><bdi lang="en">{p.latinTitle}</bdi></p>}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[14.5px] text-tahdig-ink">
              {p.sku && <span><span className="text-tahdig-slate">{labels.productCode}</span> <span dir="ltr" className="tabular-nums [unicode-bidi:isolate]">{p.sku}</span></span>}
              <span className={cn('inline-flex items-center gap-2 font-semibold before:h-2 before:w-2 before:rounded-full before:bg-current', p.available ? 'text-tahdig-ok' : 'text-tahdig-danger')}>{p.availabilityLabel}</span>
            </div>
            {p.tags?.length ? <p className="mt-2.5 text-[14.5px] text-tahdig-ink2">{p.tags.join(labels.listSep)}</p> : null}
            {p.description && <div className="mt-[18px] rounded-[18px] px-[18px] py-4 text-[14.5px] leading-[2.05] text-tahdig-slate shadow-[inset_0_0_0_1px_#D9D0BE]">{p.description}</div>}

            {p.variants && p.variants.length > 1 && (
              <div className="mt-6">
                <h2 id="tahdig-opt" className="mb-3 text-[16.5px] font-bold text-tahdig-ink">{tpl(labels.selectOption, p.optionName ?? labels.defaultOption)}</h2>
                <ChoiceChips labelledBy="tahdig-opt" value={p.selectedVariantId ?? ''} onChange={(id) => onVariantChange?.(id)}
                  items={p.variants.map((v) => ({ id: v.id, label: v.label, unavailable: !v.available }))} />
              </div>
            )}

            <div className="mt-[26px] flex items-end justify-between gap-3">
              <div><UnitPrice unitPrice={p.unitPrice} className="mb-0.5 block text-[13.5px]" /><Price price={p.price} compareAt={p.compareAtPrice} size="pdp" /></div>
              {p.available && <QtyStepper quantity={quantity} min={1} tone="beige" label={p.title} onIncrement={() => onQuantityChange(quantity + 1)} onDecrement={() => onQuantityChange(Math.max(1, quantity - 1))} />}
            </div>

            <div ref={ctaRef} className="mt-4">
              {p.available ? (
                <Button block onClick={onAddToCart} disabled={addBusy}>
                  <Icon name="cart" /><span>{labels.addToCart}</span><span aria-hidden="true" className="opacity-60">—</span><span>{moneyText(total, formatAmount)}</span>
                </Button>
              ) : notify && (
                notify.requestedEmail
                  ? <Note tone="ok" icon="check">{(() => { const [a, b = ''] = tpl(labels.notifyConfirmed, p.title, '\u0000').split('\u0000'); return <>{a}<b><bdi>{notify.requestedEmail}</bdi></b>{b}</>; })()}</Note>
                  : <div className="rounded-[18px] bg-tahdig-sand p-4" id="notify">
                      <p className="text-[14px] leading-[1.9] text-tahdig-ink2"><b className="text-tahdig-ink">{labels.notifyIntroTitle}</b> {labels.notifyIntro}</p>
                      <InlineForm className="mt-3" onSubmit={notify.onSubmit} error={notify.error} errorId="tahdig-notify-err"
                        inputProps={{ id: 'tahdig-notify', type: 'email', inputMode: 'email', autoComplete: 'email', enterKeyHint: 'send', placeholder: labels.emailPlaceholder, 'aria-label': labels.notifyEmailLabel }}
                        buttonLabel={<><Icon name="bell" />{labels.notifyMe}</>} />
                    </div>
              )}
            </div>

            {p.available && (
              <ul aria-label={labels.purchaseAssurance} className="mt-3.5 flex flex-wrap justify-center gap-x-[18px] gap-y-1.5 text-[13px] text-tahdig-ink2 [&_svg]:text-tahdig-gold">
                <li className="inline-flex items-center gap-1.5"><Icon name="lock" size={17} />{labels.assurePayment}</li>
                <li className="inline-flex items-center gap-1.5"><Icon name="truck" size={17} />{labels.assureTracking}</li>
                <li className="inline-flex items-center gap-1.5"><Icon name="help" size={17} />{labels.assureSupport}</li>
              </ul>
            )}
            {!!inCartQuantity && <Note tone="ok" icon="check" className="mt-3">{tpl(labels.inCartNote, formatNumber(inCartQuantity))} · <TLink href={cartHref} className="font-bold underline underline-offset-4">{labels.viewCart}</TLink></Note>}
            {recurring && p.available && (
              <div className="mt-2.5 flex justify-center [&_svg]:text-tahdig-gold">
                {recurring.quantity
                  ? <TLink href={recurring.href} className="inline-flex min-h-11 items-center gap-2 text-[14.5px] font-semibold text-tahdig-heading"><Icon name="repeat" size={18} />{tpl(labels.inRecurring, formatNumber(recurring.quantity))}</TLink>
                  : <TextAction onClick={recurring.onAdd} className="text-[14.5px]"><Icon name="repeat" />{labels.addToRecurring}</TextAction>}
              </div>
            )}
            <AccordionGroup items={acc} />
          </div>
        </div>
      </Container>
      {related}
      <StickyBuyBar targetRef={ctaRef}>
        {p.available
          ? <><Price price={total} size="card" className="text-[19px]" /><Button className="h-[52px] flex-1" onClick={onAddToCart} tabIndex={-1}><Icon name="cart" />{labels.addToCart}</Button></>
          : <><span className="min-w-0 flex-1 truncate text-[13px] text-tahdig-slate">{p.title}</span><Button variant="ghost" className="h-[52px]" tabIndex={-1} onClick={() => document.getElementById('tahdig-notify')?.focus()}><Icon name="bell" />{labels.notifyMe}</Button></>}
      </StickyBuyBar>
    </>
  );
}

/**
 * Phones/tablets (<1024): slides up once the main CTA has scrolled above the viewport.
 * Hidden bar is visibility:hidden + inert, so it never traps focus or screen readers.
 */
export function StickyBuyBar({ targetRef, children }: { targetRef: React.RefObject<HTMLElement | null>; children: React.ReactNode }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    let raf = 0;
    const check = () => { raf = 0; const el = targetRef.current; setOn(!!el && el.getBoundingClientRect().bottom < 0); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, [targetRef]);
  return (
    <div aria-hidden={!on} inert={!on}
      className={cn('fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 bg-[rgba(251,248,242,.96)] px-[var(--t-gutter)] pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-1px_0_#E3DCCD,0_-12px_24px_-18px_rgba(60,50,30,.35)] backdrop-blur-md transition-[transform,visibility] duration-[260ms] ease-tahdig-out lg:hidden',
        on ? 'visible translate-y-0' : 'invisible translate-y-[110%]')}>
      {children}
    </div>
  );
}
