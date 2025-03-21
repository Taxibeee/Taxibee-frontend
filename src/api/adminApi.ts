import api from './api';
import { OrdersResponse } from '../types/order.types';
import { ContactResponse } from '../types/contact.types';
import { DriverStatus, DriversResponse } from '../types/driver.types';
import { Transaction, UnaccountedTransactionsResponse } from '../types/transaction.types';
import { WeekAnalytics, WeekDayAnalytics, RevenueByPaymentMethod, RevenueByDriver  } from '../types/analytics.types';


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
        return response.data.data;
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
        params: { 
            terminal_name?: string; 
            start_date?: number; 
            end_date?: number 
        } = {}
    ): Promise<{ 
        terminals: { 
            [key: string]: { 
                transactions: Transaction[]; 
                total_amount: number; 
                count: number 
            }}; 
                total_amount: number; 
                total_count: number 
            }> => {
        const queryParams = new URLSearchParams();
        if (params.terminal_name) queryParams.append('terminal_name', params.terminal_name);
        if (params.start_date) queryParams.append('start_date', params.start_date.toString());
        if (params.end_date) queryParams.append('end_date', params.end_date.toString());

        const url = queryParams.toString() ? `/admin/getTransactionsByTerminalName?${queryParams.toString()}` : '/admin/getTransactionsByTerminalName';
        const response = await api.get(url);
        console.log(response.data.message)
        return response.data.data;
    },

    // Contacts
    getContacts: async (): Promise<ContactResponse> => {
        const response = await api.get('/getContacts');
        return response.data;
    }
};

export default adminApi;
