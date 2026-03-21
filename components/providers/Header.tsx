'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabase';
import { LogOut, ChefHat, LayoutDashboard, Home } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="header-blur sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl btn-gold flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#1A1A1A] font-serif tracking-tight">
            Culinary<span className="gold-text">Art</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive('/')
                ? 'bg-[#D4AF37]/10 text-[#8B6914] font-semibold'
                : 'text-gray-600 hover:text-[#1A1A1A] hover:bg-gray-100'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/dashboard')
                  ? 'bg-[#D4AF37]/10 text-[#8B6914] font-semibold'
                  : 'text-gray-600 hover:text-[#1A1A1A] hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* User Avatar */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full btn-gold flex items-center justify-center text-white text-xs font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="text-xs text-gray-500 max-w-[120px] truncate hidden md:block">
                  {user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md">
                Login / Register
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
