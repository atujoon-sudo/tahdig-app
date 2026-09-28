'use client';
import * as React from 'react';
import { cn } from '../lib/cn';
import { useUI } from '../provider';
import { Icon } from '../primitives/Icon';

export interface SearchBarProps {
  /** controlled value (e.g. the Meilisearch query from the URL / store) */
  value?: string;
  defaultValue?: string;
  onChange?: (q: string) => void;
  onSubmit: (q: string) => void;
  placeholder?: string;
  /** camera / mic are visual only until those features exist */
  onImageSearch?: () => void;
  onVoiceSearch?: () => void;
  className?: string;
  inputId?: string;
}

/**
 * APPROVED — FROZEN look. Cream pill, camera + mic (visual), green go button.
 * Phone: 56px / r28, go 44px. ≥481: 62px / r31, go 48px. ≥1024 in the home hero: max 760px, centred.
 * Presentational only — NOT a search engine. The production Meilisearch client owns
 * querying, debouncing, typo tolerance, facets and routing; bind `value`/`onChange`/
 * `onSubmit` to it (see docs/MIGRATION-GUIDE.md › Search mapping).
 */
export function SearchBar({ value, defaultValue, onChange, onSubmit, placeholder, onImageSearch, onVoiceSearch, className, inputId }: SearchBarProps) {
  const { labels } = useUI();
  const ref = React.useRef<HTMLInputElement>(null);
  const ic = 'relative grid cursor-pointer h-10 w-9 after:absolute after:-inset-0.5 place-items-center rounded-xl text-tahdig-slateSoft xs:h-11 xs:w-10';
  return (
    <form role="search" noValidate onSubmit={(e) => { e.preventDefault(); onSubmit((ref.current?.value ?? '').trim()); }}
      className={cn('flex h-14 items-center gap-1 rounded-[28px] bg-tahdig-cream pe-1.5 ps-4 shadow-tahdig-search focus-within:shadow-[0_12px_26px_-12px_rgba(60,50,30,.22),inset_0_0_0_1.5px_#1C4A3D] xs:h-[62px] xs:rounded-[31px] xs:pe-[7px] xs:ps-5', className)}>
      <input ref={ref} id={inputId} type="search" enterKeyHint="search" autoComplete="off" aria-label={labels.searchLabel}
        placeholder={placeholder ?? labels.searchPlaceholder} value={value} defaultValue={defaultValue} onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="t-search-input h-full min-w-0 flex-1 bg-transparent text-[16px] text-tahdig-ink outline-none placeholder:text-[14px] placeholder:text-tahdig-slateSoft" />
      <button type="button" className={ic} onClick={onImageSearch} aria-label={labels.imageSearchSoon}><Icon name="camera" size={21} /></button>
      <button type="button" className={ic} onClick={onVoiceSearch} aria-label={labels.voiceSearchSoon}><Icon name="mic" size={21} /></button>
      <button className="grid h-11 w-11 flex-none cursor-pointer place-items-center rounded-[13px] bg-tahdig-green text-white shadow-[0_8px_16px_-8px_rgba(28,74,61,.6)] transition-transform active:scale-[.94] xs:h-12 xs:w-12 xs:rounded-tahdig-control" aria-label={labels.search}>
        <Icon name="search" />
      </button>
    </form>
  );
}
