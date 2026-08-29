'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

type Range = '7D' | '30D' | '90D';

interface IndexPoint {
  date: string;
  value: number;
}

/*
  Fixed seed data generator.
  This keeps the server and client output identical
  and prevents hydration errors.
*/
const generateData = (days: number): IndexPoint[] => {
  const data: IndexPoint[] = [];

  const baseDate = new Date('2026-08-29T00:00:00');

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);

    const progress = days - 1 - i;

    const variation =
      Math.sin(progress * 1.7) * 1.8 +
      Math.cos(progress * 0.8) * 1.2;

    const value =
      118 +
      progress * 0.16 +
      variation;

    data.push({
      date: date.toISOString().split('T')[0],
      value: Number(value.toFixed(2)),
    });
  }

  return data;
};

const rangeData: Record<Range, IndexPoint[]> = {
  '7D': generateData(7),
  '30D': generateData(30),
  '90D': generateData(90),
};

export default function NationalIndexChart() {
  const [range, setRange] = useState<Range>('30D');

  const data = rangeData[range];

  const currentIndex = data[data.length - 1].value;

  const peakIndex = Math.max(
    ...data.map((item) => item.value)
  );

  const lowestIndex = Math.min(
    ...data.map((item) => item.value)
  );

  const startingIndex = data[0].value;

  const change = currentIndex - startingIndex;

  const changePercentage =
    startingIndex === 0
      ? 0
      : (change / startingIndex) * 100;

  const isRising = change >= 0;

  const chartPoints = useMemo(() => {
    const width = 900;
    const height = 300;
    const paddingX = 20;
    const paddingY = 25;

    const values = data.map((item) => item.value);

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    const rangeValue =
      maxValue - minValue === 0
        ? 1
        : maxValue - minValue;

    return data.map((item, index) => {
      const x =
        paddingX +
        (index / (data.length - 1)) *
          (width - paddingX * 2);

      const y =
        height -
        paddingY -
        ((item.value - minValue) / rangeValue) *
          (height - paddingY * 2);

      return {
        ...item,
        x,
        y,
      };
    });
  }, [data]);

  const points = chartPoints
    .map((point) => `${point.x},${point.y}`)
    .join(' ');

  const areaPoints = [
    `${chartPoints[0].x},300`,
    ...chartPoints.map(
      (point) => `${point.x},${point.y}`
    ),
    `${chartPoints[chartPoints.length - 1].x},300`,
  ].join(' ');

  const latestPoint =
    chartPoints[chartPoints.length - 1];

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">

      {/* ================= HEADER ================= */}

      <div className="border-b border-slate-800 p-5 sm:p-6">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

          {/* Title */}

          <div className="flex items-start gap-3">

            <div className="rounded-xl bg-slate-800 p-3">
              <Activity
                size={22}
                className="text-slate-300"
              />
            </div>

            <div>

              <h2 className="text-lg font-semibold text-white sm:text-xl">
                National Airfare Price Index
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-5 text-slate-400">
                Real-time view of domestic airfare price movement across India
              </p>

            </div>

          </div>

          {/* Range Selector */}

          <div className="flex w-full rounded-xl border border-slate-700 bg-slate-950/60 p-1 sm:w-auto">

            {(['7D', '30D', '90D'] as Range[]).map(
              (option) => (

                <button
                  key={option}
                  type="button"
                  onClick={() => setRange(option)}
                  className={`flex-1 rounded-lg px-4 py-2 text-xs font-semibold transition sm:flex-none ${
                    range === option
                      ? 'bg-white text-slate-900 shadow'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {option}
                </button>

              )
            )}

          </div>

        </div>

      </div>

      {/* ================= METRICS ================= */}

      <div className="grid grid-cols-2 gap-px border-b border-slate-800 bg-slate-800 lg:grid-cols-4">

        {/* Current */}

        <div className="bg-slate-900 p-4 sm:p-5">

          <p className="text-xs text-slate-500">
            Current Index
          </p>

          <div className="mt-2 flex items-center gap-2">

            <p className="text-xl font-bold text-white sm:text-2xl">
              {currentIndex.toFixed(2)}
            </p>

            {isRising ? (
              <TrendingUp
                size={17}
                className="text-red-400"
              />
            ) : (
              <TrendingDown
                size={17}
                className="text-green-400"
              />
            )}

          </div>

        </div>

        {/* Change */}

        <div className="bg-slate-900 p-4 sm:p-5">

          <p className="text-xs text-slate-500">
            Period Change
          </p>

          <p
            className={`mt-2 text-xl font-bold sm:text-2xl ${
              isRising
                ? 'text-red-400'
                : 'text-green-400'
            }`}
          >
            {isRising ? '+' : ''}
            {changePercentage.toFixed(2)}%
          </p>

        </div>

        {/* Peak */}

        <div className="bg-slate-900 p-4 sm:p-5">

          <div className="flex items-center gap-2 text-xs text-slate-500">

            <ArrowUp size={14} />

            Peak Index

          </div>

          <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
            {peakIndex.toFixed(2)}
          </p>

        </div>

        {/* Lowest */}

        <div className="bg-slate-900 p-4 sm:p-5">

          <div className="flex items-center gap-2 text-xs text-slate-500">

            <ArrowDown size={14} />

            Lowest Index

          </div>

          <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
            {lowestIndex.toFixed(2)}
          </p>

        </div>

      </div>

      {/* ================= CHART ================= */}

      <div className="p-4 sm:p-6">

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 sm:p-4">

          <div className="overflow-hidden">

            <svg
              viewBox="0 0 900 300"
              className="h-[230px] w-full sm:h-[300px]"
              preserveAspectRatio="none"
            >

              {/* Horizontal Grid */}

              <line
                x1="20"
                y1="60"
                x2="880"
                y2="60"
                stroke="currentColor"
                className="text-slate-800"
                strokeWidth="1"
              />

              <line
                x1="20"
                y1="120"
                x2="880"
                y2="120"
                stroke="currentColor"
                className="text-slate-800"
                strokeWidth="1"
              />

              <line
                x1="20"
                y1="180"
                x2="880"
                y2="180"
                stroke="currentColor"
                className="text-slate-800"
                strokeWidth="1"
              />

              <line
                x1="20"
                y1="240"
                x2="880"
                y2="240"
                stroke="currentColor"
                className="text-slate-800"
                strokeWidth="1"
              />

              {/* Area */}

              <polygon
                points={areaPoints}
                className="fill-slate-800/30"
              />

              {/* Main Line */}

              <polyline
                points={points}
                fill="none"
                stroke="currentColor"
                className="text-slate-200"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Latest Point */}

              <circle
                cx={latestPoint.x}
                cy={latestPoint.y}
                r="6"
                className="fill-white"
              />

              <circle
                cx={latestPoint.x}
                cy={latestPoint.y}
                r="11"
                className="fill-white/10"
              />

            </svg>

          </div>

          {/* Date Labels */}

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600 sm:text-xs">

            <span>
              {data[0].date}
            </span>

            <span>
              {data[Math.floor(data.length / 2)].date}
            </span>

            <span>
              {data[data.length - 1].date}
            </span>

          </div>

        </div>

      </div>

      {/* ================= INSIGHT ================= */}

      <div className="border-t border-slate-800 bg-slate-950/30 px-5 py-4 sm:px-6">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-3">

            <div className="mt-0.5 rounded-lg bg-slate-800 p-2">

              <CalendarDays
                size={16}
                className="text-slate-400"
              />

            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Market Insight
              </p>

              <p className="mt-1 text-sm text-slate-300">

                {isRising
                  ? `Airfare prices are trending upward over the selected ${range.toLowerCase()} period.`
                  : `Airfare prices are showing a downward movement over the selected ${range.toLowerCase()} period.`}

              </p>

            </div>

          </div>

          <div className="text-left sm:text-right">

            <p className="text-xs text-slate-500">
              Monitoring period
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-300">
              {range === '7D'
                ? 'Last 7 days'
                : range === '30D'
                ? 'Last 30 days'
                : 'Last 90 days'}
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}