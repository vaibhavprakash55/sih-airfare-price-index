'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  Plane,
  Database,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

import { DashboardStats } from '@/types/api.types';
import { fetchDashboardStats } from '@/services/api';

export default function MetricCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchDashboardStats();
      setStats(data);
    };

    loadStats();
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-2xl bg-slate-900"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Airfare Price Index',
      value: stats.current_index.toFixed(2),
      change: `${stats.change_24h >= 0 ? '+' : ''}${stats.change_24h.toFixed(2)}%`,
      description: 'Change in last 24 hours',
      icon: Activity,
    },
    {
      title: 'Routes Monitored',
      value: stats.routes_monitored.toString(),
      change: 'Active',
      description: 'Domestic city-pairs',
      icon: Plane,
    },
    {
      title: 'Scraped Today',
      value: stats.total_scraped_today.toLocaleString('en-IN'),
      change: 'Quotes',
      description: 'Collected today',
      icon: Database,
    },
    {
      title: 'Active Anomalies',
      value: stats.active_anomalies.toString(),
      change: 'Alerts',
      description: 'Require attention',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-slate-600"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-400">
                  {card.title}
                </p>

                <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                  {card.value}
                </h3>
              </div>

              <div className="rounded-xl bg-slate-800 p-3 transition group-hover:bg-slate-700">
                <Icon size={21} className="text-slate-300" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <TrendingUp size={15} className="text-slate-300" />

              <span className="text-sm font-semibold text-slate-200">
                {card.change}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}