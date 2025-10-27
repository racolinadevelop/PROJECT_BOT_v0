import { HTMLAttributes } from 'react';
import clsx from 'clsx';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('rounded-2xl border p-4 bg-white/80 dark:bg-zinc-900/60', className)} {...props} />;
}