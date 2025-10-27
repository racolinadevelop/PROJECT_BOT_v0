
'use client';
import clsx from 'clsx';

export default function CategoryTabs({ tabs, active = 0, onChange }: { tabs: string[]; active?: number; onChange: (i: number) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      {tabs.map((t, i) => (
        <button
          key={t}
          onClick={() => onChange(i)}
          className={clsx(
            'rounded-xl px-3 py-2 border',
            i === active ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white dark:bg-zinc-900'
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
