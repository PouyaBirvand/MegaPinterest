'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Search, Plus, Bell, User, Moon, Sun, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { usePinsActions } from '../../hooks/usePinsActions';
import Image from 'next/image';

export function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const { theme, setTheme } = useTheme();
    const { searchForPins } = usePinsActions();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            searchForPins(searchQuery.trim(), 1);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-red-white flex items-center justify-center">
                        <Image alt='logo' src='/favicon.png' width={32} height={32} />
                    </div>
                    <span className="font-bold text-xl hidden sm:block">Pinterest</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-1">
                    <Button variant="ghost" asChild>
                        <Link href="/">Home</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/explore">Explore</Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/create">Create</Link>
                    </Button>
                </nav>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search for ideas"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-full"
                        />
                    </div>
                </form>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>

                    {/* Notifications */}
                    <Button variant="ghost" size="icon">
                        <Bell className="h-4 w-4" />
                    </Button>

                    {/* Create Pin */}
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/pin-builder">
                            <Plus className="h-4 w-4" />
                        </Link>
                    </Button>

                    {/* Profile Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/profile.png" alt="Profile" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuItem asChild>
                                <Link href="/profile">Your profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/boards">Your boards</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/settings">Settings</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile Menu */}
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}