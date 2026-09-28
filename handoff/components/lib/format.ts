import type { Money, UnitPriceData } from '../types';

const FA = '۰۱۲۳۴۵۶۷۸۹';

/** Western digits → Persian digits; "." → Persian decimal separator "٫", "," → "٬" */
export function faDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => FA[Number(d)]).replace(/\./g, '٫').replace(/,/g, '٬');
}

/**
 * Approved price display: whole amounts without decimals (45), otherwise two
 * decimals (44٫80), thousands grouped (۲٬۲۰۰). Currency is rendered separately.
 * If production already formats money (Shopify/Intl), pass `formatAmount` to <TahdigUIProvider>.
 */
export function formatAmount(amount: number): string {
  const r = Math.round(amount * 100) / 100;
  const s = Number.isInteger(r) ? String(Math.round(r)) : r.toFixed(2);
  const [i, d] = s.split('.');
  return faDigits(i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? '.' + d : ''));
}

export const currencySymbol = (code: string) => (code === 'EUR' ? '€' : code);

export const moneyText = (m: Money, fmt = formatAmount) => `${fmt(m.amount)} ${currencySymbol(m.currencyCode)}`;

/** "هر کیلو ۴٫۵۰ €" */
export const unitPriceText = (u: UnitPriceData, fmt = formatAmount) =>
  `هر ${u.unit === 'l' ? 'لیتر' : 'کیلو'} ${fmt(u.amount)} ${currencySymbol(u.currencyCode)}`;
