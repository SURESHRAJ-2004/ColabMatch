import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  FolderGit2,
  User,
  Plus,
  LogOut,
  X,
} from 'lucide-react';
import { getInitials } from '../../utils/helpers';

function SidebarInner({ onClose }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/matches', label: 'Smart Matches', icon: Sparkles, badge: 'AI' },
    { to: '/projects', label: 'Projects', icon: FolderGit2 },
    { to: '/profile', label: 'My Profile', icon: User },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const isCurrentActive = (to) => {
    if (to === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(to);
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Student Developer';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="flex flex-col justify-between h-full bg-white select-none">
      {/* Top Header & Navigation */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Brand header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 shrink-0">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-slate-800 transition-colors">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-slate-900 block leading-tight">
                COLABMATCH
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block">
                Workspace
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <div className="px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Navigation
          </p>
          {navItems.map((item) => {
            const active = isCurrentActive(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-all duration-150 ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      active
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Middle Quick Action */}
      <div className="px-3 py-2 shrink-0">
        <Link
          to="/projects/new"
          onClick={onClose}
          className="w-full h-9 flex items-center justify-center gap-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-slate-700" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center overflow-hidden shrink-0 text-xs font-bold">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-7 h-7 object-cover"
                />
              ) : (
                <span>{getInitials(displayName)}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'Student Account'}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            title="Sign out"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer shrink-0"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Drawer (visible on < 1024px when isOpen) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 w-64 max-w-[85vw] bg-white shadow-xl flex flex-col z-50 border-r border-slate-200">
            <SidebarInner onClose={onClose} />
          </aside>
        </div>
      )}

      {/* Desktop Fixed Sidebar (visible on lg+) */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col h-full bg-white border-r border-slate-200 z-20 overflow-hidden">
        <SidebarInner />
      </aside>
    </>
  );
}
