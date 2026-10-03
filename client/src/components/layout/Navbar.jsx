import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/matches', label: 'Matches', icon: 'auto_awesome' },
    { to: '/projects', label: 'Projects', icon: 'folder_open' },
    { to: '/profile', label: 'Profile', icon: 'person' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-primary-600 text-2xl">handshake</span>
            <span className="text-base sm:text-lg font-bold text-text-primary tracking-tight">COLABMATCH</span>
          </Link>

          {/* Desktop & Tablet Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors
                    ${isActive(link.to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary'
                    }`}
                >
                  <span className="material-symbols-outlined text-base lg:text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="hidden md:flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium text-text-secondary hover:bg-surface-alt transition-colors"
                >
                  <span className="material-symbols-outlined text-base lg:text-lg">logout</span>
                  Logout
                </button>
                {/* Mobile menu button */}
                <button
                  type="button"
                  aria-label="Toggle navigation menu"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <span className="material-symbols-outlined text-2xl">{mobileOpen ? 'close' : 'menu'}</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-text-secondary hover:bg-surface-alt transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && mobileOpen && (
          <div className="md:hidden pb-4 border-t border-border pt-3">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive(link.to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-text-secondary hover:bg-surface-alt'
                    }`}
                >
                  <span className="material-symbols-outlined text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => { setMobileOpen(false); handleSignOut(); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-alt transition-colors"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
