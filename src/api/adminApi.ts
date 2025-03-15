import api from './api';

// Define response types

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
    payment_confirmed_timestamp: number | null;
    order_created_timestamp: number | null;
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

export interface OrdersResponse {
    data: Order[];
    total_count: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}


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

export interface DriverStatus {
    driver_uuid: string;
    driver_name: string;
    phone: string;
    current_status: string;
    last_updated: string | null;
    status_duration: string | null;
}

export interface Driver {
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

export interface DriversResponse {
    data: Driver[];
}

export interface Transaction {
    payment_reference: string;
    transaction_date: number;
    transaction_date_formatted?: string;
    terminal_name: string;
    operator_code: string;
    transaction_amount: number;
    bolt_driver_uuids: string;
    driver_names?: string[];
}

export interface UnaccountedTransactionsResponse {
    transactions: Transaction[];
    driver_options: { uuid: string; name: string }[];
}

export interface Contact {
    name: string;
    email: string;
    phone: string;
    tag: string;
}

export interface ContactResponse {
    contacts: Contact[];
}


// Admin API functions
const adminApi = {
    // Orders
    getAllOrders: async (page: number = 1, page_size: number = 25): Promise<OrdersResponse> => {
        const response = await api.get(`/admin/getAllOrders?page=${page}&page_size=${page_size}`);
        return response.data;
    },

    getDriverOrders: async (driver_uuid: string, page: number = 1, page_size: number = 25): Promise<OrdersResponse> => {
        const response = await api.get(`/admin/getDriverOrders/${driver_uuid}?page=${page}&page_size=${page_size}`);
        return response.data;
    },


    // Analytics 
    getWeekAnalytics: async (): Promise<WeekAnalytics> => {
        const response = await api.get('/admin/analyticsByWeek');
        return response.data.data;
    },

    getWeekdayAnalytics: async (): Promise<WeekDayAnalytics[]> => {
        const response = await api.get('/admin/analyticsByWeekDays');
        return response.data.data;
    },

    // Revenue
    getRevenueByPaymentMethod: async (): Promise<RevenueByPaymentMethod> => {
        const response = await api.get('/admin/revenueByPaymentMethod');
        return response.data.data;
    },

    getRevenueByDriver: async (): Promise<RevenueByDriver[]> => {
        const response = await api.get('/admin/revenueByDriver');
        return response.data.data;
    },

    // Drivers
    getAllDrivers: async (): Promise<DriversResponse> => {
        const response = await api.get('/admin/getAllDrivers');
        return response.data;
    },

    getLiveDriverStatus: async (): Promise<DriverStatus[]> => {
        const response = await api.get('/admin/live_status');
        return response.data.data;
    },

    updateDriversTable: async (): Promise<{ message: string }> => {
        const response = await api.post('/admin/updateDriversTable');
        return response.data;
    },

    // Transactions
    getUnaccountedTransactions: async (): Promise<UnaccountedTransactionsResponse> => {
        const response = await api.get('/admin/getUnaccountedTransactions');
        return response.data;
    },

    updateTransactionDriver: async (payload: { payment_reference: string, driver_uuids: string }): Promise<{ message: string, success: boolean }> => {
        const response = await api.post('/admin/updateTransactionDriver', payload);
        return response.data;
    },

    getTransactionsByWeekday: async (
        weekday?: string
    ): Promise<{ days: { [key: string]: { transactions: Transaction[]; total_amount: number; count: number } }; week_total: { total_amount: number, total_count: number } }> => {
        const url = weekday ? `/admin/getTransactionsByWeekday?weekday=${weekday}` : '/admin/getTransactionsByWeekday';
        const response = await api.get(url);
        return response.data.data;
    },

    getTransactionsByTerminal: async (
        params: { terminal_name?: string; start_date?: number; end_date?: number } = {}
    ): Promise<{ terminals: { [key: string]: { transactions: Transaction[]; total_amount: number; count: number } }; total_amount: number; total_count: number }> => {
        const queryParams = new URLSearchParams();
        if (params.terminal_name) queryParams.append('terminal_name', params.terminal_name);
        if (params.start_date) queryParams.append('start_date', params.start_date.toString());
        if (params.end_date) queryParams.append('end_date', params.end_date.toString());

        const url = queryParams.toString() ? `/admin/getTransactionsByTerminalName?${queryParams.toString()}` : '/admin/getTransactionsByTerminalName';
        const response = await api.get(url);
        return response.data.data;
    },

    // Contacts
    getContacts: async (): Promise<ContactResponse> => {
        const response = await api.get('/getContacts');
        return response.data;
    }
};

export default adminApi;
