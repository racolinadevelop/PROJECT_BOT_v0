'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { formatMoney } from '@/lib/currency';
import { useCart } from '@/store/cart';
import ProductQuickView from '@/components/ProductQuickView';
import { useState } from 'react';



export default function ProductListItem({ product }: { product: Product }) {
  const add = useCart(s => s.add);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-900 border shadow-soft">
      {product.imageUrl && (
        <div
          className="relative w-[110px] h-[110px] shrink-0 overflow-hidden rounded-xl cursor-zoom-in"
          onClick={() => setOpen(true)}
          title="Ver detalle"
        >
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold truncate">{product.name}</h3>
        {product.description && <p className="text-sm opacity-80 line-clamp-2">{product.description}</p>}
        <div className="mt-2 font-semibold">{formatMoney(product.priceCents, product.currency)}</div>
      </div>
      <div className="flex items-center">
        <button
          onClick={() =>
            add({
              productId: product.id,
              name: product.name,
              qty: 1,
              unitPriceCents: product.priceCents,
              currency: product.currency,
              imageUrl: product.imageUrl,
              description: product.description,
            })
          }
          className="w-11 h-11 rounded-full bg-white dark:bg-zinc-800 border shadow-soft flex items-center justify-center text-xl"
          title="Agregar"
        >+</button>
      </div>
      <ProductQuickView
        open={open}
        onClose={() => setOpen(false)}
        product={{
          name: product.name,
          imageUrl: product.imageUrl,
          description: product.description,
        }}
      />
    </div>


  );


}
