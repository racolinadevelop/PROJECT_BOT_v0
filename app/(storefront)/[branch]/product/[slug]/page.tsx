import { getProductBySlug } from '@/lib/api';
import { formatMoney } from '@/lib/currency';

export default async function ProductPage({ params }: { params: { branch: string; slug: string } }) {
  const product = await getProductBySlug(params.branch, params.slug);
  if (!product) return <div className="p-6">Producto no encontrado</div>;
  return (
    <main className="container mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="opacity-80">{product.description}</p>
      <p className="font-semibold">{formatMoney(product.priceCents, product.currency)}</p>
    </main>
  );
}