'use client';

import { ThemeProvider } from 'next-themes';
import { PinsProvider } from '@/contexts/PinsContext';
import { BoardsProvider } from '@/contexts/BoardsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <PinsProvider>
          <BoardsProvider>
            {children}
            <Toaster
              position="top-center"
              richColors
              closeButton
              theme="system"
            />

          </BoardsProvider>
        </PinsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
