'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useCart } from '@/store/cart';
import { formatMoney } from '@/lib/currency';
import type {
  ProductWithOptions,
  CartSelection,
  CartSelectionItem,
  OptionGroup,
} from '@/lib/types';

type Props = { product: ProductWithOptions };

export default function ProductConfigurator({ product }: Props) {
  const router = useRouter();
  const { add } = useCart();

  const groups: OptionGroup[] = product.optionGroups ?? [];
  const [qty, setQty] = useState(1);
  /** picked[groupId][itemId] = cantidad */
  const [picked, setPicked] = useState<Record<string, Record<string, number>>>({});

  const inc = (gid: string, iid: string) =>
    setPicked((p) => ({ ...p, [gid]: { ...(p[gid] ?? {}), [iid]: (p[gid]?.[iid] ?? 0) + 1 } }));

  const dec = (gid: string, iid: string) =>
    setPicked((p) => ({
      ...p,
      [gid]: { ...(p[gid] ?? {}), [iid]: Math.max(0, (p[gid]?.[iid] ?? 0) - 1) },
    }));

  const countInGroup = (gid: string) =>
    Object.values(picked[gid] ?? {}).reduce((a, b) => a + b, 0);

  /** extras a cobrar respetando freeMax (gratis los más baratos) */
  const extrasCents = useMemo(() => {
    let sum = 0;
    for (const g of groups) {
      const map = picked[g.id] ?? {};
      const freeMax = g.freeMax ?? 0;

      const selected = g.items
        .map((it) => ({ qty: map[it.id] ?? 0, price: it.unitPriceCents ?? 0 }))
        .filter((r) => r.qty > 0)
        .sort((a, b) => a.price - b.price); // primero gratis los baratos

      let remainingFree = freeMax;
      for (const r of selected) {
        const freeHere = Math.min(remainingFree, r.qty);
        const paid = r.qty - freeHere;
        sum += paid * r.price;
        remainingFree -= freeHere;
      }
    }
    return sum;
  }, [picked, groups]);

  /** Construye selections para el carrito con tipo ingredient/extra */
  const buildSelections = (): CartSelection[] => {
    const selections: CartSelection[] = [];

    for (const g of groups) {
      const map = picked[g.id] ?? {};
      const items = g.items
        .map((it) => {
          const n = map[it.id] ?? 0;
          if (n <= 0) return null;
          const type: CartSelectionItem['type'] =
            g.title.toLowerCase().includes('agrega') ||
            g.title.toLowerCase().includes('extra')
              ? 'extra'
              : 'ingredient';
          return { id: it.id, name: it.name, qty: n, price: it.unitPriceCents ?? 0, type };
        })
        .filter(Boolean) as CartSelectionItem[];

      if (items.length > 0) {
        const category: CartSelection['category'] =
          g.title.toLowerCase().includes('agrega') ||
          g.title.toLowerCase().includes('extra')
            ? 'extra'
            : 'ingredient';
        selections.push({ groupId: g.id, groupTitle: g.title, category, items });
      }
    }
    return selections;
  };

  /** Validación min/max por grupo */
  const groupErrors = useMemo(() => {
    const errors: Record<string, string | null> = {};
    for (const g of groups) {
      const total = countInGroup(g.id);
      const min = g.min ?? 0;
      const max = g.max ?? Infinity;
      if (total < min) errors[g.id] = `Selecciona al menos ${min}`;
      else if (total > max) errors[g.id] = `Máximo ${g.max}`;
      else errors[g.id] = null;
    }
    return errors;
  }, [picked, groups]);

  const isValid = Object.values(groupErrors).every((e) => e === null);

  const handleAdd = () => {
    if (!isValid) return;

    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.imageUrl,
      unitPriceCents: product.priceCents + extrasCents,
      currency: product.currency,
      qty,
      selections: buildSelections(),
    });

    // volver al catálogo
    router.back();
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      {/* Volver */}
      <Link
        href="/tienda-de-ventas"
        className="inline-flex items-center text-sm text-neutral-600 hover:underline"
      >
        ← Volver al catálogo
      </Link>

      <div className="mt-4 grid gap-6 md:gap-8 lg:grid-cols-2">
        {/* Imagen */}
        <div>
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={800}
              height={800}
              className="rounded-xl w-full h-auto object-contain"
              priority
            />
          )}
        </div>

        {/* Configuración */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold leading-snug">{product.name}</h1>
          {product.description && (
            <p className="mt-1 text-sm text-neutral-500">{product.description}</p>
          )}

          {/* Cantidad */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-md border"
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="min-w-[2ch] text-center">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 rounded-md border"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          {/* Grupos */}
          <div className="mt-6 space-y-6">
            {groups.map((g) => {
              const total = countInGroup(g.id);
              const min = g.min ?? 0;
              const max = g.max ?? Infinity;
              const freeMax = g.freeMax ?? 0;
              const error = groupErrors[g.id];

              return (
                <section key={g.id}>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-medium">{g.title}</h3>
                      <p className="text-xs text-neutral-500">
                        Min {min} · Max {Number.isFinite(max) ? max : '—'}
                        {freeMax > 0 && ` · ${freeMax} gratis`}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-500">Seleccionados: {total}</span>
                  </div>

                  <div className="mt-2 space-y-2">
                    {g.items.map((it) => {
                      const n = picked[g.id]?.[it.id] ?? 0;
                      return (
                        <div key={it.id} className="flex items-center justify-between">
                          <span className="truncate">{it.name}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => dec(g.id, it.id)}
                              className="w-7 h-7 rounded-md border"
                              aria-label={`Quitar ${it.name}`}
                            >
                              −
                            </button>
                            <span className="w-4 text-center">{n}</span>
                            <button
                              onClick={() => inc(g.id, it.id)}
                              className="w-7 h-7 rounded-md border"
                              aria-label={`Agregar ${it.name}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                </section>
              );
            })}
          </div>

          {/* Botón */}
          <button
            onClick={handleAdd}
            disabled={!isValid}
            className="mt-8 w-full h-11 rounded-xl font-semibold text-white disabled:opacity-50
                       bg-neutral-900 hover:opacity-90"
          >
            Agregar a la orden —{' '}
            {formatMoney(product.priceCents + extrasCents, product.currency)}
          </button>
        </div>
      </div>
    </div>
  );
}
