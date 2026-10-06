import { Link } from 'react-router-dom';
import { FolderGit2, Users, BellRing, ArrowUpRight } from 'lucide-react';

export default function StatsOverview({ stats = {} }) {
  const cards = [
    {
      label: 'Created Projects',
      value: stats.totalProjects ?? 0,
      icon: FolderGit2,
      accentBg: 'bg-blue-50',
      accentText: 'text-blue-700',
      accentBorder: 'border-blue-200',
      description: 'Projects initiated or led by you',
      link: '/projects',
    },
    {
      label: 'Team Memberships',
      value: stats.totalMemberships ?? 0,
      icon: Users,
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-700',
      accentBorder: 'border-emerald-200',
      description: 'Active capstone teams joined',
      link: '/projects',
    },
    {
      label: 'Pending Requests',
      value: stats.pendingRequests ?? 0,
      icon: BellRing,
      accentBg: 'bg-amber-50',
      accentText: 'text-amber-700',
      accentBorder: 'border-amber-200',
      description: 'Awaiting your review or decision',
      link: '/dashboard',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 w-full">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            to={card.link}
            key={card.label}
            className="group bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border ${card.accentBg} ${card.accentText} ${card.accentBorder} shadow-2xs group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>

            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {card.value}
              </p>
              <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-normal truncate min-w-0">
                  {card.description}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-900 transition-colors inline-flex items-center gap-0.5 shrink-0">
                  <span>View</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
