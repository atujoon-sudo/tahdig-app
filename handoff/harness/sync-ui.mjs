// Copies the handoff UI layer into src/ui/tahdig (the same place production would keep it).
import { cpSync, rmSync, mkdirSync } from 'node:fs';
const from = process.env.TAHDIG_HANDOFF ?? '..';
rmSync('src/ui/tahdig', { recursive: true, force: true });
mkdirSync('src/ui/tahdig', { recursive: true });
for (const d of ['components', 'styles', 'examples']) cpSync(`${from}/${d}`, `src/ui/tahdig/${d}`, { recursive: true });
mkdirSync('public/assets', { recursive: true });
for (const f of ['tahdig-logo.png', 'tahdig-logo-small.png']) cpSync(`${from}/reference/prototype/assets/${f}`, `public/assets/${f}`);
console.log('synced UI layer from', from);
