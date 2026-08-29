'use client';

import { useState } from 'react';
import { Download, Plane, Activity, Clock } from 'lucide-react';

import MetricCards from '@/components/MetricCards';
import NationalIndexChart from '@/components/NationalIndexChart';
import HorizonComparisonChart from '@/components/HorizonComparisonChart';
import SurgeAlertsTable from '@/components/SurgeAlertsTable';
import ExportReportModal from '@/components/ExportReportModal';

export default function Home() {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 md:px-6 md:py-6">
      <div className="mx-auto max-w-7xl">

        {/* Dashboard Header */}
        <header className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">

          <div className="flex flex-col gap-6 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">

            {/* Title Section */}
            <div>
              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700">
                  <Plane size={24} className="text-white" />
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
                    Airfare Price Intelligence
                  </h1>

                  <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                    Real-time Airfare Price Index • India
                  </p>
                </div>

              </div>

              {/* Status Information */}
              <div className="mt-5 flex flex-wrap items-center gap-4">

                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
                  </span>

                  <span className="font-medium">
                    Monitoring Active
                  </span>
                </div>

                <div className="hidden h-4 w-px bg-slate-700 sm:block" />

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Activity size={14} />
                  <span>25 domestic routes</span>
                </div>

                <div className="hidden h-4 w-px bg-slate-700 sm:block" />

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock size={14} />
                  <span>Live data monitoring</span>
                </div>

              </div>
            </div>

            {/* Export Button */}
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-slate-200 active:translate-y-0 sm:w-auto"
            >
              <Download size={18} />
              Export Report
            </button>

          </div>

          {/* Bottom Information Bar */}
          <div className="border-t border-slate-800 bg-slate-950/40 px-5 py-3 sm:px-6">
            <div className="flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

              <span>
                National airfare monitoring dashboard
              </span>

              <span>
                Designed for CPI / MoSPI analysis
              </span>

            </div>
          </div>

        </header>

        {/* Dashboard Metrics */}
        <section>
          <MetricCards />
        </section>

        {/* National Index */}
        <section>
          <NationalIndexChart />
        </section>

        {/* Booking Horizon Comparison */}
        <section>
          <HorizonComparisonChart />
        </section>

        {/* Surge Alerts */}
        <section>
          <SurgeAlertsTable />
        </section>

        {/* Export Modal */}
        <ExportReportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />

      </div>
    </main>
  );
}