'use client';

import { useState } from 'react';
import { Download, X, FileText } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportReportModal({
  isOpen,
  onClose,
}: ExportReportModalProps) {
  const [reportType, setReportType] = useState('CPI Airfare Report');
  const [range, setRange] = useState('30d');

  if (!isOpen) {
    return null;
  }

  const handleExport = () => {
    alert(
      `Export requested: ${reportType} for the last ${range}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-800 p-3">
              <FileText size={22} className="text-slate-300" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Export Report
              </h2>

              <p className="text-sm text-slate-400">
                MoSPI / CPI reporting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Report Type
            </label>

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            >
              <option>CPI Airfare Report</option>
              <option>National Index Report</option>
              <option>Route Trend Report</option>
              <option>Surge Alert Report</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Time Range
            </label>

            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            <Download size={18} />
            Export Report
          </button>

        </div>
      </div>
    </div>
  );
}