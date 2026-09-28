'use client';
/** Client island: binds the presentational SearchBar to routing (production: the Meilisearch client / URL state). */
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/ui/tahdig/components';

export function SearchIsland({ action }: { action: string }) {
  const router = useRouter();
  return <SearchBar onSubmit={(q) => router.push(`${action}?q=${encodeURIComponent(q)}`)} />;
}
