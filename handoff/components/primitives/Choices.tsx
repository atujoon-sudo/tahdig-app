import * as React from 'react';
import { cn } from '../lib/cn';

export interface ChoiceItem { id: string; label: React.ReactNode; disabled?: boolean; unavailable?: boolean }

const chip = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-tahdig-control px-[18px] text-[15px] font-semibold text-tahdig-ink shadow-[inset_0_0_0_1.5px_#D9D0BE] transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[.97] hover:bg-[#E9E4DA] aria-checked:bg-tahdig-green aria-checked:text-white aria-checked:shadow-none aria-checked:hover:bg-tahdig-green';

/** Single-select chips: variants (weight), servings, delivery frequency. */
export function ChoiceChips({ label, labelledBy, items, value, onChange, className }: {
  label?: string; labelledBy?: string; items: ChoiceItem[]; value: string; onChange: (id: string) => void; className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} aria-labelledby={labelledBy} className={cn('flex flex-wrap gap-2.5', className)}>
      {items.map((it) => (
        <button key={it.id} type="button" role="radio" aria-checked={value === it.id} disabled={it.disabled} onClick={() => onChange(it.id)}
          className={cn(chip, it.unavailable && 'text-tahdig-slate line-through decoration-[rgba(90,111,128,.6)]')}>{it.label}</button>
      ))}
    </div>
  );
}

/** Radio "cards" (checkout-style options). */
export function OptionCards({ label, items, value, onChange }: { label: string; items: Array<{ id: string; title: string; hint?: string }>; value: string; onChange: (id: string) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-2.5">
      {items.map((it) => {
        const on = value === it.id;
        return (
          <button key={it.id} type="button" role="radio" aria-checked={on} onClick={() => onChange(it.id)}
            className={cn('flex min-h-16 items-center gap-3.5 rounded-2xl bg-white px-4 py-3 text-start transition-shadow', on ? 'bg-[#FDFCF8] shadow-[inset_0_0_0_1.5px_#1C4A3D]' : 'shadow-[inset_0_0_0_1px_#E3DCCD] hover:shadow-[inset_0_0_0_1px_#D9D0BE]')}>
            <span className={cn('h-[22px] w-[22px] flex-none rounded-full', on ? 'shadow-[inset_0_0_0_6px_#1C4A3D]' : 'shadow-[inset_0_0_0_1.5px_#D9D0BE]')} />
            <span><b className="block text-[15.5px] font-bold text-tahdig-ink">{it.title}</b>{it.hint && <small className="block text-[13px] text-tahdig-slate">{it.hint}</small>}</span>
          </button>
        );
      })}
    </div>
  );
}
