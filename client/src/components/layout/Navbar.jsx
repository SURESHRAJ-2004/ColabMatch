import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#0f261f] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-lg">join_inner</span>
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-none">
                COLABMATCH
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block mt-0.5">
                Developer Matching
              </span>
            </div>
          </Link>

          {/* Right side navigation buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#0f261f] text-white hover:bg-[#18362c] transition-all shadow-xs inline-flex items-center justify-center"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="h-10 px-3.5 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors inline-flex items-center justify-center cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Link
                  to="/login"
                  className="h-10 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors inline-flex items-center justify-center"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="h-10 px-4.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#0f261f] text-white hover:bg-[#18362c] transition-all shadow-xs inline-flex items-center justify-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
