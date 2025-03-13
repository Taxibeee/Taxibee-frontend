import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '../api/adminApi';

/**
 * Custom hook that provides React Query hooks for admin data fetching
 */

export const useAdminQueries = () => {
    const queryClient = useQueryClient();
    
    // Orders queries
    const useAllOrders = (page: number = 1, pageSize: number = 25) => {
        return useQuery({
            queryKey: [ 'admin', 'allOrders', page, pageSize ],
            queryFn: () => adminApi.getAllOrders(page, pageSize),
        })
    }

    const useDriverOrders = (driverUuid: string, page: number = 1, pageSize: number = 25) => {
        return useQuery({
            queryKey: [ 'admin', 'driverOrders', driverUuid, page, pageSize ],
            queryFn: () => adminApi.getDriverOrders(driverUuid, page, pageSize),
            enabled: !!driverUuid, // Only run the query if driverUuid is provided
        })
    }


    // Analytics queries
    const useWeekAnalytics = () => {
        return useQuery({
            queryKey: [ 'admin', 'weekAnalytics' ],
            queryFn: adminApi.getWeekAnalytics,
        });
    };

    const useWeekDayAnalytics = () => {
        return useQuery({
            queryKey: [ 'admin', 'weekDayAnalytics' ],
            queryFn: adminApi.getWeekdayAnalytics,
        });
    };

    // Revenue queries
    const useRevenueByPaymentMethod = () => {
        return useQuery({
            queryKey: [ 'admin', 'revenueByMethod' ],
            queryFn: adminApi.getRevenueByPaymentMethod,
        });
    };

    const useRevenueByDriver = () => {
        return useQuery({
            queryKey: [ 'admin', 'revenueByDriver' ],
            queryFn: adminApi.getRevenueByDriver,
        });
    };

    // Driver queries 
    const useAllDrivers = () => {
        return useQuery({
            queryKey: [  'admin', 'allDrivers' ],
            queryFn: adminApi.getAllDrivers,
        });
    };

    const useLiveDriverStatus = (refreshInterval: number = 60000) => {
        return useQuery({
            queryKey: [ 'admin', 'liveDriverStatus' ],
            queryFn: adminApi.getLiveDriverStatus,
            refetchInterval: refreshInterval // Refresh automatically at the given interval
        });
    };

    const useUpdateDriversTable = () => {
        return useMutation({
            mutationFn: adminApi.updateDriversTable,
            onSuccess: () => {
                // Invalidate related queries when drivers are updated
                queryClient.invalidateQueries({ 
                    queryKey: [ 'admin', 'allDrivers' ]
                });
                queryClient.invalidateQueries({
                    queryKey: [ 'admin', 'liveDriverStatus' ]
                });
            },
        });
    };

    // Transaction queries
    const useUnaccountedTransactions = () => {
        return useQuery({
            queryKey: [ 'admin', 'unaccountedTransactions' ],
            queryFn: adminApi.getUnaccountedTransactions,
        });
    };

    const useUpdateTransactionDriver = () => {
        return useMutation({
            mutationFn: adminApi.updateTransactionDriver,
            onSuccess: () => {
                // Invalidate transaction queries when a transaction is updated
                queryClient.invalidateQueries({
                    queryKey: [ 'admin', 'unaccountedTransactions'],
                });
                queryClient.invalidateQueries({
                    queryKey: [ 'admin', 'transactionsByWeekday' ],
                });
                queryClient.invalidateQueries({
                    queryKey: [ 'admin', 'transactionsByTerminal' ]
                });
            },
        });
    };

    const useTransactionsByWeekday = (weekday?: string) => {
        return useQuery({
            queryKey: [ 'admin', 'transactionsByWeekday', weekday ],
            queryFn: () => adminApi.getTransactionsByWeekday(weekday),
        });
    };

    const useTransactionsByTerminal = (params: { terminal_name?: string; start_date?: number; end_date?: number } = {}) => {
        return useQuery({
          queryKey: ['admin', 'transactionsByTerminal', params],
          queryFn: () => adminApi.getTransactionsByTerminal(params),
        });
    };

    // Return all the query hooks
    return {
        // Orders
        useAllOrders,
        useDriverOrders,

        // Analytics
        useWeekAnalytics,
        useWeekDayAnalytics,

        // Revenue
        useRevenueByPaymentMethod,
        useRevenueByDriver,

        // Drivers
        useAllDrivers,
        useLiveDriverStatus,
        useUpdateDriversTable,

        // Transactions
        useUnaccountedTransactions,
        useUpdateTransactionDriver,
        useTransactionsByWeekday,
        useTransactionsByTerminal
    }
}