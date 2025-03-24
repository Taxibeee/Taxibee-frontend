export interface WeekAnalytics {
  total_revenue: number;
  total_orders: number;
  total_distance: number;
  date_range: {
    start: string;
    end: string;
  };
}

export interface RevenueByPaymentMethod {
  [key: string]: number;
}

export interface RevenueByDriver {
  driver_uuid: string;
  driver_name: string;
  total_revenue: number;
}

export interface WeekDayAnalytics {
  date: string;
  day: string;
  total_revenue: number;
  total_orders: number;
  total_distance: number;
}

export interface WeekDayAnalyticsResponse {
  daily_analytics: WeekDayAnalytics[];
  date_range: {
    start: string;
    end: string;
  };
}
