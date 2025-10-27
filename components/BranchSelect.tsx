
'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const BRANCHES = [
  { id: 'tienda-de-ventas', name: 'Tienda de Ventas' },
];

export default function BranchSelect({ current }: { current?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(current ?? 'tienda-de-ventas');

  useEffect(() => {
    if (current) setValue(current);
  }, [current]);

  return (
    <select
      className="rounded-xl border px-3 py-2 bg-white dark:bg-zinc-900"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        router.push(`/${e.target.value}`);
      }}
    >
      {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
    </select>
  );
}
