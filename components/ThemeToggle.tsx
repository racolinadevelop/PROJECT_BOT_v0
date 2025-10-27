
'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = (resolvedTheme ?? theme) === 'dark';
  return (
    <Button
      className="px-3 py-2 rounded-xl"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title="Cambiar tema"
    >
      {isDark ? '🌙' : '☀️'}
    </Button>
  );
}
