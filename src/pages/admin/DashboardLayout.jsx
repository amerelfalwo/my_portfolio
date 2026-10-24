import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FolderKanban, Cpu, Award, GraduationCap, User, Settings, 
  Mail, Briefcase, BookOpen, ExternalLink, Menu, X, LogOut 
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/admin/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { path: '/admin/dashboard/skills', label: 'Skills', icon: Cpu },
  { path: '/admin/dashboard/certificates', label: 'Certificates', icon: Award },
  { path: '/admin/dashboard/education', label: 'Education', icon: GraduationCap },
  { path: '/admin/dashboard/about', label: 'About & Bio', icon: User },
  { path: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
  { path: '/admin/dashboard/inbox', label: 'Inbox', icon: Mail },
  { path: '/admin/dashboard/services', label: 'Services', icon: Briefcase },
  { path: '/admin/dashboard/trainings', label: 'Trainings', icon: BookOpen },
];

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';
    return () => {
      if (meta) meta.content = 'index, follow';
    };
  }, []);

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
    <div className="min-h-screen bg-background text-foreground flex font-sans selection:bg-foreground/10">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-surface border-e border-border p-5 shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <img
            src="/icon-classic.svg"
            alt="Logo"
            className="w-8 h-8 rounded-lg"
          />
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-foreground">
              Amir Elrefai
            </h1>
            <p className="text-xs text-muted">Admin Dashboard</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 flex-1" aria-label="Admin Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-surface-muted text-foreground font-medium border border-border/80'
                    : 'text-muted hover:text-foreground hover:bg-surface-muted border border-transparent'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-foreground' : 'text-muted'} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User & Logout */}
        <div className="pt-4 border-t border-border mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg border border-border text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h2 className="text-base font-medium text-foreground">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-surface text-foreground text-xs font-medium hover:bg-surface-muted transition-colors"
            >
              <span>View site</span>
              <ExternalLink size={12} className="rtl:-scale-x-100" />
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border bg-surface text-muted hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut size={12} />
              <span>Log out</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-surface border-b border-border p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-surface-muted text-foreground font-medium'
                      : 'text-muted hover:text-foreground hover:bg-surface-muted'
                  }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 mt-2"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        )}

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
