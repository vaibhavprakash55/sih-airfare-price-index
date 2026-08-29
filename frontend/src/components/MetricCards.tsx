'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  Plane,
  Database,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

import { DashboardStats } from '@/types/api.types';
import { fetchDashboardStats } from '@/services/api';

export default function MetricCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        setStats(null);
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />

                <div className="mt-4 h-9 w-24 animate-pulse rounded bg-slate-800" />
              </div>

              <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-800" />
            </div>

            <div className="mt-6 h-4 w-20 animate-pulse rounded bg-slate-800" />

            <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-red-500/10 p-3">
            <AlertTriangle size={22} className="text-red-400" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Dashboard data unavailable
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {error || 'Unable to load dashboard data.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const indexChangePositive = stats.change_24h >= 0;

  const cards = [
    {
      title: 'Airfare Price Index',
      value: stats.current_index.toFixed(2),
      change: `${indexChangePositive ? '+' : ''}${stats.change_24h.toFixed(2)}%`,
      description: 'Change in last 24 hours',
      icon: Activity,
      trend: indexChangePositive ? 'up' : 'down',
    },
    {
      title: 'Routes Monitored',
      value: stats.routes_monitored.toString(),
      change: 'Active',
      description: 'Domestic city-pairs',
      icon: Plane,
      trend: 'neutral',
    },
    {
      title: 'Scraped Today',
      value: stats.total_scraped_today.toLocaleString('en-IN'),
      change: 'Quotes',
      description: 'Collected today',
      icon: Database,
      trend: 'neutral',
    },
    {
      title: 'Active Anomalies',
      value: stats.active_anomalies.toString(),
      change: 'Alerts',
      description: 'Require attention',
      icon: AlertTriangle,
      trend: stats.active_anomalies > 0 ? 'warning' : 'neutral',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-slate-600 hover:shadow-xl"
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

              <div className="rounded-xl border border-slate-700 bg-slate-800 p-3 transition group-hover:border-slate-600 group-hover:bg-slate-700">
                <Icon size={21} className="text-slate-300" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {card.trend === 'up' && (
                <div className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-2 py-1">
                  <TrendingUp size={14} className="text-green-400" />

                  <span className="text-sm font-semibold text-green-400">
                    {card.change}
                  </span>
                </div>
              )}

              {card.trend === 'down' && (
                <div className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-2 py-1">
                  <TrendingDown size={14} className="text-red-400" />

                  <span className="text-sm font-semibold text-red-400">
                    {card.change}
                  </span>
                </div>
              )}

              {card.trend === 'warning' && (
                <div className="flex items-center gap-1.5 rounded-lg bg-orange-500/10 px-2 py-1">
                  <AlertTriangle
                    size={14}
                    className="text-orange-400"
                  />

                  <span className="text-sm font-semibold text-orange-400">
                    {card.change}
                  </span>
                </div>
              )}

              {card.trend === 'neutral' && (
                <div className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-2 py-1">
                  <span className="text-sm font-semibold text-slate-300">
                    {card.change}
                  </span>
                </div>
              )}
            </div>

            <p className="mt-2 text-xs text-slate-500">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}