/** Minimal className joiner. Swap for the production `cn`/`clsx`/`tailwind-merge` helper if one exists. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
