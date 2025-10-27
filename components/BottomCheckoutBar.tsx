
'use client';
import { useCart } from '@/store/cart';
import { formatMoney } from '@/lib/currency';
import { Button } from '@/components/ui/button';

export default function BottomCheckoutBar() {
  const { items, totalCents } = useCart();
  const total = totalCents();
  const qty = items.reduce((a, i) => a + i.qty, 0);
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] sm:w-[560px]">
      <div className="rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-between px-3 py-3 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 dark:bg-black/20 flex items-center justify-center font-bold">{qty}</div>
          <span className="font-semibold">Finalizar compra</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{formatMoney(total, items[0]?.currency ?? 'USD')}</span>
          <Button className="rounded-xl bg-white text-black dark:bg-black dark:text-white">Continuar</Button>
        </div>
      </div>
    </div>
  );
}
