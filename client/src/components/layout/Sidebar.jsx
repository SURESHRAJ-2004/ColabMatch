import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function SidebarContent({ onClose }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: 'grid_view' },
    { to: '/matches', label: 'Smart Matches', icon: 'auto_awesome' },
    { to: '/projects', label: 'Projects', icon: 'folder_open' },
    { to: '/profile', label: 'My Profile', icon: 'person' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const isCurrentActive = (path) => {
    if (path === '/projects') {
      return location.pathname.startsWith('/projects');
    }
    if (path === '/profile') {
      return location.pathname === '/profile';
    }
    return location.pathname === path;
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Student Developer';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="flex flex-col justify-between h-full bg-white select-none">
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="h-[72px] px-5 flex items-center justify-between border-b border-slate-100">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0f261f] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-lg">join_inner</span>
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-slate-900 block leading-tight">
                COLABMATCH
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block">
                Project Workspace
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Close navigation"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="px-3.5 py-5 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Navigation
          </p>
          {navLinks.map((item) => {
            const active = isCurrentActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-[#0f261f] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] transition-colors ${
                    active ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Middle Action */}
      <div className="px-3.5 py-2">
        <Link
          to="/projects/new"
          onClick={onClose}
          className="w-full h-10 flex items-center justify-center gap-2 px-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs font-bold text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-2xs"
        >
          <span className="material-symbols-outlined text-base text-[#0f261f]">add</span>
          Create Project
        </Link>
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/40">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-slate-500 text-sm">
                  person
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'View Profile'}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            title="Sign out"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1 cursor-pointer shrink-0"
            aria-label="Sign out"
          >
            <span className="material-symbols-outlined text-base">logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Drawer (visible on < lg when isOpen) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <aside className="fixed inset-y-0 left-0 w-64 max-w-[80vw] bg-white shadow-2xl flex flex-col z-50 border-r border-slate-200">
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col h-screen sticky top-0 bg-white border-r border-slate-200/80 z-20 overflow-hidden">
        <SidebarContent />
      </aside>
    </>
  );
}
