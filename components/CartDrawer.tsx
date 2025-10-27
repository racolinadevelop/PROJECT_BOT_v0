'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useCart } from '@/store/cart';
import { formatMoney } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ProductQuickView from '@/components/ProductQuickView';

export default function CartDrawer() {
  const { items, totalCents, setQty, remove, clear } = useCart();
  const [open, setOpen] = useState(false);
  const total = totalCents();
  const qty = items.reduce((a, i) => a + i.qty, 0);
  const currency = items[0]?.currency ?? 'USD';
  const [preview, setPreview] = useState<{ name: string; imageUrl?: string; description?: string } | null>(null);

  return (
    <>
      {/* Botón del header: solo icono + badge */}
      <Button
        onClick={() => setOpen(true)}
        className="rounded-xl flex items-center gap-2 font-semibold relative"
        aria-label="Abrir carrito"
      >
        <ShoppingCart className="w-5 h-5" />
        <AnimatePresence>
          {qty > 0 && (
            <motion.span
              key={qty}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: 1,
                transition: { duration: 0.3 },
              }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute -top-2 -right-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-[1px]"
            >
              {qty}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      {/* Drawer con animaciones */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-[100]" aria-modal="true" role="dialog">
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />
              {/* Panel */}
              <motion.aside
                className="absolute right-0 top-0 h-full w-[92vw] max-w-[380px] bg-white dark:bg-zinc-950 shadow-2xl border-l flex flex-col"
                initial={{ x: 24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 24, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              >
                {/* Header del panel */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h3 className="text-lg font-semibold">Tu carrito</h3>
                  <button
                    className="w-9 h-9 rounded-full border flex items-center justify-center"
                    onClick={() => setOpen(false)}
                    aria-label="Cerrar"
                    title="Cerrar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Lista */}
                <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
                  {items.length === 0 && (
                    <p className="text-sm opacity-70">Tu carrito está vacío.</p>
                  )}

                  {items.map((i) => (
                    <motion.div
                      key={i.productId}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-start justify-between gap-3 rounded-xl border p-3"
                    >
                      {/* miniatura clickeable */}
                      {i.imageUrl && (
                        <button
                          className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 cursor-zoom-in"
                          onClick={() => setPreview({ name: i.name, imageUrl: i.imageUrl, description: i.description })}
                          title="Ver detalle"
                        >
                          <Image src={i.imageUrl} alt={i.name} fill className="object-cover" />
                        </button>
                      )}

                      {/* texto — ahora sin truncar, 2 líneas máximas */}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-snug line-clamp-2 break-words">{i.name}</p>
                        <p className="text-xs opacity-70">{formatMoney(i.unitPriceCents, i.currency)} c/u</p>
                      </div>

                      {/* qty / remove */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="w-8 h-8 rounded-full border" onClick={() => setQty(i.productId, i.qty - 1)} aria-label="Restar">−</button>
                        <span className="w-6 text-center">{i.qty}</span>
                        <button className="w-8 h-8 rounded-full border" onClick={() => setQty(i.productId, i.qty + 1)} aria-label="Sumar">+</button>
                        <button
                          onClick={() => remove(i.productId)}
                          className="text-muted-foreground hover:text-red-500 transition ml-2"
                          title="Eliminar del carrito"
                          aria-label="Eliminar del carrito"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t px-4 py-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">
                      {formatMoney(total, currency)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 rounded-xl"
                      disabled={qty === 0}
                      onClick={() => {
                        setOpen(false);
                        window.location.href = '/checkout';
                      }}
                    >
                      Ir a pagar
                    </Button>

                    {/* Vaciar con texto legible */}
                    <button
                      type="button"
                      className="flex-1 rounded-xl border bg-transparent px-4 py-2 font-semibold text-black dark:text-white"
                      onClick={clear}
                      disabled={qty === 0}
                    >
                      Vaciar
                    </button>
                  </div>
                </div>
                <ProductQuickView open={!!preview} onClose={() => setPreview(null)} product={preview || undefined} />
              </motion.aside>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
