import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fa] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 sm:py-28">
        <div className="max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs font-bold text-slate-800 shadow-xs mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Designed for Student Developers & Final-Year Teams
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Find the right collaborators.{' '}
            <span className="text-[#0f261f] block sm:inline">Build project teams that deliver.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed font-normal">
            Match technical skills, find balanced project teammates, and collaborate with peers across colleges to take your final-year project to completion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none mx-auto">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0f261f] text-white font-bold hover:bg-[#18362c] transition-all shadow-xs"
              >
                Go to Dashboard
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#0f261f] text-white font-bold hover:bg-[#18362c] transition-all shadow-xs"
                >
                  Get Started Free
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200/90 text-slate-800 font-bold hover:bg-slate-50 transition-colors shadow-xs"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="bg-white border-t border-slate-200/80 px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              How ColabMatch Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              A smarter way to assemble developer teams
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: 'badge',
                title: 'Showcase Your Tech Stack',
                desc: 'Add your skills, university, and level of experience to unlock accurate compatibility recommendations.',
              },
              {
                icon: 'auto_awesome',
                title: 'Algorithm-Ranked Matches',
                desc: 'Browse projects and candidates sorted by verified skill overlaps and team requirements.',
              },
              {
                icon: 'handshake',
                title: 'Request & Manage Members',
                desc: 'Send join requests with custom intros and accept teammates into project teams with one click.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-slate-50/60 rounded-[28px] border border-slate-200/80 p-7 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-[#0f261f] mb-5 shadow-xs">
                  <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
