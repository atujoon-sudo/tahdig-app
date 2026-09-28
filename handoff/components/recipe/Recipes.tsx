'use client';
import * as React from 'react';
import { cn } from '../lib/cn';
import { faDigits, moneyText } from '../lib/format';
import { useUI } from '../provider';
import type { Crumb, ImageData, IngredientRow, Money, PantryRow, RecipeCardData } from '../types';
import { Breadcrumbs } from '../primitives/Breadcrumbs';
import { Button } from '../primitives/Button';
import { ChoiceChips } from '../primitives/Choices';
import { Icon } from '../primitives/Icon';
import { Media } from '../primitives/Media';
import { Note } from '../primitives/Surfaces';
import { Container } from '../layout/Container';

export function RecipeMeta({ difficulty, servings, time }: { difficulty: string; servings: number; time: string }) {
  const { labels } = useUI();
  return (
    <div className="mt-3.5 flex min-h-11 items-center justify-between gap-2 rounded-xl bg-tahdig-sand px-3.5 text-[13.5px] text-tahdig-ink2 [&_svg]:text-tahdig-gold">
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Icon name="bolt" size={18} />{difficulty}</span>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Icon name="person" size={18} />{labels.people(faDigits(servings))}</span>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Icon name="timer" size={18} />{time}</span>
    </div>
  );
}

export function RecipeCard({ recipe: r, headingLevel = 3 }: { recipe: RecipeCardData; headingLevel?: 2 | 3 }) {
  const { Link, labels } = useUI();
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="flex flex-col rounded-tahdig-card bg-tahdig-cream px-4 pb-[18px] pt-4 shadow-tahdig-card">
      <Link href={r.href} tabIndex={-1} aria-hidden="true" className="block overflow-hidden rounded-2xl">
        <Media image={r.image} className="aspect-[4/3] w-full bg-[linear-gradient(160deg,#F3EEE5,#EAE2D3)]" placeholderIcon="bowl" iconSize={56} />
      </Link>
      <RecipeMeta difficulty={r.difficulty} servings={r.servings} time={r.time} />
      <H className="mt-4 px-1 text-[18px] font-bold leading-[1.6] text-tahdig-ink"><Link href={r.href} className="hover:text-tahdig-heading">{r.title}</Link></H>
      <Button href={r.href} block className="mt-4" aria-label={`${labels.viewIngredients} ${r.title}`}>{labels.viewIngredients}<Icon name="arrow-left" /></Button>
    </article>
  );
}

/** 1 column → 2 (640) → 3 (1024). */
export function RecipeGrid({ recipes }: { recipes: RecipeCardData[] }) {
  return <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">{recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}</div>;
}

export interface RecipeDetailProps {
  crumbs: Crumb[];
  title: string; difficulty: string; servings: number; time: string; image?: ImageData | null;
  servingOptions: number[]; selectedServings: number; onServingsChange: (n: number) => void;
  ingredients: IngredientRow[]; onToggleIngredient: (id: string) => void;
  /** summary of the selected, available ingredients */
  selection: { productCount: number; packCount: number; total: Money };
  onAddIngredients: () => void; addBusy?: boolean;
  /** shown after a successful add */
  addedCount?: number; cartHref: string;
  pantry: PantryRow[]; onTogglePantry: (id: string) => void; onBuyPantry?: (id: string) => void;
  steps: string[];
}

/**
 * <768: hero · title · shopping (servings, ingredients, others) · method.
 * ≥768: dish column (hero, title, method) | sticky shopping column.
 */
