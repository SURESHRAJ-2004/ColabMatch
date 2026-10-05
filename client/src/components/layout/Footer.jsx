import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-auto py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-100">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                COLABMATCH
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal max-w-sm leading-relaxed mb-4">
              An intelligent final-year collaboration hub built for student developers, engineers, and creators to assemble balanced teams and ship real-world initiatives.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>for student engineers</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Platform
            </p>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link to="/projects" className="hover:text-slate-900 transition-colors">Browse Projects</Link></li>
              <li><Link to="/matches" className="hover:text-slate-900 transition-colors">Smart Matching</Link></li>
              <li><Link to="/signup" className="hover:text-slate-900 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Resources
            </p>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link to="/login" className="hover:text-slate-900 transition-colors">Student Login</Link></li>
              <li><a href="#how-it-works" className="hover:text-slate-900 transition-colors">Matching Engine Guide</a></li>
              <li><a href="#faq" className="hover:text-slate-900 transition-colors">FAQ & Tips</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>&copy; {currentYear} COLABMATCH. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span className="hover:text-slate-600 transition-colors">Final-Year Capstone Platform</span>
            <span>&bull;</span>
            <span className="hover:text-slate-600 transition-colors">Portfolio Edition</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
