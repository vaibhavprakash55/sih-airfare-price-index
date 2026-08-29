'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

import { SurgeAlert } from '@/types/api.types';
import { fetchSurgeAlerts } from '@/services/api';

export default function SurgeAlertsTable() {
  const [alerts, setAlerts] = useState<SurgeAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAlerts = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchSurgeAlerts();
      setAlerts(data);
    } catch (error) {
      setAlerts([]);
      setError('Unable to load surge alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const getSeverityStyle = (severity: string) => {
    if (severity === 'CRITICAL') {
      return {
        badge: 'bg-red-500/15 text-red-400 border-red-500/20',
        surge: 'text-red-400',
      };
    }

    if (severity === 'HIGH') {
      return {
        badge: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
        surge: 'text-orange-400',
      };
    }

    return {
      badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
      surge: 'text-yellow-400',
    };
  };

  return (
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-lg sm:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-3">
            <AlertTriangle
              size={22}
              className="text-slate-300"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Airfare Surge Alerts
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Routes showing unusual fare increases
            </p>
          </div>
        </div>

        {/* Refresh Button */}
        {!loading && (
          <button
            type="button"
            onClick={loadAlerts}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-700 hover:text-white sm:self-auto"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-white" />

            <p className="mt-3 text-sm text-slate-400">
              Loading surge alerts...
            </p>

          </div>
        </div>
      ) : error ? (
        /* Error */
        <div className="flex h-48 items-center justify-center">
          <div className="text-center">

            <AlertTriangle
              size={28}
              className="mx-auto text-red-400"
            />

            <p className="mt-3 text-sm text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={loadAlerts}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

          </div>
        </div>
      ) : alerts.length === 0 ? (
        /* Empty State */
        <div className="flex h-48 items-center justify-center">
          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <AlertTriangle
                size={22}
                className="text-green-400"
              />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-300">
              No active surge alerts
            </p>

            <p className="mt-1 text-xs text-slate-500">
              All monitored routes are currently stable.
            </p>

          </div>
        </div>
      ) : (
        /* Table */
        <div className="overflow-x-auto rounded-xl border border-slate-800">

          <table className="w-full min-w-[760px] text-left">

            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3.5">
                  Route
                </th>

                <th className="px-4 py-3.5">
                  Airline
                </th>

                <th className="px-4 py-3.5">
                  Current Fare
                </th>

                <th className="px-4 py-3.5">
                  Surge
                </th>

                <th className="px-4 py-3.5">
                  Severity
                </th>

                <th className="px-4 py-3.5">
                  Detected
                </th>
              </tr>
            </thead>

            <tbody>
              {alerts.map((alert) => {
                const severityStyle = getSeverityStyle(
                  alert.severity
                );

                return (
                  <tr
                    key={alert.id}
                    className="border-b border-slate-800 text-sm text-slate-300 transition last:border-b-0 hover:bg-slate-800/40"
                  >
                    {/* Route */}
                    <td className="px-4 py-4">
                      <span className="font-semibold text-white">
                        {alert.route}
                      </span>
                    </td>

                    {/* Airline */}
                    <td className="px-4 py-4">
                      <span className="text-slate-300">
                        {alert.airline}
                      </span>
                    </td>

                    {/* Fare */}
                    <td className="px-4 py-4">
                      <span className="font-medium text-slate-200">
                        ₹{alert.current_fare.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Surge */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp
                          size={15}
                          className={severityStyle.surge}
                        />

                        <span
                          className={`font-semibold ${severityStyle.surge}`}
                        >
                          +{alert.surge_percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${severityStyle.badge}`}
                      >
                        {alert.severity}
                      </span>
                    </td>

                    {/* Detected */}
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-300">
                          {new Date(
                            alert.detected_at
                          ).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(
                            alert.detected_at
                          ).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      )}

      {/* Bottom Information */}
      {!loading && !error && alerts.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            {alerts.length} active alert
            {alerts.length !== 1 ? 's' : ''}
          </span>

          <span>
            Live monitoring
          </span>
        </div>
      )}

    </div>
  );
}