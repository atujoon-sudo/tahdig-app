/* TAHDIG UI layer — public exports. Presentational only: data in via props, events out via callbacks. */
export * from './types';
export { defaultLabels, type Labels } from './labels';
export { TahdigUIProvider, TahdigRoot, useUI, type LinkLike, type ImageLike } from './provider';
export { cn } from './lib/cn';
export { faDigits, formatAmount, moneyText, unitPriceText, currencySymbol } from './lib/format';

export { Icon, type IconName } from './primitives/Icon';
export { Button, TextAction, type ButtonVariant } from './primitives/Button';
export { QtyStepper } from './primitives/QtyStepper';
export { AddToCartControl } from './primitives/AddToCartControl';
export { Price, UnitPrice } from './primitives/Price';
export { Media } from './primitives/Media';
export { Breadcrumbs } from './primitives/Breadcrumbs';
export { ChoiceChips, OptionCards, type ChoiceItem } from './primitives/Choices';
export { AccordionGroup, SpecList, type AccordionItemData } from './primitives/Accordion';
export { Panel, Note, Badge, SectionTitle, EmptyState, PageHeader } from './primitives/Surfaces';
export { InlineForm, TextField } from './primitives/Fields';
export { Toast, ConfirmSheet } from './primitives/Overlays';

export { Container } from './layout/Container';
export { Header, type HeaderProps } from './layout/Header';
export { MenuDrawer, type DrawerLink } from './layout/MenuDrawer';
export { SearchBar, type SearchBarProps } from './layout/SearchBar';
export { Footer, NewsletterPanel, PaymentLogos, type FooterLinkGroup } from './layout/Footer';

export { HomeHero, CategoryCarousel, MealPanel, PromoPanels, type PromoPanelData } from './home/HomeSections';
export { ProductCard, type ProductCardProps } from './product/ProductCard';
export { ProductRail, ProductGrid, CollectionHeader, SortBar, LoadMoreButton, type CollectionTab } from './product/ProductCollections';
export { ProductDetail, StickyBuyBar, type ProductDetailProps } from './product/ProductDetail';
export { RecipeCard, RecipeGrid, RecipeMeta, RecipeDetail, type RecipeDetailProps } from './recipe/Recipes';
export { CartLayout, CartLine, CartSummary, CartComplements, DiscountCodeForm, CartEmpty } from './cart/Cart';
export { BundleCard, BundleGrid, BundleListLayout, BundleDetail, ConceptNote, type BundleDetailProps } from './bundle/Bundles';
export { RecurringLayout, type RecurringLayoutProps } from './recurring/Recurring';
export { AccountLayout, AccountOverview, OrderList, AddressForm, type AccountNavItem } from './account/Account';
export { PolicyPageLayout, HelpPanel } from './policy/Policy';
