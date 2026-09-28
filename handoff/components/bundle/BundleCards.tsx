/* Server-safe bundle listing pieces. */
import * as React from 'react';
import { TLink } from '../lib/next';
import type { BundleCardData, Crumb } from '../types';
import { Breadcrumbs } from '../primitives/Breadcrumbs';
import { Button } from '../primitives/Button';
import { Icon, type IconName } from '../primitives/Icon';
import { Media } from '../primitives/Media';
import { Price } from '../primitives/Price';
import { Badge, PageHeader } from '../primitives/Surfaces';
import { JoinedList, Label } from '../primitives/Text';
import { Container } from '../layout/Container';

/**
 * پکیج‌های آماده — FIXED curated bundles sold as one cart line at one price.
 * Not editable, unrelated to the customer's recurring list (خرید دوره‌ای).
 */
export function BundleCard({ bundle: b }: { bundle: BundleCardData }) {
  return (
    <article className="flex flex-col rounded-tahdig-card bg-tahdig-cream px-4 pb-[18px] pt-4 shadow-tahdig-card">
      <TLink href={b.href} tabIndex={-1} aria-hidden="true" className="relative block overflow-hidden rounded-2xl">
        <Media image={b.image} className="aspect-[16/10] w-full bg-[linear-gradient(160deg,#EFE7D8,#E4DBCA)]" placeholderIcon="gift" iconSize={52} />
        {!!b.savingPercent && <Badge tone="gold" className="absolute start-3 top-3"><Label k="savingBadge" values={[b.savingPercent]} /></Badge>}
      </TLink>
      <h3 className="mt-4 px-1 text-[18px] font-extrabold leading-[1.6] text-tahdig-heading"><TLink href={b.href}>{b.title}</TLink></h3>
      <p className="mt-1 px-1 text-[14px] leading-[1.85] text-tahdig-ink2">{b.description}</p>
      <div className="mt-2.5 px-1 text-[13px] text-tahdig-slate"><Label k="productsCount" values={[b.contents.length]} />: <JoinedList items={b.contents} /></div>
      <div className="mt-auto flex items-center justify-between gap-3 px-1 pt-4">
        {b.available ? <Price price={b.price} compareAt={b.compareAtPrice} /> : <span className="text-[16px] text-tahdig-slate"><Label k="bundleOos" /></span>}
        <Button href={b.href} size="sm"><Label k="viewBundle" /></Button>
      </div>
    </article>
  );
}

export function BundleGrid({ bundles }: { bundles: BundleCardData[] }) {
  return <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">{bundles.map((b) => <BundleCard key={b.id} bundle={b} />)}</div>;
}

/** Cross-link between the two purchase concepts (quiet, one line). */
export function ConceptNote({ icon, title, children }: { icon: IconName; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 flex items-start gap-3.5 rounded-[18px] bg-tahdig-beige2 px-[18px] py-4 [&_a]:font-bold [&_a]:text-tahdig-heading [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4">
      <Icon name={icon} size={26} className="mt-[3px] text-tahdig-gold" />
      <div><b className="block text-[15px] text-tahdig-ink">{title}</b><p className="mt-0.5 text-[13.5px] leading-[1.85] text-tahdig-ink2">{children}</p></div>
    </div>
  );
}

export function BundleListLayout({ crumbs, title, intro, bundles, note }: { crumbs: Crumb[]; title: string; intro: string; bundles: BundleCardData[]; note?: React.ReactNode }) {
  return <Container className="pb-2"><Breadcrumbs items={crumbs} /><PageHeader title={title} intro={intro} />{note}<BundleGrid bundles={bundles} /></Container>;
}

