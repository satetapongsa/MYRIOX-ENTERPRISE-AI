"use client";

import React from 'react';
import { Search, Bell, Moon, Sun, ChevronDown, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Header = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <header className="h-24 border-b border-slate-200 dark:border-primary/20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-10">
      <div className="flex-1"></div>
      <div className="flex items-center gap-6">
        <div className="size-11 rounded-xl bg-slate-50 dark:bg-primary/5 border border-slate-100 dark:border-primary/10"></div>
      </div>
    </header>
  );

  const isDark = resolvedTheme === 'dark';

  return (
    <header className="h-24 border-b border-slate-200 dark:border-primary/20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-10">
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Search for datasets, insights or reports..." 
          className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-primary/5 border border-slate-100 dark:border-primary/10 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="size-11 rounded-xl bg-slate-50 dark:bg-primary/5 border border-slate-100 dark:border-primary/10 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-primary/20 hover:shadow-lg transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
          </button>
          <button 
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="size-11 rounded-xl bg-slate-50 dark:bg-primary/5 border border-slate-100 dark:border-primary/10 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-primary/20 hover:shadow-lg transition-all"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-primary/20"></div>

        <Link href="/settings" className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-primary/5 transition-all group">
          <div className="size-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 shadow-lg shadow-primary/20 overflow-hidden flex items-center justify-center text-white font-bold border-2 border-white dark:border-primary/20 group-hover:scale-105 transition-transform">
             WV
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-bold leading-tight dark:text-white group-hover:text-primary transition-colors">เวฟนิกา</p>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">CEO Account</p>
          </div>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-primary group-hover:translate-y-0.5 transition-all" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
