import * as React from 'react';
import { cn } from '../lib/cn';
import { currencySymbol, unitPriceText } from '../lib/format';
import { useUI } from '../provider';
import type { Money, UnitPriceData } from '../types';

const SIZE = { sm: 'text-[16px]', line: 'text-[18px]', card: 'text-[20px]', pdp: 'text-[28px]' };

/** Current price, currency in slate, optional compare-at struck through. */
export function Price({ price, compareAt, size = 'card', className }: { price: Money; compareAt?: Money | null; size?: keyof typeof SIZE; className?: string }) {
  const { formatAmount } = useUI();
  return (
    <div className={cn('flex items-baseline gap-1.5 whitespace-nowrap font-extrabold tabular-nums text-tahdig-ink', SIZE[size], className)}>
      <span>{formatAmount(price.amount)}</span>
      <span className="font-semibold text-tahdig-slate">{currencySymbol(price.currencyCode)}</span>
      {compareAt && compareAt.amount > price.amount && (
        <s className={cn('font-medium text-tahdig-slate', size === 'pdp' ? 'text-[14px]' : 'text-[12.5px]')}>{formatAmount(compareAt.amount)} {currencySymbol(compareAt.currencyCode)}</s>
      )}
    </div>
  );
}

/** "هر کیلو ۴٫۵۰ €" — comparison price. Omit for 1 kg / 1 L packs (the caller decides). */
export function UnitPrice({ unitPrice, className }: { unitPrice?: UnitPriceData | null; className?: string }) {
  const { formatAmount } = useUI();
  if (!unitPrice) return null;
  return <span className={cn('text-[12.5px] leading-normal tabular-nums text-tahdig-slate', className)}>{unitPriceText(unitPrice, formatAmount)}</span>;
}
