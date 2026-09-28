'use client';
import * as React from 'react';
import { tpl } from '../labels';
import { TLink } from '../lib/next';
import { useUI } from '../provider';
import { Icon } from '../primitives/Icon';
import { Container } from './Container';

export interface HeaderProps {
  /** /assets/tahdig-logo.png (252×140). Ignored when `logo` is passed. */
  logoSrc?: string;
  /**
   * Optional logo node (inline SVG component or next/image). It is placed in a fixed
   * 126:70 box — 58px tall on phones, 70px from 481px — so it cannot change the bar.
   * Give an SVG `className="h-full w-auto"`; give next/image `width={126} height={70} className="h-full w-auto" priority`.
   */
  logo?: React.ReactNode;
  cartCount: number;
  cartHref: string;
  onMenuOpen: () => void;
  menuOpen?: boolean;
  homeHref?: string;
  /** optional hook for the badge "bump" animation after add-to-cart */
  badgeRef?: React.Ref<HTMLSpanElement>;
}

/**
 * APPROVED — FROZEN. Menu (start) · centred logo · cart (end), at every width.
 * Phone (≤480): 90px bar, 58px logo, 48px cart. ≥481: 108px, 70px, 56px.
 * Client Component: it owns the menu button callback and the badge ref. Icon-only
 * controls keep their accessible names (aria-label); no visible text is added.
 */
export function Header({ logoSrc = '/assets/tahdig-logo.png', logo, cartCount, cartHref, onMenuOpen, menuOpen, homeHref = '/', badgeRef }: HeaderProps) {
  const { labels, formatNumber } = useUI();
  return (
    <header className="relative z-20 border-b border-tahdig-line bg-tahdig-cream">
      <Container className="grid h-[90px] grid-cols-[1fr_auto_1fr] items-center xs:h-[108px]">
        <button type="button" onClick={onMenuOpen} aria-label={labels.menu} aria-expanded={!!menuOpen} aria-controls="tahdig-menu"
          className="-ms-1 grid h-11 w-11 cursor-pointer place-items-center justify-self-start rounded-tahdig-control text-tahdig-green transition-transform active:scale-[.97] xs:-ms-1.5 xs:h-12 xs:w-12 [&_svg]:h-6 [&_svg]:w-6 xs:[&_svg]:h-7 xs:[&_svg]:w-7">
          <Icon name="menu" strokeWidth={2} />
        </button>
        <TLink href={homeHref} aria-label={labels.homeLogo} className="block leading-none">
          {logo
            ? <span className="flex h-[58px] items-center justify-center xs:h-[70px] [&>*]:h-full [&>*]:w-auto">{logo}</span>
            : /* eslint-disable-next-line @next/next/no-img-element */
              <img src={logoSrc} width={126} height={70} alt="" className="block h-[58px] w-auto xs:h-[70px]" />}
        </TLink>
        <TLink href={cartHref} aria-label={cartCount ? tpl(labels.cartWithCount, formatNumber(cartCount)) : labels.cart}
          className="relative grid h-12 w-12 place-items-center justify-self-end rounded-tahdig-control bg-tahdig-green text-white shadow-tahdig-cartButton transition-transform active:scale-[.97] xs:h-14 xs:w-14 xs:rounded-tahdig-button [&>svg]:h-5 [&>svg]:w-5 xs:[&>svg]:h-[22px] xs:[&>svg]:w-[22px]">
          <Icon name="cart" />
          {cartCount > 0 && (
            <span ref={badgeRef} aria-hidden="true" className="absolute -top-1.5 -start-2 flex h-[18px] min-w-[26px] items-center justify-center rounded-[9px] bg-tahdig-goldAA px-1.5 text-[12px] font-bold leading-none text-white">{formatNumber(cartCount)}</span>
          )}
        </TLink>
      </Container>
    </header>
  );
}
