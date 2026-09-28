import * as React from 'react';
import { cn } from '../lib/cn';
import { useUI } from '../provider';
import type { ImageData } from '../types';
import { Icon, type IconName } from './Icon';

/**
 * Product / recipe media box. Uses the provider Image (next/image) when an
 * image exists, otherwise the approved neutral placeholder. Placeholders must
 * never change layout: the box keeps its aspect ratio either way.
 */
export function Media({ image, className, placeholderIcon = 'image', iconSize = 44, soft, sizes, priority }: {
  image?: ImageData | null; className?: string; placeholderIcon?: IconName; iconSize?: number; soft?: boolean; sizes?: string; priority?: boolean;
}) {
  const { Image } = useUI();
  return (
    <span className={cn('grid place-items-center overflow-hidden', soft ? 't-ph-soft' : 't-ph', className)} aria-hidden={image ? undefined : true}>
      {image ? <Image image={image} sizes={sizes} priority={priority} /> : <Icon name={placeholderIcon} size={iconSize} strokeWidth={1.3} className="opacity-70" />}
    </span>
  );
}
