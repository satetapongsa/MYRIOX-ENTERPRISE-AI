import React, { useState } from 'react';

const AIModels = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAskAI = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { role: 'user', content: query };
    setChatHistory([...chatHistory, userMsg]);
    setQuery('');
    setIsAnalyzing(true);

    // Simulate AI Response
    setTimeout(() => {
      const aiMsg = { 
        role: 'ai', 
        content: `Based on your recent data, I've detected a ${Math.floor(Math.random() * 15) + 5}% potential optimization in your ${query.includes('revenue') ? 'revenue stream' : 'resource allocation'}. Would you like a detailed breakdown?` 
      };
      setChatHistory(prev => [...prev, aiMsg]);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Search/Query Section */}
      <section className="mb-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl p-3 shadow-xl shadow-primary/5 focus-within:ring-2 focus-within:ring-primary/40 transition-all group">
            <div className="flex gap-4 items-start p-3">
              <div className="mt-2 text-primary group-focus-within:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[28px]">magic_button</span>
              </div>
              <textarea 
                className="w-full bg-transparent border-none focus:ring-0 text-lg md:text-xl placeholder:text-slate-400 dark:placeholder:text-slate-600 py-2 resize-none h-32 leading-relaxed text-slate-900 dark:text-slate-100 outline-none" 
                placeholder="What would you like to know about your data today? Ask anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAskAI(e)}
              ></textarea>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-primary/10 pt-3 px-3 pb-2">
              <div className="flex gap-1">
                <button className="p-2.5 text-slate-400 hover:text-primary dark:hover:text-primary-light transition-all rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <button className="p-2.5 text-slate-400 hover:text-primary transition-all rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined">insert_chart</span>
                </button>
              </div>
              <button 
                onClick={handleAskAI}
                disabled={isAnalyzing || !query.trim()}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/30 active:scale-95 disabled:opacity-50"
              >
                <span>{isAnalyzing ? 'Thinking...' : 'Ask AI'}</span>
                <span className={`material-symbols-outlined text-[18px] ${isAnalyzing ? 'animate-spin' : ''}`}>
                  {isAnalyzing ? 'refresh' : 'send'}
                </span>
              </button>
            </div>
          </div>

          {/* Chat History Simulation */}
          {chatHistory.length > 0 && (
            <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white border-primary/20' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isAnalyzing && (
                <div className="flex justify-start">
                   <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl flex gap-2 items-center">
                      <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="size-1.5 bg-primary rounded-full animate-bounce"></div>
                   </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mr-2">Try asking:</span>
            <SuggestionButton text="Summarize last week's churn" onClick={() => setQuery("Summarize last week's churn")} />
            <SuggestionButton text="Compare Q3 revenue to Q2" onClick={() => setQuery("Compare Q3 revenue to Q2")} />
            <SuggestionButton text="Top performing regions" onClick={() => setQuery("Top performing regions")} />
          </div>
        </div>
      </section>

      {/* Automated Insights Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-primary text-[24px]">auto_awesome</span>
            Latest Automated Insights
          </h2>
          <button 
            onClick={handleRefresh}
            className="text-sm font-bold text-primary hover:underline hover:opacity-80 transition-all flex items-center gap-1"
          >
            <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin' : ''}`}>refresh</span>
            {isRefreshing ? 'Analyzing...' : 'Refresh analysis'}
          </button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-500 ${isRefreshing ? 'opacity-40' : 'opacity-100'}`}>
          <InsightCard 
             icon="trending_up"
             color="bg-green-100 dark:bg-green-500/10 text-green-600"
             category="Retention"
             title="User retention increased by 12.4%"
             desc="The new onboarding sequence launched last Tuesday has correlated with a significant lift in Day-7 retention across all segments."
             chartType="line"
          />
          <InsightCard 
             icon="group"
             color="bg-blue-100 dark:bg-blue-500/10 text-blue-600"
             category="Market Segment"
             title="Enterprise segment shows strong growth"
             desc="Subscription value for accounts > 50 seats has grown by 8% WoW. Upsell opportunities identified in 14 accounts."
             chartType="bar"
          />
          <InsightCard 
             icon="warning"
             color="bg-amber-100 dark:bg-amber-500/10 text-amber-600"
             category="Anomaly"
             title="Checkout drop-off in Mobile Safari"
             desc="Unusual 15% drop in completion rates detected for Safari users on iOS 17. Possible UI glitch in the payment step."
             chartType="anomaly"
             strokeColor="#f59e0b"
          />
          <InsightCard 
             icon="payments"
             color="bg-purple-100 dark:bg-purple-500/10 text-purple-600"
             category="Revenue"
             title="Projected MRR to hit $2.4M next month"
             desc="Current trend lines suggest a 4.2% beat of your quarterly forecast if the expansion rate remains stable."
             chartType="revenue"
          />
          <InsightCard 
             icon="speed"
             color="bg-primary/10 text-primary"
             category="Performance"
             title="API Latency improved by 40ms"
             desc="After the v2.4 deployment, global response times have stabilized. User satisfaction scores (CSAT) are trending up."
             chartType="latency"
          />
          
          <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl p-8 border-dashed flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/50 hover:bg-primary/10 transition-all">
            <div className="p-5 rounded-full bg-slate-100 dark:bg-primary/10 mb-5 group-hover:bg-primary/20 transition-all group-hover:scale-110">
              <span className="material-symbols-outlined text-primary text-[32px]">add</span>
            </div>
            <p className="font-bold text-slate-900 dark:text-white">Generate custom report</p>
            <p className="text-xs font-medium text-slate-500 mt-2 max-w-[180px]">Connect new data sources or define new targets</p>
          </div>
        </div>
      </section>

      {/* Forecasting Section */}
      <section className="bg-primary/5 rounded-3xl p-10 border border-primary/10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-all"></div>
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
               <span className="material-symbols-outlined text-xs">auto_fix_high</span> New Engine
            </div>
            <h2 className="text-3xl font-extrabold mb-6 text-slate-900 dark:text-white tracking-tight">Smart Data Forecasting</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-8">
              AI Insights has detected a seasonal pattern in your weekend traffic. We recommend adjusting your server scaling policies for the upcoming holiday period to optimize costs.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => alert("Forecasting engine initialized.")}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all"
              >
                View Forecast
              </button>
              <button className="bg-white dark:bg-transparent border border-slate-200 dark:border-primary/30 px-8 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-primary/10 transition-all">Dismiss</button>
            </div>
          </div>
          <div className="w-full md:w-[320px] bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Predicted Server Load</span>
            </div>
            <div className="space-y-5">
              <ProgressBar width="w-3/4" label="Weekend Peak" />
              <ProgressBar width="w-1/2" label="Morning Spike" />
              <ProgressBar width="w-2/3" label="Average Nightly" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SuggestionButton = ({ text, onClick }) => (
  <button 
    onClick={onClick}
    className="text-xs px-4 py-1.5 bg-slate-100 dark:bg-primary/10 rounded-full hover:bg-primary/20 text-slate-600 dark:text-slate-300 border border-transparent hover:border-primary/30 transition-all font-medium"
  >
    {text}
  </button>
);

const InsightCard = ({ icon, color, category, title, desc, chartType, strokeColor = "#4c4ceb" }) => (
  <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-2xl p-6 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col h-full group cursor-pointer">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-2.5 ${color} rounded-xl shadow-sm group-hover:scale-110 transition-transform`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">{category}</span>
    </div>
    <h3 className="font-bold text-lg mb-3 text-slate-900 dark:text-white leading-tight">{title}</h3>
    <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 flex-1 leading-relaxed">
      {desc}
    </p>
    <div className="mt-auto pt-4">
      <div className="h-16 w-full opacity-60 group-hover:opacity-100 transition-opacity">
        {chartType === 'line' && (
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
            <path d="M0,25 Q15,22 25,28 T50,15 T75,10 T100,5" fill="none" stroke={strokeColor} strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
            <path d="M0,25 Q15,22 25,28 T50,15 T75,10 T100,5 L100,30 L0,30 Z" fill={strokeColor} opacity="0.1"></path>
          </svg>
        )}
        {chartType === 'bar' && (
           <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d="M0,20 L10,22 L20,18 L30,25 L40,15 L50,18 L60,10 L70,12 L80,5 L90,8 L100,2" fill="none" stroke={strokeColor} strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
           </svg>
        )}
        {chartType === 'anomaly' && (
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
            <path d="M0,5 L20,7 L40,8 L60,25 L80,26 L100,28" fill="none" stroke={strokeColor} strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
          </svg>
        )}
        {chartType === 'revenue' && (
           <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
              {[0, 12, 24, 36, 48, 60, 72, 84].map((x, i) => (
                <rect key={i} x={x} y={28 - (i * 3 + 4)} width="8" height={i * 3 + 4} fill={strokeColor} opacity={0.3 + (i * 0.1)} rx="1" />
              ))}
           </svg>
        )}
        {chartType === 'latency' && (
           <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d="M0,5 L20,8 L40,15 L60,18 L80,22 L100,25" fill="none" stroke={strokeColor} strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
           </svg>
        )}
      </div>
    </div>
  </div>
);

const ProgressBar = ({ width, label }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tight">
       <span>{label}</span>
       <span>{width === 'w-3/4' ? '75%' : width === 'w-1/2' ? '50%' : '66%'}</span>
    </div>
    <div className="h-2.5 bg-slate-100 dark:bg-primary/10 rounded-full overflow-hidden shadow-inner">
      <div className={`h-full bg-primary ${width} rounded-full shadow-lg shadow-primary/20 transition-all duration-1000`}></div>
    </div>
  </div>
);

export default AIModels;
