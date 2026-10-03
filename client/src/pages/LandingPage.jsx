import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-600 text-4xl">handshake</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4 leading-tight">
            Find Your Perfect{' '}
            <span className="text-primary-600">Project Collaborators</span>
          </h1>

          <p className="text-lg text-text-secondary mb-8 max-w-lg mx-auto">
            Match your skills with the right projects. Build teams, ship projects,
            and make your final-year project a success.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
              >
                Go to Dashboard
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
                >
                  Get Started
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-text-primary font-medium hover:bg-surface-alt transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface-alt border-t border-border px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: 'person_add',
                title: 'Create Profile',
                desc: 'Add your skills, experience, and interests to get matched with the right projects.',
              },
              {
                icon: 'search',
                title: 'Discover Projects',
                desc: 'Browse open projects, filter by skills, and find opportunities that match your expertise.',
              },
              {
                icon: 'group_add',
                title: 'Join & Collaborate',
                desc: 'Request to join projects, build your team, and start collaborating with the right people.',
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary-600 text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
