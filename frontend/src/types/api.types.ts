export interface DashboardStats {
  current_index: number;
  change_24h: number;
  routes_monitored: number;
  total_scraped_today: number;
  active_anomalies: number;
  last_updated: string;
}

export interface IndexHistoryPoint {
  date: string;
  index_value: number;
}

export interface RouteTrendPoint {
  date: string;
  t0_fare: number;
  t7_fare: number;
  t30_fare: number;
}

export interface SurgeAlert {
  id: string;
  route: string;
  airline: string;
  current_fare: number;
  surge_percentage: number;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  detected_at: string;
}