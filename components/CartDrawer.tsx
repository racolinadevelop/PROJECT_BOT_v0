'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart';
import { formatMoney } from '@/lib/currency';
import { useState } from 'react';

export default function CartDrawer() {
  const { items, totalCents, clear } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Carrito ({items.reduce((a,i)=>a+i.qty,0)})</Button>
      {open && (
        <Sheet>
          <SheetContent className="flex flex-col">
            <SheetHeader><SheetTitle>Tu carrito</SheetTitle></SheetHeader>
            <div className="flex-1 overflow-auto mt-4 space-y-3">
              {items.length === 0 && <p className="text-sm opacity-80">Vacío</p>}
              {items.map(i => (
                <div key={i.productId} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{i.name} × {i.qty}</p>
                  </div>
                  <span>{formatMoney(i.unitPriceCents * i.qty, i.currency)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">{formatMoney(totalCents(), items[0]?.currency ?? 'USD')}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button className="flex-1">Ir a pagar</Button>
              <Button className="flex-1" onClick={() => setOpen(false)} variant="outline">Cerrar</Button>
              <Button variant="outline" onClick={clear}>Vaciar</Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}