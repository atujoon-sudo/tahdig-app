/* Server-safe sections. Interactive parts arrive as slots (e.g. the client <SearchBar/>). */
import * as React from 'react';
import { cn } from '../lib/cn';
import { TLink } from '../lib/next';
import type { CategoryItem } from '../types';
import { Icon, type IconName } from '../primitives/Icon';
import { Media } from '../primitives/Media';
import { SectionTitle } from '../primitives/Surfaces';
import { Container } from '../layout/Container';
import { Num } from '../primitives/Text';

/* ------------------------------------------------------------------ */
/* APPROVED — FROZEN: hero + search + quick-search band                */
/* ------------------------------------------------------------------ */
export function HomeHero({ title, ariaTitle, subtitle, search, quickSearches }: {
  /** display title (keeps the approved kashida spacing), e.g. "امـــروز چـی لازم داری ؟" */
  title: string; ariaTitle: string; subtitle: string;
  /** the client <SearchBar …/> bound to the production Meilisearch client */
  search: React.ReactNode;
  /** quick searches link to the search route, e.g. href="/fa/search?q=برنج" */
  quickSearches: Array<{ label: string; ariaLabel: string; href: string }>;
}) {
  return (
    <>
      <Container as="section" className="pt-[31px] xs:pt-12 lg:pt-10 lg:text-center">
        <h1 aria-label={ariaTitle} className="text-[31px] font-black leading-[1.35] text-tahdig-heading [text-wrap:balance] xs:text-[34px] lg:text-[38px]">{title}</h1>
        <p className="mt-0.5 text-[15.5px] leading-[1.8] text-tahdig-slateSoft xs:mt-1.5 lg:text-[16px]">{subtitle}</p>
      </Container>
      <div className="t-search-zone mt-[34px] xs:mt-14 lg:mt-10">
        <Container><div className="lg:mx-auto lg:max-w-[760px]">{search}</div></Container>
        <div className="t-band-circles relative overflow-hidden pb-11 xs:pb-[62px]">
          <div className="t-scroll-x mt-5 flex gap-2 px-[var(--t-gutter)] [scroll-padding-inline:var(--t-gutter)] xs:mt-6 lg:justify-center">
            {quickSearches.map((q) => (
              <TLink key={q.href} href={q.href} aria-label={q.ariaLabel}
                className="relative inline-flex h-8 flex-none items-center rounded-[10px] bg-white/[.06] px-3 text-[13.5px] text-[rgba(236,230,215,.78)] transition-[background-color,transform] after:absolute after:inset-x-0 after:-inset-y-1.5 active:scale-[.96] hover:bg-white/[.12]">{q.label}</TLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* APPROVED — FROZEN: category carousel (native scroll, gentle snap)    */
/* ------------------------------------------------------------------ */
export function CategoryCarousel({ title, titleId = 'home-cats', categories, onHome = true }: { title: string; titleId?: string; categories: CategoryItem[]; onHome?: boolean }) {
  return (
    <section aria-labelledby={titleId} className={onHome ? 'pt-9 xs:pt-12' : 'pt-12'}>
      <SectionTitle id={titleId}>{title}</SectionTitle>
      <div className="t-scroll-x flex snap-x snap-proximity gap-4 px-[var(--t-gutter)] pb-2 pt-7 [scroll-padding-inline:var(--t-gutter)] sm:justify-center lg:gap-6">
        {categories.map((c) => (
          <TLink key={c.id} href={c.href} className="flex w-[88px] flex-none snap-start flex-col items-center gap-3 text-tahdig-ink transition-transform active:scale-95">
            <span aria-hidden="true" className="grid h-20 w-20 place-items-center rounded-full bg-tahdig-beige">
              <Media image={c.image} className="h-[62px] w-[62px] rounded-full" iconSize={20} />
            </span>
            <span className="whitespace-nowrap text-[14.5px] leading-normal">{c.label}</span>
          </TLink>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* APPROVED — FROZEN: "خرید بر اساس غذا" meal panel                      */
/* ------------------------------------------------------------------ */
export function MealPanel({ title, lines, steps, ctaLabel, ctaHref, collage }: {
  title: string;
  /** two copy lines, each rendered as its own balanced line */
  lines: [string, string];
  steps: Array<{ icon: IconName; label: string }>;
  ctaLabel: string; ctaHref: string;
  /** up to three dish images for the collage; placeholders otherwise */
  collage?: Array<import('../types').ImageData | null>;
}) {
  const circle = 'absolute grid place-items-center overflow-hidden rounded-full border border-white/10 bg-white/[.06] text-white/[.28]';
  const img = (i: number) => collage?.[i] ? <Media image={collage[i]} className="h-full w-full bg-none" /> : <Icon name="image" size={26} strokeWidth={1.3} />;
  return (
    <Container>
      <section aria-labelledby="home-meal"
        className="mt-3 rounded-tahdig-card bg-tahdig-greenDeep px-4 pb-4 pt-10 text-white xs:mt-16 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:px-10 lg:pb-8 lg:pt-10 lg:[grid-template-areas:'text_art'_'steps_art'_'cta_art']">
        <div className="lg:[grid-area:text]">
          <h2 id="home-meal" className="text-[29px] font-black leading-[1.4] xs:px-2 xs:text-[32px]">{title}</h2>
          <p className="mt-3 text-[13px] leading-[2] text-[rgba(246,241,230,.86)] xs:px-2 xs:text-[13.5px] xs:leading-[2.05]">
            {lines.map((l, i) => <span key={i} className="block [text-wrap:balance] xs:[text-wrap:wrap]">{l}</span>)}
          </p>
        </div>
        <div aria-hidden="true" className="relative mx-auto mb-6 mt-5 aspect-square w-[min(260px,calc(50vw+45px))] xs:mb-9 xs:mt-7 xs:aspect-[290/220] xs:w-[min(290px,80%)] lg:m-auto lg:w-[min(360px,90%)] lg:self-center lg:[grid-area:art]">
          <i className={cn(circle, 'left-[2%] top-[10%] h-[40%] w-[44%]')}>{img(0)}</i>
          <i className={cn(circle, 'right-[2%] top-[12%] h-1/2 w-[52%]')}>{img(1)}</i>
          <i className={cn(circle, 'left-[6%] top-[38%] h-[58%] w-[62%] bg-white/[.08]')}>{img(2)}</i>
        </div>
        <ol className="grid gap-4 xs:px-2 lg:mt-7 lg:[grid-area:steps]">
          {steps.map((s, i) => (
            <li key={s.label} className="t-step-link relative flex items-center gap-3.5">
              <span className="t-step-n relative grid h-8 w-8 flex-none place-items-center rounded-full border-[1.5px] border-tahdig-goldSoft text-[16px] font-bold text-tahdig-goldStep"><Num value={i + 1} /></span>
              <div className="flex h-[74px] flex-1 items-center gap-4 rounded-2xl border border-white/[.08] bg-white/[.03] px-5 text-[13.5px] xs:h-20">
                <Icon name={s.icon} size={30} strokeWidth={1.6} className="text-tahdig-goldSoft" /><span>{s.label}</span>
              </div>
            </li>
          ))}
        </ol>
        <TLink href={ctaHref} className="mt-10 flex h-[74px] w-full items-center justify-center gap-7 rounded-2xl bg-tahdig-gold text-[20px] font-bold text-white transition-[transform,filter] active:scale-[.98] hover:brightness-105 xs:mx-2 xs:mt-8 xs:w-[calc(100%-16px)] lg:[grid-area:cta]">
          <span>{ctaLabel}</span><Icon name="arrow-left" />
        </TLink>
      </section>
    </Container>
  );
}

/* ------------------------------------------------------------------ */
/* Promo panels: recurring purchases (green) + ready packages (beige)   */
/* Two separate concepts — never merge them.                            */
/* ------------------------------------------------------------------ */
export interface PromoPanelData { title: React.ReactNode; text: string; ctaLabel: string; href: string; image?: import('../types').ImageData | null }

export function PromoPanels({ recurring, bundles }: { recurring: PromoPanelData; bundles: PromoPanelData }) {
  return (
    <Container className="mt-5 grid gap-5 xs:mt-9 sm:grid-cols-2 lg:mt-10 lg:gap-7">
      <PromoPanel tone="green" {...recurring} />
      <PromoPanel tone="beige" {...bundles} />
    </Container>
  );
}

function PromoPanel({ tone, title, text, ctaLabel, href, image }: PromoPanelData & { tone: 'green' | 'beige' }) {
  const green = tone === 'green';
  return (
    <section className={cn('grid grid-cols-[1fr_40%] items-center gap-4 rounded-tahdig-panel px-5 py-7 md:px-7 md:py-8 lg:gap-x-7 lg:px-9 lg:py-10', green ? 'bg-tahdig-green text-white' : 'bg-tahdig-beige')}>
      <div>
        <h2 className={cn('text-[19.5px] font-extrabold leading-[1.6] [text-wrap:balance] lg:text-[23px]', !green && 'text-tahdig-heading')}>{title}</h2>
        <p className={cn('mt-2.5 text-[13px] leading-[1.95] lg:text-[14.5px]', green ? 'text-[rgba(246,241,230,.88)]' : 'text-tahdig-ink2')}>{text}</p>
        <TLink href={href} className={cn('mt-5 inline-flex h-11 items-center gap-3.5 whitespace-nowrap rounded-[22px] px-5 text-[15px] text-white transition-transform active:scale-[.97]', green ? 'bg-tahdig-goldAA' : 'bg-tahdig-green')}>
          <span>{ctaLabel}</span><Icon name="arrow-left" size={20} />
        </TLink>
      </div>
      <Media image={image} className={cn('aspect-square w-full rounded-tahdig-control', green ? 'bg-white/[.07] bg-none text-white/30' : 'bg-white/[.35] bg-none')} />
    </section>
  );
}
