"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  User, 
  Key, 
  Bell, 
  Shield, 
  ChevronRight, 
  Save, 
  Trash2, 
  Plus,
  Moon,
  Lock,
  Globe,
  Settings as SettingsIcon,
  CreditCard,
  Users,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="border-b border-slate-200 dark:border-primary/10 pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Account Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mt-2">Manage your instance configuration, team, and security policies.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
           {/* Sidebar Navigation */}
           <aside className="w-full lg:w-72 shrink-0 space-y-2">
              <SettingsNav 
                icon={User} 
                label="Profile Information" 
                isActive={activeTab === 'profile'} 
                onClick={() => setActiveTab('profile')} 
              />
              <SettingsNav 
                icon={Key} 
                label="API Management" 
                isActive={activeTab === 'api'} 
                onClick={() => setActiveTab('api')} 
              />
              <SettingsNav 
                icon={Bell} 
                label="Notification Rules" 
                isActive={activeTab === 'notifications'} 
                onClick={() => setActiveTab('notifications')} 
              />
              <SettingsNav 
                icon={Users} 
                label="Team & Permissions" 
                isActive={activeTab === 'team'} 
                onClick={() => setActiveTab('team')} 
              />
              <SettingsNav 
                icon={CreditCard} 
                label="Billing & Subscriptions" 
                isActive={activeTab === 'billing'} 
                onClick={() => setActiveTab('billing')} 
              />
              <div className="h-px bg-slate-100 dark:bg-primary/10 my-6"></div>
              <SettingsNav 
                icon={SettingsIcon} 
                label="Workspace Config" 
                isActive={activeTab === 'workspace'} 
                onClick={() => setActiveTab('workspace')} 
              />
              <SettingsNav 
                icon={Shield} 
                label="Security Polcies" 
                isActive={activeTab === 'security'} 
                onClick={() => setActiveTab('security')} 
              />
           </aside>

           {/* Content Area */}
           <main className="flex-1 space-y-12">
              {activeTab === 'profile' && <ProfileSection isSaving={isSaving} setIsSaving={setIsSaving} />}
              {activeTab === 'api' && <APISection />}
              {activeTab === 'notifications' && <NotificationSection />}
              {activeTab === 'team' && <TeamSection />}
              {activeTab === 'billing' && <BillingSection />}
              {activeTab === 'workspace' && <WorkspaceSection />}
              {activeTab === 'security' && <SecuritySection />}

              {/* Danger Zone */}
              <div className="pt-10 border-t border-slate-100 dark:border-primary/5">
                 <div className="bg-rose-500/5 border border-rose-500/20 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                       <h3 className="text-lg font-bold text-rose-600">Nuclear Exclusion Zone</h3>
                       <p className="text-sm text-slate-500 mt-1">Permanently delete this workspace and all associated datasets. This action is irreversible.</p>
                    </div>
                    <button className="px-8 py-3 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20 active:scale-95">
                       Destroy Workspace
                    </button>
                 </div>
              </div>
           </main>
        </div>
      </div>
    </MainLayout>
  );
}

const SettingsNav = ({ icon: Icon, label, isActive, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group",
      isActive 
        ? "bg-primary text-white shadow-xl shadow-primary/20 font-bold" 
        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-primary/5 hover:text-primary"
    )}
  >
    <Icon size={20} className={cn(isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
    <span className="text-sm">{label}</span>
    <ChevronRight size={16} className={cn("ml-auto opacity-0 group-hover:opacity-100 transition-opacity", isActive && "opacity-100")} />
  </button>
);

const ProfileSection = ({ isSaving, setIsSaving }: any) => {
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
       <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary"><User size={24} /></div>
          <h2 className="text-2xl font-extrabold dark:text-white">Profile Information</h2>
       </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-sm relative">
           {/* Static Locked Overlay Badge */}
           <div className="absolute top-6 right-6 px-4 py-2 bg-slate-900 dark:bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl z-20 flex items-center gap-2 shadow-xl">
              <Shield size={12} /> Account Verified: CEO
           </div>

           <div className="p-10 flex flex-col md:flex-row items-center gap-10">
              <div className="relative group">
                 <div className="size-32 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl bg-[url('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200')] bg-cover"></div>
                 <div className="absolute bottom-1 right-1 size-10 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl">
                    <CheckCircle2 size={20} />
                 </div>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Display Name</label>
                    <div className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-100 dark:border-primary/5 rounded-2xl px-6 py-3.5 text-sm font-bold dark:text-white flex items-center gap-2 opacity-70">
                       เวฟนิกา
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">Work Email</label>
                    <div className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-100 dark:border-primary/5 rounded-2xl px-6 py-3.5 text-sm font-bold dark:text-white flex items-center gap-2 opacity-70">
                       wavy@analytnica.ai
                    </div>
                 </div>
                 <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block px-2">Professional Biography</label>
                    <div className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-100 dark:border-primary/5 rounded-2xl px-6 py-4 text-sm font-medium dark:text-white opacity-70">
                       CEO & Founder at WAVY ANALYTNICA. Leading the next generation of neural-first enterprise intelligence systems. Authorized executive access only.
                    </div>
                 </div>
              </div>
           </div>
           <div className="px-10 py-6 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic animate-pulse">
                System Administrator Locked: Changes require Root Protocol
              </p>
           </div>
        </div>
    </div>
  );
};

