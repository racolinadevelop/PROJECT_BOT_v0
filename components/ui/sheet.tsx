'use client';
import { ReactNode, useState } from 'react';
import clsx from 'clsx';

export function Sheet({ children }: { children: ReactNode }) { return <>{children}</>; }

export function SheetTrigger({ asChild, children }: { asChild?: boolean; children: ReactNode }) {
  return <>{children}</>;
}

export function SheetContent({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={clsx(
      'fixed right-0 top-0 h-full w-96 max-w-full bg-white dark:bg-zinc-900 border-l p-4 shadow-2xl z-50',
      className
    )}>
      {children}
    </div>
  );
}

export function SheetHeader({ children }: { children: ReactNode }) { return <div>{children}</div>; }
export function SheetTitle({ children }: { children: ReactNode }) { return <h3 className="text-lg font-semibold">{children}</h3>; }