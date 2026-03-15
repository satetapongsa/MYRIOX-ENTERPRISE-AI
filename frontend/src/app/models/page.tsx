"use client";

import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Send, Plus, MessageSquare, Trash2, Paperclip, Sparkles, Users, Cpu, Lock as LockIcon, 
  X, Copy, Check, FolderPlus, Folder, ChevronRight, ChevronDown, Edit3, MoreHorizontal,
  AlertTriangle, Info, Maximize2, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon,
  Layers, Download, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

// --- VISUALIZATION COLORS ---
const COLORS = ['#4c4ceb', '#7373f0', '#38bdf8', '#818cf8', '#6366f1', '#a855f7'];

// --- UI COMPONENTS ---

const CodeBlock = ({ language, value }: { language: string; value: string }) => {
  const [copied, setCopied] = useState(false);
  
  // Detection for special "chart-data" type
  if (language === 'chart-data') {
    try {
      const config = JSON.parse(value);
      return <NeuralChartBlock config={config} />;
    } catch (e) {
      return <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl text-xs font-mono">Invalid Chart Data Pattern</div>;
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-xl bg-[#0d0d17]">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 text-slate-400 text-xs font-mono border-b border-white/5">
        <span className="flex items-center gap-2"><div className="size-2 rounded-full bg-primary" /> {language || 'code'}</span>
        <button onClick={copyToClipboard} className="flex items-center gap-1.5 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded-md">
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter language={language || 'text'} style={atomDark} customStyle={{ margin: 0, padding: '1.5rem', fontSize: '13px', backgroundColor: 'transparent' }}>
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

const NeuralChartBlock = ({ config }: { config: any }) => {
  const { type, data, title } = config;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-[350px] my-8 p-6 bg-white dark:bg-slate-900/80 rounded-[32px] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden group relative"
    >
      <div className="flex items-center justify-between mb-6">
         <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
               {type === 'bar' && <BarChart3 size={18} />}
               {type === 'line' && <LineChartIcon size={18} />}
               {type === 'pie' && <PieChartIcon size={18} />}
               {type === 'area' && <Layers size={18} />}
            </div>
            <div>
               <h4 className="text-sm font-black dark:text-white leading-none">{title || 'Neural Logic Visualization'}</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time Data Stream</p>
            </div>
         </div>
         <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-primary transition-all"><Download size={14} /></button>
            <button className="p-2 text-slate-400 hover:text-primary transition-all"><Maximize2 size={14} /></button>
         </div>
      </div>
      
      <div className="w-full h-[75%]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8884d822" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backgroundColor: '#0f172a', color: '#fff' }} />
              <Bar dataKey="value" fill="#4c4ceb" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          ) : type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8884d822" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backgroundColor: '#0f172a' }} />
              <Line type="monotone" dataKey="value" stroke="#4c4ceb" strokeWidth={4} dot={{ r: 4, fill: '#4c4ceb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          ) : type === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAreaMsg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4c4ceb" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#4c4ceb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8884d822" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backgroundColor: '#0f172a' }} />
              <Area type="monotone" dataKey="value" stroke="#4c4ceb" fillOpacity={1} fill="url(#colorAreaMsg)" strokeWidth={4} />
            </AreaChart>
          ) : (
            <PieChart>
              <Pie data={data} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                {data.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// --- MODAL COMPONENTS ---

const ModalOverlay = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      className="w-full max-w-md bg-white dark:bg-[#0c0c18] border border-slate-200 dark:border-primary/20 rounded-[40px] shadow-2xl overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </motion.div>
);

const CustomConfirmModal = ({ isOpen, title, message, onConfirm, onClose, variant = 'danger' }: any) => (
  <AnimatePresence>
    {isOpen && (
      <ModalOverlay onClose={onClose}>
        <div className="p-10 text-center">
           <div className={cn("size-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-2xl transition-transform hover:scale-110", 
             variant === 'danger' ? "bg-rose-500/10 text-rose-500 shadow-rose-500/10" : "bg-primary/10 text-primary")}>
              {variant === 'danger' ? <Trash2 size={40} /> : <AlertTriangle size={40} />}
           </div>
           <h3 className="text-2xl font-black dark:text-white mb-2">{title}</h3>
           <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-10">{message}</p>
           <div className="grid grid-cols-2 gap-4">
              <button onClick={onClose} className="py-4 bg-slate-50 dark:bg-white/5 text-slate-500 font-black rounded-2xl hover:bg-slate-100 transition-all font-bold text-xs uppercase tracking-widest">Cancel</button>
              <button onClick={onConfirm} className={cn("py-4 text-white font-black rounded-2xl shadow-xl transition-all font-bold text-xs uppercase tracking-widest", 
                variant === 'danger' ? "bg-rose-500 shadow-rose-500/20" : "bg-primary shadow-primary/20")}>Confirm</button>
           </div>
        </div>
      </ModalOverlay>
    )}
  </AnimatePresence>
);

const CustomInputModal = ({ isOpen, title, defaultValue, placeholder, onConfirm, onClose, icon: Icon }: any) => {
  const [val, setVal] = useState(defaultValue || '');
  useEffect(() => { if(isOpen) setVal(defaultValue || ''); }, [isOpen, defaultValue]);

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay onClose={onClose}>
          <div className="p-10">
             <div className="flex items-center gap-5 mb-8">
                <div className="size-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/5">
                   {Icon ? <Icon size={28} /> : <Edit3 size={28} />}
                </div>
                <h3 className="text-2xl font-black dark:text-white">{title}</h3>
             </div>
             <div className="space-y-6">
                <div className="relative group">
                   <input 
                    autoFocus 
                    value={val} 
                    onChange={e => setVal(e.target.value)} 
                    placeholder={placeholder}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-primary/10 rounded-2xl py-5 px-6 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={onClose} className="py-4 bg-slate-50 dark:bg-white/5 text-slate-500 font-black rounded-2xl hover:bg-slate-100 transition-all font-bold text-xs uppercase tracking-widest">Discard</button>
                   <button onClick={() => onConfirm(val)} disabled={!val.trim()} className="py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-xs uppercase tracking-widest disabled:opacity-50">Save Changes</button>
                </div>
             </div>
          </div>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

// --- MAIN PAGE ---

export default function AIModelsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  
  const [projects, setProjects] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<number, boolean>>({});
  const [selectedModel, setSelectedModel] = useState<'normal' | 'myriox'>('normal');

  // Modal States
  const [confirmModal, setConfirmModal] = useState<any>({ isOpen: false, title: '', message: '', onConfirm: () => {}, variant: 'danger' });
  const [inputModal, setInputModal] = useState<any>({ isOpen: false, title: '', defaultValue: '', placeholder: '', onConfirm: () => {}, icon: null });
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth') === 'true';
    if (isAuth) setIsAuthenticated(true);
    initData();
  }, []);

  const initData = async () => {
    try {
      const dbProjects = await analyticsApi.getProjects();
      setProjects(dbProjects);
      
      const dbSessions = await analyticsApi.getChatSessions();
      if (dbSessions.length > 0) {
        const fullChats = await Promise.all(dbSessions.map(async (session: any) => {
           const messages = await analyticsApi.getChatMessages(session.id);
           return {
             id: session.id,
             title: session.title,
             project_id: session.project_id,
             messages: messages.map((m: any) => ({ role: m.role, content: m.content }))
           };
        }));
        setChats(fullChats);
        if (fullChats.length > 0) setActiveChatId(fullChats[0].id);
      } else { createNewChat(); }
    } catch (err) { createNewChat(); }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, isAnalyzing, activeChatId]);

  const createNewChat = async (projectId?: number) => {
    const newId = Date.now().toString();
    const targetProjectId = projectId || activeProjectId || undefined;
    const newChat = {
      id: newId,
      title: 'New Discussion',
      project_id: targetProjectId,
      messages: [{ role: 'ai', content: `Hello! I am Myriox, your Enterprise AI assistant. I notice you're working in ${targetProjectId ? 'this project context' : 'global context'}. How can I assist you today?` }]
    };
    try {
      await analyticsApi.createChatSession(newId, newChat.title, newChat.project_id);
      await analyticsApi.saveChatMessage(newId, 'ai', newChat.messages[0].content);
    } catch (err) {}
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newId);
  };

  // ACTIONS
  const handleCreateProject = () => {
    setInputModal({
      isOpen: true,
      title: 'New Project Container',
      defaultValue: '',
      placeholder: 'E.g. Q4 Sales Analysis...',
      icon: FolderPlus,
      onConfirm: async (title: string) => {
        try {
          const newProj = await analyticsApi.createProject(title);
          setProjects(prev => [newProj, ...prev]);
          setInputModal((prev: any) => ({ ...prev, isOpen: false }));
        } catch (err) {
          alert("Persistence Error: Failed to write to DB.");
        }
      }
    });
  };

  const handleRenameProject = (e: React.MouseEvent, id: number, oldTitle: string) => {
    e.stopPropagation();
    setInputModal({
      isOpen: true,
      title: 'Rename Project',
      defaultValue: oldTitle,
      placeholder: 'Enter new title...',
      icon: Edit3,
      onConfirm: async (newTitle: string) => {
        try {
          await analyticsApi.updateProject(id, newTitle);
          setProjects(prev => prev.map(p => p.id === id ? { ...p, title: newTitle } : p));
          setInputModal((prev: any) => ({ ...prev, isOpen: false }));
        } catch (err) {
          alert("Update Error: Sync failed.");
        }
      }
    });
  };

  const handleDeleteProject = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      title: 'Purge Project Container?',
      message: 'Entering the purge sequence will delete this project folder and all associated neural chat sessions. This action is irreversible.',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await analyticsApi.deleteProject(id);
          setProjects(prev => prev.filter(p => p.id !== id));
          setChats(prev => prev.filter(c => c.project_id !== id));
          setConfirmModal((prev: any) => ({ ...prev, isOpen: false }));
          if (activeProjectId === id) setActiveProjectId(null);
        } catch (err) {
          alert("Purge Failure: Could not remove records from DB.");
        }
      }
    });
  };

  const handleRenameChat = (e: React.MouseEvent, id: string, oldTitle: string) => {
    e.stopPropagation();
    setInputModal({
      isOpen: true,
      title: 'Rename Neural Session',
      defaultValue: oldTitle,
      placeholder: 'Enter session name...',
      icon: MessageSquare,
      onConfirm: async (newTitle: string) => {
        try {
          await analyticsApi.updateChatSession(id, newTitle);
          setChats(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
          setInputModal((prev: any) => ({ ...prev, isOpen: false }));
        } catch (err) {
          alert("Sync Error: Neural session title not saved.");
        }
      }
    });
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      title: 'Delete Neural Session?',
      message: 'Are you sure you want to terminate this neural session? All conversational memory for this thread will be cleared.',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await analyticsApi.deleteChatSession(id);
          setChats(prev => prev.filter(c => c.id !== id));
          setConfirmModal((prev: any) => ({ ...prev, isOpen: false }));
          if (activeChatId === id) setActiveChatId(null);
        } catch (err) {
          alert("Purge Error: Session still exists in records.");
        }
      }
    });
  };

  const toggleFolder = (id: number) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const currentQuery = query;
    setQuery('');
    const userMsg = { role: 'user', content: currentQuery };
    
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, userMsg], title: c.title === 'New Discussion' ? currentQuery.slice(0, 30) : c.title } : c));
    setIsAnalyzing(true);

    try {
      const currentChat = chats.find(c => c.id === activeChatId);
      if (currentChat && currentChat.title === 'New Discussion') {
        const newTitle = currentQuery.slice(0, 30);
        await analyticsApi.updateChatSession(activeChatId!, newTitle);
      }

      await analyticsApi.saveChatMessage(activeChatId!, 'user', currentQuery);
      
      const contextPrefix = activeChat?.project_id 
        ? `[PROJECT CONTEXT: ${projects.find(p => p.id === activeChat.project_id)?.title}] ` 
        : "";
        
      // NEW: Explicitly instruction AI to use chart format if relevant
      const chartInstructions = " If you generate data, use this format for charts: ```chart-data {\"type\": \"bar|line|area|pie\", \"title\": \"Label\", \"data\": [{\"name\": \"X\", \"value\": 10}]} ```";
      
      const response = await analyticsApi.chatWithData(contextPrefix + currentQuery + chartInstructions, 1, selectedModel);
      const aiMsg = { role: 'ai', content: response.response };
      await analyticsApi.saveChatMessage(activeChatId!, 'ai', aiMsg.content);
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, aiMsg] } : c));
    } catch (err) {
      const errorMsg = { role: 'ai', content: "Neural link timeout. Please check your connection." };
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, errorMsg] } : c));
    } finally { setIsAnalyzing(false); }
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-[100] px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="size-20 bg-primary/20 rounded-3xl flex items-center justify-center mb-8"><LockIcon className="text-primary" size={36} /></div>
            <h1 className="text-3xl font-bold text-white mb-2">Neural Access Gate</h1>
            <p className="text-slate-400 mb-8">Enter administrator credentials to proceed.</p>
            <form onSubmit={e => { e.preventDefault(); if(password === 'rootadmin') { setIsAuthenticated(true); localStorage.setItem('admin_auth', 'true'); } else { setAuthError(true); setTimeout(()=>setAuthError(false), 2000); } }} className="w-full space-y-4">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Passphrase" className={cn("w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all text-center tracking-widest", authError && "animate-shake border-red-500/50")} />
              <button className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20">Verify Identity</button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <MainLayout>
      <CustomConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} variant={confirmModal.variant} />
      <CustomInputModal isOpen={inputModal.isOpen} title={inputModal.title} defaultValue={inputModal.defaultValue} placeholder={inputModal.placeholder} icon={inputModal.icon} onConfirm={inputModal.onConfirm} onClose={() => setInputModal({ ...inputModal, isOpen: false })} />

      <div className="flex h-[calc(100vh-100px)] overflow-hidden bg-white dark:bg-background-dark/30 rounded-[40px] border border-slate-200 dark:border-primary/5 shadow-2xl">
        
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-50 dark:border-primary/5 flex flex-col bg-slate-50/20 dark:bg-[#080812]">
          <div className="p-6 space-y-3">
            <button onClick={() => createNewChat()} className="w-full py-3.5 bg-primary text-white rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase transition-all shadow-xl shadow-primary/20 active:scale-95"><Plus size={16} /> Global New Chat</button>
            <button onClick={handleCreateProject} className="w-full py-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-white rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase hover:bg-slate-50 transition-all shadow-sm"><FolderPlus size={16} /> Create Project</button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 space-y-4 no-scrollbar pb-10">
            <div className="space-y-1">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2 flex items-center gap-2"><Info size={10} /> Uncategorized</div>
               {chats.filter(c => !c.project_id).map(chat => (
                  <ChatListItem key={chat.id} chat={chat} active={activeChatId === chat.id} onSelect={() => setActiveChatId(chat.id)} onRename={(eVal: any) => handleRenameChat(eVal, chat.id, chat.title)} onDelete={(eVal: any) => handleDeleteChat(eVal, chat.id)} />
               ))}
            </div>

            <div className="space-y-2">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2 flex items-center gap-2"><Folder size={10} /> Project Folders</div>
               {projects.map(proj => (
                  <div key={proj.id} className="space-y-1">
                     <div onClick={() => toggleFolder(proj.id)} className={cn("flex items-center justify-between p-3.5 rounded-2xl cursor-pointer group transition-all", expandedFolders[proj.id] ? "bg-primary/5 border border-primary/10" : "hover:bg-slate-100 dark:hover:bg-white/5")}>
                        <div className="flex items-center gap-2">
                           {expandedFolders[proj.id] ? <ChevronDown size={14} className="text-primary" /> : <ChevronRight size={14} className="text-slate-400" />}
                           <Folder size={16} className={expandedFolders[proj.id] ? "text-primary fill-primary/20" : "text-slate-400"} />
                           <span className={cn("text-xs font-black truncate max-w-[120px]", expandedFolders[proj.id] && "text-primary")}>{proj.title}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                           <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); createNewChat(proj.id); }} title="New Chat" className="p-1.5 hover:bg-primary hover:text-white rounded-lg transition-all"><Plus size={12}/></button>
                           <button onClick={(eValue: React.MouseEvent) => handleRenameProject(eValue, proj.id, proj.title)} className="p-1 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
                  <Edit3 size={14} />
                </button>
                <button onClick={(eValue: React.MouseEvent) => handleDeleteProject(eValue, proj.id)} className="p-1 hover:bg-white/10 rounded-lg text-white/40 hover:text-rose-400 transition-colors">
                  <Trash2 size={14} />
                </button>
                        </div>
                     </div>
                     <AnimatePresence>
                        {expandedFolders[proj.id] && (
                           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-4 overflow-hidden space-y-1 mt-1">
                              {chats.filter(c => c.project_id === proj.id).map(chat => (
                                 <ChatListItem key={chat.id} chat={chat} active={activeChatId === chat.id} onSelect={() => setActiveChatId(chat.id)} onRename={(eVal: any) => handleRenameChat(eVal, chat.id, chat.title)} onDelete={(eVal: any) => handleDeleteChat(eVal, chat.id)} isNested />
                              ))}
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#0c0c18]">
          <div className="px-10 py-5 border-b border-slate-50 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#0c0c18] z-10 shadow-sm text-slate-800 dark:text-white">
             <div className="flex items-center gap-4">
                <div className="size-11 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner"><MessageSquare size={20} /></div>
                <div>
                  <h2 className="text-sm font-black dark:text-white capitalize">{activeChat?.title || "New Discussion"}</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <div className={cn("size-1.5 rounded-full animate-pulse", activeChat?.project_id ? "bg-emerald-500" : "bg-primary")}></div>
                    {activeChat?.project_id ? `Active Context: ${projects.find(p => p.id === activeChat.project_id)?.title}` : "General Neural Mode"}
                  </p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <button className="size-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all shadow-sm"><Users size={18} className="text-slate-400" /></button>
                <button className="size-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all shadow-sm"><MoreHorizontal size={18} className="text-slate-400" /></button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
            <div className="max-w-3xl mx-auto space-y-12">
              <AnimatePresence>
                {activeChat?.messages.map((msg: any, i: number) => (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} key={i} className={cn("flex gap-5", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                    <div className={cn("size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl border transition-transform hover:scale-110", msg.role === 'ai' ? "bg-primary text-white border-primary/20" : "bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-white/5")}>
                      {msg.role === 'ai' ? (
                        <Sparkles size={16} className="text-blue-400" />
                      ) : (
                        <LockIcon size={16} className="text-white/60" />
                      )}
                    </div>
                    <div className={cn("max-w-[85%] px-8 py-6 rounded-[36px] text-[15px] leading-relaxed shadow-xl", msg.role === 'user' ? "bg-primary text-white font-bold rounded-tr-none shadow-primary/20" : "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-tl-none")}>
                      {msg.role === 'ai' ? (
                        <div className="prose dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock as any }}>{msg.content}</ReactMarkdown>
                        </div>
                      ) : msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isAnalyzing && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 items-center px-6 bg-primary/5 rounded-[24px] py-4 border border-primary/10 w-fit shadow-lg">
                    <RefreshCw size={16} className="text-primary animate-spin" />
                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Neural Engine v4.1 Synopsing...</span>
                 </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="p-10 max-w-3xl mx-auto w-full space-y-4">
            <div className="flex items-center gap-2 mb-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit border border-slate-200 dark:border-white/5">
                <button 
                  onClick={() => setSelectedModel('normal')}
                  className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", 
                    selectedModel === 'normal' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-primary")}
                >
                  Neural Standard
                </button>
                <button 
                  onClick={() => setSelectedModel('myriox')}
                  className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2", 
                    selectedModel === 'myriox' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:text-indigo-400")}
                >
                  <Sparkles size={12} /> MYRIOX CORE (Custom AI)
                </button>
            </div>
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-primary/20 rounded-[44px] p-2.5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex items-center gap-3 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
               <button className="size-14 rounded-[30px] flex items-center justify-center text-slate-400 hover:text-primary transition-all hover:bg-slate-100 dark:hover:bg-white/5"><Paperclip size={24} /></button>
               <input className="flex-1 bg-transparent py-5 text-[15px] font-bold outline-none dark:text-white placeholder:text-slate-400" placeholder={`Message ${activeChat?.project_id ? 'Project Neural Assistant' : 'Myriox'}...`} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={(e: any) => e.key === 'Enter' && handleAskAI(e)} />
               <button onClick={handleAskAI} disabled={!query.trim() || isAnalyzing} className="size-14 bg-primary text-white rounded-[30px] flex items-center justify-center hover:scale-105 active:scale-95 shadow-xl shadow-primary/30 transition-all disabled:opacity-50"><Send size={24} /></button>
            </div>
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-8 opacity-40">Neural Network Isolated • Private Shard Storage v4.1 • MYRIOX AI</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const ChatListItem = ({ chat, active, onSelect, onRename, onDelete, isNested }: any) => (
  <div onClick={onSelect} className={cn("group w-full p-4 rounded-2xl flex items-center justify-between transition-all cursor-pointer border border-transparent mb-1", active ? "bg-primary text-white shadow-2xl shadow-primary/30 font-black" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5", isNested && "ml-3")}>
    <div className="flex items-center gap-3 overflow-hidden">
      <MessageSquare size={14} className={active ? "text-white" : "text-slate-400"} />
      <span className="text-xs truncate max-w-[120px]">{chat.title}</span>
    </div>
    <div className={cn("flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all", active && "opacity-100")}>
       <button onClick={onRename} title="Rename" className={cn("p-1.5 hover:scale-110 rounded-lg transition-all", active ? "bg-white/20 text-white" : "text-slate-300 hover:bg-white dark:hover:bg-white/10 hover:text-primary")}><Edit3 size={11}/></button>
       <button onClick={onDelete} title="Delete" className={cn("p-1.5 hover:scale-110 rounded-lg transition-all", active ? "bg-white/20 text-white" : "text-slate-300 hover:bg-white dark:hover:bg-white/10 hover:text-rose-500")}><Trash2 size={11}/></button>
    </div>
  </div>
);
