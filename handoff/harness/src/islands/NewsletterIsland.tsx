'use client';
import * as React from 'react';
import { NewsletterPanel } from '@/ui/tahdig/components';

/** Client island: production posts to Shopify customer marketing consent / the ESP. */
export function NewsletterIsland() {
  const [error, setError] = React.useState<string>();
  return <NewsletterPanel error={error} onSubmit={(email) => setError(/^\S+@\S+\.\S+$/.test(email) ? undefined : 'یک ایمیل معتبر وارد کن')} />;
}
