import * as React from 'react';
import { cn } from '../lib/cn';
import { useUI } from '../provider';

export type ButtonVariant = 'primary' | 'gold' | 'ghost' | 'outline' | 'white';
const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-tahdig-green text-white shadow-tahdig-button hover:bg-[#1F5343]',
  gold: 'bg-tahdig-gold text-white hover:brightness-105',
  ghost: 'bg-tahdig-chip text-tahdig-ink hover:bg-[#E9E4DA]',
  outline: 'bg-transparent text-tahdig-heading shadow-[inset_0_0_0_1.5px_#D9D0BE] hover:shadow-[inset_0_0_0_1.5px_#1D5243]',
  white: 'bg-white text-tahdig-heading',
};
const SIZE = {
  md: 'h-14 px-6 rounded-tahdig-button text-[16px]',            // 56px — primary CTA
  sm: 'h-11 px-[18px] rounded-tahdig-control text-[15px]',     // 44px
};

type Common = { variant?: ButtonVariant; size?: keyof typeof SIZE; block?: boolean; className?: string; children: React.ReactNode };
type AsButton = Common & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common & { href: string; 'aria-label'?: string };

/** Primary action. Renders the provider Link when `href` is set. */
export function Button(props: AsButton | AsLink) {
  const { Link } = useUI();
  const { variant = 'primary', size = 'md', block, className, children } = props;
  const cls = cn(
    'inline-flex items-center justify-center gap-3 whitespace-nowrap font-bold leading-[1.2] transition-[transform,background-color,filter] duration-[140ms] ease-tahdig-out active:scale-[.98]',
    '[&_svg]:h-[22px] [&_svg]:w-[22px] disabled:opacity-45 disabled:pointer-events-none aria-disabled:opacity-45 aria-disabled:pointer-events-none',
    SIZE[size], VARIANT[variant], block && 'flex w-full', className,
  );
  if ('href' in props && props.href !== undefined) {
    return <Link href={props.href} className={cls} aria-label={props['aria-label']}>{children}</Link>;
  }
  const { variant: _v, size: _s, block: _b, className: _c, children: _ch, ...rest } = props as AsButton;
  return <button type="button" className={cls} {...rest}>{children}</button>;
}

/** Quiet inline text action (e.g. "افزودن به خرید دوره‌ای", "ویرایش") */
export function TextAction({ className, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cn('inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-tahdig-heading [&_svg]:h-[18px] [&_svg]:w-[18px]', className)} {...rest}>{children}</button>;
}
