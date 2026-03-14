import React, { useState } from 'react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('Last 24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTimeChange = (range) => {
    setTimeRange(range);
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Analytics Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Real-time performance metrics and predictive insights.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {['Last 24h', 'Last 7d', 'Last 30d'].map((range) => (
            <button 
              key={range}
              onClick={() => handleTimeChange(range)}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                timeRange === range 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isRefreshing ? 'opacity-40' : 'opacity-100'}`}>
        <MetricCard title="Model Accuracy" value="98.4%" change="+2.1%" icon="target" color="text-primary" />
        <MetricCard title="Daily Predictions" value="1.2M" change="+14%" icon="bolt" color="text-amber-500" />
        <MetricCard title="Error Rate" value="0.04%" change="-18%" icon="warning" color="text-rose-500" trend="down" />
        <MetricCard title="Active Jobs" value="24" change="Running" icon="sync" color="text-indigo-500" pulsing />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Predictive Confidence Trends</h3>
            <button onClick={() => alert("Exporting current chart data...")} className="flex items-center gap-2 text-xs font-bold text-primary hover:underline hover:opacity-80 transition-all">
               <span className="material-symbols-outlined text-[18px]">download</span>
               Export Data
            </button>
          </div>
          <div className="h-[320px] w-full relative group">
             {isRefreshing && (
               <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl">
                  <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
               </div>
             )}
             <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                <defs>
                   <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4c4ceb" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#4c4ceb" stopOpacity="0" />
                   </linearGradient>
                </defs>
                <path d="M0,250 Q100,220 200,240 T400,100 T600,150 T800,80 T1000,120" fill="none" stroke="#4c4ceb" strokeWidth="4" className="animate-in fade-in duration-1000" />
                <path d="M0,250 Q100,220 200,240 T400,100 T600,150 T800,80 T1000,120 V300 H0 Z" fill="url(#chartGradient)" />
                {/* Mock data points */}
                <circle cx="400" cy="100" r="6" fill="#4c4ceb" className="animate-pulse shadow-lg" />
             </svg>
             <div className="flex justify-between mt-6 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>23:59</span>
             </div>
          </div>
        </div>

        {/* Status Feed */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <h3 className="font-bold text-lg mb-8 text-slate-900 dark:text-white">Live Prediction Logs</h3>
          <div className="space-y-6">
            <LogRow type="Anomaly" msg="High variance detected in Node_04" time="2m ago" color="text-rose-500" />
            <LogRow type="Report" msg="Weekly summary generated" time="15m ago" color="text-primary" />
            <LogRow type="System" msg="Model v2.4 deployment complete" time="1h ago" color="text-emerald-500" />
            <LogRow type="User" msg="Admin updated workspace settings" time="3h ago" color="text-indigo-500" />
            <button className="w-full py-3 text-xs font-bold text-slate-500 hover:text-primary transition-colors border-t border-slate-100 dark:border-slate-800 mt-4">
               View All Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, icon, color, trend = 'up', pulsing = false }) => (
  <div className="bg-white dark:bg-slate-900 p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform ${pulsing ? 'animate-pulse' : ''}`}>
        <span className={`material-symbols-outlined ${color} text-[22px]`}>{icon}</span>
      </div>
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
        {change}
      </span>
    </div>
    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</p>
  </div>
);

const LogRow = ({ type, msg, time, color }) => (
  <div className="flex gap-4 group cursor-pointer">
    <div className={`size-2 mt-1.5 rounded-full ${color.replace('text', 'bg')} shrink-0 group-hover:scale-150 transition-transform`}></div>
    <div className="space-y-1">
      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{type}</p>
      <p className="text-xs font-medium text-slate-500 leading-relaxed">{msg}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{time}</p>
    </div>
  </div>
);

export default Dashboard;
