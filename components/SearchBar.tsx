'use client';
import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

type Props = {
  onSearch: (q: string) => void;
  /** milisegundos de espera antes de disparar la búsqueda (default: 250ms) */
  delayMs?: number;
  /** longitud mínima para empezar a buscar (default: 1) */
  minLength?: number;
};

export default function SearchBar({ onSearch, delayMs = 250, minLength = 1 }: Props) {
  const [q, setQ] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const t = useRef<NodeJS.Timeout | null>(null);

  // 🔎 Búsqueda en vivo con debounce
  useEffect(() => {
    setIsTyping(true);
    if (t.current) clearTimeout(t.current);

    t.current = setTimeout(() => {
      const term = q.trim();
      onSearch(term.length >= minLength ? term : '');
      setIsTyping(false);
    }, delayMs);

    return () => {
      if (t.current) clearTimeout(t.current);
    };
  }, [q, delayMs, minLength, onSearch]);

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-2xl border px-3 py-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar producto..."
        className="flex-1 bg-transparent outline-none text-sm"
      />
      {q && (
        <button
          onClick={() => setQ('')}
          title="Limpiar"
          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition"
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}

      {/* Botón visual (ya no es necesario para disparar, pero queda como acción explícita) */}
      <button
        onClick={() => onSearch(q.trim())}
        title="Buscar"
        className="relative flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition"
        aria-label="Buscar"
      >
        {/* Ícono de lupa */}
        <Search size={16} className={`text-zinc-600 dark:text-zinc-300 ${isTyping ? 'opacity-50' : ''}`} />
        {/* Indicador de “escribiendo” */}
        {isTyping && (
          <span className="absolute inline-block w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
        )}
      </button>
    </div>
  );
}


