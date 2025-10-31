import { notFound } from 'next/navigation';
import ProductConfigurator from '@/components/ProductConfigurator';
import productsData from '@/mocks/products.json';
import { ProductWithOptions } from '@/lib/types';

type Params = { slug: string };

export default function ProductPage({ params }: { params: Params }) {
  const product = (productsData as ProductWithOptions[]).find(
    (p) => p.slug === params.slug
  );

  if (!product) return notFound();

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6">
      <ProductConfigurator product={product} />
    </div>
  );
}
