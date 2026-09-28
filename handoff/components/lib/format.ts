import type { Money } from '../types';

const FA = '۰۱۲۳۴۵۶۷۸۹';

/** Western digits → Persian digits; "." → Persian decimal "٫", "," → "٬" */
export function faDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => FA[Number(d)]).replace(/\./g, '٫').replace(/,/g, '٬');
}

const isPersian = (locale: string) => /^fa\b|^fa-|^prs|^ps/i.test(locale);

/**
 * Approved price display for Persian: whole amounts without decimals (45), otherwise two
 * decimals (۴۴٫۸۰), thousands grouped (۲٬۲۰۰). Currency is rendered separately.
 */
export function formatAmount(amount: number): string {
  const r = Math.round(amount * 100) / 100;
  const s = Number.isInteger(r) ? String(Math.round(r)) : r.toFixed(2);
  const [i, d] = s.split('.');
  return faDigits(i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? '.' + d : ''));
}

/** Locale-aware amount formatter: Persian keeps the approved format, others use Intl (fi: "44,80", en: "44.80"). */
export function amountFormatter(locale = 'fa'): (amount: number) => string {
  if (isPersian(locale)) return formatAmount;
  return (amount) => {
    const whole = Number.isInteger(Math.round(amount * 100) / 100);
    return new Intl.NumberFormat(locale, { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 }).format(amount);
  };
}

/** Locale-aware integer / count formatter. */
export function numberFormatter(locale = 'fa'): (n: number | string) => string {
  if (isPersian(locale)) return faDigits;
  return (n) => (typeof n === 'number' ? new Intl.NumberFormat(locale).format(n) : n);
}

export const currencySymbol = (code: string) => (code === 'EUR' ? '€' : code);

export const moneyText = (m: Money, fmt: (n: number) => string = formatAmount) => `${fmt(m.amount)} ${currencySymbol(m.currencyCode)}`;
