
'use client';
import { useEffect, useMemo, useState } from 'react';
import { getProductsByBranch } from '@/lib/api';
import ProductListItem from '@/components/ProductListItem';
import SearchBar from '@/components/SearchBar';
import CategoryTabs from '@/components/CategoryTabs';

export default function BranchPage({ params }: { params: { branch: string } }) {
  const [products, setProducts] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => {
    (async () => {
      const data = await getProductsByBranch(params.branch);
      setProducts(data);
    })();
  }, [params.branch]);

  const tabs = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => set.add(p.category || 'General'));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    const list = !q ? products : products.filter(p => [p.name, p.description].join(' ').toLowerCase().includes(q.toLowerCase()));
    if (tabs.length === 0) return list;
    const cat = tabs[active] || tabs[0];
    return list.filter(p => (p.category || 'General') === cat);
  }, [q, products, tabs, active]);

  return (
    <section className="container mx-auto px-4 py-4 space-y-4">
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border p-3 shadow-soft">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="font-semibold">Tienda: <span className="opacity-80">{params.branch}</span></div>
        </div>
        <SearchBar onSearch={(term) => setQ(term)} />
        <div className="mt-3">
          <CategoryTabs tabs={tabs} active={active} onChange={setActive} />
        </div>
      </div>

      <div className="space-y-3 pb-24">
        {filtered.map((p) => <ProductListItem key={p.id} product={p} />)}
      </div>
    </section>
  );
}
