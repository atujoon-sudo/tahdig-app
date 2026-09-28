/* Server-safe presentational surfaces. */
import * as React from 'react';
import { cn } from '../lib/cn';
import { Icon, type IconName } from './Icon';

/** Cream card surface with the approved soft shadow. */
export function Panel({ as: Tag = 'section', className, children, ...rest }: { as?: 'section' | 'div' | 'aside' | 'nav' | 'article'; className?: string; children: React.ReactNode } & React.HTMLAttributes<HTMLElement>) {
  return <Tag className={cn('rounded-tahdig-card bg-tahdig-cream shadow-tahdig-card', className)} {...rest}>{children}</Tag>;
}

const NOTE = { info: 'bg-tahdig-sand text-tahdig-ink2 [&>svg]:text-tahdig-gold', ok: 'bg-tahdig-okBg text-tahdig-ok', warn: 'bg-tahdig-warnBg text-[#7A5A1E] [&>svg]:text-tahdig-gold' };
export function Note({ tone = 'info', icon = 'info', className, children }: { tone?: keyof typeof NOTE; icon?: IconName; className?: string; children: React.ReactNode }) {
  return <p className={cn('flex items-start gap-2.5 rounded-tahdig-control px-3.5 py-3 text-[13.5px] leading-[1.8]', NOTE[tone], className)}><Icon name={icon} size={20} className="mt-0.5" /><span>{children}</span></p>;
}

const BADGE = { neutral: 'bg-tahdig-sand text-tahdig-ink2', gold: 'bg-[#F4E8CF] text-tahdig-goldText', ok: 'bg-tahdig-okBg text-tahdig-ok', muted: 'bg-[#ECE9E3] text-tahdig-slate' };
export function Badge({ tone = 'neutral', className, children }: { tone?: keyof typeof BADGE; className?: string; children: React.ReactNode }) {
  return <span className={cn('inline-flex h-[26px] items-center rounded-lg px-2.5 text-[12.5px] font-bold', BADGE[tone], className)}>{children}</span>;
}

/** Centered section title (home sections, "همراه این محصول", trust). */
export function SectionTitle({ id, className, children }: { id?: string; className?: string; children: React.ReactNode }) {
  return <h2 id={id} className={cn('text-center text-[26px] font-black leading-[1.45] text-tahdig-heading [text-wrap:balance] lg:text-[28px]', className)}>{children}</h2>;
}

export function EmptyState({ icon = 'bag', title, text, children }: { icon?: IconName; title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="py-12 text-center text-[16px] leading-[1.9] text-tahdig-slate">
      <Icon name={icon} size={44} strokeWidth={1.4} className="mx-auto mb-2.5 text-tahdig-goldSoft" />
      <b className="block text-[19px] font-extrabold text-tahdig-heading">{title}</b>
      {text && <p>{text}</p>}
      {children && <div className="mt-[18px] flex flex-col items-center gap-3.5">{children}</div>}
    </div>
  );
}

/** Page heading block for inner pages. */
export function PageHeader({ title, meta, intro }: { title: string; meta?: React.ReactNode; intro?: string }) {
  return (
    <header className="pt-1.5">
      <h1 className="text-[26px] font-black leading-[1.45] text-tahdig-ink [text-wrap:balance] md:text-[30px] lg:text-[34px]">{title}</h1>
      {meta && <p className="mt-1 text-[14px] text-tahdig-slate">{meta}</p>}
      {intro && <p className="mt-2.5 max-w-[62ch] text-[15px] leading-[2] text-tahdig-slate">{intro}</p>}
    </header>
  );
}
