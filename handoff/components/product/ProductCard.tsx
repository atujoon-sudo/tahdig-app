import * as React from 'react';
import { cn } from '../lib/cn';
import { TLink } from '../lib/next';
import type { CartControlProps, ProductCardData } from '../types';
import { AddToCartControl } from '../primitives/AddToCartControl';
import { Media } from '../primitives/Media';
import { Price, UnitPrice } from '../primitives/Price';
import { Label } from '../primitives/Text';

export interface ProductCardProps {
  product: ProductCardData;
  /** Client usage: state + callbacks from the cart store → the approved AddToCartControl. */
  cart?: CartControlProps;
  /** Server usage: a client island that renders <AddToCartControl …/> bound to the cart store. Wins over `cart`. */
  cartSlot?: React.ReactNode;
  variant?: 'rail' | 'grid'; imageSizes?: string;
}

/**
 * The single product card used everywhere (home picks, grids, related, favourites).
 * Order is fixed: image · name + package size · price (+ unit price) · cart control.
 * Server-safe. No recurring / subscription UI on cards (that lives on the PDP only).
 */
export function ProductCard({ product: p, cart, cartSlot, variant = 'grid', imageSizes = '(min-width:1024px) 240px, 70vw' }: ProductCardProps) {
  return (
    <article className={cn(
      'relative flex flex-col rounded-tahdig-card bg-tahdig-cream px-4 pb-5 pt-4 shadow-tahdig-card transition-transform duration-150 ease-tahdig-out has-[a[data-card-link]:active]:scale-[.985]',
      variant === 'rail' && 'flex-none snap-start basis-[calc(25vw+202.5px)] xs:basis-[300px] lg:basis-auto',
      !p.available && 'is-oos')}>
      <TLink href={p.href} tabIndex={-1} aria-hidden="true"
        className={cn('mx-auto block aspect-square overflow-hidden rounded-md', !p.available && 'opacity-75 grayscale',
          variant === 'rail' ? 'w-[min(240px,calc(25vw+131px))] xs:w-[min(240px,100%)]' : 'w-[min(260px,100%)] lg:w-[min(240px,100%)]')}>
        <Media image={p.image} soft className="h-full w-full" sizes={imageSizes} />
      </TLink>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5 px-1.5">
        <h3 className="text-[15.5px] font-medium leading-[1.6] text-tahdig-ink">
          <TLink href={p.href} className="hover:text-tahdig-heading" data-card-link="">{p.title}</TLink>
        </h3>
        <span className="text-[14px] text-tahdig-slate">{p.sizeLabel}</span>
      </div>
      <div className="mt-auto flex min-h-[52px] items-center justify-between gap-3 px-1.5 pt-3.5">
        {p.available
          ? <div className="grid"><Price price={p.price} compareAt={p.compareAtPrice} /><UnitPrice unitPrice={p.unitPrice} /></div>
          : <span className="text-[16px] text-tahdig-slate"><Label k="outOfStock" /></span>}
        {cartSlot ?? (cart ? <AddToCartControl title={p.title} available={p.available} {...cart} /> : null)}
      </div>
    </article>
  );
}
