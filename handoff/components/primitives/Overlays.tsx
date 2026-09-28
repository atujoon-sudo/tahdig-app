'use client';
import * as React from 'react';
import { cn } from '../lib/cn';
import { useUI } from '../provider';
import { Button } from './Button';

/** Presentational toast (bottom centre). Drive `message`/`visible` from the existing notification mechanism. */
export function Toast({ message, visible, raised }: { message: string; visible: boolean; raised?: boolean }) {
  return (
    <div role="status" aria-live="polite"
      className={cn('pointer-events-none fixed left-1/2 z-[90] max-w-[min(88vw,420px)] -translate-x-1/2 rounded-2xl bg-tahdig-green px-5 py-3 text-center text-[14px] text-white shadow-tahdig-toast transition-[opacity,transform] duration-200',
        raised ? 'bottom-[calc(96px+env(safe-area-inset-bottom))]' : 'bottom-[calc(24px+env(safe-area-inset-bottom))]',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>{message}</div>
  );
}

/** Bottom confirm sheet (e.g. cancel recurring purchase). Focus management: move focus to cancel on open. */
export function ConfirmSheet({ open, title, text, confirmLabel, onConfirm, onClose }: { open: boolean; title: string; text: string; confirmLabel: string; onConfirm: () => void; onClose: () => void }) {
  const { labels } = useUI();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => cancelRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); };
  }, [open, onClose]);
  return (
    <div className={cn('fixed inset-0 z-[80]', open ? 'visible' : 'invisible delay-200')} aria-hidden={!open}>
      <div className={cn('absolute inset-0 bg-[rgba(20,30,25,.42)] transition-opacity duration-200', open ? 'opacity-100' : 'opacity-0')} onClick={onClose} />
      <div role="alertdialog" aria-modal="true" aria-label={title}
        className={cn('absolute inset-x-0 bottom-0 mx-auto max-w-[520px] rounded-t-3xl bg-tahdig-cream px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-2.5 transition-transform',
          open ? 'translate-y-0 duration-[380ms] ease-tahdig-drawer' : 'translate-y-full duration-200 ease-tahdig-out')}>
        <div className="mx-auto mb-4 h-[5px] w-9 rounded-full bg-tahdig-line2" />
        <h2 className="text-[19px] font-extrabold text-tahdig-heading">{title}</h2>
        <p className="mt-1.5 text-[14.5px] leading-[1.9] text-tahdig-ink2">{text}</p>
        <div className="mt-[22px] grid grid-cols-2 gap-2.5">
          <Button variant="ghost" onClick={onClose}>{labels.cancel}</Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
        <button ref={cancelRef} className="sr-only" onClick={onClose}>{labels.cancel}</button>
      </div>
    </div>
  );
}
