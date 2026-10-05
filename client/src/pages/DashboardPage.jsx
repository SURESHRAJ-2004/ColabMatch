import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import StatsOverview from '../components/dashboard/StatsOverview';
import MyProjects from '../components/dashboard/MyProjects';
import JoinRequestsList from '../components/dashboard/JoinRequestsList';
import RecommendedSection from '../components/dashboard/RecommendedSection';
import Skeleton from '../components/ui/Skeleton';
import { Plus, Sparkles, FolderGit2, ArrowRight } from 'lucide-react';

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
      <PageLayout title="Dashboard" description="Loading your project workspace...">
        <div className="space-y-6">
          <Skeleton className="w-full h-36 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!data) {
    return (
      <PageLayout title="Dashboard" description="Overview of your collaboration activity">
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-slate-500 text-sm mb-4">Failed to load dashboard data.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      </PageLayout>
    );
  }

  const studentName = data.profile?.full_name || 'Student';

  return (
    <PageLayout
      title="Dashboard"
      description={`Welcome back, ${studentName}`}
      actions={
        <Link
          to="/projects/new"
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </Link>
      }
    >
      <div className="space-y-6 sm:space-y-8 overflow-x-hidden">
        {/* Welcome Hero Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Final-Year Collaboration Workspace</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              Ready to collaborate, {studentName}?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed font-normal">
              Browse algorithm-ranked projects matching your tech stack or review pending applications to your capstone initiatives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0 relative z-10">
            <Link
              to="/matches"
              className="inline-flex items-center justify-center gap-1.5 h-9.5 px-4 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Matches</span>
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-1.5 h-9.5 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-xs"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Browse Projects</span>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={data.stats} />

        {/* 2-Column Split: Active Projects & Incoming Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Projects Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">My Projects</h3>
                <p className="text-xs text-slate-400 font-normal mt-0.5">Projects created or led by you</p>
              </div>
              <Link
                to="/projects"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex-1">
              <MyProjects projects={data.myProjects} />
            </div>
          </div>

          {/* Incoming Requests Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Incoming Join Requests</h3>
                <p className="text-xs text-slate-400 font-normal mt-0.5">Students who applied to your project teams</p>
              </div>
            </div>
            <div className="flex-1">
              <JoinRequestsList requests={data.incomingRequests} type="incoming" />
            </div>
          </div>
        </div>

        {/* Recommended Projects Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-emerald-600" />
                <span>Recommended For You</span>
              </h3>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Projects actively recruiting developers with your exact skillset
              </p>
            </div>
            <Link
              to="/matches"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>See all matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <RecommendedSection projects={data.recommendedProjects} />
        </div>

        {/* Outgoing Applications Section */}
        {data.outgoingRequests?.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">My Sent Applications</h3>
              <p className="text-xs text-slate-400 font-normal mt-0.5">Projects you requested to join</p>
            </div>
            <JoinRequestsList requests={data.outgoingRequests} type="outgoing" />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
