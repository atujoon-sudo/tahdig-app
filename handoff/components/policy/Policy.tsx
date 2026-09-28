import * as React from 'react';
import { cn } from '../lib/cn';
import { useUI } from '../provider';
import type { Crumb, PolicySection } from '../types';
import { Breadcrumbs } from '../primitives/Breadcrumbs';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import { PageHeader, Panel } from '../primitives/Surfaces';
import { Container } from '../layout/Container';
import { PaymentLogos } from '../layout/Footer';

export function HelpPanel({ supportHref }: { supportHref: string }) {
  const { labels } = useUI();
  return (
    <section aria-labelledby="help-t" className="rounded-tahdig-card bg-tahdig-green px-5 pb-5 pt-[26px] text-center text-white">
      <h2 id="help-t" className="flex items-center justify-center gap-3 text-[19px] font-extrabold"><Icon name="question" size={30} strokeWidth={1.5} />{labels.helpTitle}</h2>
      <p className="mt-2 text-[14px] text-[rgba(246,241,230,.86)]">{labels.helpText}</p>
      <Button href={supportHref} variant="white" block className="mt-5">{labels.contactSupport}</Button>
    </section>
  );
}

/**
 * Online Store page (policies, about, contact). Body comes from the CMS / Shopify pages.
 * <1024: article, then help + related pages (side by side from 768). ≥1024: article | sticky 340px column.
 */
export function PolicyPageLayout({ crumbs, title, updatedLabel, intro, sections, bodyHtml, supportHref, related }: {
  crumbs: Crumb[]; title: string; updatedLabel?: string; intro?: string; sections?: PolicySection[]; bodyHtml?: string;
  supportHref?: string; related: Array<{ href: string; label: string; current?: boolean }>;
}) {
  const { Link, labels } = useUI();
  return (
    <Container className="pb-2">
      <Breadcrumbs items={crumbs} />
      <PageHeader title={title} meta={updatedLabel ? labels.updatedOn(updatedLabel) : undefined} intro={intro} />
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
        <Panel as="article" className="mt-6 px-5 pb-2 pt-6">
          {sections?.map((s) => (
            <section key={s.title} className="pb-6">
              <h2 className="text-[17.5px] font-extrabold leading-[1.6] text-tahdig-heading">{s.title}</h2>
              {s.showPaymentLogos ? <div className="mt-4"><PaymentLogos /></div> : <p className="mt-2.5 text-[15px] leading-[2.1] text-tahdig-ink2">{s.body}</p>}
            </section>
          ))}
          {bodyHtml && <div className="pb-6 text-[15px] leading-[2.1] text-tahdig-ink2 [&_h2]:mt-6 [&_h2]:text-[17.5px] [&_h2]:font-extrabold [&_h2]:text-tahdig-heading" dangerouslySetInnerHTML={{ __html: bodyHtml }} />}
        </Panel>
        <aside className={cn('grid gap-5 md:grid-cols-2 lg:sticky lg:top-6 lg:mt-6 lg:grid-cols-1')}>
          {supportHref && <HelpPanel supportHref={supportHref} />}
          <Panel as="nav" aria-label={labels.helpPages} className="overflow-hidden">
            <h2 className="px-5 pb-1 pt-4 text-[14px] font-bold text-tahdig-slate">{labels.helpPages}</h2>
            {related.map((r) => (
              <Link key={r.href} href={r.href} aria-current={r.current ? 'page' : undefined}
                className={cn('flex min-h-[52px] items-center border-b border-tahdig-line px-5 text-[15px] font-semibold last:border-b-0 hover:bg-[#F6F2EA]', r.current ? 'bg-[#F6F2EA] text-tahdig-heading' : 'text-tahdig-ink')}>
                {r.label}<Icon name="chev-left" size={16} className="ms-auto text-tahdig-slate" />
              </Link>
            ))}
          </Panel>
        </aside>
      </div>
    </Container>
  );
}
