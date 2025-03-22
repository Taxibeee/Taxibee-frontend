export interface WeekAnalytics {
  total_revenue: number;
  total_orders: number;
  total_distance: number;
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
  day: string;
  total_revenue: number;
  total_orders: number;
  total_distance: number;
}
