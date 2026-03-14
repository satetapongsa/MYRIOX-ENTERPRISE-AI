import React, { useState } from 'react';

const Reports = () => {
  const [reports, setReports] = useState([
    { id: 1, name: "Q4 Market Analysis Trends", detail: "3.4 MB • AI-Synthesized", date: "Oct 24, 2023", schedule: "Weekly", status: "Ready", type: "Predictive Model", icon: "picture_as_pdf", iconColor: "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400" },
    { id: 2, name: "User Retention Cohorts", detail: "1.2 MB • CSV Dataset", date: "Oct 23, 2023", schedule: "One-time", status: "Ready", type: "Raw Analytics", icon: "table_view", iconColor: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    { id: 3, name: "Revenue Growth Projections", detail: "Calculating...", date: "Processing", schedule: "Started 2m ago", status: "Running AI", type: "Forecasting", icon: "auto_awesome", iconColor: "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400", pulsing: true },
    { id: 4, name: "Churn Risk Assessment", detail: "2.1 MB • AI-Synthesized", date: "Oct 20, 2023", schedule: "Monthly", status: "Ready", type: "ML Insights", icon: "picture_as_pdf", iconColor: "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400" }
  ]);
  const [search, setSearch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      const newReport = {
        id: Date.now(),
        name: `Custom Analysis ${reports.length + 1}`,
        detail: "Calculating...",
        date: "Processing",
        schedule: "Started just now",
        status: "Running AI",
        type: "Custom Model",
        icon: "auto_awesome",
        iconColor: "bg-primary/10 text-primary",
        pulsing: true
      };
      setReports([newReport, ...reports]);
      setIsGenerating(false);

      // Finish "calculating" after 5 seconds
      setTimeout(() => {
        setReports(prev => prev.map(r => r.id === newReport.id ? { ...r, status: 'Ready', date: 'Just now', detail: '0.8 MB • Generated', pulsing: false } : r));
      }, 5000);
    }, 800);
  };

  const filteredReports = reports.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-600">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Analytics Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage, schedule and export your AI-generated data insights.</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[20px] ${isGenerating ? 'animate-spin' : ''}`}>
            {isGenerating ? 'refresh' : 'add'}
          </span>
          {isGenerating ? 'Simulating...' : 'Generate New Report'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportStat icon="assessment" label="Total Reports" value={reports.length} color="text-primary" bg="bg-primary/10" />
        <ReportStat icon="schedule" label="Scheduled Tasks" value="12" color="text-emerald-500" bg="bg-emerald-500/10" />
        <ReportStat icon="storage" label="Storage Used" value="4.2 GB" color="text-amber-500" bg="bg-amber-500/10" />
      </div>

      {/* Reports Table Container */}
      <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-800/10">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input 
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" 
              placeholder="Search reports..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Filters
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg">sort</span>
              Sort
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5">Report Name & Details</th>
                <th className="px-6 py-5">Generation Date</th>
                <th className="px-6 py-5">Process Status</th>
                <th className="px-6 py-5">Category Type</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredReports.map((row) => (
                <ReportRow key={row.id} {...row} />
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-10 text-center text-slate-500 font-bold">No reports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/20 dark:bg-transparent">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Showing {filteredReports.length} reports</p>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm font-bold border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 text-sm font-bold border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all shadow-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportStat = ({ icon, label, value, color, bg }) => (
  <div className="bg-white dark:bg-slate-900/50 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all">
    <div className="flex items-center gap-6">
      <div className={`p-4 ${bg} rounded-2xl shadow-inner`}>
        <span className={`material-symbols-outlined ${color} text-[28px]`}>{icon}</span>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

const ReportRow = ({ name, detail, date, schedule, status, type, icon, iconColor, pulsing = false }) => (
  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group cursor-pointer border-l-2 border-transparent hover:border-primary">
    <td className="px-8 py-5">
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl ${iconColor} flex items-center justify-center shadow-sm`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <div>
          <div className="font-bold text-slate-900 dark:text-white leading-tight">{name}</div>
          <div className="text-[11px] font-bold text-slate-500 mt-0.5">{detail}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-5">
      <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{date}</div>
      <div className="text-[11px] font-bold text-slate-400 italic mt-0.5">{schedule}</div>
    </td>
    <td className="px-6 py-5">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
        status === 'Ready' 
          ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' 
          : 'bg-primary/10 text-primary'
      } ${pulsing ? 'animate-pulse' : ''}`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-5">
      <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{type}</span>
    </td>
    <td className="px-8 py-5 text-right">
      <div className="flex items-center justify-end gap-1">
        <button onClick={(e) => {e.stopPropagation(); alert(`Previewing ${name}...`)}} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Preview"><span className="material-symbols-outlined text-lg">visibility</span></button>
        <button onClick={(e) => {e.stopPropagation(); alert(`Initiating download for ${name}...`)}} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Download"><span className="material-symbols-outlined text-lg">download</span></button>
        <button onClick={(e) => {e.stopPropagation(); alert(`Opening scheduler for ${name}...`)}} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Schedule"><span className="material-symbols-outlined text-lg">calendar_today</span></button>
      </div>
    </td>
  </tr>
);

export default Reports;
