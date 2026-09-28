/*
 * TAHDIG UI layer — public exports. Presentational only: data in via props, events out via callbacks.
 * Boundaries: files marked 'use client' are Client Components; everything else is server-safe
 * (no hooks / context) and can be rendered from Server Components. See docs/MIGRATION-GUIDE.md.
 */
export * from './types';
export { defaultLabels, tpl, type Labels } from './labels';
export { TahdigUIProvider, useUI } from './provider';
export { cn } from './lib/cn';
export { faDigits, formatAmount, amountFormatter, numberFormatter, moneyText, currencySymbol } from './lib/format';
export { TLink, TImage } from './lib/next';

export { Icon, type IconName } from './primitives/Icon';
export { Button, TextAction, type ButtonVariant } from './primitives/Button';
export { QtyStepper } from './primitives/QtyStepper';
export { AddToCartControl } from './primitives/AddToCartControl';
export { Price, UnitPrice } from './primitives/Price';
export { Num, Amount, Label, UnitPriceText, JoinedList } from './primitives/Text';
export { Media } from './primitives/Media';
export { Breadcrumbs } from './primitives/Breadcrumbs';
export { ChoiceChips, OptionCards, type ChoiceItem } from './primitives/Choices';
export { AccordionGroup, SpecList, type AccordionItemData } from './primitives/Accordion';
export { Panel, Note, Badge, SectionTitle, EmptyState, PageHeader } from './primitives/Surfaces';
export { InlineForm, TextField } from './primitives/Fields';
export { Toast, ConfirmSheet } from './primitives/Overlays';

export { TahdigRoot, dirForLocale } from './layout/TahdigRoot';
export { Container } from './layout/Container';
export { Header, type HeaderProps } from './layout/Header';
export { MenuDrawer, type DrawerLink } from './layout/MenuDrawer';
export { SearchBar, type SearchBarProps } from './layout/SearchBar';
export { Footer, PaymentLogos, defaultFooterCopy, type FooterLinkGroup, type FooterCopy } from './layout/Footer';
export { NewsletterPanel, defaultNewsletterCopy, type NewsletterCopy } from './layout/NewsletterPanel';

export { HomeHero, CategoryCarousel, MealPanel, PromoPanels, type PromoPanelData } from './home/HomeSections';
export { ProductCard, type ProductCardProps } from './product/ProductCard';
export { ProductRail, ProductGrid, CollectionHeader, type CollectionTab } from './product/ProductCollections';
export { SortBar, LoadMoreButton } from './product/CollectionControls';
export { ProductDetail, StickyBuyBar, type ProductDetailProps } from './product/ProductDetail';
export { RecipeCard, RecipeGrid, RecipeMeta } from './recipe/RecipeCards';
export { RecipeDetail, type RecipeDetailProps } from './recipe/RecipeDetail';
export { CartLayout, CartLine, CartSummary, CartComplements, DiscountCodeForm, CartEmpty } from './cart/Cart';
export { BundleCard, BundleGrid, BundleListLayout, ConceptNote } from './bundle/BundleCards';
export { BundleDetail, type BundleDetailProps } from './bundle/BundleDetail';
export { RecurringLayout, defaultRecurringCopy, type RecurringLayoutProps, type RecurringCopy } from './recurring/Recurring';
export { AccountLayout, AccountOverview, OrderList, defaultAccountCopy, type AccountNavItem, type AccountCopy } from './account/Account';
export { AddressForm, defaultAddressCopy, type AddressCopy } from './account/AddressForm';
export { PolicyPageLayout, HelpPanel } from './policy/Policy';
