import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-sm',
        'bg-black text-white hover:opacity-90 disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}