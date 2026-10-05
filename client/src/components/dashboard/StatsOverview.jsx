import { Link } from 'react-router-dom';
import { FolderGit2, Users, BellRing, ArrowUpRight } from 'lucide-react';

export default function StatsOverview({ stats = {} }) {
  const items = [
    {
      label: 'Created Projects',
      value: stats.totalProjects ?? 0,
      icon: FolderGit2,
      accentBg: 'bg-blue-50/70',
      accentText: 'text-blue-600',
      accentBorder: 'border-blue-100',
      description: 'Projects you are leading',
      link: '/projects',
    },
    {
      label: 'Team Memberships',
      value: stats.totalMemberships ?? 0,
      icon: Users,
      accentBg: 'bg-emerald-50/70',
      accentText: 'text-emerald-700',
      accentBorder: 'border-emerald-100',
      description: 'Active project teams',
      link: '/projects',
    },
    {
      label: 'Pending Requests',
      value: stats.pendingRequests ?? 0,
      icon: BellRing,
      accentBg: 'bg-amber-50/70',
      accentText: 'text-amber-600',
      accentBorder: 'border-amber-100',
      description: 'Awaiting team review',
      link: '/dashboard',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            to={item.link}
            key={item.label}
            className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {item.label}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.accentBg} ${item.accentText} ${item.accentBorder} shadow-2xs group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>

            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {item.value}
              </p>
              <div className="flex items-center justify-between gap-2 mt-1.5 pt-2 border-t border-slate-100/80">
                <span className="text-xs text-slate-400 font-normal truncate min-w-0">
                  {item.description}
                </span>
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-900 transition-colors inline-flex items-center gap-0.5 shrink-0">
                  Details <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
