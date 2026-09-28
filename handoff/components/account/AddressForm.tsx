'use client';
import type { AddressData } from '../types';
import { Button } from '../primitives/Button';
import { TextField } from '../primitives/Fields';
import { Panel } from '../primitives/Surfaces';

/** Presentational address form. Validation rules + persistence (Customer Account API) stay in production. */
export const defaultAddressCopy = {
  title: 'نشانی تحویل', intro: 'این نشانی در تکمیل سفارش استفاده می‌شود.', name: 'نام و نام خانوادگی', contact: 'ایمیل یا شماره تماس',
  street: 'نشانی', postalCode: 'کد پستی', city: 'شهر', submit: 'ذخیره نشانی',
};
export type AddressCopy = typeof defaultAddressCopy;

export function AddressForm({ value, errors = {}, onSubmit, submitLabel, copy: o }: { value: AddressData; errors?: Partial<Record<keyof AddressData, string>>; onSubmit: (a: AddressData) => void; submitLabel?: string; copy?: Partial<AddressCopy> }) {
  const c = { ...defaultAddressCopy, ...o };
  const read = (f: HTMLFormElement): AddressData => {
    const g = (k: string) => (f.elements.namedItem(k) as HTMLInputElement).value.trim();
    return { name: g('name'), contact: g('contact'), street: g('street'), postalCode: g('postalCode'), city: g('city') };
  };
  return (
    <Panel className="px-5 pb-6 pt-[22px]">
      <h2 className="text-[19px] font-extrabold text-tahdig-heading">{c.title}</h2>
      <p className="mt-0.5 text-[14px] text-tahdig-slate">{c.intro}</p>
      <form noValidate onSubmit={(e) => { e.preventDefault(); onSubmit(read(e.currentTarget)); }} className="mt-[18px] grid gap-4 lg:grid-cols-2">
        <TextField id="name" name="name" label={c.name} autoComplete="name" defaultValue={value.name} error={errors.name} />
        <TextField id="contact" name="contact" label={c.contact} autoComplete="email" ltr defaultValue={value.contact} error={errors.contact} />
        <TextField id="street" name="street" label={c.street} autoComplete="street-address" defaultValue={value.street} error={errors.street} className="lg:col-span-2" />
        <TextField id="postalCode" name="postalCode" label={c.postalCode} autoComplete="postal-code" inputMode="numeric" maxLength={5} ltr defaultValue={value.postalCode} error={errors.postalCode} />
        <TextField id="city" name="city" label={c.city} autoComplete="address-level2" defaultValue={value.city} error={errors.city} />
        <Button block className="lg:col-span-2" type="submit">{submitLabel ?? c.submit}</Button>
      </form>
    </Panel>
  );
}
