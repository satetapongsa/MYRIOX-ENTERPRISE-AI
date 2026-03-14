import React, { useState } from 'react';

const Settings = () => {
  const [profile, setProfile] = useState({
    name: 'Alex Rivera',
    email: 'alex.rivera@company.com',
    bio: 'Senior Data Scientist at Acme Corp. Focusing on predictive modeling, generative AI, and business automation strategies.'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: "Production Environment", k: "ins_••••••••4f2a", date: "Oct 12, 2023", last: "2 hours ago" },
    { id: 2, name: "Staging/Development", k: "ins_••••••••91bc", date: "Jan 05, 2024", last: "Yesterday" }
  ]);

  const [notifications, setNotifications] = useState({
    security: true,
    weekly: true,
    sync: true,
    invites: false
  });

  const [workspaceName, setWorkspaceName] = useState('Acme Analytics');
  const [retention, setRetention] = useState('90 Days (Standard)');

  const handleSaveProfile = () => {
    setIsSaving(true);
    setSaveStatus(null);
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const handleAddApiKey = () => {
    const name = prompt("Enter a name for the new API key:");
    if (!name) return;
    const newKey = {
      id: Date.now(),
      name,
      k: `ins_••••••••${Math.random().toString(16).slice(2, 6)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      last: 'Never'
    };
    setApiKeys([newKey, ...apiKeys]);
  };

  const handleDeleteKey = (id) => {
    if (confirm("Are you sure you want to revoke this API key? This cannot be undone.")) {
      setApiKeys(apiKeys.filter(k => k.id !== id));
    }
  };

  const toggleNotify = (key) => {
    setNotifications({...notifications, [key]: !notifications[key]});
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Settings Sidebar */}
        <aside className="w-full lg:w-64 flex flex-col gap-8 shrink-0">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 px-4">Workspace</h3>
            <div className="px-4 py-3 bg-primary/5 rounded-2xl flex items-center justify-between border border-primary/20 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-primary">{workspaceName}</span>
                <span className="text-[9px] font-extrabold text-primary/60 uppercase tracking-widest">Enterprise Plan</span>
              </div>
              <span className="material-symbols-outlined text-primary text-sm group-hover:rotate-180 transition-transform duration-500">unfold_more</span>
            </div>
          </div>
          
          <nav className="flex flex-col gap-1.5 p-1 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/50">
            <SettingsNavItem icon="person" label="Profile Information" active />
            <SettingsNavItem icon="vpn_key" label="API Keys" />
            <SettingsNavItem icon="notifications_active" label="Notifications" />
            <SettingsNavItem icon="groups" label="Team Members" />
            <SettingsNavItem icon="payments" label="Billing & Usage" />
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-4 mx-4"></div>
            <SettingsNavItem icon="settings" label="Workspace Settings" />
          </nav>
        </aside>

        {/* Settings Content Area */}
        <main className="flex-1 space-y-16 pb-24">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Settings</h1>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-lg">Manage your personal account preferences and workspace configuration.</p>
          </div>

          {/* Profile Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg"><span className="material-symbols-outlined text-primary text-[24px]">person</span></div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Information</h2>
            </div>
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10 items-start md:items-center">
                <div className="relative group self-center md:self-auto">
                  <div className="w-28 h-28 rounded-full bg-center bg-no-repeat bg-cover border-4 border-white dark:border-slate-800 shadow-xl" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBp5-BAh5lVC3IZE6JiU2Nz4PEpnQNHnusk1ZWlR4NjlHPMVqm0jR2GIvbXWgVkh3hHJnxxsAHO1OuUAzsibDkqiH25CusqxrG_zYXaFqPj2rNwcaNgJ6itfwHa9DYirJB2vSX5T4yQctCb9rnbM0fXER00eu0gmO8vB9SN4-qakMukPin41hJGt0Uc5h70zrGcN_KD4d9BkGbn2cpMZhVMpK07NwlP-g4juYddqj5_RqUI3Pop4Ugq6dXAadeBEmDG5yLYvePgsXJE")'}}></div>
                  <button className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-2 shadow-lg border-2 border-white dark:border-slate-900 hover:scale-110 active:scale-95 transition-all"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <InputGroup label="Full Name" value={profile.name} onChange={(v) => setProfile({...profile, name: v})} />
                  <InputGroup label="Email Address" value={profile.email} type="email" onChange={(v) => setProfile({...profile, email: v})} />
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block px-1">Your Remarkable Biography</label>
                    <textarea className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none text-slate-700 dark:text-slate-300" rows="3" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="bg-slate-50/50 dark:bg-slate-800/40 px-8 py-5 flex items-center justify-end gap-4 border-t border-slate-200 dark:border-slate-800">
                {saveStatus === 'success' && <span className="text-emerald-500 text-sm font-bold flex items-center gap-1 animate-pulse"><span className="material-symbols-outlined">check_circle</span> Changes saved!</span>}
                <button onClick={() => setProfile({name: 'Alex Rivera', email: 'alex.rivera@company.com', bio: 'Senior Data Scientist...'})} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Discard</button>
                <button onClick={handleSaveProfile} disabled={isSaving} className="px-8 py-2.5 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </div>
          </section>

          {/* API Keys Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><span className="material-symbols-outlined text-primary text-[24px]">vpn_key</span></div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">API Management</h2>
              </div>
              <button onClick={handleAddApiKey} className="flex items-center gap-2 text-[11px] font-bold bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-lg active:scale-95"><span className="material-symbols-outlined text-[18px]">add</span>New Key</button>
            </div>
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-200 dark:border-slate-800">
                    <th className="px-8 py-5">Name</th>
                    <th className="px-6 py-5">Key</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {apiKeys.map(key => (
                    <tr key={key.id} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-8 py-5 font-bold text-slate-800 dark:text-slate-200">{key.name}</td>
                      <td className="px-6 py-5 font-mono text-slate-500">{key.k}</td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => handleDeleteKey(key.id)} className="text-slate-400 hover:text-red-500 material-symbols-outlined text-[20px] transition-colors">delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="space-y-6">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span></div>
                <h2 className="text-xl font-bold">Channels & Alerts</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-5">
                   <ToggleItem label="Security & Login alerts" active={notifications.security} onToggle={() => toggleNotify('security')} />
                   <ToggleItem label="Weekly usage reports" active={notifications.weekly} onToggle={() => toggleNotify('weekly')} />
                   <ToggleItem label="Sync error alerts" active={notifications.sync} onToggle={() => toggleNotify('sync')} />
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8 flex flex-col justify-between">
                   <div>
                      <h4 className="font-bold text-red-600">Danger Zone</h4>
                      <p className="text-xs text-slate-500 mt-1">Irreversibly delete this entire workspace.</p>
                   </div>
                   <button onClick={() => confirm("ARE YOU ABSOLUTELY SURE? This will destroy all datasets and models.")} className="mt-4 w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20">Delete Workspace</button>
                </div>
             </div>
          </section>
        </main>
      </div>
    </div>
  );
};

const SettingsNavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group cursor-pointer ${active ? 'bg-primary text-white shadow-xl shadow-primary/20 font-bold' : 'text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/60 hover:text-slate-900'}`}>
    <span className={`material-symbols-outlined text-[20px] ${active ? 'text-white' : 'text-slate-400'}`}>{icon}</span>
    <span className="text-[13px]">{label}</span>
  </div>
);

const InputGroup = ({ label, value, type = 'text', onChange }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">{label}</label>
    <input className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const ToggleItem = ({ label, active, onToggle }) => (
  <div className="flex items-center justify-between group cursor-pointer" onClick={onToggle}>
    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 transition-colors">{label}</span>
    <div className="relative inline-flex items-center">
      <div className={`w-11 h-6 rounded-full transition-all duration-300 relative ${active ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}>
        <div className={`absolute top-1 left-1 size-4 bg-white rounded-full transition-all duration-300 ${active ? 'translate-x-5' : 'translate-x-0'}`}></div>
      </div>
    </div>
  </div>
);

export default Settings;
