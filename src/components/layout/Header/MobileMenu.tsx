'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LogIn, LogOut, Sun, Moon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MobileMenuProps } from '@/types/navigation.types';

export function MobileMenu({
  isOpen,
  onClose,
  user,
  navigationItems,
  userMenuItems,
  onSignIn,
  onSignOut,
  theme,
  setTheme,
  isLoading,
  children,
}: MobileMenuProps & { children: React.ReactNode }) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-red-white flex items-center justify-center">
              <Image alt="logo" src="/favicon.png" width={32} height={32} />
            </div>
            <span className="font-bold text-xl">Pinterest</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col space-y-4 mt-6">
          {/* User Info */}
          {user && (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user.image || '/profile.png'}
                  alt={user.name || 'Profile'}
                />
                <AvatarFallback>
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                {user.name && <p className="font-medium">{user.name}</p>}
                {user.email && (
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-2">
            {navigationItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu Items */}
          {user && (
            <div className="space-y-2 border-t pt-4">
              {userMenuItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 border-t pt-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors w-full text-left"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* Sign In/Out */}
            {isLoading ? (
              <div className="p-3 text-center">Loading...</div>
            ) : user ? (
              <button
                onClick={onSignOut}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors w-full text-left text-red-600"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors w-full text-left"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
