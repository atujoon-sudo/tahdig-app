/**
 * Tailwind preset for the TAHDIG UI layer (Tailwind v3.3+).
 *
 *   // tailwind.config.ts in the production app
 *   import tahdig from './src/ui/tahdig/styles/tailwind.preset';
 *   export default { presets: [tahdig], content: [...existing, './src/ui/tahdig/**\/*.{ts,tsx}'] };
 *
 * Everything is namespaced under `tahdig` (colors, shadows, radii, font) so it
 * cannot collide with the existing production theme. Screens keep Tailwind's
 * defaults (sm 640, md 768, lg 1024, xl 1280) and add `xs: 481px`.
 */
import type { Config } from 'tailwindcss';
import { colors, fontFamily, radius, shadow, screens, motion } from './tokens';

const px = (n: number) => `${n}px`;

const preset: Partial<Config> = {
  theme: {
    screens: {
      xs: px(screens.xs), sm: px(screens.sm), md: px(screens.md), lg: px(screens.lg), xl: px(screens.xl), '2xl': '1536px',
    },
    extend: {
      colors: { tahdig: colors },
      fontFamily: { tahdig: [...fontFamily.tahdig] },
      borderRadius: Object.fromEntries(Object.entries(radius).map(([k, v]) => [`tahdig-${k}`, px(v)])),
      boxShadow: Object.fromEntries(Object.entries(shadow).map(([k, v]) => [`tahdig-${k}`, v])),
      maxWidth: { 'tahdig-container': '1200px' },
      transitionTimingFunction: { 'tahdig-out': motion.easeOut, 'tahdig-drawer': motion.easeDrawer },
      keyframes: {
        'tahdig-marquee': { to: { transform: 'translateX(50%)' } },
        'tahdig-fade': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'tahdig-marquee': 'tahdig-marquee 28s linear infinite',
        'tahdig-fade': 'tahdig-fade .15s ease',
      },
    },
  },
};
export default preset;
