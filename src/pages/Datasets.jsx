import React, { useState, useRef } from 'react';

const Datasets = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [datasets, setDatasets] = useState([
    { id: 1, name: 'Customer_Churn_v2.csv', source: 'Project Alpha', status: 'Ready', size: '124.5 MB', type: 'CSV', mod: '2m ago', icon: 'table_chart', iconColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30' },
    { id: 2, name: 'User_Events_Log_Full.json', source: 'Production Stream', status: 'Processing', size: '856.2 MB', type: 'JSON', mod: '15m ago', icon: 'description', iconColor: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30', pulsing: true },
    { id: 3, name: 'Financial_Forecast_2024.parquet', source: 'Revenue Analysis', status: 'Ready', size: '42.1 MB', type: 'PARQUET', mod: '2h ago', icon: 'data_object', iconColor: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30' },
    { id: 4, name: 'Malformed_Test_Data.csv', source: 'Sandbox', status: 'Failed', size: '1.2 MB', type: 'CSV', mod: '5h ago', icon: 'warning', iconColor: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30' }
  ]);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newDataset = {
        id: Date.now(),
        name: file.name,
        source: 'Manual Upload',
        status: 'Ready',
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: file.name.split('.').pop().toUpperCase(),
        mod: 'Just now',
        icon: 'insert_drive_file',
        iconColor: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
      };
      setDatasets([newDataset, ...datasets]);
      setIsUploading(false);
    }, 2000);
  };

  const filteredDatasets = datasets.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-600">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Datasets</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and organize your data sources for AI model training.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
            Documentation
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm font-bold rounded-lg bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Project
          </button>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleUpload}
      />

      {/* Upload Section */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary bg-white dark:bg-slate-900/40 rounded-2xl p-16 transition-all flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-inner">
          <span className={`material-symbols-outlined text-[40px] ${isUploading ? 'animate-bounce' : ''}`}>
            {isUploading ? 'sync' : 'cloud_upload'}
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {isUploading ? 'Uploading and analyzing...' : 'Upload new dataset'}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mt-3 leading-relaxed">
          Drag and drop your CSV, JSON, or Parquet files here, or click to browse from your computer. Our AI will automatically detect headers and types.
        </p>
        <button className="mt-8 px-8 py-3 bg-slate-900 dark:bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-primary/10">
          {isUploading ? 'Please wait...' : 'Select Files'}
        </button>
        <p className="mt-6 text-xs font-medium text-slate-400 uppercase tracking-widest">Max file size: 2GB per dataset</p>
      </div>

      {/* Dataset List Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 dark:bg-slate-800/20 gap-4">
          <h2 className="font-bold text-slate-900 dark:text-white shrink-0">Recent Uploads</h2>
          <div className="w-full max-w-xs relative">
             <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
             <input 
               type="text" 
               placeholder="Filter datasets..." 
               className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5 font-bold">Name & Source</th>
                <th className="px-6 py-5 font-bold">Status</th>
                <th className="px-6 py-5 font-bold">Size</th>
                <th className="px-6 py-5 font-bold">Type</th>
                <th className="px-8 py-5 font-bold text-right">Modified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDatasets.length > 0 ? filteredDatasets.map((row) => (
                <DatasetRow key={row.id} {...row} />
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-10 text-center text-slate-500 font-medium italic">No datasets found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/20 dark:bg-transparent">
          <p className="text-xs font-semibold text-slate-500">Showing {filteredDatasets.length} of {datasets.length} datasets</p>
          <div className="flex gap-3">
            <button className="px-4 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all">Previous</button>
            <button className="px-4 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all">Next</button>
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <FooterMetricCard 
          icon="storage" 
          color="text-primary" 
          title="Storage Used" 
          value="1.02 GB" 
          total=" / 10 GB" 
          progress="10.2%" 
        />
        <FooterMetricCard 
          icon="check_circle" 
          color="text-emerald-500" 
          title="Active Datasets" 
          value={datasets.filter(d => d.status === 'Ready').length} 
          subtitle="Ready for model training" 
        />
        <FooterMetricCard 
          icon="auto_awesome" 
          color="text-indigo-500" 
          title="AI Suggestions" 
          value="4" 
          subtitle="New insights available" 
        />
      </div>
    </div>
  );
};

const DatasetRow = ({ name, source, status, size, type, mod, icon, iconColor, pulsing = false }) => (
  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all group cursor-pointer border-l-2 border-transparent hover:border-primary">
    <td className="px-8 py-5">
      <div className="flex items-center gap-4">
        <div className={`size-11 rounded-xl ${iconColor} flex items-center justify-center shadow-sm`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white leading-tight">{name}</p>
          <p className="text-xs font-medium text-slate-500">{source}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-5">
      <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        status === 'Ready' 
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
          : status === 'Failed'
          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      }`}>
        <span className={`size-1.5 rounded-full ${
          status === 'Ready' ? 'bg-emerald-500' : status === 'Failed' ? 'bg-rose-500' : 'bg-amber-500'
        } ${pulsing ? 'animate-pulse' : ''}`}></span>
        {status}
      </span>
    </td>
    <td className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-400">{size}</td>
    <td className="px-6 py-5">
      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-bold text-[10px] text-slate-500 dark:text-slate-400">{type}</span>
    </td>
    <td className="px-8 py-5 text-sm font-medium text-slate-500 dark:text-slate-400 text-right">{mod}</td>
  </tr>
);

const FooterMetricCard = ({ icon, color, title, value, total, progress, subtitle }) => (
  <div className="p-6 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:translate-y-[-2px] transition-all">
    <div className="flex items-center gap-3 mb-3">
      <span className={`material-symbols-outlined ${color}`}>{icon}</span>
      <span className="font-bold text-xs uppercase tracking-widest text-slate-500">{title}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p>
      {total && <span className="text-sm font-bold text-slate-400">{total}</span>}
    </div>
    {progress && (
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
        <div className="bg-primary h-full rounded-full shadow-lg shadow-primary/20 transition-all duration-1000" style={{ width: progress }}></div>
      </div>
    )}
    {subtitle && <p className="text-xs font-bold text-slate-500 mt-4 uppercase tracking-tight">{subtitle}</p>}
  </div>
);

export default Datasets;
