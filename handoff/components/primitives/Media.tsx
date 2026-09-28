import { cn } from '../lib/cn';
import { TImage } from '../lib/next';
import type { ImageData } from '../types';
import { Icon, type IconName } from './Icon';

/**
 * Server-safe product / recipe media box: next/image when an image exists,
 * otherwise the approved neutral placeholder. The box keeps its aspect ratio
 * either way, so placeholders never change layout.
 */
export function Media({ image, className, placeholderIcon = 'image', iconSize = 44, soft, sizes, priority }: {
  image?: ImageData | null; className?: string; placeholderIcon?: IconName; iconSize?: number; soft?: boolean; sizes?: string; priority?: boolean;
}) {
  return (
    <span className={cn('relative grid place-items-center overflow-hidden', soft ? 't-ph-soft' : 't-ph', className)} aria-hidden={image ? undefined : true}>
      {image ? <TImage image={image} sizes={sizes} priority={priority} /> : <Icon name={placeholderIcon} size={iconSize} strokeWidth={1.3} className="opacity-70" />}
    </span>
  );
}
