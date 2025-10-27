export type Currency = 'USD' | 'EUR' | 'VES' | 'MXN';

export interface Product {
  id: string;
  branchId: string;
  name: string;
  slug: string;
  description?: string;
  priceCents: number;
  currency: Currency;
  imageUrl?: string;
  isActive: boolean;
  category?: string; // 👈 nuevo
}

export interface CartItem {
  productId: string;
  name: string;
  qty: number;
  unitPriceCents: number;
  currency: Currency;
}
