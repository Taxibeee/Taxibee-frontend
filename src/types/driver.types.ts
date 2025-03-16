export interface DriverProfile {
    taxibee_id: number;
    bolt_driver_uuid: string;
    bolt_partner_uuid: string;
    chauffeurskaartnr: string;
    phone: string;
    email: string;
    exact_debnr: string;
    state: string;
    mypos_operator_code: string;
    full_name: string;
    company_id: string;
    inactivity_reason: string | null;
    today_terminal_name: string | null;
}

export interface DriverEarnings {
    total_orders: number;
    total_revenue: number;
    total_distance: number;
    average_ride_price: number;
    total_ride_time: number | null;
    today_terminal_name: string | null;
    average_ride_time: number | null;
    average_distance: number;
    average_price_per_mile: number;
}

