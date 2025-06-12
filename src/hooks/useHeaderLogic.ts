'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { usePinsActions } from '@/hooks/usePinsActions';

export function useHeaderLogic() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { theme, setTheme } = useTheme();
  const { searchForPins } = usePinsActions();
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        searchForPins(searchQuery.trim(), 1);
        setIsSearchOpen(false);
      }
    },
    [searchQuery, searchForPins]
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSignIn = useCallback(() => {
    router.push('/auth/signin');
    setIsMobileMenuOpen(false);
  }, [router]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [signOut]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => !prev);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  return {
    // State
    searchQuery,
    isMobileMenuOpen,
    isSearchOpen,
    theme,
    user,
    isLoading,

    // Actions
    handleSearch,
    handleSearchChange,
    handleSignIn,
    handleSignOut,
    toggleTheme,
    closeMobileMenu,
    toggleMobileMenu,
    toggleSearch,
    closeSearch,
    setTheme,
  };
}
