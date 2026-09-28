import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * Server-safe root. Sets the TAHDIG font, colours and gutter variable.
 *
 * Direction and language are INHERITED from the production `[locale]` layout
 * (`<html lang={locale} dir={dir}>`) by default. Pass `dir` / `lang` only when the
 * TAHDIG area must differ from the document (e.g. an embedded island).
 * Persian: dir="rtl" (the approved design). Finnish / English: dir="ltr".
 */
export function TahdigRoot({ dir, lang, className, children }: { dir?: 'rtl' | 'ltr'; lang?: string; className?: string; children: React.ReactNode }) {
  return <div dir={dir} lang={lang} className={cn('tahdig-root min-h-full bg-tahdig-page', className)}>{children}</div>;
}

/** Direction for a locale — use in the production [locale] layout. */
export const dirForLocale = (locale: string): 'rtl' | 'ltr' => (/^(fa|ar|he|ur|ps|prs)(\b|-)/i.test(locale) ? 'rtl' : 'ltr');
