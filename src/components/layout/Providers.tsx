'use client';

import { ThemeProvider } from 'next-themes';
import { PinsProvider } from '@/contexts/PinsContext';
import { BoardsProvider } from '@/contexts/BoardsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import { NotificationProvider } from '@/contexts/NotificationContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NotificationProvider>
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
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
