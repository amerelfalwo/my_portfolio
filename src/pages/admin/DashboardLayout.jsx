import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { m } from 'framer-motion';
import { 
  FolderKanban, Cpu, Award, Settings, LogOut, Hexagon, ExternalLink, Menu, X, ShieldCheck,
  GraduationCap
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/admin/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { path: '/admin/dashboard/skills', label: 'Skills', icon: Cpu },
  { path: '/admin/dashboard/education', label: 'Education', icon: GraduationCap },
  { path: '/admin/dashboard/certificates', label: 'Certificates', icon: Award },
  { path: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
];

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('aura_token');
    document.cookie = 'aura_token=; Max-Age=0; path=/;';
    navigate('/admin/login');
  };

  const getPageTitle = () => {
    const item = NAV_ITEMS.find((n) => location.pathname.startsWith(n.path));
    return item ? item.label : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-purple-500/30">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-slate-900/60 backdrop-blur-2xl border-r border-slate-800/60 p-6 relative z-20 shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Hexagon className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 uppercase">
              Aura CMS
            </h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">Control Center</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-2 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/20 to-cyan-500/10 text-white border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="pt-6 border-t border-slate-800/80 space-y-4">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/30 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white leading-tight truncate">Administrator</p>
              <p className="text-[9px] font-mono text-emerald-400/80 leading-tight truncate">Session Active</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Header */}
        <header className="h-20 bg-slate-900/40 backdrop-blur-md border-b border-slate-800/60 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-xl font-extrabold tracking-tight text-white uppercase font-mono">
              {getPageTitle()}
            </h2>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/60 text-slate-300 hover:text-white hover:border-cyan-400/40 text-xs font-bold tracking-wide transition-all"
          >
            <span>Live Portfolio</span>
            <ExternalLink size={14} className="text-cyan-400" />
          </a>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold mt-4"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}

        {/* Page Views Container */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
