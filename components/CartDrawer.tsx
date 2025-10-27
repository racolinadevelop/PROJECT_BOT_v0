'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/store/cart';
import { formatMoney } from '@/lib/currency';
import type { Currency } from '@/lib/types';
import Image from 'next/image';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

type Placement = 'floating' | 'header';

export default function CartDrawer({ placement = 'floating' }: { placement?: Placement }) {
  const { items, totalCents, remove, clear } = useCart();
  const [open, setOpen] = useState(false);

  const currency: Currency = (items[0]?.currency as Currency) ?? 'USD';
  const total = formatMoney(totalCents(), currency);
  const qty = items.reduce((a, i) => a + i.qty, 0);

  // estilos según ubicación
  const btnClass =
    placement === 'header'
      ? // dentro del header (NO fixed)
      'relative inline-flex items-center justify-center rounded-full bg-black text-white hover:bg-zinc-700 transition-all w-[44px] h-[44px] md:w-[48px] md:h-[48px]'
      : // flotante (fixed + safe-area)
      'fixed right-4 md:right-6 z-40 rounded-full bg-black text-white hover:bg-zinc-700 transition-all w-[56px] h-[56px] md:w-[60px] md:h-[60px] shadow-lg';

  const btnStyle =
    placement === 'header'
      ? undefined
      : // respeta el notch cuando es flotante
      ({ top: 'calc(env(safe-area-inset-top, 0px) + 16px)' } as React.CSSProperties);

  return (
    <>
      {/* Botón del carrito */}
      <Button
        onClick={() => setOpen(true)}
        aria-label="Abrir carrito"
        className="relative flex items-center justify-center
             h-12 w-12 md:h-14 md:w-14 rounded-xl
             bg-neutral-900 text-white hover:bg-neutral-800
             transition shadow-md
             backdrop-blur-sm bg-neutral-900/90 hover:bg-neutral-800/90"
      >
        {/* Ícono del carrito más grande */}
        <ShoppingCart className="h-6 w-6 md:h-7 md:w-7 stroke-[2.5]" />

        {/* Badge rojo de cantidad */}
        {qty > 0 && (
          <span
            className="absolute -top-1 -right-1 inline-flex items-center justify-center
                 h-5 w-5 rounded-full bg-red-500 text-white text-[11px] font-bold
                 ring-2 ring-white dark:ring-neutral-900"
          >
            {qty > 9 ? '9+' : qty}
          </span>
        )}
      </Button>

      {/* Drawer lateral */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <aside className="relative z-10 w-full max-w-[392px] h-full bg-white dark:bg-zinc-950 shadow-2xl border-l flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold text-lg">Tu carrito</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-black dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center mt-10">Tu carrito está vacío</p>
                ) : (
                  items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 border rounded-xl p-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.imageUrl ?? '/placeholder.png'}
                          alt={item.name ?? 'Producto'}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.name}</p>
                        {item.options && (
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {Object.entries(item.options)
                              .map(([k, v]) => `${v} ${k}`)
                              .join(', ')}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {formatMoney(item.unitPriceCents, item.currency)} × {item.qty}
                        </p>
                      </div>
                      <button
                        onClick={() => remove(item.productId)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t p-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Total</span>
                  <span>{total}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      // cerrar y navegar
                      (document.activeElement as HTMLElement)?.blur?.();
                      setOpen(false);
                      window.location.href = '/checkout';
                    }}
                    disabled={qty === 0}
                    className="flex-1 bg-black text-white rounded-xl hover:bg-zinc-800 py-2"
                  >
                    Ir a pagar
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      setOpen(false);
                    }}
                    disabled={qty === 0}
                    className="flex-1 rounded-xl border bg-transparent px-4 py-2 font-semibold text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
                  >
                    Vaciar
                  </button>
                </div>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </>
  );
}

