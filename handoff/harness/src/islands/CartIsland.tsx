'use client';
/** Client island: the approved card cart control, bound to the (example) Zustand cart store. */
import { AddToCartControl } from '@/ui/tahdig/components';
import { useCartStore } from '@/ui/tahdig/examples/cartStore';

export function CartIsland({ variantId, title, available, notifyHref }: { variantId: string; title: string; available: boolean; notifyHref?: string }) {
  const quantity = useCartStore((s) => s.lines[variantId] ?? 0);
  const { add, increment, decrement } = useCartStore.getState();
  return <AddToCartControl title={title} available={available} quantity={quantity} notifyHref={notifyHref}
    onAdd={() => add(variantId)} onIncrement={() => increment(variantId)} onDecrement={() => decrement(variantId)} />;
}
