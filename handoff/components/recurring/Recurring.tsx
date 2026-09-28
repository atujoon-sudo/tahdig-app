'use client';
import * as React from 'react';
import { cn } from '../lib/cn';
import { faDigits, moneyText } from '../lib/format';
import { useUI } from '../provider';
import type { Crumb, Money, ProductCardData, RecurringLineData, RecurringStatus } from '../types';
import { Breadcrumbs } from '../primitives/Breadcrumbs';
import { Button, TextAction } from '../primitives/Button';
import { ChoiceChips } from '../primitives/Choices';
import { Icon, type IconName } from '../primitives/Icon';
import { Media } from '../primitives/Media';
import { Price } from '../primitives/Price';
import { QtyStepper } from '../primitives/QtyStepper';
import { Badge, PageHeader, Panel } from '../primitives/Surfaces';
import { Container } from '../layout/Container';

/**
 * خرید دوره‌ای — the customer's own editable recurring list (products,
 * quantities, frequency, pause / skip / cancel). Maps to selling plans +
 * subscription contracts in production. Never merged with fixed bundles.
 */
const STATUS: Record<RecurringStatus, [string, 'muted' | 'ok' | 'gold']> = {
  draft: ['هنوز فعال نشده', 'muted'], active: ['فعال', 'ok'], paused: ['متوقف موقت', 'gold'], cancelled: ['لغو شده', 'muted'],
};

export interface RecurringLayoutProps {
  crumbs: Crumb[];
  status: RecurringStatus;
  lines: RecurringLineData[];
  onLineQuantity: (id: string, q: number) => void;
  onLineRemove: (id: string) => void;
  /** product picker (search is the production search, e.g. Meilisearch) */
  picker: { open: boolean; onToggle: () => void; query: string; onQueryChange: (q: string) => void; results: Array<ProductCardData & { inListQuantity: number }>; onAdd: (p: ProductCardData) => void };
  frequencies: Array<{ id: string; label: string }>; frequency: string; onFrequencyChange: (id: string) => void;
  nextDeliveryLabel?: string | null;   // formatted date, null when paused/cancelled
  nextDeliveryCaption?: string;
  estimate: Money;
  actions: { onActivate?: () => void; onPause?: () => void; onResume?: () => void; onSkipToggle?: () => void; skipNext?: boolean; onCancel?: () => void };
  showIntroSteps?: boolean;
  bundlesHref: string;
}

