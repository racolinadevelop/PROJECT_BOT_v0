
'use client';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <motion.div
      className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06 } }
      }}
    >
      {products.map(p => (
        <motion.div
          key={p.id}
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 }
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 14, mass: 0.6 }}
        >
          <ProductCard product={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}
