'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

import { SurgeAlert } from '@/types/api.types';
import { fetchSurgeAlerts } from '@/services/api';

export default function SurgeAlertsTable() {
  const [alerts, setAlerts] = useState<SurgeAlert[]>([]);

  useEffect(() => {
    const loadAlerts = async () => {
      const data = await fetchSurgeAlerts();
      setAlerts(data);
    };

    loadAlerts();
  }, []);

  return (
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-slate-800 p-3">
          <AlertTriangle size={22} className="text-slate-300" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            Airfare Surge Alerts
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Routes showing unusual fare increases
          </p>
        </div>
      </div>

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
                className="border-b border-slate-800 text-sm text-slate-300"
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

                <td className="px-4 py-4 font-medium">
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
                  {new Date(alert.detected_at).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}