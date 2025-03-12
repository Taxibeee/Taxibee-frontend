import api from './api';

// Define response types
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


// Admin API functions
const adminApi = {
    // Analytics 
    getWeekAnalytics: async (): Promise<WeekAnalytics> => {
        const response = await api.get('/analyticsByWeek');
        return response.data.data;
    },

    getWeekdayAnalytics: async (): Promise<WeekDayAnalytics[]> => {
        const response = await api.get('analyticsByWeekDays');
        return response.data.data;
    },

    // Revenue
    getRevenueByPaymentMethod: async (): Promise<RevenueByPaymentMethod> => {
        const response = await api.get('/revenueByPaymentMethod');
        return response.data.data;
    },

    getRevenueByDriver: async (): Promise<RevenueByDriver[]> => {
        const response = await api.get('/revenueByDriver');
        return response.data.data;
    },

    // Drivers
    getAllDrivers: async (): Promise<DriversResponse> => {
        const response = await api.get('/getAllDrivers');
        return response.data;
    },

    getLiveDriverStatus: async (): Promise<DriverStatus[]> => {
        const response = await api.get('/live_status');
        return response.data.data;
    },

    updateDriversTable: async (): Promise<{ message: string }> => {
        const response = await api.post('/updateDriversTable');
        return response.data;
    },

    // Transactions
    getUnaccountedTransactions: async (): Promise<UnaccountedTransactionsResponse> => {
        const response = await api.get('/unaccountedTransactions');
        return response.data;
    },

    updateTransactionDriver: async (payload: { payment_reference: string, driver_uuids: string }): Promise<{ message: string, success: boolean }> => {
        const response = await api.post('/updateTransactionDriver', payload);
        return response.data;
    },

    getTransactionsByWeekday: async (
        weekday?: string
    ): Promise<{ days: { [key: string]: { transactions: Transaction[]; total_amount: number; count: number } }; week_total: { total_amount: number, total_count: number } }> => {
        const url = weekday ? `/getTransactionsByWeekday?weekday=${weekday}` : '/getTransactionsByWeekday';
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

        const url = queryParams.toString() ? `/getTransactionsByTerminal?${queryParams.toString()}` : '/getTransactionsByTerminal';
        const response = await api.get(url);
        return response.data.data;
    }
};

export default adminApi;
