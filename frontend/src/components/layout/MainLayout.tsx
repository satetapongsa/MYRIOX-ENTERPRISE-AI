"use client";

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex bg-background-light dark:bg-background-dark min-h-screen font-display">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-10 py-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        <footer className="px-10 py-6 border-t border-slate-200 dark:border-primary/10 flex flex-col md:flex-row justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
           <div>© 2024 Analytica AI Enterprise. All rights reserved.</div>
           <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-primary transition-colors">Documentation</a>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
