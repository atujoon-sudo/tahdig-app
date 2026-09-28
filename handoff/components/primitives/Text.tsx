'use client';
/**
 * Tiny client leaves that read the locale context. They let server-safe
 * components show locale-correct digits, money and UI copy without becoming
 * Client Components themselves (props are serializable).
 */
import { tpl, type Labels } from '../labels';
import { currencySymbol } from '../lib/format';
import { useUI } from '../provider';
import type { UnitPriceData } from '../types';

/** Count / integer in the active locale's digits. */
export function Num({ value }: { value: number | string }) {
  return <>{useUI().formatNumber(value)}</>;
}

/** Money amount (without currency) in the active locale's format. */
export function Amount({ value }: { value: number }) {
  return <>{useUI().formatAmount(value)}</>;
}

/** UI copy from the label dictionary, with optional {0} placeholders (numbers are localized). */
export function Label({ k, values }: { k: keyof Labels; values?: Array<string | number> }) {
  const { labels, formatNumber } = useUI();
  return <>{tpl(labels[k], ...(values ?? []).map((v) => (typeof v === 'number' ? formatNumber(v) : v)))}</>;
}

/** "هر کیلو ۴٫۵۰ €" / "4,50 € / kg" depending on the label dictionary. */
export function UnitPriceText({ unitPrice }: { unitPrice: UnitPriceData }) {
  const { labels, formatAmount } = useUI();
  return <>{tpl(labels.perUnit, unitPrice.unit === 'l' ? labels.unitL : labels.unitKg, `${formatAmount(unitPrice.amount)} ${currencySymbol(unitPrice.currencyCode)}`)}</>;
}

/** Joins short items with the locale's list separator ("، " / ", "). */
export function JoinedList({ items }: { items: string[] }) {
  return <>{items.join(useUI().labels.listSep)}</>;
}
