'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState('');
  return (
    <div className="flex items-center gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar producto..."
        className="flex-1 rounded-xl border px-3 py-2 bg-white dark:bg-zinc-900"
      />
      {q && (
        <Button className="rounded-xl" onClick={() => { setQ(''); onSearch(''); }} title="Limpiar">✕</Button>
      )}
      <Button className="rounded-xl" onClick={() => onSearch(q)} title="Buscar">🔍</Button>
    </div>
  );
}
