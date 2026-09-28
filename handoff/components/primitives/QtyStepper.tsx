'use client';
import { cn } from '../lib/cn';
import { tpl } from '../labels';
import { useUI } from '../provider';
import { Icon } from './Icon';

export interface QtyStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  /** accessible group name, e.g. the product title */
  label: string;
  /** below this the minus button is disabled (cart lines use 1 + a separate remove button) */
  min?: number;
  size?: 'md' | 'sm';
  /** beige track on cream surfaces (PDP, cart) */
  tone?: 'default' | 'beige';
  /** play the scale-in when the stepper replaces the add button */
  enter?: boolean;
  disabled?: boolean;
}

/**
 * plus · value · minus. In RTL plus sits on the reading-start (right) side as approved;
 * in LTR the order mirrors (minus · value · plus).
 * The small (cart-line) buttons are 36px visually with an invisible 44×44 hit area.
 */
export function QtyStepper({ quantity, onIncrement, onDecrement, label, min = 0, size = 'md', tone = 'default', enter, disabled }: QtyStepperProps) {
  const { labels, formatNumber } = useUI();
  const sm = size === 'sm';
  const btn = cn('relative grid cursor-pointer place-items-center transition-transform duration-[120ms] ease-tahdig-out active:scale-90 disabled:cursor-default disabled:opacity-45',
    sm ? 'h-9 w-9 rounded-[10px] after:absolute after:-inset-1' : 'h-11 w-11 rounded-xl');
  return (
    <div role="group" aria-label={tpl(labels.quantityOf, label)}
      className={cn('inline-flex items-center gap-1 p-1 ltr:flex-row-reverse', sm ? 'h-11 rounded-tahdig-control' : 'h-[52px] rounded-tahdig-button', tone === 'beige' ? 'bg-tahdig-beige' : 'bg-[#F1ECE2]', enter && 't-enter')}>
      <button type="button" className={cn(btn, 'bg-tahdig-green text-white')} onClick={onIncrement} disabled={disabled} aria-label={labels.addOneMore}>
        <Icon name="plus" size={sm ? 18 : 20} strokeWidth={2} />
      </button>
      <output aria-live="polite" className={cn('text-center font-semibold tabular-nums text-tahdig-ink', sm ? 'min-w-[22px] text-[15px]' : 'min-w-[26px] text-[16px]')}>{formatNumber(quantity)}</output>
      <button type="button" className={cn(btn, 'bg-tahdig-cream text-tahdig-ink2')} onClick={onDecrement} disabled={disabled || quantity <= min}
        aria-label={quantity <= 1 && min === 0 ? labels.remove : labels.removeOne}>
        <Icon name="minus" size={sm ? 18 : 20} strokeWidth={2} />
      </button>
    </div>
  );
}
