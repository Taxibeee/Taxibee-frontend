import api from './api';

// Define response types
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

export interface Order {
    order_reference: string;
    driver_name: string | null;
    driver_uuid: string | null;
    payment_method: string | null;
    order_status: string | null;
    vehicle_model: string | null;
    vehicle_license_plate: string | null;
    terminal_name: string | null;
    pickup_address: string | null;
    ride_distance: number | null;
    order_created_timestamp: string | null;
    order_accepted_timestamp: number | null;
    order_pickup_timestamp: number | null;
    order_dropoff_timestamp: number | null;
    order_finished_timestamp: number | null;
    ride_price: number | null;
    booking_fee: number | null;
    toll_fee: number | null;
    tip: number | null;
    cash_discount: number | null;
    commission: number | null;
    in_app_discount: number | null;
    net_earnings: number | null;
    cancellation_fee: number | null;
}

// Driver API functions
const driverApi = {
    // Profile
    getDriverProfile: async (): Promise<DriverProfile> => {
        const response = await api.get('/driver/profile');
        return response.data;   
    },

    // Earnings 
    getDriverEarnings: async (period: string = 'week'): Promise<DriverEarnings> => {
        const response = await api.get(`/driver/earnings?period=${period}`);
        return response.data;
    },

    // Orders
    getDriverOrders: async (params: { period: string; limit?: number; offset?: number } = { period: 'week' }) : Promise<Order[]> => {
        const queryParams = new URLSearchParams();
        queryParams.append('period', params.period);
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.offset) queryParams.append('offset', params.offset.toString());

        const response = await api.get(`/driver/orders?${queryParams.toString()}`);
        return response.data;
    }
};

export default driverApi;