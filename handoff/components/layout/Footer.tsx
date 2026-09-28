import * as React from 'react';
import { cn } from '../lib/cn';
import { useUI } from '../provider';
import { Icon, type IconName } from '../primitives/Icon';
import { SectionTitle } from '../primitives/Surfaces';
import { Container } from './Container';

export interface FooterLinkGroup { title: string; /** spaced display version, e.g. "خدمـــات مشتـــری" */ displayTitle?: string; links: Array<{ href: string; label: string; current?: boolean }>; defaultOpen?: boolean }

const TRUST: Array<{ icon: IconName; title: string; text: string; highlight?: boolean }> = [
  { icon: 'trust-pay', title: 'پرداخت امن', text: 'پرداخت از مسیرهای امن و معتبر.', highlight: true },
  { icon: 'trust-help', title: 'پشتیبانی به زبان خودت', text: 'برای سؤال یا پیگیری، راحت‌تر با ما در ارتباط باش.' },
  { icon: 'trust-box', title: 'اطلاعات شفاف محصول', text: 'پیش از خرید، وزن، ترکیبات و اطلاعات لازم را ببین.' },
  { icon: 'trust-ship', title: 'ارسال قابل پیگیری', text: 'وضعیت سفارشت را تا زمان تحویل دنبال کن.' },
];

/** Neutral placeholders until licensed provider marks are supplied (pass `logos`). */
export function PaymentLogos({ logos, columns = 6 }: { logos?: React.ReactNode[]; columns?: 3 | 6 }) {
  const items = logos ?? ['VISA', 'Mastercard', 'MobilePay', 'Apple Pay', 'Google Pay', 'Klarna'];
  return (
    <div dir="ltr" aria-label="روش‌های پرداخت" className={cn('grid gap-1.5', columns === 3 ? 'grid-cols-3' : 'grid-cols-6')}>
      {items.map((l, i) => <span key={i} className="grid h-[34px] place-items-center overflow-hidden whitespace-nowrap rounded-[7px] bg-white text-[9.5px] font-bold text-[#A8A397] shadow-[0_1px_3px_rgba(0,0,0,.06)] sm:h-9 sm:text-[10.5px]">{l}</span>)}
    </div>
  );
}

export function NewsletterPanel({ onSubmit, error }: { onSubmit: (email: string) => void; error?: string }) {
  const ref = React.useRef<HTMLInputElement>(null);
  return (
    <section aria-labelledby="tahdig-news" className="t-news-circles relative mt-10 overflow-hidden rounded-tahdig-card bg-tahdig-green px-5 pb-6 pt-[30px] text-center text-white">
      <h2 id="tahdig-news" className="text-[20px] font-extrabold leading-[1.6]">تازه‌های <em className="not-italic text-tahdig-goldText">ته‌دیگ</em> را از دست نده</h2>
      <p className="mt-1 text-[13.5px] text-[rgba(246,241,230,.85)]">از محصولات جدید و پیشنهادهای ویژه زودتر باخبر شو.</p>
      <form noValidate onSubmit={(e) => { e.preventDefault(); onSubmit(ref.current?.value.trim() ?? ''); }}
        className="mt-6 flex h-[60px] items-center gap-2 rounded-[18px] bg-tahdig-cream pe-1.5 ps-[18px]">
        <input ref={ref} type="email" inputMode="email" autoComplete="email" enterKeyHint="send" aria-label="ایمیل شما" placeholder="ایمیل شما"
          aria-invalid={error ? true : undefined} className="h-full min-w-0 flex-1 bg-transparent text-start text-tahdig-ink outline-none placeholder:text-[14.5px] placeholder:text-tahdig-slate" />
        <button className="h-12 rounded-tahdig-control bg-tahdig-green px-6 text-[15px] font-semibold text-white active:scale-[.96]">عضویت</button>
      </form>
      {error && <p role="alert" className="mt-2 text-[13px] text-[#F3C9BD]">{error}</p>}
    </section>
  );
}

/**
 * variant:
 *  - full: trust + newsletter + links + brand + contact + social + banks + bottom
 *  - info: same without the trust section (policy pages)
 *  - lite: bottom band only (checkout entry)
 */
