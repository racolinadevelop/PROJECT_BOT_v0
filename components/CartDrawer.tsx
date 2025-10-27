'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/store/cart';
import { formatMoney } from '@/lib/currency';
import type { Currency } from '@/lib/types';
import Image from 'next/image';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

export default function CartDrawer() {
  const { items, totalCents, remove, clear } = useCart();
  const [open, setOpen] = useState(false);

  const currency: Currency = (items[0]?.currency as Currency) ?? 'USD';
  const total = formatMoney(totalCents(), currency);
  const qty = items.reduce((a, i) => a + i.qty, 0);

  return (
    <>
      {/* Botón flotante del carrito */}
      <Button
        onClick={() => setOpen(true)}
        className="rounded-full flex items-center justify-center gap-2 bg-black text-white hover:bg-zinc-700 transition-all w-11 h-11 md:w-12 md:h-12 relative"
        aria-label="Abrir carrito"
      >
        <ShoppingCart className="w-5 h-5" />
        {qty > 0 && (
          <span className="absolute -top-2 -right-2 text-xs font-semibold bg-red-500 text-white rounded-full px-1.5">
            {qty}
          </span>
        )}
      </Button>

      {/* Drawer lateral */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Fondo oscuro */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            {/* Panel del carrito */}
            <aside className="relative z-10 w-full max-w-[380px] h-full bg-white dark:bg-zinc-950 shadow-2xl border-l flex flex-col">
              {/* Encabezado */}
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold text-lg">Tu carrito</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-black dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Lista de productos */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center mt-10">
                    Tu carrito está vacío
                  </p>
                ) : (
                  items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 border rounded-xl p-3"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.imageUrl ?? '/placeholder.png'}
                          alt={item.name ?? 'Producto sin nombre'}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold line-clamp-1">
                          {item.name}
                        </p>
                        {/* Ingredientes si existen */}
                        {item.options && (
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {Object.entries(item.options)
                              .map(([k, v]) => `${v} ${k}`)
                              .join(', ')}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {formatMoney(item.unitPriceCents, item.currency)} ×{' '}
                          {item.qty}
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

              {/* Footer */}
              <div className="border-t p-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Total</span>
                  <span>{total}</span>
                </div>
                <div className="flex gap-2">
                  {/* Ir a pagar */}
                  <Button
                    onClick={() => {
                      setOpen(false);
                      window.location.href = '/checkout';
                    }}
                    disabled={qty === 0}
                    className="flex-1 bg-black text-white rounded-xl hover:bg-zinc-800 py-2"
                  >
                    Ir a pagar
                  </Button>
                  {/* Vaciar carrito */}
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
