// /lib/types.ts
export type Currency = 'USD' | 'EUR' | 'MXN' | string;

/* ===== PRODUCTO BASE ===== */
export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  imageUrl?: string;
  priceCents: number;
  currency: Currency;
  category?: string;
}

/* ===== OPCIONES ===== */
export interface OptionItem {
  id: string;
  name: string;
  unitPriceCents?: number;
}

export interface OptionGroup {
  id: string;
  title: string;
  type?: 'stepper' | 'checkbox';
  min?: number;
  max?: number;
  freeMax?: number;
  items: OptionItem[];
}

export interface ProductWithOptions extends Product {
  optionGroups?: OptionGroup[];
}

/* ===== CARRITO ===== */
export interface CartSelectionItem {
  id: string;
  name: string;
  qty: number;
  price?: number;
  type?: 'ingredient' | 'extra';
}

export interface CartSelection {
  groupId: string;
  groupTitle?: string;
  category?: 'ingredient' | 'extra';
  items: CartSelectionItem[];
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  imageUrl?: string;
  unitPriceCents: number;
  currency: Currency;
  qty: number;
  selections?: CartSelection[];
  note?: string;
}

export interface CartState {
  items: CartItem[];
  totalCents: () => number;
}

export interface AddToCartPayload {
  product: Pick<Product, 'id' | 'slug' | 'name' | 'imageUrl' | 'priceCents' | 'currency'>;
  qty: number;
  selections?: CartSelection[];
}
