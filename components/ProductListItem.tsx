'use client';

import Image from 'next/image';
import { formatMoney } from '@/lib/currency';
import type { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function ProductListItem({ product }: { product: Product }) {
  const router = useRouter();

  const goToConfigurator = () => {
    // Redirige a la página del producto con su slug
    router.push(`/tienda-de-ventas/${product.slug}`);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b rounded-xl bg-white dark:bg-zinc-900 hover:shadow-md transition-all">
      <div className="flex items-center gap-4 min-w-0">
        {/* Imagen del producto */}
        {product.imageUrl && (
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        {/* Información */}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold truncate">{product.name}</h3>
          {product.description && (
            <p className="text-sm opacity-70 truncate">{product.description}</p>
          )}
          <div className="mt-1 font-medium">
            {formatMoney(product.priceCents, product.currency)}
          </div>
        </div>
      </div>

      {/* Botón que ahora abre el configurador */}
      <button
        onClick={goToConfigurator}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-zinc-700 transition-colors"
        aria-label="Configurar producto"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
