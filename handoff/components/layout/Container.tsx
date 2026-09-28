import * as React from 'react';
import { cn } from '../lib/cn';

/** 1200px max content width with the responsive gutter (16 / 24 / 32px). */
export function Container({ className, children, as: Tag = 'div' }: { className?: string; children: React.ReactNode; as?: 'div' | 'section' | 'main' }) {
  return <Tag className={cn('mx-auto w-full max-w-tahdig-container px-[var(--t-gutter)]', className)}>{children}</Tag>;
}
