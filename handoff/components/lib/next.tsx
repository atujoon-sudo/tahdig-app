/**
 * The ONE place the UI layer touches Next.js primitives. Server-safe.
 * If production wraps next/link (e.g. locale-prefixed links) or next/image
 * (custom loader), change these two exports only.
 */
import NextLink from 'next/link';
import NextImage from 'next/image';
import { cn } from './cn';
import type { ImageData } from '../types';

export const TLink = NextLink;

/**
 * Product / content image. With width+height it renders a sized next/image; without,
 * it fills its (relative) box. `sizes` should be provided by the caller for responsive grids.
 */
export function TImage({ image, className, sizes, priority }: { image: ImageData; className?: string; sizes?: string; priority?: boolean }) {
  if (image.width && image.height) {
    return <NextImage src={image.url} alt={image.alt ?? ''} width={image.width} height={image.height} sizes={sizes} priority={priority} className={cn('h-full w-full object-contain', className)} />;
  }
  return <NextImage src={image.url} alt={image.alt ?? ''} fill sizes={sizes ?? '100vw'} priority={priority} className={cn('object-contain', className)} />;
}
