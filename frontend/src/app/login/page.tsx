"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Eye, EyeOff, Lock, Mail, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate Login
    setTimeout(() => {
      if (email === 'admin' && password === 'admins') {
        router.push('/dashboard');
      } else {
        alert("Invalid credentials. Try admin / admins");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 font-display overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] size-96 bg-primary/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] size-96 bg-primary/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-[480px] space-y-10 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-4">
           <div className="size-16 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex items-center justify-center text-primary mx-auto border-4 border-white dark:border-primary/20 hover:scale-110 transition-transform duration-500">
              <Sparkles size={32} className="animate-pulse" />
           </div>
           <h1 className="text-4xl font-extrabold tracking-tight dark:text-white">WAVY ANALYTNICA</h1>
           <p className="text-slate-500 dark:text-slate-400 font-medium">Enterprise intelligence for modern teams.</p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-primary/10 rounded-[40px] p-10 shadow-2xl">
           <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Corporate Email</label>
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      placeholder="alex.rivera@company.com"
                      className="w-full bg-slate-50 dark:bg-background-dark/50 border border-slate-100 dark:border-primary/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all dark:text-white font-bold"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center ml-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Secret Key</label>
                    <button type="button" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Forgot Key?</button>
                 </div>
                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="w-full bg-slate-50 dark:bg-background-dark/50 border border-slate-100 dark:border-primary/10 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all dark:text-white font-bold"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                <span>{isLoading ? 'Decrypting Access...' : 'Authenticate'}</span>
                {isLoading ? <Sparkles size={20} className="animate-spin" /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </button>
           </form>

           <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-slate-100 dark:border-primary/5"></div>
              </div>
              <div className="relative flex justify-center">
                 <span className="bg-white dark:bg-slate-900 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or Secure Logwith</span>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 rounded-2xl border border-slate-200 dark:border-primary/10 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all text-sm font-bold dark:text-white">
                 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvpVEUjRbbhmkyERfbyaT5LQRdZcqTQ--SL70GqIjWvAVVbYxHJLx2l-Uyfr_PV5W5DB4t4coGqp9Df7Dp1F0hpVkkUlXlRAw1KsczUszvIdkuV8K67GiULLi8Ma-biFLRq2zF-tOR-sJXuGwjS-PD7Ges9lU74XcdWnlfp4VuVydL2mahJXcwB5CDcXupixnK4VjDiraV9UJF8UwHLtUdiy1_T81j_Y70mNGGU3kDoVrln5gHPo6fNhc202Bqu67d4M68S4EZGDx9" alt="" className="size-5" />
                 SSO Login
              </button>
              <button className="flex items-center justify-center gap-3 py-3 rounded-2xl border border-slate-200 dark:border-primary/10 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all text-sm font-bold dark:text-white">
                 <Github size={20} />
                 ID Vault
              </button>
           </div>
        </div>
        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           Protected by Wavy Shield v2.4 <br />
           Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
