import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Badge from '../components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Users,
  ShieldCheck,
  Send,
  Code2,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  const techBadges = [
    'React', 'Node.js', 'Python', 'TypeScript', 'Tailwind CSS',
    'PyTorch', 'Next.js', 'PostgreSQL', 'Docker', 'GraphQL',
    'TensorFlow', 'Flutter', 'Go', 'FastAPI', 'MongoDB',
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Define Your Stack Profile',
      desc: 'List your technical competencies, academic major, and developer experience. Specify which roles you excel at.',
      icon: Code2,
    },
    {
      step: '02',
      title: 'Algorithmic Skill Matching',
      desc: 'Our engine computes exact compatibility percentages between your skills and project requirements.',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'Assemble Team & Ship',
      desc: 'Send personalized join requests, review candidate applications, manage seats, and ship your capstone.',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-slate-900 selection:text-white w-full">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs mb-5 sm:mb-7 hover:border-slate-300 transition-colors max-w-full">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="hidden sm:inline">Final-Year Project Collaborator Matching Platform</span>
              <span className="sm:hidden truncate">Student Capstone Collaborator Matcher</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18] mb-4 sm:mb-6">
              Find the right collaborators.{' '}
              <span className="text-emerald-700 block sm:inline">Build teams that deliver.</span>
            </h1>

            <p className="text-xs sm:text-base md:text-lg text-slate-600 mb-7 sm:mb-9 max-w-2xl mx-auto leading-relaxed font-normal">
              Stop pairing up randomly. Match technical skill sets, balance team roles, and collaborate with peer developers to take your capstone project across the finish line.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none mx-auto mb-8 sm:mb-10">
              {user ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto h-11 inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-xs active:scale-[0.98]"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto h-11 inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-xs active:scale-[0.98]"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/projects"
                    className="w-full sm:w-auto h-11 inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-xs active:scale-[0.98]"
                  >
                    <span>Explore Open Projects</span>
                  </Link>
                </>
              )}
            </div>

            {/* Social Trust Metric */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs text-slate-500 font-medium mb-10 sm:mb-14">
              <div className="flex -space-x-1.5 overflow-hidden">
                {['JD', 'AM', 'RK', 'SL'].map((initials, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full ring-2 ring-white bg-slate-800 text-white text-[10px] font-bold"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <span className="text-center">Joined by engineering students across colleges</span>
            </div>
          </div>

          {/* Interactive UI Preview Showcase Mockup */}
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between px-2 sm:px-3 py-2 border-b border-slate-100 mb-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                </div>
                <span className="hidden sm:inline font-mono text-[11px] text-slate-400">colabmatch.app/matches</span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold text-xs ml-auto sm:ml-0">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Live Matcher</span>
                </span>
              </div>

              {/* Sample Mock Matches Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge color="green" size="xs" dot>Recruiting</Badge>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Zap className="w-3 h-3 fill-current" /> 92% Match
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                      Autonomous Drone Navigation System
                    </h4>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                      Real-time SLAM and computer vision pipeline for indoor drone flight without GPS signals.
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {['Python', 'OpenCV', 'ROS', 'PyTorch'].map((tag) => (
                        <span key={tag} className="text-[10px] font-medium bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-200/80">
                    <span>3 of 4 seats occupied</span>
                    <span className="text-slate-900 font-semibold flex items-center gap-0.5">
                      Apply to Team <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge color="blue" size="xs" dot>In Progress</Badge>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <Zap className="w-3 h-3 fill-current" /> 84% Match
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                      Decentralized Patient Records Exchange
                    </h4>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                      Zero-knowledge verification for secure medical history sharing between participating research hospitals.
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {['React', 'Solidity', 'Node.js', 'Cryptography'].map((tag) => (
                        <span key={tag} className="text-[10px] font-medium bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-200/80">
                    <span>2 of 4 seats occupied</span>
                    <span className="text-slate-900 font-semibold flex items-center gap-0.5">
                      Apply to Team <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="bg-white border-y border-slate-200 py-10 sm:py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                100%
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">Skill-Driven Matching</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                50+
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">Tech Stacks Supported</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                2 to 20
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">Configurable Team Sizes</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                1-Click
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">Application Review</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            The Collaboration Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How ColabMatch pairs students for capstones
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            A structured, merit-focused workflow designed for academic and engineering excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="font-mono text-sm font-bold text-slate-300">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-white border-t border-slate-200 py-16 sm:py-24 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Platform Features
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Built specifically for final-year engineering projects
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-7 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 mb-4 shadow-xs">
                  <Zap className="w-4.5 h-4.5 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Transparent Match Scores
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  View exactly which required technologies overlap with your background so you never apply to mismatched initiatives.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 mb-4 shadow-xs">
                  <Send className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Application Management
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  Project owners review candidate profiles and intro notes in one organized dashboard, accepting or declining with 1 click.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 mb-4 shadow-xs">
                  <ShieldCheck className="w-4.5 h-4.5 text-indigo-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Portfolio-Ready Showcase
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  Showcase your GitHub, LinkedIn, and completed final-year deliverables directly to recruiters and peers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Catalog */}
      <section id="tech-stacks" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
          Find peers across 50+ languages, frameworks & tools
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          {techBadges.map((tech) => (
            <span
              key={tech}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs hover:border-slate-300 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 w-full">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Ready to assemble your final-year project team?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mb-8 leading-relaxed font-normal">
            Join other students looking for balanced skills and reliable teammates. Set up your profile in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/signup"
              className="w-full sm:w-auto h-11 px-6 rounded-xl bg-white text-slate-900 text-xs sm:text-sm font-bold hover:bg-slate-100 transition-all inline-flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto h-11 px-6 rounded-xl border border-white/20 text-white text-xs sm:text-sm font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
