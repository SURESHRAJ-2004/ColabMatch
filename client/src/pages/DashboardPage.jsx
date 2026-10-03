import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import StatsOverview from '../components/dashboard/StatsOverview';
import MyProjects from '../components/dashboard/MyProjects';
import JoinRequestsList from '../components/dashboard/JoinRequestsList';
import RecommendedSection from '../components/dashboard/RecommendedSection';
import Spinner from '../components/ui/Spinner';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <Spinner className="py-20" />
      </PageLayout>
    );
  }

  if (!data) {
    return (
      <PageLayout>
        <p className="text-center text-text-secondary py-20">Failed to load dashboard.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
            Welcome, {data.profile?.full_name || 'Student'}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Here's an overview of your activity
          </p>
        </div>
        <Link
          to="/projects/new"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors self-start sm:self-auto shrink-0 shadow-xs"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Project
        </Link>
      </div>

      {/* Stats */}
      <StatsOverview stats={data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* My Projects */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-text-primary">My Projects</h2>
            <Link to="/projects" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          <MyProjects projects={data.myProjects} />
        </div>

        {/* Incoming Requests */}
        <div>
          <h2 className="text-base font-semibold text-text-primary mb-3">Incoming Requests</h2>
          <JoinRequestsList requests={data.incomingRequests} type="incoming" />
        </div>
      </div>

      {/* Recommended Projects */}
      <div className="mt-6">
        <h2 className="text-base font-semibold text-text-primary mb-3">Recommended For You</h2>
        <RecommendedSection projects={data.recommendedProjects} />
      </div>

      {/* Outgoing Requests */}
      {data.outgoingRequests?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-base font-semibold text-text-primary mb-3">My Applications</h2>
          <JoinRequestsList requests={data.outgoingRequests} type="outgoing" />
        </div>
      )}
    </PageLayout>
  );
}
