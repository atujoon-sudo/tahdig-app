/* Server-safe recipe listing pieces. */
import { TLink } from '../lib/next';
import type { RecipeCardData } from '../types';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import { Media } from '../primitives/Media';
import { Label } from '../primitives/Text';

export function RecipeMeta({ difficulty, servings, time }: { difficulty: string; servings: number; time: string }) {
  return (
    <div className="mt-3.5 flex min-h-11 items-center justify-between gap-2 rounded-xl bg-tahdig-sand px-3.5 text-[13.5px] text-tahdig-ink2 [&_svg]:text-tahdig-gold">
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Icon name="bolt" size={18} />{difficulty}</span>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Icon name="person" size={18} /><Label k="people" values={[servings]} /></span>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Icon name="timer" size={18} />{time}</span>
    </div>
  );
}

export function RecipeCard({ recipe: r, headingLevel = 3 }: { recipe: RecipeCardData; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="flex flex-col rounded-tahdig-card bg-tahdig-cream px-4 pb-[18px] pt-4 shadow-tahdig-card">
      <TLink href={r.href} tabIndex={-1} aria-hidden="true" className="block overflow-hidden rounded-2xl">
        <Media image={r.image} className="aspect-[4/3] w-full bg-[linear-gradient(160deg,#F3EEE5,#EAE2D3)]" placeholderIcon="bowl" iconSize={56} />
      </TLink>
      <RecipeMeta difficulty={r.difficulty} servings={r.servings} time={r.time} />
      <H className="mt-4 px-1 text-[18px] font-bold leading-[1.6] text-tahdig-ink"><TLink href={r.href} className="hover:text-tahdig-heading">{r.title}</TLink></H>
      <Button href={r.href} block className="mt-4"><Label k="viewIngredients" /><span className="sr-only"> {r.title}</span><Icon name="arrow-left" /></Button>
    </article>
  );
}

/** 1 column → 2 (640) → 3 (1024). */
export function RecipeGrid({ recipes }: { recipes: RecipeCardData[] }) {
  return <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">{recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}</div>;
}

