// lib/types.ts
export type Currency = 'USD' | 'EUR' | 'MXN' | string;

export interface Product {
  id: string;
  slug: string;                 // ← importante para la página /[slug]
  name: string;
  description?: string;
  imageUrl?: string;
  priceCents: number;
  currency: Currency;
  category?: string;
}

export interface OptionItem {
  id: string;
  name: string;
  unitPriceCents?: number;
}

export interface OptionGroup {
  id: string;
  title: string;
  type: 'stepper';
  min?: number;
  max?: number;
  freeMax?: number;
  items: OptionItem[];
}

export interface ProductWithOptions extends Product {
  optionGroups?: OptionGroup[];
}

export interface CartItem {
  productId: string;
  name: string;
  qty: number;
  unitPriceCents: number;
  currency: Currency;
  imageUrl?: string;
  description?: string;
  selections?: {
    groupId: string;
    items: { id: string; name: string; qty: number; unitPriceCents?: number }[];
  }[];
  note?: string;
  // opcional: si quieres reabrir con reglas desde el carrito
  slug?: string;
  options?: Record<string, string>;
}

