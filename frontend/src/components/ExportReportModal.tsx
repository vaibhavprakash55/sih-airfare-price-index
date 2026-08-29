'use client';

import { useEffect, useState } from 'react';
import { Download, X, FileText, CheckCircle } from 'lucide-react';

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
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setExporting(false);
      setExported(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleExport = () => {
    setExporting(true);
    setExported(false);

    setTimeout(() => {
      const csvContent = [
        ['Airfare Price Intelligence Report'],
        ['Report Type', reportType],
        ['Time Range', range],
        [],
        ['Route', 'Airline', 'Current Fare', 'Surge %', 'Severity'],
        ['DEL-BOM', 'IndiGo', '5450', '12.5', 'HIGH'],
        ['BOM-BLR', 'Air India', '6200', '8.4', 'MEDIUM'],
        ['DEL-BLR', 'IndiGo', '5800', '15.2', 'CRITICAL'],
        ['BLR-HYD', 'Akasa Air', '4100', '6.8', 'MEDIUM'],
      ]
        .map((row) => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const fileName = `${reportType
        .toLowerCase()
        .replace(/\s+/g, '-')}-${range}.csv`;

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setExporting(false);
      setExported(true);
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-800 p-3">
              <FileText size={22} className="text-slate-300" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white sm:text-xl">
                Export Report
              </h2>

              <p className="text-sm text-slate-400">
                MoSPI / CPI reporting
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close export modal"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="report-type"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Report Type
            </label>

            <select
              id="report-type"
              value={reportType}
              onChange={(event) => {
                setReportType(event.target.value);
                setExported(false);
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-slate-500"
            >
              <option>CPI Airfare Report</option>
              <option>National Index Report</option>
              <option>Route Trend Report</option>
              <option>Surge Alert Report</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="time-range"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Time Range
            </label>

            <select
              id="time-range"
              value={range}
              onChange={(event) => {
                setRange(event.target.value);
                setExported(false);
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-slate-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          {exported && (
            <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              <CheckCircle size={18} />
              <span>Report downloaded successfully.</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download size={18} />

            {exporting ? 'Preparing Report...' : 'Export Report'}
          </button>
        </div>
      </div>
    </div>
  );
}