'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { RouteTrendPoint } from '@/types/api.types';
import { fetchRouteTrends } from '@/services/api';

export default function HorizonComparisonChart() {
  const [data, setData] = useState<RouteTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('DEL-BOM');

  const routes = [
    'DEL-BOM',
    'BOM-BLR',
    'DEL-BLR',
    'DEL-CCU',
    'BLR-HYD',
    'MAA-DEL',
  ];

  useEffect(() => {
    const loadTrends = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await fetchRouteTrends(selectedRoute);
        setData(result);
      } catch (error) {
        setData([]);
        setError('Unable to load fare data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadTrends();
  }, [selectedRoute]);

  return (
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Booking Horizon Comparison
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Fare movement across different booking windows
          </p>
        </div>

        <div>
          <label
            htmlFor="route"
            className="mb-2 block text-xs font-medium text-slate-400"
          >
            Select Route
          </label>

          <select
            id="route"
            value={selectedRoute}
            onChange={(event) => setSelectedRoute(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-white outline-none transition focus:border-slate-500"
          >
            {routes.map((route) => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[350px] w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-white" />

              <p className="mt-3 text-sm text-slate-400">
                Loading fare data...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-slate-400">
                No fare data available for this route.
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => value.slice(5)}
              />

              <YAxis tick={{ fontSize: 11 }} />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString('en-IN')}`
                }
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="t0_fare"
                name="T+0 Fare"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="t7_fare"
                name="T+7 Fare"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="t30_fare"
                name="T+30 Fare"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}