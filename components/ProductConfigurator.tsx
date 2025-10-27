'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '@/store/cart';
import { formatMoney } from '@/lib/currency';
import type { Currency, OptionGroup, ProductWithOptions } from '@/lib/types';

export default function ProductConfigurator({ product }: { product: ProductWithOptions }) {
  const router = useRouter();
  const { add } = useCart();

  // Reglas de opciones vienen dentro del propio producto (products.json)
  const groups: OptionGroup[] = useMemo(() => product.optionGroups ?? [], [product]);

  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  // picked[groupId][itemId] = cantidad
  const [picked, setPicked] = useState<Record<string, Record<string, number>>>(() => {
    const start: Record<string, Record<string, number>> = {};
    groups.forEach((g) => {
      start[g.id] = {};
      g.items.forEach((it) => (start[g.id][it.id] = 0));
    });
    return start;
  });

  const groupTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    groups.forEach((g) => {
      totals[g.id] = Object.values(picked[g.id] ?? {}).reduce((a, n) => a + (n || 0), 0);
    });
    return totals;
  }, [picked, groups]);

  const unitFinal = product.priceCents; // extras gratis en esta demo
  const totalCents = unitFinal * qty;

  const inc = (g: OptionGroup, itemId: string) => {
    setPicked((prev) => {
      const next = structuredClone(prev);
      const sum = Object.values(next[g.id] ?? {}).reduce((a, n) => a + (n || 0), 0);
      if (g.max != null && sum >= g.max) return prev;
      next[g.id][itemId] = (next[g.id][itemId] || 0) + 1;
      return next;
    });
  };

  const dec = (g: OptionGroup, itemId: string) => {
    setPicked((prev) => {
      const next = structuredClone(prev);
      next[g.id][itemId] = Math.max(0, (next[g.id][itemId] || 0) - 1);
      return next;
    });
  };

  const canAdd =
    groups.every((g) => (g.min ?? 0) <= (groupTotals[g.id] ?? 0)) && qty > 0;

  const addToCart = () => {
    if (!canAdd) return;

    const selections = groups
      .map((g) => ({
        groupId: g.id,
        items: g.items
          .map((it) => ({
            id: it.id,
            name: it.name,
            qty: picked[g.id]?.[it.id] || 0,
            unitPriceCents: it.unitPriceCents ?? 0,
          }))
          .filter((x) => x.qty > 0),
      }))
      .filter((s) => s.items.length > 0);

    const currency = (product.currency as Currency) ?? 'USD';

    add({
      productId: product.id,
      name: product.name,
      qty,
      unitPriceCents: unitFinal,
      currency,
      imageUrl: product.imageUrl,
      description: product.description,
      selections,
      note: note?.trim() || undefined,
      slug: product.slug,
    });

    // Volver al catálogo después de agregar
    router.push('/tienda-de-ventas'); // o router.back() si prefieres regresar a la página anterior
  };

  return (
    <div className="mt-4 space-y-6">
      {/* Cantidad + precio */}
      <div className="flex items-center gap-3">
        <button
          className="w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center"
          onClick={() => setQty(Math.max(1, qty - 1))}
          aria-label="Restar"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-14 h-10 rounded-lg border flex items-center justify-center">
          {qty}
        </div>

        <button
          className="w-10 h-10 rounded-lg bg-green-600 text-white flex items-center justify-center"
          onClick={() => setQty(qty + 1)}
          aria-label="Sumar"
        >
          <Plus className="w-4 h-4" />
        </button>

        <div className="ml-auto text-lg font-semibold">
          {formatMoney(totalCents, product.currency)}
        </div>
      </div>

      {/* Grupos de opciones */}
      {groups.map((g) => (
        <div key={g.id} className="space-y-2">
          <div className="flex items-end justify-between">
            <h3 className="font-semibold">{g.title}</h3>
            <span className="text-xs opacity-70">
              {g.min ? `Min ${g.min}` : null}
              {g.min && g.max ? ' · ' : ''}
              {g.max ? `Max ${g.max}` : null}
            </span>
          </div>

          <div className="rounded-xl border divide-y">
            {g.items.map((it) => {
              const q = picked[g.id]?.[it.id] || 0;
              const disabledPlus =
                g.max != null && (groupTotals[g.id] ?? 0) >= g.max;
              return (
                <div
                  key={it.id}
                  className="flex items-center justify-between p-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{it.name}</p>
                    {g.freeMax ? (
                      <p className="text-xs opacity-70">
                        Gratis hasta {g.freeMax}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-9 h-9 rounded-full border flex items-center justify-center"
                      onClick={() => dec(g, it.id)}
                      aria-label={`Quitar ${it.name}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center">{q}</span>
                    <button
                      className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-40"
                      onClick={() => inc(g, it.id)}
                      disabled={disabledPlus}
                      aria-label={`Agregar ${it.name}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {g.min && (groupTotals[g.id] ?? 0) < g.min && (
            <p className="text-xs text-red-600">
              Selecciona al menos {g.min} opciones.
            </p>
          )}
        </div>
      ))}

      {/* Nota */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Instrucciones especiales</label>
        <textarea
          className="w-full min-h-[80px] rounded-xl border p-3"
          placeholder="Ej: sin orégano, cortar en 8"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* CTA */}
      <button
        className="w-full rounded-xl bg-black text-white dark:bg-white dark:text-black py-3 font-semibold disabled:opacity-50"
        disabled={!canAdd}
        onClick={addToCart}
      >
        Agregar a la orden
      </button>
    </div>
  );
}

