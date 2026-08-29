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
  Check,
} from 'lucide-react';

import MetricCards from '@/components/MetricCards';
import NationalIndexChart from '@/components/NationalIndexChart';
import HorizonComparisonChart from '@/components/HorizonComparisonChart';
import SurgeAlertsTable from '@/components/SurgeAlertsTable';
import ExportReportModal from '@/components/ExportReportModal';

export default function Home() {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [refreshMessage, setRefreshMessage] = useState(false);

  const updateTime = () => {
    setLastUpdated(
      new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
  };

  useEffect(() => {
    updateTime();
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
    setRefreshMessage(false);

    setTimeout(() => {
      updateTime();
      setCountdown(60);
      setRefreshing(false);
      setRefreshMessage(true);

      setTimeout(() => {
        setRefreshMessage(false);
      }, 3000);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <header className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">

          {/* Main Header */}

          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">

            {/* Branding */}

            <div>
              <div className="flex items-center gap-4">

                {/* Logo */}

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
                  <span className="text-2xl">✈</span>
                </div>

                {/* Title */}

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                    Airfare Price Intelligence
                  </h1>

                  <p className="mt-1 text-sm text-slate-400">
                    Real-time Airfare Price Index • India
                  </p>
                </div>

              </div>

              {/* Status Section */}

              <div className="mt-5 flex flex-wrap items-center gap-3">

                {/* Live Status */}

                <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5">

                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />

                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
                  </span>

                  <span className="text-xs font-medium text-green-400">
                    Monitoring Active
                  </span>

                </div>

                {/* System Description */}

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Activity size={14} />

                  <span>
                    Domestic airfare intelligence system
                  </span>
                </div>

              </div>
            </div>

            {/* Header Actions */}

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* Refresh Button */}

              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-semibold text-slate-200 shadow-md transition duration-200 hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={18}
                  className={refreshing ? 'animate-spin' : ''}
                />

                <span>
                  {refreshing ? 'Refreshing...' : 'Refresh Data'}
                </span>
              </button>

              {/* Export Button */}

              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-slate-200"
              >
                <Download size={18} />

                <span>
                  Export Report
                </span>
              </button>

            </div>

          </div>

          {/* ================= INFO BAR ================= */}

          <div className="border-t border-slate-800 bg-slate-950/40 px-6 py-3">

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">

              {/* Coverage */}

              <div className="flex items-center gap-2">
                <ShieldCheck size={14} />

                <span>
                  Coverage: India Domestic
                </span>
              </div>

              {/* Data Sources */}

              <div className="flex items-center gap-2">
                <Database size={14} />

                <span>
                  Data: Airline & OTA Sources
                </span>
              </div>

              {/* Monitoring */}

              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} />

                <span>
                  Index: Live Monitoring
                </span>
              </div>

              {/* Last Updated */}

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

        {/* ================= REFRESH SUCCESS MESSAGE ================= */}

        {refreshMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
              <Check size={17} className="text-green-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-green-400">
                Data refreshed successfully
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Latest dashboard information is now available.
              </p>
            </div>

          </div>
        )}

        {/* ================= LIVE UPDATE BAR ================= */}

        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
              <Activity size={16} className="text-green-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-200">
                Live Monitoring
              </p>

              <p className="text-xs text-slate-500">
                Dashboard connected to airfare intelligence services
              </p>
            </div>

          </div>

          {/* Auto Refresh Status */}

          <div className="flex items-center gap-3 text-xs text-slate-400">

            <span className="h-2 w-2 rounded-full bg-green-400" />

            <span>
              Auto-refresh in {countdown}s
            </span>

          </div>

        </div>

        {/* ================= DASHBOARD ================= */}

        {/* Key Metrics */}

        <MetricCards />

        {/* National Index */}

        <NationalIndexChart />

        {/* Booking Horizon */}

        <HorizonComparisonChart />

        {/* Surge Alerts */}

        <SurgeAlertsTable />

        {/* ================= EXPORT MODAL ================= */}

        <ExportReportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />

        {/* ================= FOOTER ================= */}

        <footer className="mt-8 border-t border-slate-800 pt-6 pb-4">

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