'use client';
import * as React from 'react';

export interface NewsletterCopy { titleA: string; titleBrand: string; titleB: string; text: string; email: string; submit: string }
export const defaultNewsletterCopy: NewsletterCopy = { titleA: 'تازه‌های ', titleBrand: 'ته‌دیگ', titleB: ' را از دست نده', text: 'از محصولات جدید و پیشنهادهای ویژه زودتر باخبر شو.', email: 'ایمیل شما', submit: 'عضویت' };

/** Client island. Subscription (Shopify customer marketing consent / ESP) is production logic behind onSubmit. */
export function NewsletterPanel({ onSubmit, error, copy: o }: { onSubmit: (email: string) => void; error?: string; copy?: Partial<NewsletterCopy> }) {
  const copy = { ...defaultNewsletterCopy, ...o };
  const ref = React.useRef<HTMLInputElement>(null);
  return (
    <section aria-labelledby="tahdig-news" className="t-news-circles relative mt-10 overflow-hidden rounded-tahdig-card bg-tahdig-green px-5 pb-6 pt-[30px] text-center text-white">
      <h2 id="tahdig-news" className="text-[20px] font-extrabold leading-[1.6]">{copy.titleA}<em className="not-italic text-tahdig-goldHighlight">{copy.titleBrand}</em>{copy.titleB}</h2>
      <p className="mt-1 text-[13.5px] text-[rgba(246,241,230,.85)]">{copy.text}</p>
      <form noValidate onSubmit={(e) => { e.preventDefault(); onSubmit(ref.current?.value.trim() ?? ''); }}
        className="mt-6 flex h-[60px] items-center gap-2 rounded-[18px] bg-tahdig-cream pe-1.5 ps-[18px]">
        <input ref={ref} type="email" inputMode="email" autoComplete="email" enterKeyHint="send" aria-label={copy.email} placeholder={copy.email}
          aria-invalid={error ? true : undefined} className="h-full min-w-0 flex-1 bg-transparent text-start text-tahdig-ink outline-none placeholder:text-[14.5px] placeholder:text-tahdig-slate" />
        <button className="h-12 cursor-pointer rounded-tahdig-control bg-tahdig-green px-6 text-[15px] font-semibold text-white active:scale-[.96]">{copy.submit}</button>
      </form>
      {error && <p role="alert" className="mt-2 text-[13px] text-[#F3C9BD]">{error}</p>}
    </section>
  );
}
