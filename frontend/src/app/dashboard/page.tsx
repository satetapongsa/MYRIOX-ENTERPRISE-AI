"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Target, 
  Zap, 
  AlertTriangle, 
  RefreshCcw, 
  Download,
  TrendingUp,
  ArrowUpRight,
  Activity,
  History,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';

const data = [
  { time: '00:00', value: 400 },
  { time: '04:00', value: 300 },
  { time: '08:00', value: 600 },
  { time: '12:00', value: 800 },
  { time: '16:00', value: 500 },
  { time: '20:00', value: 900 },
  { time: '23:59', value: 700 },
];

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: stats, refetch } = useQuery({
    queryKey: ['system-stats'],
    queryFn: () => analyticsApi.getStats(),
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
  };

  return (
    <MainLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
               <Activity size={12} /> Live System Status: Operational
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Analytics Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Real-time performance metrics and predictive insights.</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-white dark:bg-primary/10 border border-slate-200 dark:border-primary/20 px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-xl hover:translate-y-[-2px] transition-all group"
          >
            <RefreshCcw size={18} className={isRefreshing ? "animate-spin text-primary" : "group-hover:rotate-180 transition-transform duration-500"} />
            <span>{isRefreshing ? "Updating..." : "Refresh Stats"}</span>
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Model Accuracy" value="98.4%" change="+2.1%" icon={Target} color="text-primary" />
          <MetricCard title="Total Datasets" value={stats?.total_datasets?.toString() || "0"} change="Active" icon={Zap} color="text-amber-500" />
          <MetricCard title="AI Insights" value={stats?.total_insights_generated?.toString() || "0"} change="Generated" icon={Sparkles} color="text-rose-500" trend="up" />
          <MetricCard title="Active Jobs" value={stats?.active_jobs?.toString() || "0"} change="Running" icon={RefreshCcw} color="text-indigo-500" pulsing />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm group">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-lg text-primary"><TrendingUp size={20} /></div>
                 <h3 className="font-bold text-xl text-slate-900 dark:text-white">Predictive Confidence Trends</h3>
              </div>
              <button className="flex items-center gap-2 text-xs font-bold text-primary hover:underline group-hover:translate-x-1 transition-all">
                 <Download size={16} />
                 Export Data
              </button>
            </div>
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4c4ceb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4c4ceb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4c4ceb" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>

          {/* Status Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="font-bold text-xl mb-8 text-slate-900 dark:text-white">Live Prediction Logs</h3>
            <div className="space-y-8">
              <LogRow type="Anomaly" msg="High variance detected in Node_04" time="2m ago" color="bg-rose-500" />
              <LogRow type="Report" msg="Weekly summary generated" time="15m ago" color="bg-primary" />
              <LogRow type="System" msg="Model v2.4 deployment complete" time="1h ago" color="bg-emerald-500" />
              <LogRow type="User" msg="Admin updated workspace settings" time="3h ago" color="bg-indigo-500" />
              <button className="w-full py-4 text-xs font-bold text-slate-500 hover:text-primary transition-colors border-t border-slate-100 dark:border-slate-800 mt-4 uppercase tracking-widest">
                 View All System Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const MetricCard = ({ title, value, change, icon: Icon, color, trend = 'up', pulsing = false }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className={cn(
        "p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-inner",
        pulsing ? "animate-pulse bg-primary/20" : "bg-slate-50 dark:bg-primary/5"
      )}>
        <Icon className={cn(color, "size-6")} />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm",
        trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
      )}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : null}
        {change}
      </div>
    </div>
    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">{title}</h3>
    <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</p>
  </div>
);

const LogRow = ({ type, msg, time, color }: any) => (
  <div className="flex gap-5 group cursor-pointer">
    <div className={cn("size-2.5 mt-1.5 rounded-full shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_8px_currentColor]", color.replace('bg-', 'text-'))}></div>
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
         <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{type}</p>
         <span className="text-[10px] font-bold text-slate-400">• {time}</span>
      </div>
      <p className="text-xs font-medium text-slate-500 leading-relaxed">{msg}</p>
    </div>
  </div>
);
