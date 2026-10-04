import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function TopHeader({ onOpenSidebar, title, description, actions }) {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Developer';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <header className="sticky top-0 z-30 bg-[#f7f8fa]/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 transition-all">
      <div className="flex items-center justify-between gap-3 min-w-0">
        {/* Left: Mobile hamburger & Page Header Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="lg:hidden p-2 -ml-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs cursor-pointer shrink-0"
            aria-label="Open sidebar"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>

          {title && (
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">
                {title}
              </h1>
              {description && (
                <p className="text-xs text-slate-500 font-medium truncate hidden sm:block">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: Quick Controls, Actions & Profile pill */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0">
          {actions && <div className="flex items-center gap-2 min-w-0">{actions}</div>}

          {/* Quick Match Pill */}
          <Link
            to="/matches"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-sm text-[#0f261f]">auto_awesome</span>
            Smart Matches
          </Link>

          {/* User Avatar Pill */}
          <Link
            to="/profile"
            className="flex items-center gap-2 pl-1.5 pr-2.5 h-9 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs shrink-0"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-6 h-6 object-cover" />
              ) : (
                <span className="material-symbols-outlined text-slate-500 text-xs">person</span>
              )}
            </div>
            <span className="text-xs font-bold text-slate-800 max-w-[80px] truncate hidden md:inline">
              {displayName}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
