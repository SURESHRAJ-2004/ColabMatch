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
      <PageLayout title="Dashboard" description="Loading your project workspace...">
        <Spinner className="py-24" />
      </PageLayout>
    );
  }

  if (!data) {
    return (
      <PageLayout title="Dashboard" description="Overview of your collaboration activity">
        <p className="text-center text-slate-500 py-24">Failed to load dashboard data.</p>
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
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f261f] text-white text-xs sm:text-sm font-bold hover:bg-[#18362c] transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New Project
        </Link>
      }
    >
      <div className="space-y-6 sm:space-y-8 overflow-x-hidden">
        {/* Welcome Hero Banner */}
        <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/70 mb-3.5">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Final-Year Collaboration Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Ready to build, {studentName}?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed font-normal">
              Connect your technical skills with the right final-year project teams. Review collaborator requests and browse AI-ranked project matches.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto relative z-10">
            <Link
              to="/matches"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f261f] text-white text-xs sm:text-sm font-bold hover:bg-[#18362c] transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              View Matches
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
            >
              Browse Projects
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={data.stats} />

        {/* 2-Column Split: Active Projects & Incoming Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Projects Card */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">My Projects</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Projects created or led by you</p>
              </div>
              <Link
                to="/projects"
                className="text-xs font-bold text-[#0f261f] hover:underline flex items-center gap-0.5"
              >
                View all
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="flex-1">
              <MyProjects projects={data.myProjects} />
            </div>
          </div>

          {/* Incoming Requests Card */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Incoming Join Requests</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Teammates who applied to your projects</p>
              </div>
            </div>
            <div className="flex-1">
              <JoinRequestsList requests={data.incomingRequests} type="incoming" />
            </div>
          </div>
        </div>

        {/* Recommended Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Recommended For You
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Projects looking for developers with your exact skills
              </p>
            </div>
            <Link
              to="/matches"
              className="text-xs font-bold text-[#0f261f] hover:underline flex items-center gap-1"
            >
              See all matches
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <RecommendedSection projects={data.recommendedProjects} />
        </div>

        {/* Outgoing Applications Section */}
        {data.outgoingRequests?.length > 0 && (
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">My Sent Applications</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Projects you requested to join</p>
            </div>
            <JoinRequestsList requests={data.outgoingRequests} type="outgoing" />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
