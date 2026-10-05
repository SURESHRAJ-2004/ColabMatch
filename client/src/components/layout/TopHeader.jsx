import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Sparkles } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

export default function TopHeader({ onOpenSidebar, title, description, actions }) {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Developer';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 transition-all">
      <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        {/* Left: Mobile hamburger & Page Header Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs cursor-pointer shrink-0"
            aria-label="Open sidebar"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>

          {title && (
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 tracking-tight truncate">
                {title}
              </h1>
              {description && (
                <p className="text-xs text-slate-500 font-normal truncate hidden sm:block">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: Quick Controls, Actions & Profile pill */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
          {actions && <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">{actions}</div>}

          {/* Quick Match Pill - Desktop only */}
          <Link
            to="/matches"
            className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-xs whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Smart Matches</span>
          </Link>

          {/* User Avatar Pill */}
          <Link
            to="/profile"
            className="flex items-center gap-2 p-1.5 sm:pl-1.5 sm:pr-2.5 h-9 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-xs shrink-0"
            title="My Profile"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center overflow-hidden shrink-0 text-[10px] font-bold">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-6 h-6 object-cover" />
              ) : (
                <span>{getInitials(displayName)}</span>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-800 max-w-[90px] truncate hidden md:inline">
              {displayName}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