export function RecurringLayout(p: RecurringLayoutProps) {
  const { Link, labels, formatAmount } = useUI();
  const [label, tone] = STATUS[p.status];
  const empty = !p.lines.length;
  const steps: Array<[string, IconName]> = [['محصولات همیشگی‌ات را به فهرست اضافه کن', 'list'], ['فاصله ارسال را انتخاب کن', 'calendar'], ['هر بار بدون سفارش دوباره تحویل بگیر', 'truck']];
  const pickerOpen = p.picker.open || empty;
  return (
    <Container className="pb-2">
      <Breadcrumbs items={p.crumbs} />
      <PageHeader title="خرید دوره‌ای" intro="محصولات همیشگی‌ات را یک‌بار انتخاب کن و در زمان دلخواه دوباره تحویل بگیر. فهرست مال خودت است و هر زمان می‌توانی آن را تغییر دهی." />
      {p.showIntroSteps && (
        <ol className="mt-[22px] grid gap-3 sm:grid-cols-3">
          {steps.map(([t, ic], i) => (
            <li key={t} className="flex min-h-16 items-center gap-3.5 rounded-2xl bg-tahdig-cream px-4 py-2.5 text-[15px] text-tahdig-ink shadow-[inset_0_0_0_1px_#E3DCCD]">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-full border-[1.5px] border-tahdig-goldSoft text-[15px] font-bold text-tahdig-gold">{faDigits(i + 1)}</span>{t}
              <Icon name={ic} size={24} className="ms-auto text-tahdig-gold" />
            </li>
          ))}
        </ol>
      )}
      <div className="mt-6 grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] md:gap-x-6 lg:gap-x-8">
        <Panel aria-labelledby="rec-list" className="p-5">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="rec-list" className="text-[18px] font-extrabold text-tahdig-heading">{labels.myList}</h2>
            <span className="text-[14px] text-tahdig-slate">{faDigits(p.lines.reduce((s, l) => s + l.quantity, 0))} محصول</span>
          </header>
          {empty ? <p className="mt-2 text-[14px] text-tahdig-slate">فهرستت هنوز خالی است. از فهرست زیر محصول اضافه کن.</p> : (
            <div className="mt-1.5">
              {p.lines.map((l) => (
                <div key={l.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-x-3 gap-y-1.5 border-b border-tahdig-line py-3.5 [grid-template-areas:'img_info_price'_'img_ctl_ctl'] last:border-b-0">
                  <Media image={l.image} className="h-14 w-14 self-start rounded-xl [grid-area:img]" iconSize={22} />
                  <div className="min-w-0 [grid-area:info]"><Link href={l.href} className="text-[15px] font-semibold leading-[1.6] text-tahdig-ink">{l.title}</Link><small className="block text-[13px] text-tahdig-slate">{l.variantLabel}{!l.available && ' · فعلاً ناموجود'}</small></div>
                  <Price price={l.lineTotal} size="sm" className="[grid-area:price]" />
                  <div className="mt-1 flex items-center justify-between [grid-area:ctl]">
                    <QtyStepper size="sm" quantity={l.quantity} label={l.title} onIncrement={() => p.onLineQuantity(l.id, l.quantity + 1)} onDecrement={() => p.onLineQuantity(l.id, l.quantity - 1)} />
                    <button type="button" onClick={() => p.onLineRemove(l.id)} aria-label={`حذف ${l.title} از فهرست`} className="grid h-11 w-11 place-items-center rounded-xl text-tahdig-ink2 hover:text-tahdig-danger"><Icon name="trash" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!empty && <TextAction className="mt-2" onClick={p.picker.onToggle} aria-expanded={pickerOpen}><Icon name={pickerOpen ? 'minus' : 'plus'} />{pickerOpen ? labels.closeProducts : labels.addProduct}</TextAction>}
          {pickerOpen && (
            <div className="mt-3.5 border-t border-tahdig-line pt-3.5">
              <div className="flex h-[52px] items-center rounded-[18px] bg-white pe-1.5 ps-4 shadow-[inset_0_0_0_1px_#E3DCCD] focus-within:shadow-[inset_0_0_0_1.5px_#1C4A3D]">
                <input type="search" value={p.picker.query} onChange={(e) => p.picker.onQueryChange(e.target.value)} placeholder={labels.searchProduct} aria-label="جستجوی محصول برای خرید دوره‌ای" className="h-full w-full bg-transparent outline-none" />
              </div>
              <div className="mt-2 max-h-[360px] overflow-y-auto overscroll-contain">
                {p.picker.results.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 border-b border-tahdig-line py-2.5 last:border-b-0">
                    <Media image={r.image} className="h-11 w-11 flex-none rounded-[10px]" iconSize={18} />
                    <div className="min-w-0 flex-1 text-[14.5px] leading-[1.6] text-tahdig-ink">{r.title}<small className="block text-[12.5px] text-tahdig-slate">{r.sizeLabel} · {r.available ? moneyText(r.price, formatAmount) : 'فعلاً ناموجود'}</small></div>
                    {r.inListQuantity ? <Badge tone="ok">{faDigits(r.inListQuantity)} در فهرست</Badge>
                      : <Button variant="ghost" size="sm" className="h-10 rounded-xl px-3.5 text-[14px] shadow-none" onClick={() => p.picker.onAdd(r)} aria-label={`افزودن ${r.title} به فهرست`}><Icon name="plus" />{labels.add}</Button>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Panel>

        <Panel as="aside" aria-label="تنظیمات ارسال" className="grid gap-[22px] p-5 md:sticky md:top-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-[16px] font-extrabold text-tahdig-heading">{labels.status}</h3><Badge tone={tone}>{label}</Badge></div>
          <div><h3 id="rec-freq" className="mb-3 text-[16px] font-extrabold text-tahdig-heading">{labels.frequency}</h3>
            <ChoiceChips labelledBy="rec-freq" value={p.frequency} onChange={p.onFrequencyChange} items={p.frequencies} /></div>
          {p.status !== 'cancelled' && (
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[inset_0_0_0_1px_#E3DCCD]">
              <Icon name="calendar" size={24} className="text-tahdig-gold" />
              <div><small className="block text-[12.5px] text-tahdig-slate">{p.nextDeliveryCaption ?? labels.nextDelivery}</small><b className="text-[16px] text-tahdig-ink">{p.nextDeliveryLabel ?? '—'}</b></div>
            </div>
          )}
          <div className="border-t border-tahdig-line">
            <div className="flex items-baseline justify-between border-b border-tahdig-line px-1 py-3.5 text-[14.5px] text-tahdig-slate"><span>{labels.perDelivery}</span><b className="font-bold tabular-nums text-tahdig-ink">{moneyText(p.estimate, formatAmount)}</b></div>
            <div className="flex items-baseline justify-between border-b border-tahdig-line px-1 py-3.5 text-[14.5px] text-tahdig-slate"><span>{labels.shippingCost}</span><b className="font-semibold text-tahdig-ink2">{labels.shippingAtOrder}</b></div>
          </div>
          <RecurringActions status={p.status} empty={empty} {...p.actions} />
          <p className="text-[13px] leading-[1.8] text-tahdig-slate">مبلغ نهایی هر ارسال بر اساس قیمت روز محصولات محاسبه می‌شود. هر زمان می‌توانی فهرست، فاصله ارسال یا وضعیت را تغییر دهی.</p>
        </Panel>
      </div>
      <div className="mt-5 flex items-start gap-3.5 rounded-[18px] bg-tahdig-beige2 px-[18px] py-4">
        <Icon name="gift" size={26} className="mt-[3px] text-tahdig-gold" />
        <div><b className="block text-[15px] text-tahdig-ink">دنبال مجموعه‌های آماده هستی؟</b><p className="mt-0.5 text-[13.5px] leading-[1.85] text-tahdig-ink2"><Link href={p.bundlesHref} className="font-bold text-tahdig-heading underline underline-offset-4">پکیج‌های آماده</Link> مجموعه‌های ثابت و از پیش انتخاب‌شده‌اند و یک‌بار خریده می‌شوند.</p></div>
      </div>
    </Container>
  );
}

function RecurringActions({ status, empty, onActivate, onPause, onResume, onSkipToggle, skipNext, onCancel }: RecurringLayoutProps['actions'] & { status: RecurringStatus; empty: boolean }) {
  const danger = 'text-tahdig-danger';
  if (status === 'draft' || status === 'cancelled')
    return <Button block onClick={onActivate} aria-disabled={empty || undefined}><Icon name="repeat" />{status === 'draft' ? 'فعال‌سازی خرید دوره‌ای' : 'فعال‌سازی دوباره'}</Button>;
  if (status === 'paused')
    return <div className="grid gap-2.5"><Button block onClick={onResume}>ادامه ارسال‌ها</Button><Button block variant="outline" size="sm" className={danger} onClick={onCancel}>لغو خرید دوره‌ای</Button></div>;
  return (
    <div className="grid gap-2.5">
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
        <Button variant="ghost" size="sm" className="px-3" onClick={onSkipToggle}>{skipNext ? 'برگرداندن ارسال بعدی' : 'رد کردن ارسال بعدی'}</Button>
        <Button variant="ghost" size="sm" className="px-3" onClick={onPause}>توقف موقت</Button>
      </div>
      <Button block variant="outline" size="sm" className={cn(danger)} onClick={onCancel}>لغو خرید دوره‌ای</Button>
    </div>
  );
}
