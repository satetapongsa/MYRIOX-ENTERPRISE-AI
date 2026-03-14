import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('admins');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate authentication check
    setTimeout(() => {
      if (email === 'admin' && password === 'admins') {
        onLogin();
      } else {
        setError('Invalid username or password. Use admin / admins');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display dark">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-primary/20 px-6 md:px-10 py-4 bg-background-light dark:bg-background-dark">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="size-8 text-primary">
                <Sparkles size={32} />
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-tight">Analytica AI</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-slate-500 dark:text-slate-400 text-sm">Don't have an account?</span>
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-bold">
                Sign Up
              </button>
            </div>
          </header>
          
          <main className="flex-1 flex items-center justify-center p-6 bg-background-light dark:bg-background-dark">
            <div className="w-full max-w-[440px] flex flex-col gap-8 shake-in">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base">Enter your credentials to access your dashboard</p>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg animate-in fade-in slide-in-from-top-2">
                    {error}
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
                  <input 
                    className="w-full rounded-lg border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    placeholder="Enter username" 
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                    <a className="text-sm font-semibold text-primary hover:underline" href="#">Forgot password?</a>
                  </div>
                  <div className="relative flex items-center text-slate-900 dark:text-white">
                    <input 
                      className="w-full rounded-lg border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input className="rounded border-slate-300 dark:border-primary/30 bg-white dark:bg-primary/10 text-primary focus:ring-primary" id="remember" type="checkbox"/>
                  <label className="text-sm text-slate-600 dark:text-slate-400" htmlFor="remember">Keep me signed in for 30 days</label>
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-primary/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background-light dark:bg-background-dark px-2 text-slate-500">Or continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-primary/20 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors">
                  <img alt="" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvpVEUjRbbhmkyERfbyaT5LQRdZcqTQ--SL70GqIjWvAVVbYxHJLx2l-Uyfr_PV5W5DB4t4coGqp9Df7Dp1F0hpVkkUlXlRAw1KsczUszvIdkuV8K67GiULLi8Ma-biFLRq2zF-tOR-sJXuGwjS-PD7Ges9lU74XcdWnlfp4VuVydL2mahJXcwB5CDcXupixnK4VjDiraV9UJF8UwHLtUdiy1_T81j_Y70mNGGU3kDoVrln5gHPo6fNhc202Bqu67d4M68S4EZGDx9"/>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-primary/20 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors">
                  <img alt="" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASTW244B9RPwukMSIrntZajRjAO1k1wGTbm6CKhpvZ9T2I3ykEPpFDfUbm2EMFHt07WaCyHKkBox9xUO6dRHgXB4dCnyVrfQ5mQL0zijv_-mQ1t8fmEs3gVrqn9pgD5cvI2e0rUbfQVA8gmu9Yafyz5SMUWvJ29WPFMqd57M8eZ7i7tYY10_2tPMhqM8frQYQVjosCezVUaRAjK-cStzX1NjnbVcF-ejDk0YKgthyDkYi-aOf5PIq0Y5GJ_WY5pUcKLiS79AhZJc5s"/>
                  SSO
                </button>
              </div>
            </div>
          </main>
          
          <footer className="p-6 text-center text-slate-500 dark:text-slate-600 text-xs bg-background-light dark:bg-background-dark">
            © 2024 Analytica AI Corp. All rights reserved. <br className="md:hidden"/>
            <a className="hover:text-primary mx-2" href="#">Privacy Policy</a> • 
            <a className="hover:text-primary mx-2" href="#">Terms of Service</a>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
