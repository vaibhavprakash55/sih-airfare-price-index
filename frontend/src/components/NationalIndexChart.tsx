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

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);

      const result = await fetchIndexHistory('30d');

      setData(result);
      setLoading(false);
    };

    loadHistory();
  }, []);

  return (
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          National Airfare Price Index
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          30-day movement of the national airfare index
        </p>
      </div>

      <div className="h-[350px] w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-white" />

              <p className="mt-3 text-sm text-slate-400">
                Loading index data...
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

              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 11 }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="index_value"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}