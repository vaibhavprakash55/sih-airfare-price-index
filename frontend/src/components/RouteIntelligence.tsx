'use client';

import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Filter,
  Plane,
  Search,
  TrendingUp,
} from 'lucide-react';

type Severity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'STABLE';

interface RouteData {
  route: string;
  airline: string;
  currentFare: number;
  averageFare: number;
  change: number;
  severity: Severity;
}

const routeData: RouteData[] = [
  {
    route: 'DEL-BOM',
    airline: 'IndiGo',
    currentFare: 6840,
    averageFare: 4800,
    change: 42.5,
    severity: 'CRITICAL',
  },
  {
    route: 'MAA-DEL',
    airline: 'SpiceJet',
    currentFare: 5960,
    averageFare: 4540,
    change: 31.2,
    severity: 'HIGH',
  },
  {
    route: 'BOM-BLR',
    airline: 'Air India',
    currentFare: 5120,
    averageFare: 3980,
    change: 28.7,
    severity: 'HIGH',
  },
  {
    route: 'DEL-BLR',
    airline: 'Akasa Air',
    currentFare: 4380,
    averageFare: 3700,
    change: 18.4,
    severity: 'MODERATE',
  },
  {
    route: 'BLR-HYD',
    airline: 'IndiGo',
    currentFare: 3560,
    averageFare: 3320,
    change: 7.2,
    severity: 'STABLE',
  },
  {
    route: 'DEL-CCU',
    airline: 'Air India',
    currentFare: 4720,
    averageFare: 4510,
    change: 4.7,
    severity: 'STABLE',
  },
];

const severityOptions = [
  'ALL',
  'CRITICAL',
  'HIGH',
  'MODERATE',
  'STABLE',
] as const;

