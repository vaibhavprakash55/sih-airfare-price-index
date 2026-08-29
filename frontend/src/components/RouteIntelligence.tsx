'use client';

import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Filter,
  Plane,
  Search,
  TrendingUp,
  X,
  CalendarDays,
  IndianRupee,
  BarChart3,
} from 'lucide-react';

type Severity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'STABLE';

interface RouteData {
  route: string;
  airline: string;
  currentFare: number;
  averageFare: number;
  change: number;
  severity: Severity;
  t0Fare: number;
  t7Fare: number;
  t30Fare: number;
}

const routeData: RouteData[] = [
  {
    route: 'DEL-BOM',
    airline: 'IndiGo',
    currentFare: 6840,
    averageFare: 4800,
    change: 42.5,
    severity: 'CRITICAL',
    t0Fare: 6840,
    t7Fare: 5200,
    t30Fare: 4100,
  },
  {
    route: 'MAA-DEL',
    airline: 'SpiceJet',
    currentFare: 5960,
    averageFare: 4540,
    change: 31.2,
    severity: 'HIGH',
    t0Fare: 5960,
    t7Fare: 4850,
    t30Fare: 3900,
  },
  {
    route: 'BOM-BLR',
    airline: 'Air India',
    currentFare: 5120,
    averageFare: 3980,
    change: 28.7,
    severity: 'HIGH',
    t0Fare: 5120,
    t7Fare: 4300,
    t30Fare: 3500,
  },
  {
    route: 'DEL-BLR',
    airline: 'Akasa Air',
    currentFare: 4380,
    averageFare: 3700,
    change: 18.4,
    severity: 'MODERATE',
    t0Fare: 4380,
    t7Fare: 3950,
    t30Fare: 3300,
  },
  {
    route: 'BLR-HYD',
    airline: 'IndiGo',
    currentFare: 3560,
    averageFare: 3320,
    change: 7.2,
    severity: 'STABLE',
    t0Fare: 3560,
    t7Fare: 3450,
    t30Fare: 3200,
  },
  {
    route: 'DEL-CCU',
    airline: 'Air India',
    currentFare: 4720,
    averageFare: 4510,
    change: 4.7,
    severity: 'STABLE',
    t0Fare: 4720,
    t7Fare: 4600,
    t30Fare: 4380,
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

  const [selectedRoute, setSelectedRoute] =
    useState<RouteData | null>(null);

  const filteredRoutes = useMemo(() => {
    return routeData.filter((item) => {
      const searchValue = search.toLowerCase();

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

  const getSeverityClasses = (value: Severity) => {
    if (value === 'CRITICAL') {
      return 'border-red-500/20 bg-red-500/10 text-red-400';
    }

    if (value === 'HIGH') {
      return 'border-orange-500/20 bg-orange-500/10 text-orange-400';
    }

    if (value === 'MODERATE') {
      return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400';
    }

    return 'border-green-500/20 bg-green-500/10 text-green-400';
  };

  return (
    <>
      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">

        {/* Header */}

        <div className="border-b border-slate-800 p-5 sm:p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-3">

              <div className="rounded-xl bg-slate-800 p-3">
                <Plane size={22} className="text-slate-300" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white sm:text-xl">
                  Route Intelligence
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Monitor domestic routes and identify fare movement
                </p>
              </div>

            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2 text-center">
                <p className="text-xs text-slate-500">Routes</p>
                <p className="mt-1 text-lg font-bold text-white">
                  {routeData.length}
                </p>
              </div>

              <div className="rounded-xl border border-red-500/10 bg-red-500/5 px-3 py-2 text-center">
                <p className="text-xs text-slate-500">Critical</p>
                <p className="mt-1 text-lg font-bold text-red-400">
                  {criticalCount}
                </p>
              </div>

              <div className="rounded-xl border border-orange-500/10 bg-orange-500/5 px-3 py-2 text-center">
                <p className="text-xs text-slate-500">High</p>
                <p className="mt-1 text-lg font-bold text-orange-400">
                  {highCount}
                </p>
              </div>

            </div>

          </div>

          {/* Filters */}

          <div className="mt-5 flex flex-col gap-3 md:flex-row">

            <div className="relative min-w-0 flex-1">

              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search route or airline..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-slate-500"
              />

            </div>

            <div className="relative w-full md:w-52">

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
                className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-800 py-3 pl-9 pr-4 text-sm font-medium text-white outline-none transition focus:border-slate-500"
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

        {/* Market Summary */}

        <div className="grid grid-cols-1 gap-px border-b border-slate-800 bg-slate-800 sm:grid-cols-3">

          <div className="bg-slate-900 px-5 py-4">

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <TrendingUp size={14} />
              Average fare movement
            </div>

            <p className="mt-2 text-xl font-bold text-white">
              +{averageChange.toFixed(1)}%
            </p>

          </div>

          <div className="bg-slate-900 px-5 py-4">

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ArrowUp size={14} />
              Highest surge
            </div>

            <p className="mt-2 text-xl font-bold text-red-400">
              +42.5%
            </p>

          </div>

          <div className="bg-slate-900 px-5 py-4">

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ArrowDown size={14} />
              Routes displayed
            </div>

            <p className="mt-2 text-xl font-bold text-white">
              {filteredRoutes.length}
            </p>

          </div>

        </div>

        {/* Route Cards */}

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

            </div>

          ) : (

            filteredRoutes.map((item) => (

              <div
                key={item.route}
                className="group px-5 py-5 transition hover:bg-slate-800/40 sm:px-6"
              >

                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                  {/* Route */}

                  <div className="flex min-w-0 items-center gap-4 xl:min-w-[220px]">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
                      <Plane
                        size={19}
                        className="text-slate-300"
                      />
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-base font-bold tracking-wide text-white">
                        {item.route.replace('-', ' → ')}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.airline}
                      </p>

                    </div>

                  </div>

                  {/* Fare */}

                  <div className="min-w-0 xl:min-w-[150px]">

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

                  <div className="min-w-0 xl:min-w-[130px]">

                    <p className="text-xs text-slate-500">
                      Fare Movement
                    </p>

                    <div className="mt-2 flex items-center gap-2">

                      <TrendingUp
                        size={17}
                        className={
                          item.change >= 20
                            ? 'text-red-400'
                            : item.change >= 10
                            ? 'text-orange-400'
                            : 'text-yellow-400'
                        }
                      />

                      <span
                        className={`text-lg font-bold ${
                          item.change >= 20
                            ? 'text-red-400'
                            : item.change >= 10
                            ? 'text-orange-400'
                            : 'text-yellow-400'
                        }`}
                      >
                        +{item.change.toFixed(1)}%
                      </span>

                    </div>

                  </div>

                  {/* Severity */}

                  <div>

                    <p className="mb-2 text-xs text-slate-500">
                      Status
                    </p>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getSeverityClasses(
                        item.severity
                      )}`}
                    >
                      {item.severity}
                    </span>

                  </div>

                  {/* Action */}

                  <button
                    type="button"
                    onClick={() => setSelectedRoute(item)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700 hover:text-white xl:w-auto"
                  >
                    View Route
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

        {/* Footer Insight */}

        <div className="border-t border-slate-800 bg-slate-950/30 px-5 py-4 sm:px-6">

          <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">

            <p className="text-slate-500">
              Route-level fare intelligence across monitored
              domestic city-pairs.
            </p>

            <p className="font-medium text-slate-400">
              {filteredRoutes.length} of {routeData.length} routes shown
            </p>

          </div>

        </div>

      </section>

      {/* ================= ROUTE DETAILS MODAL ================= */}

      {selectedRoute && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedRoute(null)}
        >

          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="flex items-start justify-between border-b border-slate-800 p-5 sm:p-6">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-slate-800 p-3">
                  <Plane size={22} className="text-slate-300" />
                </div>

                <div>

                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Route Details
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    {selectedRoute.route.replace('-', ' → ')}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {selectedRoute.airline}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => setSelectedRoute(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                aria-label="Close route details"
              >
                <X size={20} />
              </button>

            </div>

            {/* Current Status */}

            <div className="p-5 sm:p-6">

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <IndianRupee size={14} />
                    Current Fare
                  </div>

                  <p className="mt-2 text-2xl font-bold text-white">
                    ₹{selectedRoute.currentFare.toLocaleString('en-IN')}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <BarChart3 size={14} />
                    Average Fare
                  </div>

                  <p className="mt-2 text-2xl font-bold text-white">
                    ₹{selectedRoute.averageFare.toLocaleString('en-IN')}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <TrendingUp size={14} />
                    Fare Change
                  </div>

                  <p className="mt-2 text-2xl font-bold text-red-400">
                    +{selectedRoute.change.toFixed(1)}%
                  </p>

                </div>

              </div>

              {/* Severity */}

              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/40 p-4">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-sm font-medium text-white">
                      Current Market Status
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Detected fare movement for this route
                    </p>

                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${getSeverityClasses(
                      selectedRoute.severity
                    )}`}
                  >
                    {selectedRoute.severity}
                  </span>

                </div>

              </div>

              {/* Booking Horizon */}

              <div className="mt-5">

                <div className="flex items-center gap-2">
                  <CalendarDays size={17} className="text-slate-400" />

                  <h4 className="text-sm font-semibold text-white">
                    Booking Horizon Comparison
                  </h4>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">

                    <p className="text-xs text-slate-500">
                      Today · T+0
                    </p>

                    <p className="mt-2 text-xl font-bold text-white">
                      ₹{selectedRoute.t0Fare.toLocaleString('en-IN')}
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">

                    <p className="text-xs text-slate-500">
                      7 Days · T+7
                    </p>

                    <p className="mt-2 text-xl font-bold text-white">
                      ₹{selectedRoute.t7Fare.toLocaleString('en-IN')}
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">

                    <p className="text-xs text-slate-500">
                      30 Days · T+30
                    </p>

                    <p className="mt-2 text-xl font-bold text-white">
                      ₹{selectedRoute.t30Fare.toLocaleString('en-IN')}
                    </p>

                  </div>

                </div>

              </div>

              {/* Intelligence Insight */}

              <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800/40 p-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Intelligence Insight
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">

                  {selectedRoute.change >= 20
                    ? `This route is showing a significant fare increase of ${selectedRoute.change.toFixed(
                        1
                      )}%. The current fare is considerably above its recent average, indicating elevated pricing pressure.`
                    : selectedRoute.change >= 10
                    ? `This route is experiencing a noticeable fare increase of ${selectedRoute.change.toFixed(
                        1
                      )}%. Continued monitoring is recommended.`
                    : `This route is showing relatively stable fare movement with a ${selectedRoute.change.toFixed(
                        1
                      )}% increase compared with its reference fare.`}

                </p>

              </div>

            </div>

            {/* Modal Footer */}

            <div className="flex justify-end border-t border-slate-800 p-5">

              <button
                type="button"
                onClick={() => setSelectedRoute(null)}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}