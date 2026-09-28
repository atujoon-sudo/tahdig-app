/**
 * Example only — merge into the EXISTING production tailwind.config.ts.
 * Do not replace the production config; add the preset and the content glob.
 */
import type { Config } from 'tailwindcss';
import tahdig from './src/ui/tahdig/styles/tailwind.preset';

const config: Config = {
  presets: [tahdig],
  content: [
    // ...existing production globs stay here
    './src/ui/tahdig/components/**/*.{ts,tsx}',
  ],
  // If production already defines theme.screens, add `xs: '481px'` there instead of
  // relying on the preset's screens (the preset keeps Tailwind's default sm/md/lg/xl values).
};
export default config;
