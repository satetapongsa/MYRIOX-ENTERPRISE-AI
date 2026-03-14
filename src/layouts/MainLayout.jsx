import { Link, Outlet, useLocation } from 'react-router-dom';

const MainLayout = ({ onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', path: '/', icon: 'dashboard' },
    { title: 'Datasets', path: '/datasets', icon: 'database' },
    { title: 'AI Models', path: '/models', icon: 'psychology' },
    { title: 'Reports', path: '/reports', icon: 'description' },
    { title: 'Settings', path: '/settings', icon: 'settings' },
  ];

  const currentPath = location.pathname;

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display dark">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-all">
        <Link to="/" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Analytica AI</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Enterprise</p>
          </div>
        </Link>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-2">
          {menuItems.map((item) => {
             const isActive = (currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path)));
             return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                  {item.icon}
                </span>
                <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.title}</span>
              </Link>
             );
          })}

          <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administration</div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group mb-4"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-red-500">logout</span>
            <span className="text-sm font-medium group-hover:text-red-500">Sign Out</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-primary/5 rounded-xl p-4 mb-4 border border-primary/10">
            <p className="text-xs font-bold text-primary mb-1 uppercase tracking-tight">Upgrade Available</p>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">Unlock advanced real-time AI and LLM monitoring.</p>
            <button className="w-full bg-primary text-white text-[11px] font-bold py-2 rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/10">Upgrade Plan</button>
          </div>
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center">
               <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc-DS84X_cHmxE0-CnyLHpQ9UfbgF-6RSORsUnccm0H40oO814OCnfSP--6RQsFMT6ny2kSRo2tActeZcS9iacKZmv6Eu-MYJ_q0JpYjmDJOVstirgqiJPS7G7vXLQMRYDtHQWnd76jnpHAbeqwcAkNRKytygR3RBKY1Ey33wf2aj9qosFEdw-Gshf1QdRk1chFbmnJlRXOZWdEo-4bXMdfpwLQH0LR5xZ1PTsoGhL4FwJBHjRRFYvV3t8Xdq2Q6uGaThFmkGz5Sma" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">Alex Morgan</p>
              <p className="text-[10px] text-slate-500 truncate">alex@analytics.ai</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md z-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="hover:text-primary cursor-pointer transition-colors">Home</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold capitalize">
                {currentPath === '/' ? 'Dashboard' : currentPath.substring(1).replace('-', ' ')}
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block mx-2"></div>
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input 
                className="pl-10 pr-4 py-2 rounded-lg border-none bg-slate-100 dark:bg-slate-800/80 text-sm focus:ring-2 focus:ring-primary w-72 transition-all outline-none" 
                placeholder="Search resources, models, insights..." 
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:text-primary transition-colors relative flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <button className="p-2 text-slate-500 hover:text-primary transition-colors flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-sm">add</span>
              <span>New Action</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
           <div className="p-8">
              <Outlet />
           </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
