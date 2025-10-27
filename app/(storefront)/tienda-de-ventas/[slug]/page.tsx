// app/tienda-de-ventas/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import products from '@/mocks/products.json';
import type { Product } from '@/lib/types';
import ProductConfigurator from '@/components/ProductConfigurator';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const list = products as Product[];
  const product = list.find(p => p.slug === params.slug);
  if (!product) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <Link href="/tienda-de-ventas" className="text-sm underline">
          ← Volver al catálogo
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative w-full aspect-square rounded-2xl border overflow-hidden bg-black/5 dark:bg-zinc-900">
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold leading-tight">{product.name}</h1>
          {product.description && (
            <p className="mt-1 opacity-80">{product.description}</p>
          )}
          <ProductConfigurator product={product} />
        </div>
      </div>
    </div>
  );
}
