'use client';
/**
 * Integration seam between the UI layer and the production app.
 * Wrap the storefront once (e.g. in app/layout.tsx):
 *
 *   <TahdigUIProvider link={NextLink} image={NextImageAdapter} labels={t}>
 *     <TahdigRoot>{children}</TahdigRoot>
 *   </TahdigUIProvider>
 *
 * Nothing here talks to Shopify, Meilisearch, Zustand or SWR.
 */
import * as React from 'react';
import { defaultLabels, type Labels } from './labels';
import { formatAmount } from './lib/format';
import { cn } from './lib/cn';
import type { ImageData } from './types';

export type LinkLike = React.ComponentType<{ href: string; className?: string; children?: React.ReactNode; 'aria-label'?: string; 'aria-current'?: 'page' | undefined; tabIndex?: number; 'aria-hidden'?: boolean | 'true'; onClick?: React.MouseEventHandler }>;
export type ImageLike = React.ComponentType<{ image: ImageData; className?: string; sizes?: string; priority?: boolean }>;

const DefaultLink: LinkLike = ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>;
const DefaultImage: ImageLike = ({ image, className }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={image.url} alt={image.alt ?? ''} width={image.width} height={image.height} loading="lazy" className={cn('h-full w-full object-contain', className)} />
);

interface Ctx { Link: LinkLike; Image: ImageLike; formatAmount: (n: number) => string; labels: Labels }
const UICtx = React.createContext<Ctx>({ Link: DefaultLink, Image: DefaultImage, formatAmount, labels: defaultLabels });

export function TahdigUIProvider({ link, image, formatAmount: fmt, labels, children }: {
  link?: LinkLike; image?: ImageLike; formatAmount?: (n: number) => string; labels?: Partial<Labels>; children: React.ReactNode;
}) {
  const value = React.useMemo<Ctx>(() => ({
    Link: link ?? DefaultLink, Image: image ?? DefaultImage, formatAmount: fmt ?? formatAmount,
    labels: { ...defaultLabels, ...labels } as Labels,
  }), [link, image, fmt, labels]);
  return <UICtx.Provider value={value}>{children}</UICtx.Provider>;
}

export const useUI = () => React.useContext(UICtx);

/** Sets RTL, font and the gutter variable for everything inside it. */
export function TahdigRoot({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div dir="rtl" lang="fa" className={cn('tahdig-root min-h-full bg-tahdig-page', className)}>{children}</div>;
}
