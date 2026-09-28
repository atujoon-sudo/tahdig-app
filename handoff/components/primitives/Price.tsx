import { cn } from '../lib/cn';
import { currencySymbol } from '../lib/format';
import type { Money, UnitPriceData } from '../types';
import { Amount, UnitPriceText } from './Text';

/* Server-safe: digits come from the <Amount> client leaf (locale context). */
const SIZE = { sm: 'text-[16px]', line: 'text-[18px]', card: 'text-[20px]', pdp: 'text-[28px]' };

/** Current price, currency in slate, optional compare-at struck through. */
export function Price({ price, compareAt, size = 'card', className }: { price: Money; compareAt?: Money | null; size?: keyof typeof SIZE; className?: string }) {
  return (
    <div className={cn('flex items-baseline gap-1.5 whitespace-nowrap font-extrabold tabular-nums text-tahdig-ink', SIZE[size], className)}>
      <span><Amount value={price.amount} /></span>
      <span className="font-semibold text-tahdig-slate">{currencySymbol(price.currencyCode)}</span>
      {compareAt && compareAt.amount > price.amount && (
        <s className={cn('font-medium text-tahdig-slate', size === 'pdp' ? 'text-[14px]' : 'text-[12.5px]')}><Amount value={compareAt.amount} /> {currencySymbol(compareAt.currencyCode)}</s>
      )}
    </div>
  );
}

/** "هر کیلو ۴٫۵۰ €" — comparison price. Omit for 1 kg / 1 L packs (the caller decides). */
export function UnitPrice({ unitPrice, className }: { unitPrice?: UnitPriceData | null; className?: string }) {
  if (!unitPrice) return null;
  return <span className={cn('text-[12.5px] leading-normal tabular-nums text-tahdig-slate', className)}><UnitPriceText unitPrice={unitPrice} /></span>;
}
