"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Database, 
  Zap, 
  FileText, 
  Settings, 
  Sparkles,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Zap, label: 'Neural Chat', href: '/models' },
  { icon: Database, label: 'Datasets', href: '/datasets' },
  { icon: FileText, label: 'Reports', href: '/reports' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Clear any auth data if exists
    localStorage.removeItem('admin_auth');
    router.push('/login');
  };

  return (
    <aside className="w-72 border-r border-slate-200 dark:border-primary/20 flex flex-col h-screen bg-white dark:bg-background-dark sticky top-0 transition-all duration-300">
      <div className="p-8">
        <div className="flex items-center gap-4 px-2 mb-10 group cursor-pointer relative">
          {/* Animated Glow Background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-400 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          {/* The Main Logo Icon */}
          <div className="relative size-12 bg-slate-950 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
             <svg viewBox="0 0 24 24" className="size-7 text-white relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" className="opacity-30" />
                <circle cx="12" cy="12" r="3" className="text-primary fill-primary/20" />
                <path d="M12 5V3m0 18v-2M5 12H3m18 0h-2" className="animate-pulse" />
                <path d="M7 12c0 2.8 2.2 5 5 5s5-2.2 5-5-2.2-5-5-5-5 2.2-5 5Z" className="animate-spin-slow origin-center" style={{ animationDuration: '8s' }} />
             </svg>
             {/* Dynamic Wave Overlay */}
             <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
          </div>

          <div className="flex flex-col relative">
            <h1 className="text-2xl font-black tracking-tighter text-slate-800 dark:text-white leading-none mb-1">
              MYRIOX
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">
                ENTERPRISE AI
              </span>
              <div className="size-1 bg-primary rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 px-4"> Main Menu </div>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group",
                isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/20 font-bold" 
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-primary/10 hover:text-primary"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
              <span className="text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <Link href="/settings" className="block bg-slate-50 dark:bg-primary/5 rounded-2xl p-4 border border-slate-100 dark:border-primary/10 mb-4 hover:shadow-lg hover:border-primary/30 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform"> MX </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-bold truncate dark:text-white group-hover:text-primary transition-colors">เวฟนิกา</p>
               <p className="text-xs text-slate-500 truncate">CEO & Founder</p>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-primary/10 rounded-full overflow-hidden">
             <div className="h-full bg-primary w-3/4 rounded-full shadow-lg shadow-primary/20"></div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">7.5GB / 10GB Used</p>
        </Link>
        
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all group"
        >
          <LogOut size={20} />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
