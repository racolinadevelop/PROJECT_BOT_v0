'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { formatMoney } from '@/lib/currency';
import { ProductWithOptions as Product } from '@/lib/types';

const BASE_PATH = '/tienda-de-ventas'; // ajusta si tu catálogo vive en otra ruta

export default function ProductListItem({ product }: { product: Product }) {
  const router = useRouter();

  return (
    <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 p-3 flex items-center gap-3 bg-white dark:bg-neutral-900">
      {/* Imagen */}
      {product.imageUrl && (
        <div className="relative w-20 h-20 overflow-hidden rounded-xl flex-shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      )}

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-[15px] leading-tight truncate">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-neutral-500 line-clamp-1">
            {product.description}
          </p>
        )}
        <p className="mt-1 text-sm font-semibold">
          {formatMoney(product.priceCents, product.currency)}
        </p>
      </div>

      {/* Botón + (tamaño uniforme) */}
      <button
        onClick={() => router.push(`${BASE_PATH}/${product.slug}`)}
        className="h-11 w-11 grid place-items-center rounded-full bg-neutral-900 text-white hover:opacity-90 transition flex-shrink-0"
        aria-label="Configurar y agregar"
        title="Configurar y agregar"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
