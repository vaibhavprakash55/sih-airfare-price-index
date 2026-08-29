'use client';

import { useEffect, useState } from 'react';
import {
  Download,
  Activity,
  ShieldCheck,
  RefreshCw,
  Clock,
  Database,
  CheckCircle2,
  BarChart3,
  Route,
  AlertTriangle,
  LayoutDashboard,
} from 'lucide-react';

import MetricCards from '@/components/MetricCards';
import NationalIndexChart from '@/components/NationalIndexChart';
import HorizonComparisonChart from '@/components/HorizonComparisonChart';
import RouteIntelligence from '@/components/RouteIntelligence';
import SurgeAlertsTable from '@/components/SurgeAlertsTable';
import ExportReportModal from '@/components/ExportReportModal';

export default function Home() {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    setLastUpdated(
      new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          window.location.reload();
          return 60;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setCountdown(60);

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'national-index',
      label: 'National Index',
      icon: BarChart3,
    },
    {
      id: 'route-intelligence',
      label: 'Routes',
      icon: Route,
    },
    {
      id: 'surge-alerts',
      label: 'Alerts',
      icon: AlertTriangle,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-3 sm:p-4 md:p-6">
      <div className="mx-auto w-full max-w-7xl">

        {/* ================= HEADER ================= */}

        <header className="mb-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg sm:mb-6 md:mb-8">

          <div className="flex flex-col gap-5 p-4 sm:gap-6 sm:p-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Branding */}

            <div className="min-w-0">
              <div className="flex items-center gap-3 sm:gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 sm:h-12 sm:w-12">
                  <span className="text-xl sm:text-2xl">✈</span>
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
                    Airfare Price Intelligence
                  </h1>

                  <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                    Real-time Airfare Price Index • India
                  </p>
                </div>

              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">

                <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
                  </span>

                  <span className="text-xs font-medium text-green-400">
                    Monitoring Active
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Activity size={14} />

                  <span>
                    Domestic airfare intelligence system
                  </span>
                </div>

              </div>
            </div>

            {/* Header Actions */}

            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:gap-3">

              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm font-semibold text-slate-200 shadow-md transition duration-200 hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
              >
                <RefreshCw
                  size={17}
                  className={refreshing ? 'animate-spin' : ''}
                />

                <span>
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-sm font-semibold text-slate-900 shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-slate-200 sm:px-5"
              >
                <Download size={17} />

                <span>
                  Export Report
                </span>
              </button>

            </div>

          </div>

          {/* Info Bar */}

          <div className="border-t border-slate-800 bg-slate-950/40 px-4 py-3 sm:px-6">

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">

              <div className="flex items-center gap-2">
                <ShieldCheck size={14} />

                <span>
                  Coverage: India Domestic
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Database size={14} />

                <span>
                  Data: Airline & OTA Sources
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} />

                <span>
                  Index: Live Monitoring
                </span>
              </div>

              {lastUpdated && (
                <div className="flex items-center gap-2">
                  <Clock size={14} />

                  <span>
                    Last updated: {lastUpdated}
                  </span>
                </div>
              )}

            </div>

          </div>

        </header>

        {/* ================= QUICK NAVIGATION ================= */}

        <nav className="sticky top-2 z-40 mb-5 rounded-2xl border border-slate-800 bg-slate-900/95 p-2 shadow-xl backdrop-blur-md sm:top-3 sm:mb-6">

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">

            <div className="hidden shrink-0 items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 lg:flex">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Dashboard
            </div>

            <div className="hidden h-6 w-px bg-slate-800 lg:block" />

            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-2.5 text-xs font-medium text-slate-400 transition duration-200 hover:border-slate-700 hover:bg-slate-800 hover:text-white sm:flex-none sm:gap-2 sm:px-4 sm:text-sm"
                >
                  <Icon size={15} />

                  <span className="truncate">
                    {item.label}
                  </span>
                </button>
              );
            })}

            <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-500 lg:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

              <span>
                Auto-refresh {countdown}s
              </span>
            </div>

          </div>

        </nav>

        {/* ================= LIVE UPDATE BAR ================= */}

        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
              <Activity size={16} className="text-green-400" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200">
                Live Monitoring
              </p>

              <p className="truncate text-xs text-slate-500">
                Dashboard connected to airfare intelligence services
              </p>
            </div>

          </div>

          <div className="flex shrink-0 items-center gap-2 text-xs text-slate-400">

            <span className="h-2 w-2 rounded-full bg-green-400" />

            <span>
              Auto-refresh in {countdown}s
            </span>

          </div>

        </div>

        {/* ================= OVERVIEW ================= */}

        <section
          id="overview"
          className="scroll-mt-24"
        >

          <div className="mb-4 flex items-end justify-between gap-4">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                System Overview
              </p>

              <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
                National Airfare Snapshot
              </h2>
            </div>

            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <Activity size={14} />
              Live intelligence
            </div>

          </div>

          <MetricCards />

        </section>

        {/* ================= NATIONAL INDEX ================= */}

        <section
          id="national-index"
          className="scroll-mt-24"
        >

          <div className="mb-4 mt-7 flex items-end justify-between gap-4 sm:mt-8">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Market Movement
              </p>

              <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
                National Airfare Price Index
              </h2>
            </div>

            <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-500 md:flex">
              <BarChart3 size={14} />
              Historical trend
            </div>

          </div>

          <NationalIndexChart />

          <HorizonComparisonChart />

        </section>

        {/* ================= ROUTE INTELLIGENCE ================= */}

        <section
          id="route-intelligence"
          className="scroll-mt-24"
        >

          <div className="mb-4 mt-7 flex items-end justify-between gap-4 sm:mt-8">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Route Analytics
              </p>

              <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
                Route Intelligence
              </h2>
            </div>

            <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-500 md:flex">
              <Route size={14} />
              Domestic city-pairs
            </div>

          </div>

          <RouteIntelligence />

        </section>

        {/* ================= SURGE ALERTS ================= */}

        <section
          id="surge-alerts"
          className="scroll-mt-24"
        >

          <div className="mb-4 mt-7 flex items-end justify-between gap-4 sm:mt-8">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Anomaly Detection
              </p>

              <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
                Airfare Surge Alerts
              </h2>
            </div>

            <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-500 md:flex">
              <AlertTriangle size={14} />
              Requires attention
            </div>

          </div>

          <SurgeAlertsTable />

        </section>

        {/* ================= EXPORT MODAL ================= */}

        <ExportReportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />

        {/* ================= FOOTER ================= */}

        <footer className="mt-8 border-t border-slate-800 pt-6 pb-4 sm:mt-10">

          <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

            <div>
              <p className="text-sm font-medium text-slate-300">
                Airfare Price Intelligence
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Real-time airfare monitoring and CPI support system
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-green-400 sm:justify-end">

              <span className="h-2 w-2 rounded-full bg-green-400" />

              <span>
                System Operational
              </span>

            </div>

          </div>

          <div className="mt-4 text-center text-xs text-slate-600">
            India Domestic Airfare Intelligence • SIH 2026
          </div>

        </footer>

      </div>
    </main>
  );
}