export function Footer({ variant = 'full', linkGroups, contactHref, social, banks, onNewsletterSubmit, newsletterError }: {
  variant?: 'full' | 'info' | 'lite'; linkGroups: FooterLinkGroup[]; contactHref: string;
  social: Array<{ label: string; icon: IconName; href?: string; highlight?: boolean }>; banks: string[];
  onNewsletterSubmit: (email: string) => void; newsletterError?: string;
}) {
  const { Link } = useUI();
  const bottom = (
    <div className={cn('bg-tahdig-bottomBg pb-[calc(24px+env(safe-area-inset-bottom))] pt-5', variant === 'lite' ? 'mt-12' : 'mt-10')}>
      <Container><p className="text-center text-[14px] text-tahdig-ink2">تمامی حقوق برای این وب سایت محفوظ است. © ۲۰۲۶</p><div className="mt-4"><PaymentLogos /></div></Container>
    </div>
  );
  if (variant === 'lite') return <footer>{bottom}</footer>;
  return (
    <footer>
      {variant === 'full' && <>
        <SectionTitle className="px-[var(--t-gutter)] pb-8 pt-16 lg:pt-20">با خیال راحت، از انتخاب تا تحویل</SectionTitle>
        <section aria-label="چرا ته‌دیگ" className="bg-tahdig-trustBg pb-16 pt-14">
          <Container className="grid grid-cols-2 gap-x-2 gap-y-6 sm:grid-cols-4">
            {TRUST.map((t) => (
              <div key={t.title} className={cn('group flex flex-col items-center rounded-tahdig-card px-2.5 pb-5 pt-4 text-center transition-colors hover:bg-tahdig-sand', t.highlight && 'bg-tahdig-sand')}>
                <span className={cn('grid h-[72px] w-[72px] place-items-center rounded-full group-hover:bg-transparent', t.highlight ? 'bg-transparent' : 'bg-white')}>
                  <Icon name={t.icon} size={34} strokeWidth={1.6} className="text-tahdig-green" />
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-tahdig-ink">{t.title}</h3>
                <p className="mt-1.5 text-[13px] leading-[1.75] text-tahdig-ink2">{t.text}</p>
              </div>
            ))}
          </Container>
        </section>
      </>}
      <Container>
        <div className="md:grid md:grid-cols-[1.1fr_1fr] md:items-start md:gap-8 lg:gap-14">
          <NewsletterPanel onSubmit={onNewsletterSubmit} error={newsletterError} />
          <nav aria-label="پیوندهای پاورقی" className="mt-10 grid gap-0.5">
            {linkGroups.map((g) => (
              <details key={g.title} open={g.defaultOpen} className="t-details">
                <summary className="flex min-h-[52px] cursor-pointer items-center justify-between text-[20px] font-extrabold text-tahdig-heading">
                  <span aria-hidden="true">{g.displayTitle ?? g.title}</span><span className="sr-only">{g.title}</span>
                  <Icon name="down" size={18} className="t-chev text-tahdig-slate transition-transform duration-200" />
                </summary>
                <ul className="pb-3 pe-0 ps-4 pt-1">
                  {g.links.map((l) => (
                    <li key={l.href}><Link href={l.href} aria-current={l.current ? 'page' : undefined}
                      className={cn('flex min-h-11 items-center gap-2.5 text-[15.5px] hover:text-tahdig-ink', l.current ? 'text-tahdig-ink before:-ms-[15px] before:h-[5px] before:w-[5px] before:rounded-full before:bg-tahdig-ink' : 'text-tahdig-slate')}>{l.label}</Link></li>
                  ))}
                </ul>
              </details>
            ))}
          </nav>
        </div>
        <div className="mx-auto max-w-[640px]">
          <div className="mt-9 text-center">
            <h2 className="text-[23px] font-extrabold leading-normal text-tahdig-heading">ته‌دیگ؛ خرید ساده، انتخاب مطمئن</h2>
            <p className="mt-3 text-[14.5px] leading-[1.95] text-tahdig-ink2">ته‌دیگ برای ساده‌تر کردن خرید ساخته شده است؛ محصولات منتخب، اطلاعات روشن، پرداخت امن و ارسال قابل پیگیری، همه در یکجا</p>
          </div>
          <Link href={contactHref} className="mt-7 flex h-16 w-full items-center justify-center gap-3.5 rounded-[18px] bg-tahdig-green text-[18px] font-semibold text-white shadow-tahdig-contact transition-transform active:scale-[.98]">
            <Icon name="chat" size={24} /><span>ارتباط با ما</span>
          </Link>
          <div className="mt-6 grid grid-cols-4 place-items-center">
            {social.map((s) => {
              const cls = cn('grid h-16 w-16 place-items-center rounded-[18px] transition-[transform,background-color] active:scale-[.92]', s.highlight ? 'bg-tahdig-gold text-white' : 'text-tahdig-green hover:bg-tahdig-chip');
              const icon = <Icon name={s.icon} size={30} strokeWidth={1.8} />;
              return s.href ? <Link key={s.label} href={s.href} aria-label={s.label} className={cls}>{icon}</Link> : <span key={s.label} className={cls} aria-label={s.label} role="img">{icon}</span>;
            })}
          </div>
        </div>
        <section aria-labelledby="tahdig-banks" className="mt-12 rounded-tahdig-card border border-tahdig-goldSoft pb-[22px] pt-5">
          <h2 id="tahdig-banks" className="flex items-center justify-center gap-3 text-[17px] font-bold text-tahdig-heading"><Icon name="bank" size={24} />بانک‌های معتبر فنلاند</h2>
          <hr className="mx-10 my-4 h-px border-0 bg-[linear-gradient(90deg,transparent,#CFC6B4,transparent)]" />
          <div className="t-marquee-mask overflow-hidden" aria-hidden="true">
            <div className="flex w-max animate-tahdig-marquee gap-8 hover:[animation-play-state:paused]">
              {[...banks, ...banks].map((b, i) => <span key={i} dir="ltr" className="grid h-[38px] place-items-center whitespace-nowrap rounded-[10px] bg-[#EAE5DA] px-[18px] text-[13px] font-semibold tracking-[.06em] text-[#9A958A]">{b}</span>)}
            </div>
          </div>
        </section>
      </Container>
      {bottom}
    </footer>
  );
}
