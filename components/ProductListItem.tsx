'use client';

import Image from 'next/image';
import { formatMoney } from '@/lib/currency';
import type { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function ProductListItem({ product }: { product: Product }) {
  const router = useRouter();

  const goToConfigurator = () => {
    router.push(`/tienda-de-ventas/${product.slug}`);
  };

  return (
    <div
      className="flex items-center gap-4 p-3 sm:p-4 border rounded-2xl bg-white dark:bg-zinc-900 hover:shadow-md transition-all
                 min-h-[88px]"
    >
      {/* Imagen fija para cards consistentes */}
      {product.imageUrl && (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover rounded-xl"
          />
        </div>
      )}

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="text-sm sm:text-base font-semibold truncate">{product.name}</h3>
        {product.description && (
          <p className="text-xs sm:text-sm opacity-70 line-clamp-1">
            {product.description}
          </p>
        )}
        <div className="mt-1 font-semibold text-sm sm:text-base">
          {formatMoney(product.priceCents, product.currency)}
        </div>
      </div>

      {/* Botón “+” UNIFORME (siempre mismo tamaño/posición) */}
      <button
        onClick={goToConfigurator}
        className="ml-auto flex-shrink-0 inline-flex items-center justify-center
                   rounded-full bg-black text-white hover:bg-zinc-700
                   w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 transition-colors"
        aria-label="Configurar producto"
      >
        <Plus className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
}
