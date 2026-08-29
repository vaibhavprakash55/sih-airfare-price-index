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

  const latestData =
    data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-lg sm:p-6">

      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            Booking Horizon Comparison
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Fare movement across different booking windows
          </p>
        </div>

        {/* Route Selector */}
        <div className="w-full md:w-auto">
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
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-white outline-none transition hover:border-slate-600 focus:border-slate-500 md:w-40"
          >
            {routes.map((route) => (
              <option key={route} value={route}>
                {route}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* ================= HORIZON SUMMARY ================= */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

        {/* T+0 */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">

          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">
              T+0
            </p>

            <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-400">
              Today
            </span>
          </div>

          <p className="mt-2 text-sm font-medium text-slate-300">
            Same-day booking
          </p>

          <p className="mt-3 text-xl font-bold text-white">
            {latestData
              ? `₹${latestData.t0_fare.toLocaleString('en-IN')}`
              : '--'}
          </p>

        </div>

        {/* T+7 */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">

          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">
              T+7
            </p>

            <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-400">
              7 Days
            </span>
          </div>

          <p className="mt-2 text-sm font-medium text-slate-300">
            Advance booking
          </p>

          <p className="mt-3 text-xl font-bold text-white">
            {latestData
              ? `₹${latestData.t7_fare.toLocaleString('en-IN')}`
              : '--'}
          </p>

        </div>

        {/* T+30 */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">

          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">
              T+30
            </p>

            <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-400">
              30 Days
            </span>
          </div>

          <p className="mt-2 text-sm font-medium text-slate-300">
            Advance booking
          </p>

          <p className="mt-3 text-xl font-bold text-white">
            {latestData
              ? `₹${latestData.t30_fare.toLocaleString('en-IN')}`
              : '--'}
          </p>

        </div>

      </div>

      {/* ================= CHART ================= */}
      <div className="h-[350px] w-full">

        {/* Loading */}
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

          /* Error */
          <div className="flex h-full items-center justify-center">

            <div className="text-center">

              <p className="text-sm text-red-400">
                {error}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Please select another route or try again.
              </p>

            </div>

          </div>

        ) : data.length === 0 ? (

          /* Empty */
          <div className="flex h-full items-center justify-center">

            <div className="text-center">

              <p className="text-sm text-slate-400">
                No fare data available for this route.
              </p>

            </div>

          </div>

        ) : (

          /* Chart */
          <ResponsiveContainer width="100%" height="100%">

            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 5,
                bottom: 10,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
              />

              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 11,
                  fill: '#94a3b8',
                }}
                tickFormatter={(value) => value.slice(5)}
                axisLine={{
                  stroke: '#334155',
                }}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 11,
                  fill: '#94a3b8',
                }}
                tickFormatter={(value) =>
                  `₹${Number(value).toLocaleString('en-IN')}`
                }
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '10px 12px',
                }}
                labelStyle={{
                  color: '#ffffff',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
                itemStyle={{
                  color: '#e2e8f0',
                }}
                formatter={(value, name) => [
                  `₹${Number(value).toLocaleString('en-IN')}`,
                  name === 't0_fare'
                    ? 'T+0 Fare'
                    : name === 't7_fare'
                    ? 'T+7 Fare'
                    : 'T+30 Fare',
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />

              <Legend
                wrapperStyle={{
                  paddingTop: '10px',
                  fontSize: '12px',
                }}
              />

              <Line
                type="monotone"
                dataKey="t0_fare"
                name="T+0 Fare"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 5,
                }}
              />

              <Line
                type="monotone"
                dataKey="t7_fare"
                name="T+7 Fare"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 5,
                }}
              />

              <Line
                type="monotone"
                dataKey="t30_fare"
                name="T+30 Fare"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 5,
                }}
              />

            </LineChart>

          </ResponsiveContainer>

        )}

      </div>

      {/* ================= FOOTER ================= */}
      {!loading && !error && data.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4">

          <span className="text-xs text-slate-500">
            Route: {selectedRoute}
          </span>

          <span className="text-xs text-slate-500">
            30-day fare movement
          </span>

        </div>
      )}

    </div>
  );
}