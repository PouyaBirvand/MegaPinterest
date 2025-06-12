'use client';

import { Search, Menu, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Components
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { SearchBar, MobileSearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { NotificationButton } from '../Header/NotificationButton';

// Hooks
import { useHeaderLogic } from '@/hooks/useHeaderLogic';
import { useNavigationItems } from '@/hooks/useNavigationItems';

export function Header() {
  const {
    searchQuery,
    isMobileMenuOpen,
    isSearchOpen,
    theme,
    user,
    isLoading,
    handleSearch,
    handleSearchChange,
    handleSignIn,
    handleSignOut,
    toggleTheme,
    closeMobileMenu,
    toggleSearch,
    closeSearch,
    setTheme,
  } = useHeaderLogic();

  const { navigationItems, userMenuItems } = useNavigationItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <Navigation
          items={navigationItems}
          className="hidden lg:flex items-center space-x-1"
        />

        {/* Desktop Search */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSubmit={handleSearch}
          className="hidden md:flex mx-4"
        />

        {/* Mobile Search Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          {isLoading ? (
            <div className="text-sm">Loading...</div>
          ) : user ? (
            <>
              {/* Notifications */}
              <NotificationButton />

              {/* User Menu */}
              <UserMenu
                user={user}
                onSignOut={handleSignOut}
                userMenuItems={userMenuItems}
              />
            </>
          ) : (
            <Button onClick={handleSignIn}>
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          user={user}
          navigationItems={navigationItems}
          userMenuItems={userMenuItems}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          theme={theme}
          setTheme={setTheme}
          isLoading={isLoading}
        >
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </MobileMenu>
      </div>

      {/* Mobile Search Bar */}
      <MobileSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSubmit={handleSearch}
        isOpen={isSearchOpen}
        onClose={closeSearch}
      />
    </header>
  );
}
