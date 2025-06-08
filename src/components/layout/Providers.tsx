'use client';

import { ThemeProvider } from 'next-themes';
import { PinsProvider } from '@/contexts/PinsContext';
import { BoardsProvider } from '@/contexts/BoardsContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <PinsProvider>
        <BoardsProvider>
          {children}
        </BoardsProvider>
      </PinsProvider>
    </ThemeProvider>
  );
}