const APISection = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
     <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Key size={24} /></div>
           <h2 className="text-2xl font-extrabold dark:text-white">API Integrations</h2>
        </div>
        <button className="flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-primary/20 transition-all">
           <Plus size={16} /> New Security Key
        </button>
     </div>

     <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden">
        <table className="w-full text-left">
           <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                 <th className="px-10 py-6">Machine Name</th>
                 <th className="px-6 py-6 text-center">Security Status</th>
                 <th className="px-10 py-6 text-right">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              <tr className="hover:bg-slate-50/50 transition-colors">
                 <td className="px-10 py-6 text-sm font-bold dark:text-white">Prod_Neural_Engine_01</td>
                 <td className="px-6 py-6 flex justify-center">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-extrabold border border-emerald-500/20">Active</span>
                 </td>
                 <td className="px-10 py-6 text-right">
                    <button className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                 </td>
              </tr>
           </tbody>
        </table>
     </div>
  </div>
);

const NotificationSection = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
     <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Bell size={24} /></div>
        <h2 className="text-2xl font-extrabold dark:text-white">Notification Rules</h2>
     </div>
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ToggleCard icon={Shield} title="Security Alerts" desc="Immediate notification on unauthorized access attempts." />
        <ToggleCard icon={Activity} title="System Health" desc="Real-time alerts for server latency or processing errors." />
        <ToggleCard icon={Users} title="Team Activity" desc="Summarized reports of your team's weekly insights." />
        <ToggleCard icon={Lock} title="Data Privacy" desc="Compliance alerts and data encryption status updates." />
     </div>
  </div>
);

const ToggleCard = ({ icon: Icon, title, desc }: any) => {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex items-start justify-between gap-6 hover:shadow-lg transition-all cursor-pointer" onClick={() => setEnabled(!enabled)}>
       <div className="flex gap-6">
          <div className="p-4 bg-slate-50 dark:bg-primary/5 rounded-2xl text-slate-400 group-hover:text-primary transition-colors">
             <Icon size={24} />
          </div>
          <div className="space-y-1">
             <p className="font-bold text-slate-900 dark:text-white">{title}</p>
             <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">{desc}</p>
          </div>
       </div>
       <div className={cn(
         "w-12 h-6 rounded-full relative transition-all duration-300",
         enabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
       )}>
          <div className={cn(
            "absolute top-1 size-4 bg-white rounded-full transition-all duration-300 shadow-md",
            enabled ? "left-7" : "left-1"
          )} />
       </div>
    </div>
  );
};

const InputGroup = ({ label, defaultValue }: any) => (
  <div className="space-y-2">
     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-2">{label}</label>
     <input 
       type="text" 
       defaultValue={defaultValue}
       className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-100 dark:border-primary/5 rounded-2xl px-6 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:text-white"
     />
  </div>
);

const TeamSection = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
     <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Users size={24} /></div>
           <h2 className="text-2xl font-extrabold dark:text-white">Team & Permissions</h2>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-primary/20 hover:scale-105 transition-all">
           <Plus size={16} /> Invite Member
        </button>
     </div>
     <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden">
        <table className="w-full text-left">
           <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">
                 <th className="px-10 py-6">Member</th>
                 <th className="px-6 py-6">Role</th>
                 <th className="px-6 py-6">Status</th>
                 <th className="px-10 py-6 text-right">Actions</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              <TeamRow name="เวฟนิกา (You)" email="wavy@analytnica.ai" role="Owner" status="Active" isOwner />
              <TeamRow name="Sarah Chen" email="sarah.c@analytnica.ai" role="Lead Engineer" status="Active" />
              <TeamRow name="Marcus Wright" email="m.wright@analytnica.ai" role="Data Analyst" status="Away" />
           </tbody>
        </table>
     </div>
  </div>
);

