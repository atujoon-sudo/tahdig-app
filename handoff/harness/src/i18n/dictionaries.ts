/**
 * Example UI dictionaries. Persian uses the component defaults (the approved copy).
 * Finnish / English show how the production i18n layer overrides labels — plain strings only,
 * so they can be passed from the Server layout to the client provider.
 * (Wording is illustrative; production copy comes from the real translation files.)
 */
import type { Labels } from '@/ui/tahdig/components';
import type { Locale } from './config';

const en: Partial<Labels> = {
  menu: 'Menu', closeMenu: 'Close menu', cart: 'Cart', home: 'Home', homeLogo: 'TAHDIG, home',
  search: 'Search', searchPlaceholder: 'e.g. Persian rice, saffron…', searchLabel: 'Search products, brands or dishes',
  imageSearchSoon: 'Search by image (coming soon)', voiceSearchSoon: 'Voice search (coming soon)',
  addToCart: 'Add to cart', addOneMore: 'Add one more', removeOne: 'Remove one', remove: 'Remove',
  outOfStock: 'Out of stock', notifyMe: 'Notify me', notifyWhenBack: 'Notify me when available',
  inCartNote: '{0} of this product in your cart', viewCart: 'View cart', viewIngredients: 'See ingredients',
  people: '{0} people', productsCount: '{0} products', sort: 'Sort:', loadMore: 'More products',
  cartWithCount: 'Cart, {0} items', quantityOf: 'Quantity of {0}', perUnit: '{1} / {0}', unitKg: 'kg', unitL: 'l',
  breadcrumbs: 'Breadcrumb', mainMenu: 'Main menu', categoriesTitle: 'Product categories', listSep: ', ',
  yourCart: 'Your cart', itemsInCart: '{0} items in cart', subtotal: 'Subtotal', shippingCost: 'Shipping',
  shippingLater: 'Next step', shippingLaterHint: 'Shipping is calculated after you enter your address',
  total: 'Total', totalNoShipping: 'Total (excl. shipping)', taxIncluded: 'Prices include VAT', checkout: 'Continue to shipping',
  guest: 'Guest', guestHint: 'Sign in to follow your orders more easily.', signIn: 'Sign in or create account',
  helpTitle: 'Didn’t find the answer?', helpText: 'Send us a message and we’ll help you.', contactSupport: 'Contact support',
  updatedOn: 'Updated {0}', helpPages: 'Help pages', orderItems: '{0} items',
};

const fi: Partial<Labels> = {
  menu: 'Valikko', closeMenu: 'Sulje valikko', cart: 'Ostoskori', home: 'Etusivu', homeLogo: 'TAHDIG, etusivu',
  search: 'Hae', searchPlaceholder: 'esim. persialainen riisi, sahrami…', searchLabel: 'Hae tuotteita, merkkejä tai ruokia',
  addToCart: 'Lisää koriin', outOfStock: 'Loppu', notifyMe: 'Ilmoita minulle', viewCart: 'Näytä kori',
  people: '{0} henkeä', productsCount: '{0} tuotetta', cartWithCount: 'Ostoskori, {0} tuotetta', quantityOf: 'Määrä: {0}',
  perUnit: '{1} / {0}', unitKg: 'kg', unitL: 'l', breadcrumbs: 'Murupolku', mainMenu: 'Päävalikko', listSep: ', ',
  guest: 'Vierailija', signIn: 'Kirjaudu tai luo tili', updatedOn: 'Päivitetty {0}', helpPages: 'Ohjesivut',
};

export const dictionaries: Record<Locale, Partial<Labels>> = { fa: {}, fi, en };
