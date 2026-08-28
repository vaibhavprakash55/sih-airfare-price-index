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

  useEffect(() => {
    const loadTrends = async () => {
      const result = await fetchRouteTrends('DEL-BOM');
      setData(result);
    };

    loadTrends();
  }, []);

  return (
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Booking Horizon Comparison
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          DEL-BOM fare movement across different booking windows
        </p>
      </div>

      <div className="h-[350px] w-full">
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
              tick={{ fontSize: 11 }}
            />

            <Tooltip
              formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
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
      </div>
    </div>
  );
}