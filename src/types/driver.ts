export interface Driver {
    taxibee_id: number | null;
    bolt_driver_uuid: string;
    bolt_partner_uuid: string | null;
    chauffeurskaartnr: string | null;
    phone: string | null;
    email: string | null;
    exact_debnr: string | null;
    state: string | null;
    mypos_operator_code: string | null;
    full_name: string;
    company_id: number | null;
    inactivity_reason: string | null;
    today_terminal_name: string | null;
  }
  
  export interface DriverEarningsSummary {
    total_orders: number;
    total_revenue: number;
    total_distance: number | null;
    average_ride_price: number;
    total_ride_time: number | null;
    today_terminal_name: string | null; // Based on your API, this seems to be variable
    average_ride_time: number | null;
    average_distance: number | null;
    average_price_per_mile: number | null;
  }
  
  export interface DriverDashboardData {
    driver: {
      name: string;
      status: string | null;
      inactivity_reason: string | null;
    };
    today: {
      orders_count: number;
      total_revenue: number;
    };
    week: {
      orders_count: number;
      total_revenue: number;
    };
    recent_orders: {
      order_reference: string;
      created_at: string | null;
      ride_price: number;
      pickup: string | null;
      destination: string | null;
      status: string | null;
    }[];
  }