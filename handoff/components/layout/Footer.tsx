/* Server-safe. The only interactive part (newsletter form) is the client file NewsletterPanel.tsx. */
import * as React from 'react';
import { cn } from '../lib/cn';
import { TLink } from '../lib/next';
import { NewsletterPanel } from './NewsletterPanel';
import { Icon, type IconName } from '../primitives/Icon';
import { SectionTitle } from '../primitives/Surfaces';
import { Container } from './Container';

export interface FooterLinkGroup { title: string; /** spaced display version, e.g. "خدمـــات مشتـــری" */ displayTitle?: string; links: Array<{ href: string; label: string; current?: boolean }>; defaultOpen?: boolean }

export interface FooterCopy {
  trustTitle: string; trustAria: string; trust: Array<{ icon: IconName; title: string; text: string; highlight?: boolean }>;
  linksAria: string; brandTitle: string; brandText: string; contact: string; banksTitle: string; copyright: string; paymentAria: string;
}

const TRUST: FooterCopy['trust'] = [
  { icon: 'trust-pay', title: 'پرداخت امن', text: 'پرداخت از مسیرهای امن و معتبر.', highlight: true },
  { icon: 'trust-help', title: 'پشتیبانی به زبان خودت', text: 'برای سؤال یا پیگیری، راحت‌تر با ما در ارتباط باش.' },
  { icon: 'trust-box', title: 'اطلاعات شفاف محصول', text: 'پیش از خرید، وزن، ترکیبات و اطلاعات لازم را ببین.' },
  { icon: 'trust-ship', title: 'ارسال قابل پیگیری', text: 'وضعیت سفارشت را تا زمان تحویل دنبال کن.' },
];

export const defaultFooterCopy: FooterCopy = {
  trustTitle: 'با خیال راحت، از انتخاب تا تحویل', trustAria: 'چرا ته‌دیگ', trust: TRUST, linksAria: 'پیوندهای پاورقی',
  brandTitle: 'ته‌دیگ؛ خرید ساده، انتخاب مطمئن',
  brandText: 'ته‌دیگ برای ساده‌تر کردن خرید ساخته شده است؛ محصولات منتخب، اطلاعات روشن، پرداخت امن و ارسال قابل پیگیری، همه در یکجا',
  contact: 'ارتباط با ما', banksTitle: 'بانک‌های معتبر فنلاند', copyright: 'تمامی حقوق برای این وب سایت محفوظ است. © ۲۰۲۶', paymentAria: 'روش‌های پرداخت',
};

/** Neutral placeholders until licensed provider marks are supplied (pass `logos`). */
export function PaymentLogos({ logos, columns = 6, ariaLabel = defaultFooterCopy.paymentAria }: { logos?: React.ReactNode[]; columns?: 3 | 6; ariaLabel?: string }) {
  const items = logos ?? ['VISA', 'Mastercard', 'MobilePay', 'Apple Pay', 'Google Pay', 'Klarna'];
  return (
    <div dir="ltr" aria-label={ariaLabel} className={cn('grid gap-1.5', columns === 3 ? 'grid-cols-3' : 'grid-cols-6')}>
      {items.map((l, i) => <span key={i} className="grid h-[34px] place-items-center overflow-hidden whitespace-nowrap rounded-[7px] bg-white text-[9.5px] font-bold text-[#A8A397] shadow-[0_1px_3px_rgba(0,0,0,.06)] sm:h-9 sm:text-[10.5px]">{l}</span>)}
    </div>
  );
}

/**
 * variant:
 *  - full: trust + newsletter + links + brand + contact + social + banks + bottom
 *  - info: same without the trust section (policy pages)
 *  - lite: bottom band only (checkout entry)
 */
