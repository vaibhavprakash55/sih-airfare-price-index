'use client';

import { useEffect, useMemo, useState } from 'react';
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
import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  TrendingUp,
} from 'lucide-react';

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
    let active = true;

    const loadTrends = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await fetchRouteTrends(selectedRoute);

        if (active) {
          setData(result);
        }
      } catch {
        if (active) {
          setData([]);
          setError('Unable to load fare data. Please try again.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTrends();

    return () => {
      active = false;
    };
  }, [selectedRoute]);

  const latestData =
    data.length > 0 ? data[data.length - 1] : null;

  const horizonSpread = useMemo(() => {
    if (!latestData) {
      return null;
    }

    const fares = [
      latestData.t0_fare,
      latestData.t7_fare,
      latestData.t30_fare,
    ];

    return Math.max(...fares) - Math.min(...fares);
  }, [latestData]);

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">

      {/* ================= HEADER ================= */}

      <div className="border-b border-slate-800 p-4 sm:p-6">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex min-w-0 items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 sm:h-11 sm:w-11">
              <TrendingUp
                size={20}
                className="text-slate-300"
              />
            </div>

            <div className="min-w-0">

              <h2 className="text-lg font-semibold text-white sm:text-xl">
                Booking Horizon Comparison
              </h2>

              <p className="mt-1 text-sm leading-5 text-slate-400">
                Compare fares across different booking windows
              </p>

            </div>

          </div>

          {/* Route Selector */}

          <div className="w-full sm:max-w-xs lg:w-44">

            <label
              htmlFor="route"
              className="mb-2 block text-xs font-medium text-slate-400"
            >
              Select Route
            </label>

            <div className="relative">

              <select
                id="route"
                value={selectedRoute}
                onChange={(event) =>
                  setSelectedRoute(event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-10 text-sm font-semibold text-white outline-none transition hover:border-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
              >
                {routes.map((route) => (
                  <option key={route} value={route}>
                    {route}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

            </div>

          </div>

        </div>

      </div>

      {/* ================= HORIZON SUMMARY ================= */}

      <div className="grid grid-cols-1 gap-px border-b border-slate-800 bg-slate-800 sm:grid-cols-3">

        {/* T+0 */}

        <div className="bg-slate-900 p-4 sm:p-5">

          <div className="flex items-center justify-between gap-2">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              T+0
            </p>

            <span className="rounded-full border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] font-medium text-slate-500">
              Today
            </span>

          </div>

          <p className="mt-2 text-sm text-slate-400">
            Same-day booking
          </p>

          <p className="mt-3 text-xl font-bold text-white sm:text-2xl">
            {latestData
              ? `₹${latestData.t0_fare.toLocaleString('en-IN')}`
              : '--'}
          </p>

        </div>

        {/* T+7 */}

        <div className="bg-slate-900 p-4 sm:p-5">

          <div className="flex items-center justify-between gap-2">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              T+7
            </p>

            <span className="rounded-full border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] font-medium text-slate-500">
              7 Days
            </span>

          </div>

          <p className="mt-2 text-sm text-slate-400">
            Advance booking
          </p>

          <p className="mt-3 text-xl font-bold text-white sm:text-2xl">
            {latestData
              ? `₹${latestData.t7_fare.toLocaleString('en-IN')}`
              : '--'}
          </p>

        </div>

        {/* T+30 */}

        <div className="bg-slate-900 p-4 sm:p-5">

          <div className="flex items-center justify-between gap-2">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              T+30
            </p>

            <span className="rounded-full border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] font-medium text-slate-500">
              30 Days
            </span>

          </div>

          <p className="mt-2 text-sm text-slate-400">
            Advance booking
          </p>

          <p className="mt-3 text-xl font-bold text-white sm:text-2xl">
            {latestData
              ? `₹${latestData.t30_fare.toLocaleString('en-IN')}`
              : '--'}
          </p>

        </div>

      </div>

      {/* ================= CHART ================= */}

      <div className="p-3 sm:p-6">

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2 sm:p-4">

          <div className="h-[280px] w-full sm:h-[350px]">

            {loading ? (

              <div className="flex h-full items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-white" />

                  <p className="mt-3 text-sm text-slate-400">
                    Loading fare data...
                  </p>

                </div>

              </div>

            ) : error ? (

              <div className="flex h-full items-center justify-center px-4">

                <div className="max-w-sm text-center">

                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                    <AlertCircle
                      size={20}
                      className="text-red-400"
                    />
                  </div>

                  <p className="mt-3 text-sm font-medium text-red-400">
                    {error}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Select another route and try again.
                  </p>

                </div>

              </div>

            ) : data.length === 0 ? (

              <div className="flex h-full items-center justify-center px-4">

                <div className="text-center">

                  <CalendarDays
                    size={24}
                    className="mx-auto text-slate-600"
                  />

                  <p className="mt-3 text-sm font-medium text-slate-400">
                    No fare data available
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    No trend data was returned for this route.
                  </p>

                </div>

              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 8,
                    left: 0,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 10,
                      fill: '#64748b',
                    }}
                    tickFormatter={(value) =>
                      String(value).slice(5)
                    }
                    axisLine={{
                      stroke: '#334155',
                    }}
                    tickLine={false}
                    minTickGap={28}
                  />

                  <YAxis
                    width={55}
                    tick={{
                      fontSize: 10,
                      fill: '#64748b',
                    }}
                    tickFormatter={(value) =>
                      `₹${Number(value).toLocaleString('en-IN')}`
                    }
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    cursor={{
                      stroke: '#475569',
                      strokeDasharray: '4 4',
                    }}
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
                      fontSize: '12px',
                    }}
                    formatter={(value, name) => [
                      `₹${Number(value).toLocaleString('en-IN')}`,
                      name === 't0_fare'
                        ? 'T+0 Fare'
                        : name === 't7_fare'
                        ? 'T+7 Fare'
                        : 'T+30 Fare',
                    ]}
                    labelFormatter={(label) =>
                      `Date: ${label}`
                    }
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={30}
                    wrapperStyle={{
                      paddingTop: '8px',
                      fontSize: '11px',
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="t0_fare"
                    name="T+0 Fare"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="t7_fare"
                    name="T+7 Fare"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="t30_fare"
                    name="T+30 Fare"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            )}

          </div>

        </div>

      </div>

      {/* ================= INSIGHT ================= */}

      {!loading && !error && latestData && (
        <div className="border-t border-slate-800 bg-slate-950/30 px-4 py-4 sm:px-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-start gap-3">

              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                <TrendingUp
                  size={16}
                  className="text-slate-400"
                />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Booking Horizon Insight
                </p>

                <p className="mt-1 text-sm leading-5 text-slate-300">
                  {horizonSpread !== null
                    ? `${selectedRoute} shows a ₹${horizonSpread.toLocaleString(
                        'en-IN'
                      )} spread between the lowest and highest booking horizon fare.`
                    : 'Fare comparison is available across the selected booking horizons.'}
                </p>

              </div>

            </div>

            <div className="shrink-0 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 sm:min-w-[150px]">

              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Monitoring Window
              </p>

              <p className="mt-1 text-sm font-bold text-slate-200">
                30-day movement
              </p>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}