const TeamRow = ({ name, email, role, status, isOwner }: any) => (
  <tr className="hover:bg-slate-50/50 dark:hover:bg-primary/5 transition-colors">
     <td className="px-10 py-6">
        <div><p className="text-sm font-bold dark:text-white">{name}</p><p className="text-xs text-slate-400">{email}</p></div>
     </td>
     <td className="px-6 py-6"><span className="text-xs font-medium dark:text-slate-300">{role}</span></td>
     <td className="px-6 py-6">
        <span className={cn(
          "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest",
          status === 'Active' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
        )}>{status}</span>
     </td>
     <td className="px-10 py-6 text-right">
        {!isOwner && <button className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>}
     </td>
  </tr>
);

const BillingSection = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
     <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary"><CreditCard size={24} /></div>
        <h2 className="text-2xl font-extrabold dark:text-white">Billing & Subscription</h2>
     </div>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-primary to-indigo-700 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
           <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-2">Current Plan</p>
              <h3 className="text-4xl font-black mb-6">WAVY ENTERPRISE</h3>
              <div className="flex items-center gap-6 text-sm font-bold">
                 <div className="flex items-center gap-2"><div className="size-2 bg-white rounded-full animate-pulse" /> Unlimited Compute</div>
                 <div className="flex items-center gap-2"><div className="size-2 bg-white rounded-full animate-pulse" /> 24/7 Priority Support</div>
              </div>
           </div>
           <Globe size={180} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[40px] flex flex-col justify-center text-center">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Next Payment</p>
           <p className="text-3xl font-black dark:text-white">$1,240.00</p>
           <p className="text-xs text-slate-500 mt-2">Due on April 12, 2026</p>
           <button className="mt-6 w-full py-3 bg-slate-900 dark:bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-all outline-none">Manage Payment</button>
        </div>
     </div>
  </div>
);

const WorkspaceSection = () => (
   <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
         <div className="p-3 bg-primary/10 rounded-2xl text-primary"><SettingsIcon size={24} /></div>
         <h2 className="text-2xl font-extrabold dark:text-white">Workspace Configuration</h2>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-10 space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
               <h4 className="font-bold dark:text-white flex items-center gap-2"><Globe size={16} className="text-primary" /> Regional Deployment</h4>
               <p className="text-xs text-slate-500">Choose where your neural processing happens. Currently set to APAC (Singapore).</p>
               <select className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-100 dark:border-primary/5 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none">
                  <option>APAC (Singapore)</option>
                  <option>US East (Virginia)</option>
                  <option>EU West (Frankfurt)</option>
               </select>
            </div>
            <div className="space-y-4">
               <h4 className="font-bold dark:text-white flex items-center gap-2"><RefreshCw size={16} className="text-primary" /> Model Auto-Update</h4>
               <p className="text-xs text-slate-500">Automatically switch to the latest Gemini models as they become available.</p>
               <div className="flex items-center gap-4 bg-slate-50 dark:bg-primary/5 p-4 rounded-2xl border border-slate-100 dark:border-primary/10">
                  <div className="flex-1 text-xs font-bold dark:text-slate-300">Enabled (Recommended)</div>
                  <div className="size-6 bg-primary rounded-full flex items-center justify-center text-white"><CheckCircle2 size={12} /></div>
               </div>
            </div>
         </div>
      </div>
   </div>
);

const SecuritySection = () => (
   <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
         <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500"><Shield size={24} /></div>
         <h2 className="text-2xl font-extrabold dark:text-white">Security & Audit Policies</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <SecurityPolicyCard title="Two-Factor Authentication" status="Enforced" desc="All team members must use 2FA to access the workspace." icon={Lock} />
         <SecurityPolicyCard title="Audit Logging" status="Enabled" desc="Every data access and query is logged for 365 days." icon={Activity} />
         <SecurityPolicyCard title="IP Whitelisting" status="Disabled" desc="Restrict workspace access to specific office networks." icon={Globe} />
         <SecurityPolicyCard title="Data Encryption" status="AES-256" desc="All datasets are encrypted at rest with enterprise-grade keys." icon={Shield} />
      </div>
   </div>
);

const SecurityPolicyCard = ({ title, status, desc, icon: Icon }: any) => (
   <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[32px] hover:shadow-xl transition-all group">
      <div className="flex items-center justify-between mb-4">
         <div className="p-3 bg-slate-50 dark:bg-primary/5 rounded-xl text-slate-400 group-hover:text-primary transition-colors"><Icon size={20} /></div>
         <span className={cn(
           "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
           status === 'Disabled' ? "bg-slate-100 text-slate-400 border-slate-200" : "bg-primary/10 text-primary border-primary/20"
         )}>{status}</span>
      </div>
      <h4 className="font-bold dark:text-white mb-2">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
   </div>
);

const Activity = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);