export default function RouteIntelligence() {
  const [search, setSearch] = useState('');
  const [severity, setSeverity] =
    useState<(typeof severityOptions)[number]>('ALL');

  const filteredRoutes = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return routeData.filter((item) => {
      const matchesSearch =
        item.route.toLowerCase().includes(searchValue) ||
        item.airline.toLowerCase().includes(searchValue);

      const matchesSeverity =
        severity === 'ALL' || item.severity === severity;

      return matchesSearch && matchesSeverity;
    });
  }, [search, severity]);

  const criticalCount = routeData.filter(
    (item) => item.severity === 'CRITICAL'
  ).length;

  const highCount = routeData.filter(
    (item) => item.severity === 'HIGH'
  ).length;

  const averageChange =
    routeData.reduce((sum, item) => sum + item.change, 0) /
    routeData.length;

  const highestSurge = Math.max(
    ...routeData.map((item) => item.change)
  );

  const getSeverityClasses = (value: Severity) => {
    switch (value) {
      case 'CRITICAL':
        return 'border-red-500/20 bg-red-500/10 text-red-400';

      case 'HIGH':
        return 'border-orange-500/20 bg-orange-500/10 text-orange-400';

      case 'MODERATE':
        return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400';

      default:
        return 'border-green-500/20 bg-green-500/10 text-green-400';
    }
  };

  const getMovementColor = (change: number) => {
    if (change >= 20) {
      return 'text-red-400';
    }

    if (change >= 10) {
      return 'text-orange-400';
    }

    if (change >= 5) {
      return 'text-yellow-400';
    }

    return 'text-green-400';
  };

  return (
    <section className="mt-6 w-full min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
      {/* ================= HEADER ================= */}

      <div className="border-b border-slate-800 p-4 sm:p-5 lg:p-6">
        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Title */}

          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800">
              <Plane size={21} className="text-slate-300" />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white sm:text-xl">
                Route Intelligence
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                Monitor domestic routes and identify fare movement
              </p>
            </div>
          </div>

          {/* Summary Cards */}

          <div className="grid w-full grid-cols-3 gap-2 sm:gap-3 lg:w-auto">
            <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950/50 px-2 py-2.5 text-center sm:px-4">
              <p className="text-[10px] text-slate-500 sm:text-xs">
                Routes
              </p>

              <p className="mt-1 text-lg font-bold text-white">
                {routeData.length}
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-red-500/10 bg-red-500/5 px-2 py-2.5 text-center sm:px-4">
              <p className="text-[10px] text-slate-500 sm:text-xs">
                Critical
              </p>

              <p className="mt-1 text-lg font-bold text-red-400">
                {criticalCount}
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-orange-500/10 bg-orange-500/5 px-2 py-2.5 text-center sm:px-4">
              <p className="text-[10px] text-slate-500 sm:text-xs">
                High
              </p>

              <p className="mt-1 text-lg font-bold text-orange-400">
                {highCount}
              </p>
            </div>
          </div>
        </div>

        {/* ================= FILTERS ================= */}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          {/* Search */}

          <div className="relative min-w-0">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search route or airline..."
              className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-slate-500 focus:ring-1 focus:ring-slate-500/30"
            />
          </div>

          {/* Severity */}

          <div className="relative min-w-0 sm:w-56">
            <Filter
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <select
              value={severity}
              onChange={(event) =>
                setSeverity(
                  event.target.value as (typeof severityOptions)[number]
                )
              }
              className="w-full min-w-0 appearance-none rounded-xl border border-slate-700 bg-slate-800 py-3 pl-9 pr-4 text-sm font-medium text-white outline-none transition focus:border-slate-500"
            >
              {severityOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'ALL'
                    ? 'All Severity Levels'
                    : option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ================= MARKET SUMMARY ================= */}

      <div className="grid grid-cols-1 gap-px border-b border-slate-800 bg-slate-800 sm:grid-cols-3">
        <div className="bg-slate-900 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <TrendingUp size={14} />

            <span>Average fare movement</span>
          </div>

          <p className="mt-2 text-xl font-bold text-white">
            +{averageChange.toFixed(1)}%
          </p>
        </div>

        <div className="bg-slate-900 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ArrowUp size={14} />

            <span>Highest surge</span>
          </div>

          <p className="mt-2 text-xl font-bold text-red-400">
            +{highestSurge.toFixed(1)}%
          </p>
        </div>

        <div className="bg-slate-900 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ArrowDown size={14} />

            <span>Routes displayed</span>
          </div>

          <p className="mt-2 text-xl font-bold text-white">
            {filteredRoutes.length}
          </p>
        </div>
      </div>

      {/* ================= ROUTE LIST ================= */}

      <div className="divide-y divide-slate-800">
        {filteredRoutes.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Search
              size={28}
              className="mx-auto text-slate-600"
            />

            <p className="mt-3 text-sm font-medium text-slate-400">
              No matching routes found
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Try another route, airline, or severity level.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSeverity('ALL');
              }}
              className="mt-4 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredRoutes.map((item) => (
            <div
              key={`${item.route}-${item.airline}`}
              className="group min-w-0 px-4 py-5 transition hover:bg-slate-800/40 sm:px-5 lg:px-6"
            >
              <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_0.8fr_auto] xl:items-center">
                {/* Route */}

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
                    <Plane
                      size={18}
                      className="text-slate-300"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-base font-bold tracking-wide text-white">
                      {item.route.replace('-', ' → ')}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {item.airline}
                    </p>
                  </div>
                </div>

                {/* Fare */}

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">
                    Current Fare
                  </p>

                  <p className="mt-1 text-xl font-bold text-white">
                    ₹{item.currentFare.toLocaleString('en-IN')}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Avg ₹
                    {item.averageFare.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Movement */}

                <div className="min-w-0">
                  <p className="text-xs text-slate-500">
                    Fare Movement
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <TrendingUp
                      size={17}
                      className={getMovementColor(item.change)}
                    />

                    <span
                      className={`text-lg font-bold ${getMovementColor(
                        item.change
                      )}`}
                    >
                      +{item.change.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Severity */}

                <div className="min-w-0">
                  <p className="mb-2 text-xs text-slate-500">
                    Status
                  </p>

                  <span
                    className={`inline-flex max-w-full rounded-full border px-3 py-1.5 text-xs font-semibold ${getSeverityClasses(
                      item.severity
                    )}`}
                  >
                    {item.severity}
                  </span>
                </div>

                {/* Action */}

                <button
                  type="button"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700 hover:text-white sm:w-fit"
                >
                  View Route
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= FOOTER INSIGHT ================= */}

      <div className="border-t border-slate-800 bg-slate-950/30 px-4 py-4 sm:px-5 lg:px-6">
        <div className="flex min-w-0 flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 text-slate-500">
            Route-level fare intelligence across monitored
            domestic city-pairs.
          </p>

          <p className="shrink-0 font-medium text-slate-400">
            {filteredRoutes.length} of {routeData.length} routes shown
          </p>
        </div>
      </div>
    </section>
  );
}