import * as React from 'react';
import { cn } from '../lib/cn';

/** Pill field with an inline submit button (discount code, newsletter, back-in-stock). */
export function InlineForm({ onSubmit, inputProps, buttonLabel, error, errorId, className, tall }: {
  onSubmit: (value: string) => void; inputProps: React.InputHTMLAttributes<HTMLInputElement>; buttonLabel: React.ReactNode;
  error?: string; errorId?: string; className?: string; tall?: boolean;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  return (
    <form noValidate className={className} onSubmit={(e) => { e.preventDefault(); onSubmit(ref.current?.value.trim() ?? ''); }}>
      <div className={cn('flex items-center gap-2 rounded-[18px] bg-white pe-1.5 ps-[18px] shadow-[inset_0_0_0_1px_#E3DCCD] focus-within:shadow-[inset_0_0_0_1.5px_#1C4A3D]', tall ? 'h-[60px]' : 'h-14')}>
        <input ref={ref} {...inputProps} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined}
          className="h-full w-full min-w-0 flex-1 bg-transparent text-tahdig-ink outline-none placeholder:text-[14.5px] placeholder:text-tahdig-slate" />
        <button className="inline-flex h-12 flex-none items-center gap-2 rounded-tahdig-control bg-tahdig-green px-5 text-[15px] font-bold text-white [&_svg]:h-5 [&_svg]:w-5">{buttonLabel}</button>
      </div>
      {error && <p id={errorId} role="alert" className="mt-2 text-[13px] text-tahdig-danger">{error}</p>}
    </form>
  );
}

export function TextField({ label, error, id, ltr, className, ...rest }: { label: string; error?: string; id: string; ltr?: boolean; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn('grid gap-2', className)}>
      <span className="text-[14px] font-semibold text-tahdig-ink2">{label}</span>
      <input id={id} {...rest} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined}
        className={cn('h-[52px] w-full rounded-tahdig-control bg-white px-4 text-tahdig-ink outline-none shadow-[inset_0_0_0_1px_#E3DCCD] focus:shadow-[inset_0_0_0_1.5px_#1C4A3D] aria-invalid:shadow-[inset_0_0_0_1.5px_#B5462F] placeholder:text-tahdig-slate', ltr && '[direction:ltr] text-right')} />
      {error && <span id={`${id}-err`} className="text-[13px] text-tahdig-danger">{error}</span>}
    </label>
  );
}
