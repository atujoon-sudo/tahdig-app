/* Generated from the approved icon sprite (prototype index.html). Stroke icons inherit currentColor. */
import * as React from 'react';
import { cn } from '../lib/cn';

export type IconName =
  | 'menu'
  | 'cart'
  | 'search'
  | 'camera'
  | 'mic'
  | 'pot'
  | 'listcheck'
  | 'arrow-left'
  | 'arrow-down'
  | 'bell'
  | 'chat'
  | 'whatsapp'
  | 'telegram'
  | 'youtube'
  | 'instagram'
  | 'bank'
  | 'image'
  | 'down'
  | 'chev-left'
  | 'home'
  | 'sort'
  | 'caret'
  | 'close'
  | 'plus'
  | 'minus'
  | 'trust-pay'
  | 'trust-help'
  | 'trust-box'
  | 'trust-ship'
  | 'bag'
  | 'bowl'
  | 'user'
  | 'repeat'
  | 'trash'
  | 'heart'
  | 'zoom'
  | 'spec'
  | 'list'
  | 'box'
  | 'truck'
  | 'bolt'
  | 'person'
  | 'timer'
  | 'check'
  | 'x-circle'
  | 'question'
  | 'gift'
  | 'calendar'
  | 'info'
  | 'lock'
  | 'doc'
  | 'pin'
  | 'help'
  | 'card'
  | 'undo';

