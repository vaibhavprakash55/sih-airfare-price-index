import axios from 'axios';
import {
  DashboardStats,
  IndexHistoryPoint,
  RouteTrendPoint,
  SurgeAlert,
} from '@/types/api.types';

const API = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  return {
    current_index: 128.46,
    change_24h: 2.34,
    routes_monitored: 25,
    total_scraped_today: 18420,
    active_anomalies: 7,
    last_updated: new Date().toISOString(),
  };
};

export const fetchIndexHistory = async (
  range: string = '30d'
): Promise<IndexHistoryPoint[]> => {
  const data: IndexHistoryPoint[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split('T')[0],
      index_value: Number(
        (118 + Math.random() * 10 + (29 - i) * 0.25).toFixed(2)
      ),
    });
  }

  return data;
};

export const fetchRouteTrends = async (
  route: string = 'DEL-BOM'
): Promise<RouteTrendPoint[]> => {
  const data: RouteTrendPoint[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split('T')[0],
      t0_fare: Math.round(4500 + Math.random() * 1500),
      t7_fare: Math.round(3500 + Math.random() * 1200),
      t30_fare: Math.round(2800 + Math.random() * 900),
    });
  }

  return data;
};

export const fetchSurgeAlerts = async (): Promise<SurgeAlert[]> => {
  return [
    {
      id: '1',
      route: 'DEL-BOM',
      airline: 'IndiGo',
      current_fare: 6840,
      surge_percentage: 42.5,
      severity: 'CRITICAL',
      detected_at: new Date().toISOString(),
    },
    {
      id: '2',
      route: 'BOM-BLR',
      airline: 'Air India',
      current_fare: 5120,
      surge_percentage: 28.7,
      severity: 'HIGH',
      detected_at: new Date().toISOString(),
    },
    {
      id: '3',
      route: 'DEL-BLR',
      airline: 'Akasa Air',
      current_fare: 4380,
      surge_percentage: 18.4,
      severity: 'MODERATE',
      detected_at: new Date().toISOString(),
    },
    {
      id: '4',
      route: 'MAA-DEL',
      airline: 'SpiceJet',
      current_fare: 5960,
      surge_percentage: 31.2,
      severity: 'HIGH',
      detected_at: new Date().toISOString(),
    },
  ];
};