export function Footer({ variant = 'full', linkGroups, contactHref, social, banks, newsletter, onNewsletterSubmit, newsletterError, copy: copyOverride }: {
  variant?: 'full' | 'info' | 'lite'; linkGroups: FooterLinkGroup[]; contactHref: string;
  social: Array<{ label: string; icon: IconName; href?: string; highlight?: boolean }>; banks: string[];
  /** Server usage: pass a client island, e.g. <NewsletterSignup /> wrapping <NewsletterPanel onSubmit=…/>. */
  newsletter?: React.ReactNode;
  /** Client usage only (functions cannot cross the server boundary). Ignored when `newsletter` is set. */
  onNewsletterSubmit?: (email: string) => void; newsletterError?: string;
  /** Localized footer copy (defaults: approved Persian). */
  copy?: Partial<FooterCopy>;
}) {
  const copy = { ...defaultFooterCopy, ...copyOverride };
  const bottom = (
    <div className={cn('bg-tahdig-bottomBg pb-[calc(22px+env(safe-area-inset-bottom))] pt-[18px]', variant === 'lite' ? 'mt-12' : 'mt-8 md:mt-10')}>
      <Container className="lg:flex lg:items-center lg:justify-between lg:gap-8">
        <p className="text-center text-[13.5px] text-tahdig-ink2 lg:text-start">{copy.copyright}</p>
        <div className="mt-3.5 md:mx-auto md:max-w-[560px] lg:m-0 lg:w-[540px] lg:max-w-none lg:flex-none"><PaymentLogos ariaLabel={copy.paymentAria} /></div>
      </Container>
    </div>
  );
  if (variant === 'lite') return <footer>{bottom}</footer>;
  const socialRow = (
    <div className="mt-2 grid grid-cols-4 place-items-center md:mt-0 md:grid-cols-[repeat(4,44px)] md:justify-between lg:justify-start lg:gap-1.5">
      {social.map((s) => {
        const cls = cn('grid h-14 w-14 place-items-center rounded-2xl transition-[transform,background-color] active:scale-[.92] md:h-11 md:w-11 md:rounded-tahdig-control md:[&>svg]:h-6 md:[&>svg]:w-6', s.highlight ? 'bg-[#F4E8CF] text-tahdig-goldText' : 'text-tahdig-green hover:bg-tahdig-chip');
        const icon = <Icon name={s.icon} size={28} strokeWidth={1.8} />;
        return s.href ? <TLink key={s.label} href={s.href} aria-label={s.label} className={cls}>{icon}</TLink> : <span key={s.label} className={cls} aria-label={s.label} role="img">{icon}</span>;
      })}
    </div>
  );
  const linkCls = (current?: boolean) => cn('flex items-center gap-2.5 text-[15px] hover:text-tahdig-ink', current ? 'text-tahdig-ink' : 'text-tahdig-slate');
  return (
    <footer>
      {variant === 'full' && <>
        <SectionTitle className="px-[var(--t-gutter)] pb-6 pt-12 md:pb-7 md:pt-16 lg:pt-20">{copy.trustTitle}</SectionTitle>
        <section aria-label={copy.trustAria} className="bg-tahdig-trustBg pb-10 pt-9 md:pb-12 md:pt-11">
          <Container className="grid grid-cols-2 gap-x-2 gap-y-3 sm:grid-cols-4">
            {copy.trust.map((t) => (
              <div key={t.title} className={cn('group flex flex-col items-center rounded-tahdig-card px-2 pb-4 pt-3.5 text-center transition-colors hover:bg-tahdig-sand', t.highlight && 'bg-tahdig-sand')}>
                <span className={cn('grid h-16 w-16 place-items-center rounded-full group-hover:bg-transparent', t.highlight ? 'bg-transparent' : 'bg-white')}>
                  <Icon name={t.icon} size={32} strokeWidth={1.6} className="text-tahdig-green" />
                </span>
                <h3 className="mt-3 text-[15px] font-bold text-tahdig-ink">{t.title}</h3>
                <p className="mt-1 text-[13px] leading-[1.75] text-tahdig-ink2">{t.text}</p>
              </div>
            ))}
          </Container>
        </section>
      </>}
      <Container className="pt-8 md:pt-10 lg:pt-12">
        {newsletter ?? (onNewsletterSubmit ? <NewsletterPanel onSubmit={onNewsletterSubmit} error={newsletterError} /> : null)}
        <div className="mt-6 grid md:mt-10 md:gap-y-8 md:[grid-template-areas:'cols'_'brand'] lg:mt-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)] lg:gap-x-12 lg:[grid-template-areas:'brand_cols'] xl:gap-x-[72px]">
          {/* phones: accordions — full-width divided rows, so each chevron reads with its own title */}
          <nav aria-label={copy.linksAria} className="border-t border-tahdig-line md:hidden">
            {linkGroups.map((g) => (
              <details key={g.title} open={g.defaultOpen} className="t-details border-b border-tahdig-line">
                <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 text-[17px] font-extrabold text-tahdig-heading">
                  <span aria-hidden="true">{g.displayTitle ?? g.title}</span><span className="sr-only">{g.title}</span>
                  <Icon name="down" size={18} className="t-chev flex-none text-tahdig-slate transition-transform duration-200" />
                </summary>
                <ul className="pb-2.5 ps-4">
                  {g.links.map((l) => (
                    <li key={l.href}><TLink href={l.href} aria-current={l.current ? 'page' : undefined}
                      className={cn(linkCls(l.current), 'min-h-11', l.current && 'before:-ms-[15px] before:h-[5px] before:w-[5px] before:rounded-full before:bg-tahdig-ink')}>{l.label}</TLink></li>
                  ))}
                </ul>
              </details>
            ))}
          </nav>
          {/* tablet / desktop: open link columns, no mobile-only accordion chrome */}
          <nav aria-label={copy.linksAria} className="hidden md:grid md:grid-cols-3 md:gap-6 md:[grid-area:cols]">
            {linkGroups.map((g) => (
              <div key={g.title}>
                <h2 className="mb-1.5 text-[16px] font-extrabold leading-[1.6] text-tahdig-heading">{g.title}</h2>
                <ul>
                  {g.links.map((l) => (
                    <li key={l.href}><TLink href={l.href} aria-current={l.current ? 'page' : undefined}
                      className={cn(linkCls(l.current), 'relative min-h-10 after:absolute after:inset-x-0 after:-inset-y-0.5', l.current && 'font-semibold')}>{l.label}</TLink></li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="mt-6 text-center md:mt-0 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-x-8 md:border-t md:border-tahdig-line md:pt-6 md:text-start md:[grid-area:brand] lg:block lg:border-t-0 lg:pt-0">
            <div>
              <h2 className="text-[18px] font-extrabold leading-[1.5] text-tahdig-heading [text-wrap:balance] md:text-[17px]">{copy.brandTitle}</h2>
              <p className="mt-1.5 text-[13.5px] leading-[1.85] text-tahdig-ink2 [text-wrap:pretty]">{copy.brandText}</p>
            </div>
            <div className="mt-[18px] md:mt-0 md:flex md:w-[212px] md:flex-col md:gap-2.5 lg:mt-5 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-4 lg:gap-y-3">
              <TLink href={contactHref} className="flex h-[52px] w-full items-center justify-center gap-3 rounded-2xl bg-tahdig-green text-[17px] font-semibold text-white shadow-tahdig-contact transition-transform active:scale-[.98] md:h-[52px] md:rounded-tahdig-control md:px-6 md:text-[16px] lg:w-auto">
                <Icon name="chat" size={22} /><span>{copy.contact}</span>
              </TLink>
              {socialRow}
            </div>
          </div>
        </div>
        <section aria-labelledby="tahdig-banks" className="mt-8 rounded-[20px] border border-tahdig-goldSoft pb-[18px] pt-4 md:mt-10 md:flex md:items-center md:gap-5 md:px-5 md:py-3 lg:mt-12">
          <h2 id="tahdig-banks" className="flex items-center justify-center gap-2.5 whitespace-nowrap text-[15.5px] font-bold text-tahdig-heading"><Icon name="bank" size={22} />{copy.banksTitle}</h2>
          <div className="t-marquee-mask mt-3.5 overflow-hidden md:mt-0 md:min-w-0 md:flex-1" aria-hidden="true">
            <div className="flex w-max animate-tahdig-marquee gap-6 hover:[animation-play-state:paused] ltr:animate-tahdig-marquee-ltr">
              {[...banks, ...banks].map((b, i) => <span key={i} dir="ltr" className="grid h-[34px] place-items-center whitespace-nowrap rounded-[10px] bg-[#EAE5DA] px-4 text-[12.5px] font-semibold tracking-[.06em] text-[#9A958A]">{b}</span>)}
            </div>
          </div>
        </section>
      </Container>
      {bottom}
    </footer>
  );
}
