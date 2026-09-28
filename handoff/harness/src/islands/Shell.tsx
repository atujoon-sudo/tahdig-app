'use client';
/** Client island: header + menu drawer share the open state and read the cart count from the store. */
import * as React from 'react';
import { Header, MenuDrawer, type DrawerLink } from '@/ui/tahdig/components';
import { selectCount, useCartStore } from '@/ui/tahdig/examples/cartStore';

export function Shell({ locale, links }: { locale: string; links: DrawerLink[] }) {
  const [open, setOpen] = React.useState(false);
  const count = useCartStore(selectCount);
  const close = React.useCallback(() => setOpen(false), []);
  return <>
    <Header cartCount={count} cartHref={`/${locale}/preview/cart`} homeHref={`/${locale}/server`} onMenuOpen={() => setOpen(true)} menuOpen={open} />
    <MenuDrawer open={open} onClose={close} logoSrc="/assets/tahdig-logo-small.png" links={links.map((l) => (l.icon === 'cart' ? { ...l, count } : l))} />
  </>;
}