export function RecipeDetail(p: RecipeDetailProps) {
  const { labels, Link, formatAmount } = useUI();
  const oos = p.ingredients.filter((i) => !i.available).length;
  return (
    <Container className="pb-2">
      <Breadcrumbs items={p.crumbs} />
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:grid-rows-[auto_auto_1fr] md:gap-x-7 md:[grid-template-areas:'hero_shop'_'head_shop'_'method_shop'] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-x-12">
        <Media image={p.image} className="aspect-[4/3] rounded-tahdig-card bg-[linear-gradient(160deg,#F3EEE5,#EAE2D3)] shadow-[inset_0_0_0_1px_#E3DCCD] sm:aspect-[16/8] md:aspect-[4/3] md:[grid-area:hero] lg:aspect-[16/10]" placeholderIcon="bowl" iconSize={72} />
        <header className="mt-[22px] md:[grid-area:head]">
          <h1 className="text-[26px] font-black leading-[1.45] text-tahdig-heading md:text-[30px]">{p.title}</h1>
          <RecipeMeta difficulty={p.difficulty} servings={p.servings} time={p.time} />
        </header>

        <div className="md:sticky md:top-5 md:self-start md:[grid-area:shop]">
          <section aria-labelledby="rd-serv" className="mt-8 md:mt-0">
            <h2 id="rd-serv" className="text-[19px] font-extrabold leading-normal text-tahdig-heading">{labels.servingsQ}</h2>
            <ChoiceChips className="mt-3.5" labelledBy="rd-serv" value={String(p.selectedServings)} onChange={(v) => p.onServingsChange(Number(v))}
              items={p.servingOptions.map((n) => ({ id: String(n), label: labels.people(faDigits(n)) }))} />
          </section>

          <section aria-labelledby="rd-ing" className="mt-8">
            <h2 id="rd-ing" className="text-[19px] font-extrabold text-tahdig-heading">{labels.buyableIngredients}</h2>
            <p className="mt-1 text-[14px] leading-[1.8] text-tahdig-slate">{labels.buyableHint}</p>
            <div className="mt-3.5 rounded-tahdig-card bg-tahdig-cream px-4 py-1.5 shadow-tahdig-card">
              {p.ingredients.map((i) => (
                <div key={i.id} className={cn('grid grid-cols-[auto_56px_1fr_auto] items-center gap-3 border-b border-tahdig-line py-3.5 last:border-b-0', !i.available && 'opacity-65')}>
                  <button type="button" role="checkbox" aria-checked={i.available && i.selected} disabled={!i.available} onClick={() => p.onToggleIngredient(i.id)} aria-label={`خرید ${i.title}`}
                    className={cn('relative grid h-[26px] w-[26px] place-items-center rounded-lg text-white after:absolute after:-inset-2.5', i.available && i.selected ? 'bg-tahdig-green' : 'bg-white shadow-[inset_0_0_0_1.5px_#D9D0BE] disabled:bg-tahdig-chip')}>
                    <Icon name="check" size={16} strokeWidth={2.6} className={i.available && i.selected ? '' : 'opacity-0'} />
                  </button>
                  <Media image={i.image} className="h-14 w-14 rounded-xl" iconSize={22} />
                  <div className="min-w-0">
                    <div className={cn('text-[15px] font-semibold leading-[1.6]', i.selected && i.available ? 'text-tahdig-ink' : 'text-tahdig-slate')}><Link href={i.href} className="hover:text-tahdig-heading">{i.title}</Link></div>
                    <div className="text-[13px] text-tahdig-slate">{i.needLabel} · {i.packLabel}</div>
                  </div>
                  <div className={cn('whitespace-nowrap text-[15px] font-bold tabular-nums', i.selected && i.available ? 'text-tahdig-ink' : 'text-tahdig-slate')}>
                    {i.available ? (i.lineTotal ? moneyText(i.lineTotal, formatAmount) : '—') : labels.outOfStock}
                  </div>
                </div>
              ))}
            </div>
            {oos > 0 && <Note tone="warn" className="mt-3">{faDigits(oos)} ماده فعلاً ناموجود است و به سبد اضافه نمی‌شود.</Note>}
            <div className="mt-4 grid gap-3">
              <div className="flex items-baseline justify-between text-[14.5px] text-tahdig-slate">
                <span>{faDigits(p.selection.productCount)} محصول · {faDigits(p.selection.packCount)} بسته</span>
                <b className="text-[20px] tabular-nums text-tahdig-ink">{moneyText(p.selection.total, formatAmount)}</b>
              </div>
              <Button block onClick={p.onAddIngredients} disabled={!p.selection.productCount || p.addBusy}><Icon name="cart" />{labels.addIngredients}</Button>
            </div>
            {!!p.addedCount && <Note tone="ok" icon="check" className="mt-3">{faDigits(p.addedCount)} محصول به سبد اضافه شد · <Link href={p.cartHref} className="font-bold underline underline-offset-4">{labels.viewCart}</Link></Note>}
          </section>

          <section aria-labelledby="rd-other" className="mt-8">
            <h2 id="rd-other" className="text-[19px] font-extrabold text-tahdig-heading">{labels.otherIngredients}</h2>
            <p className="mt-1 text-[14px] leading-[1.8] text-tahdig-slate">{labels.otherHint}</p>
            <div className="mt-3.5 grid gap-2.5">
              {p.pantry.map((x) => (
                <div key={x.id} className="flex min-h-14 items-center gap-2.5 rounded-2xl bg-tahdig-cream py-2 pe-2 ps-4 shadow-[inset_0_0_0_1px_#E3DCCD]">
                  <span className="flex-1 text-[15px] text-tahdig-ink">{x.label}{x.soldHere && <small className="block text-[12.5px] text-tahdig-slate">{labels.soldHere}</small>}</span>
                  {x.soldHere && !x.have && p.onBuyPantry && <Button variant="ghost" size="sm" onClick={() => p.onBuyPantry?.(x.id)}><Icon name="plus" />{labels.buy}</Button>}
                  <button type="button" role="checkbox" aria-checked={x.have} onClick={() => p.onTogglePantry(x.id)} aria-label={`${x.label} را دارم`}
                    className={cn('inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3.5 text-[14px] font-semibold', x.have ? 'bg-tahdig-okBg text-tahdig-ok' : 'text-tahdig-ink shadow-[inset_0_0_0_1.5px_#D9D0BE]')}>
                    {x.have && <Icon name="check" size={16} strokeWidth={2.4} />}{labels.iHave}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section aria-labelledby="rd-method" className="mt-8 md:[grid-area:method]">
          <h2 id="rd-method" className="text-[19px] font-extrabold text-tahdig-heading">{labels.method}</h2>
          <ol className="t-method mt-4 grid gap-3.5">
            {p.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3.5 before:mt-0.5 before:grid before:h-8 before:w-8 before:flex-none before:place-items-center before:rounded-full before:border-[1.5px] before:border-tahdig-goldSoft before:text-[15px] before:font-bold before:text-tahdig-gold">
                <p className="flex-1 rounded-2xl bg-tahdig-cream px-4 py-3 text-[15px] leading-[1.95] text-tahdig-ink2 shadow-[inset_0_0_0_1px_#E3DCCD]">{s}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </Container>
  );
}
