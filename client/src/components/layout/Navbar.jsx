import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Menu, X, ArrowRight, LogOut, LayoutDashboard, FolderGit2 } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 w-full transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to={user ? '/dashboard' : '/'}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-lg shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-slate-800 transition-colors">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
                COLABMATCH
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase block mt-0.5">
                Student Team Matcher
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {!user && (
            <div className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
              <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</a>
              <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
              <a href="#tech-stacks" className="hover:text-slate-900 transition-colors">Tech Catalog</a>
            </div>
          )}

          {/* Desktop Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/projects"
                  className="h-9 px-3 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Projects</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="h-9 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs inline-flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Workspace</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="h-9 px-3 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="h-9 px-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors inline-flex items-center justify-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="h-9 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer / dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3">
          {user ? (
            <div className="flex flex-col gap-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-10 px-3 rounded-xl text-sm font-semibold bg-slate-900 text-white flex items-center gap-2 justify-center shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Workspace</span>
              </Link>
              <Link
                to="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-10 px-3 rounded-xl text-sm font-medium border border-slate-200 text-slate-800 flex items-center gap-2 justify-center"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Browse Projects</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="w-full h-10 px-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 justify-center cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                How it Works
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Features
              </a>
              <a
                href="#tech-stacks"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Tech Catalog
              </a>
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-10 px-3 rounded-xl text-sm font-semibold border border-slate-200 text-slate-800 flex items-center justify-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-10 px-3 rounded-xl text-sm font-semibold bg-slate-900 text-white flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
