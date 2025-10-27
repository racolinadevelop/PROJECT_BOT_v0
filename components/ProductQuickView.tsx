'use client';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  product?: {
    name: string;
    imageUrl?: string;
    description?: string;
  };
};

export default function ProductQuickView({ open, onClose, product }: Props) {
  if (!open || !product) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[120]">
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2
                     rounded-2xl bg-white dark:bg-zinc-950 shadow-2xl border overflow-hidden"
          initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        >
          <div className="relative">
            {product.imageUrl && (
              <div className="relative w-full h-[260px]">
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold leading-snug">{product.name}</h3>
            {product.description && (
              <p className="text-sm opacity-80 leading-relaxed whitespace-pre-line">{product.description}</p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
