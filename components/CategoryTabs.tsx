'use client'
import clsx from 'clsx'

type Props = {
  tabs: string[] // nombres de las categorías
  active?: number // índice activo
  onChange?: (i: number) => void
}

export default function CategoryTabs({ tabs, active = 0, onChange }: Props) {
  return (
    <div className="mt-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tabs.map((tab, i) => {
          const isActive = i === active

          return (
            <button
              key={i}
              onClick={() => onChange?.(i)}
              aria-pressed={isActive}
              className={clsx(
                'h-11 w-full rounded-2xl text-sm font-semibold flex items-center justify-center text-center border transition shadow-sm select-none',
                isActive
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-900 border-neutral-200 hover:bg-neutral-50'
              )}
            >
              <span className="truncate">{tab}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

