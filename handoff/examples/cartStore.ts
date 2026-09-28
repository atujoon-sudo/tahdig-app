'use client';
/**
 * EXAMPLE store — stands in for the production Zustand cart store (which also calls the
 * Shopify cart mutations). Only the shape the UI needs is shown: quantities by variant id.
 */
import { create } from 'zustand';

interface CartState {
  lines: Record<string, number>;
  add: (variantId: string, qty?: number) => void;
  increment: (variantId: string) => void;
  decrement: (variantId: string) => void;
  reset: (lines: Record<string, number>) => void;
}

export const useCartStore = create<CartState>((set) => ({
  lines: {},
  add: (id, qty = 1) => set((s) => ({ lines: { ...s.lines, [id]: (s.lines[id] ?? 0) + qty } })),
  increment: (id) => set((s) => ({ lines: { ...s.lines, [id]: (s.lines[id] ?? 0) + 1 } })),
  decrement: (id) => set((s) => {
    const n = (s.lines[id] ?? 0) - 1; const lines = { ...s.lines };
    if (n > 0) lines[id] = n; else delete lines[id];
    return { lines };
  }),
  reset: (lines) => set({ lines }),
}));

export const selectCount = (s: CartState) => Object.values(s.lines).reduce((a, b) => a + b, 0);
