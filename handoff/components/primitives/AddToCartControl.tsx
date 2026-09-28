'use client';
import * as React from 'react';
import { TLink } from '../lib/next';
import { useUI } from '../provider';
import type { CartControlProps } from '../types';
import { Icon } from './Icon';
import { QtyStepper } from './QtyStepper';

/**
 * Card-level cart control (approved behaviour, keep it):
 *  - out of stock  → bell, leads to the product's back-in-stock form
 *  - quantity 0    → green cart button (one tap adds 1)
 *  - quantity > 0  → inline stepper (minus at 1 removes the line)
 * State and mutations stay in the production cart store (Zustand) — pass them in.
 */
export function AddToCartControl({ title, available, quantity, onAdd, onIncrement, onDecrement, notifyHref, busy }: CartControlProps & { title: string; available: boolean }) {
  const { labels } = useUI();
  const prev = React.useRef(quantity);
  const enter = prev.current === 0 && quantity > 0;
  React.useEffect(() => { prev.current = quantity; }, [quantity]);

  if (!available) {
    const cls = 'grid h-[52px] w-14 place-items-center rounded-tahdig-button bg-[#EDEFEA] text-tahdig-green transition-transform duration-[140ms] active:scale-[.94]';
    return notifyHref
      ? <TLink href={notifyHref} className={cls} aria-label={`${labels.notifyWhenBack}: ${title}`}><Icon name="bell" /></TLink>
      : <span className={cls} aria-hidden="true"><Icon name="bell" /></span>;
  }
  if (!quantity) {
    return (
      <button type="button" onClick={onAdd} disabled={busy} aria-label={`${labels.addToCart}: ${title}`}
        className="grid h-[52px] w-14 cursor-pointer place-items-center rounded-tahdig-button bg-tahdig-green text-white shadow-tahdig-button transition-transform duration-[140ms] ease-tahdig-out active:scale-[.94] disabled:opacity-60">
        <Icon name="cart" />
      </button>
    );
  }
  return <QtyStepper quantity={quantity} onIncrement={onIncrement} onDecrement={onDecrement} label={title} enter={enter} disabled={busy} />;
}
