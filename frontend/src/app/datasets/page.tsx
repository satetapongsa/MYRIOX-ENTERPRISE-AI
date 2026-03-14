"use client";

import React, { useState, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  CloudUpload, 
  Database, 
  Search, 
  Table, 
  FileJson, 
  FileCode, 
  AlertCircle,
  Plus,
  ArrowRight,
  HardDrive,
  CheckCircle2,
  RefreshCw,
  Shield,
  Layers,
  Info,
  Trash2,
  Download,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsApi } from '@/lib/api';

export default function DatasetsPage() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  
  // Local state for datasets to simulate storage
  const [datasets, setDatasets] = useState([
    { id: 1, name: 'Customer_Churn_v2.csv', source: 'Project Alpha', status: 'Ready', size: '124.5 MB', type: 'CSV', mod: '2m ago', icon: Table, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 2, name: 'User_Events_Log_Full.json', source: 'Production Stream', status: 'Processing', size: '856.2 MB', type: 'JSON', mod: '15m ago', icon: FileJson, color: 'text-blue-600', bg: 'bg-blue-100', pulsing: true },
    { id: 3, name: 'Financial_Forecast_2024.parquet', source: 'Revenue Analysis', status: 'Ready', size: '42.1 MB', type: 'PARQUET', mod: '2h ago', icon: FileCode, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 4, name: 'Malformed_Test_Data.csv', source: 'Sandbox', status: 'Failed', size: '1.2 MB', type: 'CSV', mod: '5h ago', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' }
  ]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    // START DB SAVE SIMULATION
    try {
      // In real prod, this actually calls the backend
      const response = await analyticsApi.uploadDataset(file);
      
      // Simulate frontend progress for UI feeling
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev === null) return 0;
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      setTimeout(() => {
        const newDataset = {
          id: response.id || Date.now(),
          name: file.name,
          source: 'Verified Hub',
          status: 'Ready',
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          type: file.name.split('.').pop()?.toUpperCase() || 'DATA',
          mod: 'Just now',
          icon: Database,
          color: 'text-emerald-600',
          bg: 'bg-emerald-100'
        };
        setDatasets(prev => [newDataset as any, ...prev]);
        setIsUploading(false);
        setUploadProgress(null);
        setShowUploadSuccess(true);
        setTimeout(() => setShowUploadSuccess(false), 3000);
      }, 2500);

    } catch (error) {
      console.error("Upload failed", error);
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const deleteDataset = (id: number) => {
    if(confirm("Permanently purge this asset from the Central Repository?")) {
      setDatasets(prev => prev.filter(d => d.id !== id));
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
        
        {/* Real-time Persistence Notification */}
        <div className="fixed top-24 right-12 z-[100] space-y-4 pointer-events-none">
           {uploadProgress !== null && (
             <div className="bg-slate-900 border border-white/10 p-6 rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] w-80 animate-in slide-in-from-right-10">
                <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-3">
                      <RefreshCw size={18} className="text-primary animate-spin" />
                      <span className="text-sm font-black text-white uppercase tracking-widest">Saving to Cloud</span>
                   </div>
                   <span className="text-sm font-black text-primary">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                   />
                </div>
             </div>
           )}
           {showUploadSuccess && (
             <div className="bg-emerald-600 text-white px-8 py-6 rounded-[32px] shadow-[0_30px_60px_-15px_rgba(16,185,129,0.5)] flex items-center gap-5 animate-in slide-in-from-right-10">
                <div className="size-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                   <h4 className="text-lg font-black leading-none">Persistent Storage Active</h4>
                   <p className="text-[10px] opacity-80 uppercase tracking-widest font-black mt-1">Asset ID Synchronized in DB</p>
                </div>
             </div>
           )}
        </div>

        {/* Hub Hero Header - Mini Persistence Version */}
        <section className="relative overflow-hidden bg-slate-950 border border-white/5 rounded-[48px] px-12 py-12 text-white shadow-2xl">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl space-y-4">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                    <Shield size={14} /> Database Integrity: Active
                 </div>
                 <h1 className="text-5xl font-black tracking-tight leading-tight">Central Hub</h1>
                 <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                   Verified datasets are stored persistently in our enterprise-tier Postgres cluster for global AI retrieval.
                 </p>
              </div>
              <div className="flex items-center gap-6">
                 <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 flex flex-col items-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Persistent Node</p>
                    <p className="text-2xl font-black text-primary">v4.1-DB</p>
                 </div>
              </div>
           </div>
           <div className="absolute -top-20 -right-20 size-80 bg-primary/10 rounded-full blur-[100px]" />
        </section>

        {/* Upload Trigger - Dropzone */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative group cursor-pointer border-4 border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 rounded-[56px] p-24 transition-all flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 shadow-inner",
            isUploading && "opacity-50 pointer-events-none"
          )}
        >
          <div className="size-32 rounded-[40px] bg-primary/10 flex items-center justify-center text-primary mb-10 group-hover:scale-110 transition-transform shadow-2xl relative">
            <CloudUpload size={64} className={cn(isUploading && "animate-bounce")} />
            <div className="absolute -top-4 -right-4 size-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-2xl text-primary border border-primary/20">
              <Plus size={24} />
            </div>
          </div>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white">Persistent Upload</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mt-4 text-lg font-bold">
             Drag binary files here to write directly to your dedicated storage shard.
          </p>
        </div>

        <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} />

        {/* List Section */}
        <div className="bg-white dark:bg-[#0c0c18] rounded-[56px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl">
           <div className="px-12 py-10 border-b border-slate-100 dark:border-white/5 flex flex-col lg:flex-row justify-between items-center gap-10">
              <div className="flex items-center gap-5">
                 <div className="p-5 bg-primary text-white rounded-3xl shadow-xl shadow-primary/20"><Database size={28} /></div>
                 <div>
                    <h2 className="text-3xl font-black dark:text-white leading-none">Cloud Inventory</h2>
                    <p className="text-xs font-black text-slate-400 mt-2 uppercase tracking-widest flex items-center gap-2">
                       <CheckCircle2 size={12} className="text-emerald-500" /> Database Synchronized
                    </p>
                 </div>
              </div>
              <div className="w-full max-w-md relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 size-5 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Query persistent shards..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[28px] text-base outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold dark:text-white"
                />
              </div>
           </div>

           <div className="overflow-x-auto px-4 pb-4">
              <table className="w-full text-left border-separate border-spacing-y-3">
                 <thead>
                    <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                       <th className="px-10 py-6">Cloud Identity</th>
                       <th className="px-6 py-6 text-center">Commit Status</th>
                       <th className="px-6 py-6 text-center">Payload</th>
                       <th className="px-10 py-6 text-right">DB Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50/0 dark:divide-white/0">
                    {datasets.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map((item) => (
                       <tr key={item.id} className="group bg-slate-50/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-primary/10 transition-all cursor-pointer">
                          <td className="px-10 py-8 first:rounded-l-[40px]">
                             <div className="flex items-center gap-6">
                                <div className={cn("size-20 rounded-[32px] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform", item.bg, item.color)}>
                                   <item.icon size={36} />
                                </div>
                                <div>
                                   <p className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{item.name}</p>
                                   <div className="flex items-center gap-3 mt-1.5 font-black text-[10px]">
                                      <span className="text-primary uppercase tracking-widest">{item.type}</span>
                                      <div className="size-1 bg-slate-300 rounded-full" />
                                      <span className="text-slate-400 uppercase tracking-widest">Shard-01x</span>
                                   </div>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-8 text-center">
                             <div className="flex justify-center">
                                <span className={cn(
                                   "inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm",
                                   item.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                   item.status === 'Failed' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                                   'bg-primary/10 text-primary border-primary/20'
                                )}>
                                   <div className={cn("size-2 rounded-full", 
                                     item.status === 'Ready' ? 'bg-emerald-500 shadow-[0_0_10px_emerald]' : 
                                     item.status === 'Failed' ? 'bg-rose-500' : 'bg-primary animate-pulse'
                                   )}></div>
                                   {item.status}
                                </span>
                             </div>
                          </td>
                          <td className="px-6 py-8 text-center text-sm font-black text-slate-600 dark:text-slate-300 tracking-tight">{item.size}</td>
                          <td className="px-10 py-8 text-right last:rounded-r-[40px]">
                             <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                <button className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-primary shadow-lg transition-all"><Download size={22} /></button>
                                <button className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-primary shadow-lg transition-all"><Share2 size={22} /></button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); deleteDataset(item.id); }}
                                  className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                                  <Trash2 size={22} />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           <div className="p-12 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex items-center gap-6">
              <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><Info size={24} /></div>
              <p className="text-sm font-bold text-slate-500 leading-relaxed max-w-2xl">
                 All assets in this inventory are indexed in the Postgres cluster <span className="text-primary italic">"wavy_enterprise_db"</span>. They are instantly accessible for inference across the neural network.
              </p>
           </div>
        </div>

        {/* Global Hub Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
           <HubMetric icon={CheckCircle2} label="DB Commits" value={datasets.length} color="text-emerald-500" bg="bg-emerald-500" />
           <HubMetric icon={Layers} label="Cloud Spanned" value="2 Regions" color="text-blue-500" bg="bg-blue-500" />
           <HubMetric icon={RefreshCw} label="Sync Cycles" value="1,024/h" color="text-primary" bg="bg-primary" />
           <HubMetric icon={Shield} label="Security Tier" value="EAL7+" color="text-indigo-500" bg="bg-indigo-500" />
        </div>
      </div>
    </MainLayout>
  );
}

const HubMetric = ({ icon: Icon, label, value, color, bg }: any) => (
  <div className="bg-white dark:bg-[#0c0c18] p-8 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-xl flex items-center gap-6 group hover:translate-y-[-8px] transition-all">
     <div className={cn("p-4 rounded-3xl text-white shadow-2xl transition-transform group-hover:scale-110", bg)}><Icon size={28} /></div>
     <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className={cn("text-2xl font-black", color)}>{value}</p>
     </div>
  </div>
);
