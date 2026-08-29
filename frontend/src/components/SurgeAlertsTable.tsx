'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

import { SurgeAlert } from '@/types/api.types';
import { fetchSurgeAlerts } from '@/services/api';

export default function SurgeAlertsTable() {
  const [alerts, setAlerts] = useState<SurgeAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    loadAlerts();
  }, []);

  return (
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-lg sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-slate-800 p-3">
          <AlertTriangle size={22} className="text-slate-300" />
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
        <div className="flex h-48 items-center justify-center">
          <div className="text-center">
            <AlertTriangle
              size={28}
              className="mx-auto text-red-400"
            />

            <p className="mt-3 text-sm text-red-400">
              {error}
            </p>
          </div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex h-48 items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-slate-400">
              No active surge alerts.
            </p>

            <p className="mt-1 text-xs text-slate-500">
              All monitored routes are currently stable.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-700 text-sm text-slate-400">
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Airline</th>
                <th className="px-4 py-3">Current Fare</th>
                <th className="px-4 py-3">Surge</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Detected</th>
              </tr>
            </thead>

            <tbody>
              {alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="border-b border-slate-800 text-sm text-slate-300 transition hover:bg-slate-800/40"
                >
                  <td className="px-4 py-4 font-medium text-white">
                    {alert.route}
                  </td>

                  <td className="px-4 py-4">
                    {alert.airline}
                  </td>

                  <td className="px-4 py-4">
                    ₹{alert.current_fare.toLocaleString('en-IN')}
                  </td>

                  <td className="px-4 py-4 font-medium text-white">
                    +{alert.surge_percentage.toFixed(1)}%
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400'
                          : alert.severity === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-slate-400">
                    {new Date(alert.detected_at).toLocaleTimeString(
                      'en-IN',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}