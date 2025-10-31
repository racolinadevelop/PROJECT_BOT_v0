'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/store/cart';
import { formatMoney } from '@/lib/currency';
import type { CartItem, CartSelection } from '@/lib/types';

export default function CartDrawer() {
  const { items, totalCents, remove, clear } = useCart();
  const [open, setOpen] = useState(false);

  const currency = items[0]?.currency ?? 'USD';
  const qty = items.reduce((a, i) => a + i.qty, 0);

  const renderSelections = (item: CartItem) => {
    if (!item.selections?.length) return null;
    const ingredients = item.selections.filter((s) => s.category === 'ingredient');
    const extras = item.selections.filter((s) => s.category === 'extra');

    return (
      <div className="mt-2 text-xs space-y-1 text-neutral-700 dark:text-neutral-300">
        {ingredients.length > 0 && (
          <>
            <p className="font-medium">INGREDIENTES:</p>
            {ingredients.flatMap((g) =>
              g.items.map((it) => (
                <div key={`${g.groupId}-${it.id}`}>• {it.name} × {it.qty}</div>
              ))
            )}
          </>
        )}
        {extras.length > 0 && (
          <>
            <p className="font-medium mt-2">AGREGOS:</p>
            {extras.flatMap((g) =>
              g.items.map((it) => (
                <div key={`${g.groupId}-${it.id}`}>• {it.name} × {it.qty}</div>
              ))
            )}
          </>
        )}
      </div>
    );
  };

  const drawer = (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <aside className="w-full max-w-md bg-white dark:bg-zinc-900 h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="font-semibold text-lg">Tu carrito</h2>
          <button onClick={() => setOpen(false)} className="text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="border p-3 rounded-xl">
              <div className="flex items-center gap-3">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-neutral-500">
                    {formatMoney(item.unitPriceCents, item.currency)} × {item.qty}
                  </p>
                </div>
                <button
                  onClick={() => remove(item.productId)}
                  className="p-1 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-md"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {renderSelections(item)}
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-neutral-500 text-center mt-10">Tu carrito está vacío.</p>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex justify-between mb-3 text-sm font-medium">
            <span>Total</span>
            <span>{formatMoney(totalCents(), currency)}</span>
          </div>
          <div className="flex gap-2">
            <button
              disabled={qty === 0}
              onClick={() => {
                setOpen(false);
                window.location.href = '/checkout';
              }}
              className="flex-1 h-10 rounded-xl bg-neutral-900 text-white font-semibold hover:opacity-90 disabled:opacity-50"
            >
              Ir a pagar
            </button>
            <button
              disabled={qty === 0}
              onClick={() => {
                clear();
                setOpen(false);
              }}
              className="flex-1 h-10 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-zinc-800 disabled:opacity-50"
            >
              Vaciar
            </button>
          </div>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 top-4 z-40 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black w-12 h-12 flex items-center justify-center shadow-md"
      >
        <ShoppingCart size={22} />
        {qty > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
            {qty}
          </span>
        )}
      </button>

      {open && createPortal(drawer, document.body)}
    </>
  );
}
