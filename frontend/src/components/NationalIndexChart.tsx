'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { IndexHistoryPoint } from '@/types/api.types';
import { fetchIndexHistory } from '@/services/api';

export default function NationalIndexChart() {
  const [data, setData] = useState<IndexHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await fetchIndexHistory('30d');
        setData(result);
      } catch (error) {
        setData([]);
        setError('Unable to load index data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const latestValue =
    data.length > 0 ? data[data.length - 1].index_value : null;

  const previousValue =
    data.length > 1 ? data[data.length - 2].index_value : null;

  const change =
    latestValue !== null && previousValue !== null
      ? ((latestValue - previousValue) / previousValue) * 100
      : null;

  return (
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-lg sm:p-6">

      {/* ================= CHART HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            National Airfare Price Index
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            30-day movement of the national airfare index
          </p>
        </div>

        {/* Latest Value */}
        {!loading && !error && latestValue !== null && (
          <div className="rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 sm:min-w-[150px]">

            <p className="text-xs text-slate-400">
              Current Index
            </p>

            <div className="mt-1 flex items-baseline gap-2">

              <span className="text-xl font-bold text-white">
                {latestValue.toFixed(2)}
              </span>

              {change !== null && (
                <span
                  className={`text-xs font-semibold ${
                    change >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {change >= 0 ? '+' : ''}
                  {change.toFixed(2)}%
                </span>
              )}

            </div>

          </div>
        )}

      </div>

      {/* ================= CHART ================= */}
      <div className="h-[350px] w-full">

        {/* Loading */}
        {loading ? (
          <div className="flex h-full items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-white" />

              <p className="mt-3 text-sm text-slate-400">
                Loading index data...
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

            </div>

          </div>

        ) : data.length === 0 ? (

          /* Empty State */
          <div className="flex h-full items-center justify-center">

            <div className="text-center">

              <p className="text-sm text-slate-400">
                No index data available.
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
                left: 0,
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
                domain={['auto', 'auto']}
                tick={{
                  fontSize: 11,
                  fill: '#94a3b8',
                }}
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
                  color: '#cbd5e1',
                  marginBottom: '6px',
                  fontSize: '12px',
                }}
                itemStyle={{
                  color: '#ffffff',
                  fontSize: '13px',
                }}
                formatter={(value) => [
                  Number(value).toFixed(2),
                  'Index Value',
                ]}
              />

              <Line
                type="monotone"
                dataKey="index_value"
                name="Airfare Index"
                strokeWidth={3}
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
            Historical window: 30 days
          </span>

          <span className="text-xs text-slate-500">
            Updated from monitored airfare data
          </span>

        </div>
      )}

    </div>
  );
}