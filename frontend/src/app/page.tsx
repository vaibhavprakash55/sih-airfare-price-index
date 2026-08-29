'use client';

import { useState } from 'react';

import MetricCards from '@/components/MetricCards';
import NationalIndexChart from '@/components/NationalIndexChart';
import HorizonComparisonChart from '@/components/HorizonComparisonChart';
import SurgeAlertsTable from '@/components/SurgeAlertsTable';
import ExportReportModal from '@/components/ExportReportModal';

export default function Home() {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg md:flex-row md:items-center md:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800">
                <span className="text-xl">✈</span>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white md:text-3xl">
                  Airfare Price Intelligence
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Real-time Airfare Price Index • India
                </p>
              </div>

            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Monitoring Active
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Export Report
          </button>

        </div>

        {/* Dashboard Components */}
        <MetricCards />

        <NationalIndexChart />

        <HorizonComparisonChart />

        <SurgeAlertsTable />

        {/* Export Modal */}
        <ExportReportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />

      </div>
    </main>
  );
}