const PATHS: Record<IconName, { viewBox: string; body: React.ReactNode }> = {
  'menu': { viewBox: '0 0 24 24', body: <><path d="M4 7h16M10 12h10M7 17h13"/></> },
  'cart': { viewBox: '0 0 24 24', body: <><g transform="matrix(-1 0 0 1 24 0)"><path d="M3 4.5h2.2l2.1 9.7a1.6 1.6 0 001.6 1.3h8.2a1.6 1.6 0 001.6-1.2L20.5 8.5H6"/><path d="M10.5 11.5h5"/><circle cx="9.6" cy="19.2" r="1.1"/><circle cx="16.8" cy="19.2" r="1.1"/></g></> },
  'search': { viewBox: '0 0 24 24', body: <><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/></> },
  'camera': { viewBox: '0 0 24 24', body: <><path d="M4 8.7A1.7 1.7 0 015.7 7H8l1.4-2h5.2L16 7h2.3A1.7 1.7 0 0120 8.7v8.6a1.7 1.7 0 01-1.7 1.7H5.7A1.7 1.7 0 014 17.3z"/><circle cx="12" cy="12.8" r="3.1"/></> },
  'mic': { viewBox: '0 0 24 24', body: <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21M9 21h6"/></> },
  'pot': { viewBox: '0 0 24 24', body: <><path d="M4.5 10.5h15v4.5a5 5 0 01-5 5h-5a5 5 0 01-5-5z"/><path d="M2.5 10.5h19"/><path d="M8 10.5V9a4 4 0 018 0v1.5"/><path d="M12 5V3.5"/></> },
  'listcheck': { viewBox: '0 0 24 24', body: <><path d="M17 11V5.5A2.5 2.5 0 0014.5 3h-8A2.5 2.5 0 004 5.5v13A2.5 2.5 0 006.5 21H12"/><path d="M8 8h6M8 12h5M8 16h2.5"/><path d="M14.5 18l2 2 4-4.5"/></> },
  'arrow-left': { viewBox: '0 0 24 24', body: <><path d="M19 12H5M11 6l-6 6 6 6"/></> },
  'arrow-down': { viewBox: '0 0 24 24', body: <><path d="M12 5v14M6.5 13.5L12 19l5.5-5.5"/></> },
  'bell': { viewBox: '0 0 24 24', body: <><path d="M6 10a6 6 0 1112 0c0 5 2 6.5 2 6.5H4S6 15 6 10z"/><path d="M10 20a2.2 2.2 0 004 0"/></> },
  'chat': { viewBox: '0 0 24 24', body: <><path d="M12 3.5a8.5 8.5 0 00-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1012 3.5z"/><path d="M8.6 12h.01M12 12h.01M15.4 12h.01" strokeWidth="2.4"/></> },
  'whatsapp': { viewBox: '0 0 24 24', body: <><path d="M12 3.5a8.5 8.5 0 00-7.3 12.8L3.5 20.5l4.3-1.2A8.5 8.5 0 1012 3.5z"/><path d="M9.2 8.2c-.5 0-1 .5-1 1.3 0 2.4 3 5.7 6 5.7.9 0 1.4-.6 1.4-1.1l-1.8-.9-.9.8c-1-.4-2.1-1.5-2.6-2.6l.8-.9-.8-2z"/></> },
  'telegram': { viewBox: '0 0 24 24', body: <><circle cx="12" cy="12" r="9"/><path d="M7.3 11.9l8.9-3.6-1.5 8-3.1-2.3-1.7 1.6.3-2.6 3.9-3.4"/></> },
  'youtube': { viewBox: '0 0 24 24', body: <><rect x="3" y="5.5" width="18" height="13" rx="3.5"/><path d="M10.5 9.5v5l4.2-2.5z"/></> },
  'instagram': { viewBox: '0 0 24 24', body: <><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.2 6.8h.01" strokeWidth="2.6"/></> },
  'bank': { viewBox: '0 0 24 24', body: <><path d="M3.5 9.5L12 4.5l8.5 5"/><path d="M4.5 9.5h15M6.5 10.5v6.5M10 10.5v6.5M14 10.5v6.5M17.5 10.5v6.5M4 19.5h16"/></> },
  'image': { viewBox: '0 0 24 24', body: <><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-5-5-8 8.5"/></> },
  'down': { viewBox: '0 0 24 24', body: <><path d="M6 9l6 6 6-6"/></> },
  'chev-left': { viewBox: '0 0 24 24', body: <><path d="M14.5 6l-6 6 6 6"/></> },
  'home': { viewBox: '0 0 24 24', body: <><path d="M4.5 10.5L12 4.5l7.5 6V19a1 1 0 01-1 1H15v-5H9v5H5.5a1 1 0 01-1-1z"/></> },
  'sort': { viewBox: '0 0 24 24', body: <><path d="M4 5h16l-6 7v5.5l-4 2V12z"/></> },
  'caret': { viewBox: '0 0 24 24', body: <><path d="M6.5 9.5l5.5 6 5.5-6z" fill="currentColor" stroke="none"/></> },
  'close': { viewBox: '0 0 24 24', body: <><path d="M6 6l12 12M18 6L6 18"/></> },
  'plus': { viewBox: '0 0 24 24', body: <><path d="M12 5v14M5 12h14"/></> },
  'minus': { viewBox: '0 0 24 24', body: <><path d="M5 12h14"/></> },
  'trust-pay': { viewBox: '0 0 36 36', body: <><rect x="4" y="8" width="22" height="16" rx="3"/><path d="M4 13.5h22M8.5 19h5"/><path d="M26 18l6 2v4.2c0 3.2-2.4 5.3-6 6.3-3.6-1-6-3.1-6-6.3V20z" fill="#C9A15A"/><path d="M23.4 24.3l1.8 1.8 3.4-3.6"/></> },
  'trust-help': { viewBox: '0 0 36 36', body: <><circle cx="18" cy="17" r="7.5" fill="#F3E7CF"/><path d="M8 17v-1.5a10 10 0 0120 0V17"/><rect x="5.5" y="16" width="4.5" height="7.5" rx="2.2" fill="#C9A15A"/><rect x="26" y="16" width="4.5" height="7.5" rx="2.2" fill="#C9A15A"/><path d="M28 23.5c0 3.5-3 5-6.5 5h-2"/><path d="M15.5 18.8c.8.9 1.6 1.3 2.5 1.3s1.7-.4 2.5-1.3M15.2 15.5h.01M20.8 15.5h.01" strokeWidth="1.9"/></> },
  'trust-box': { viewBox: '0 0 36 36', body: <><path d="M14 10.5l9-4.5 9 4.5v10.5l-9 4.5-9-4.5z"/><path d="M14 10.5l9 4.5 9-4.5M23 15v10.5"/><circle cx="12" cy="24" r="6" fill="#C9A15A"/><path d="M9.4 24.1l1.8 1.8 3.4-3.5"/></> },
  'trust-ship': { viewBox: '0 0 36 36', body: <><circle cx="16" cy="19" r="11" fill="#E9D6AE"/><path d="M5 19h22M16 8c3 3 4.4 6.8 4.4 11S19 27 16 30c-3-3-4.4-6.8-4.4-11S13 11 16 8z"/><path d="M20 12.5l10-4.5-3 5.6 2.8 1.8-1.8 1.2-3-1.4-4.6 2.1z" fill="#C9A15A"/></> },
  'bag': { viewBox: '0 0 24 24', body: <><path d="M5.5 8.5h13l-1 11a1.5 1.5 0 01-1.5 1.4H8a1.5 1.5 0 01-1.5-1.4z"/><path d="M9 8.5V7a3 3 0 016 0v1.5"/></> },
  'bowl': { viewBox: '0 0 24 24', body: <><path d="M3.5 11.5h17a8.5 7.5 0 01-17 0z"/><path d="M8 20.5h8"/><path d="M9.5 8.5c0-1.3 1-1.7 1-3M13.5 8.5c0-1.3 1-1.7 1-3"/></> },
  'user': { viewBox: '0 0 24 24', body: <><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.3-3.6 4.3-5.5 7.5-5.5s6.2 1.9 7.5 5.5"/></> },
  'repeat': { viewBox: '0 0 24 24', body: <><path d="M4 11.5V10a4 4 0 014-4h11"/><path d="M16 3l3 3-3 3"/><path d="M20 12.5V14a4 4 0 01-4 4H5"/><path d="M8 21l-3-3 3-3"/></> },
  'trash': { viewBox: '0 0 24 24', body: <><path d="M4.5 7h15"/><path d="M9.5 7V5.2A1.2 1.2 0 0110.7 4h2.6a1.2 1.2 0 011.2 1.2V7"/><path d="M6.5 7l.8 12a1.6 1.6 0 001.6 1.5h6.2a1.6 1.6 0 001.6-1.5l.8-12"/><path d="M10 11v5.5M14 11v5.5"/></> },
  'heart': { viewBox: '0 0 24 24', body: <><path d="M12 20s-7-4.3-8.6-8.6C2.2 8.2 4.2 5 7.4 5c2 0 3.5 1.1 4.6 2.7C13.1 6.1 14.6 5 16.6 5c3.2 0 5.2 3.2 4 6.4C19 15.7 12 20 12 20z"/></> },
  'zoom': { viewBox: '0 0 24 24', body: <><circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M20.5 20.5L16 16"/></> },
  'spec': { viewBox: '0 0 24 24', body: <><rect x="5" y="4.5" width="14" height="16" rx="3"/><path d="M9 3.5v2M15 3.5v2M8.5 10h7M8.5 14h7M8.5 17.5h4"/></> },
  'list': { viewBox: '0 0 24 24', body: <><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M7.5 9l1.3 1.3 2.2-2.3M13 9.5h4M7.5 14.5l1.3 1.3 2.2-2.3M13 15h4"/></> },
  'box': { viewBox: '0 0 24 24', body: <><path d="M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7z"/><path d="M4.5 7.7L12 12l7.5-4.3M12 12v8.5"/></> },
  'truck': { viewBox: '0 0 24 24', body: <><path d="M3 6.5h10.5v10H3z"/><path d="M13.5 10h3.8l3.2 3.4v3.1h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></> },
  'bolt': { viewBox: '0 0 24 24', body: <><path d="M13 3L5.5 13.5H11L10 21l7.5-10.5H12z"/></> },
  'person': { viewBox: '0 0 24 24', body: <><circle cx="12" cy="8" r="3.5"/><path d="M6.5 20.5c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5z"/></> },
  'timer': { viewBox: '0 0 24 24', body: <><circle cx="12" cy="13.5" r="7"/><path d="M12 10v3.8M9.5 3.5h5"/></> },
  'check': { viewBox: '0 0 24 24', body: <><path d="M5 12.5l4.5 4.5L19 7.5"/></> },
  'x-circle': { viewBox: '0 0 24 24', body: <><circle cx="12" cy="12" r="8.5"/><path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6"/></> },
  'question': { viewBox: '0 0 24 24', body: <><path d="M5.5 4.5h13a2 2 0 012 2v9a2 2 0 01-2 2H11l-4.5 3.5v-3.5h-1a2 2 0 01-2-2v-9a2 2 0 012-2z"/><path d="M10 9.3a2 2 0 113 1.7c-.7.4-1 .9-1 1.6M12 15h.01"/></> },
  'gift': { viewBox: '0 0 24 24', body: <><rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5v6.5a1.5 1.5 0 001.5 1.5h11a1.5 1.5 0 001.5-1.5v-6.5M12 8.5v12"/><path d="M12 8.5C10.5 5 7 4.5 7 6.8S10 8.5 12 8.5zM12 8.5c1.5-3.5 5-4 5-1.7S14 8.5 12 8.5z"/></> },
  'calendar': { viewBox: '0 0 24 24', body: <><rect x="4" y="5.5" width="16" height="15" rx="3"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/></> },
  'info': { viewBox: '0 0 24 24', body: <><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/></> },
  'lock': { viewBox: '0 0 24 24', body: <><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5"/></> },
  'doc': { viewBox: '0 0 24 24', body: <><path d="M7 3.5h7l4.5 4.5v12.5H7z"/><path d="M14 3.5V8h4.5M9.5 12.5h6M9.5 16h6"/></> },
  'pin': { viewBox: '0 0 24 24', body: <><path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 00-13 0c0 5 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.3"/></> },
  'help': { viewBox: '0 0 24 24', body: <><path d="M4.5 13v-1a7.5 7.5 0 0115 0v1"/><rect x="3.5" y="13" width="4" height="6" rx="1.6"/><rect x="16.5" y="13" width="4" height="6" rx="1.6"/></> },
  'card': { viewBox: '0 0 24 24', body: <><rect x="3" y="6" width="18" height="12.5" rx="2.5"/><path d="M3 10.5h18M7 15h4"/></> },
  'undo': { viewBox: '0 0 24 24', body: <><path d="M9 7.5l-4 4 4 4"/><path d="M5 11.5h9.5a4.5 4.5 0 010 9H11"/></> },
};

export interface IconProps extends React.SVGProps<SVGSVGElement> { name: IconName; size?: number }

/** Directional icons mirror automatically in LTR (Finnish / English). */
const MIRROR_IN_LTR = new Set<IconName>(['arrow-left', 'chev-left']);

/** Server-safe. Decorative by default (aria-hidden). Give the parent control an accessible name. */
export function Icon({ name, size = 22, className, strokeWidth, ...rest }: IconProps) {
  const icon = PATHS[name];
  return (
    <svg viewBox={icon.viewBox} width={size} height={size} aria-hidden="true" focusable="false"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.7} strokeLinecap="round" strokeLinejoin="round"
      className={cn('shrink-0', MIRROR_IN_LTR.has(name) && 'ltr:-scale-x-100', className)} {...rest}>
      {icon.body}
    </svg>
  );
}
