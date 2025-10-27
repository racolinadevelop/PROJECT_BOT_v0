
'use client';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/currency';
import { Product } from '@/lib/types';
import { useCart } from '@/store/cart';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: Product }) {
  const add = useCart(s => s.add);

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
      <Card className="p-4 flex flex-col gap-3 shadow-soft rounded-2xl">
        {product.imageUrl && (
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          {product.description && <p className="text-sm opacity-80">{product.description}</p>}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">{formatMoney(product.priceCents, product.currency)}</span>
          <Button
            className="bg-primary text-primary-foreground rounded-2xl"
            onClick={() =>
              add({
                productId: product.id,
                name: product.name,
                qty: 1,
                unitPriceCents: product.priceCents,
                currency: product.currency,
              })
            }
          >
            Agregar
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
