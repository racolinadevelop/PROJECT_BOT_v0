
'use client';
import Link from 'next/link';
import CartDrawer from '@/components/CartDrawer';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const currentBranch = pathname?.split('/')[1] || 'tienda-de-ventas';

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-950/70 bg-white/90 dark:bg-zinc-950/80 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/" className="font-extrabold text-xl tracking-tight">Bot Store</Link>
        <div className="ml-auto flex items-center gap-3">
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
