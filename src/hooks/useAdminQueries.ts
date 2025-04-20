import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '../api/adminApi';

import { OrdersResponse } from '../types/order.types';
import { formatApiError } from '../api/api';

/**
 * Custom hook that provides React Query hooks for admin data fetching
 */

export const useAdminQueries = () => {
  const queryClient = useQueryClient();

  // Orders queries
  const useAllOrders = (page: number = 1, pageSize: number = 25, search?: string) => {
    return useQuery({
      queryKey: ['admin', 'allOrders', page, pageSize, search],
      queryFn: () => adminApi.getAllOrders(page, pageSize, search) as Promise<OrdersResponse>,
      staleTime: 5000,
    });
  };

  const useDriverOrders = (driverUuid: string, page: number = 1, pageSize: number = 25) => {
    return useQuery({
      queryKey: ['admin', 'driverOrders', driverUuid, page, pageSize],
      queryFn: () => adminApi.getDriverOrders(driverUuid, page, pageSize),
      enabled: !!driverUuid, // Only run the query if driverUuid is provided
    });
  };

  // Analytics queries
  const useWeekAnalytics = (startDate: string, endDate: string) => {
    return useQuery({
      queryKey: ['admin', 'weekAnalytics', startDate, endDate],
      queryFn: () => adminApi.getWeekAnalytics(startDate, endDate),
    });
  };

  const useWeekDayAnalytics = (startDate: string, endDate: string) => {
    return useQuery({
      queryKey: ['admin', 'weekDayAnalytics', startDate, endDate],
      queryFn: () => adminApi.getWeekdayAnalytics(startDate, endDate),
    });
  };

  // Revenue queries
  const useRevenueByPaymentMethod = (startDate: string, endDate: string) => {
    return useQuery({
      queryKey: ['admin', 'revenueByPaymentMethod', startDate, endDate],
      queryFn: () => adminApi.getRevenueByPaymentMethod(startDate, endDate),
    });
  };

  const useRevenueByDriver = (startDate: string, endDate: string) => {
    return useQuery({
      queryKey: ['revenueByDriver', startDate, endDate],
      queryFn: () => adminApi.getRevenueByDriver(startDate, endDate),
    });
  };

  // Driver queries
  const useAllDrivers = () => {
    return useQuery({
      queryKey: ['admin', 'allDrivers'],
      queryFn: adminApi.getAllDrivers,
    });
  };

  const useLiveDriverStatus = (refreshInterval: number = 60000) => {
    return useQuery({
      queryKey: ['admin', 'liveDriverStatus'],
      queryFn: adminApi.getLiveDriverStatus,
      refetchInterval: refreshInterval, // Refresh automatically at the given interval
      refetchIntervalInBackground: false, // Only refetch when the tab is focused
    });
  };

  const useUpdateDriversTable = () => {
    return useMutation({
      mutationFn: adminApi.updateDriversTable,
      onSuccess: () => {
        // Invalidate related queries when drivers are updated
        queryClient.invalidateQueries({
          queryKey: ['admin', 'allDrivers'],
        });
        queryClient.invalidateQueries({
          queryKey: ['admin', 'liveDriverStatus'],
        });
      },
      onError: (error: unknown) => {
        console.error('Failed to update drivers:', error);
        return formatApiError(error).message;
      },
    });
  };

  // Transaction queries
  const useUnaccountedTransactions = () => {
    return useQuery({
      queryKey: ['admin', 'unaccountedTransactions'],
      queryFn: adminApi.getUnaccountedTransactions,
    });
  };

  const useUpdateTransactionDriver = () => {
    return useMutation({
      mutationFn: adminApi.updateTransactionDriver,
      onSuccess: () => {
        // Invalidate transaction queries when a transaction is updated
        queryClient.invalidateQueries({
          queryKey: ['admin', 'unaccountedTransactions'],
        });
        queryClient.invalidateQueries({
          queryKey: ['admin', 'transactionsByWeekday'],
        });
        queryClient.invalidateQueries({
          queryKey: ['admin', 'transactionsByTerminal'],
        });
      },
      onError: (error: unknown) => {
        console.error('Failed to update transaction driver: ', formatApiError(error));
        return formatApiError(error).message;
      },
    });
  };

  const useTransactionsByWeekday = (weekday?: string) => {
    return useQuery({
      queryKey: ['admin', 'transactionsByWeekday', weekday],
      queryFn: () => adminApi.getTransactionsByWeekday(weekday),
    });
  };

  const useTransactionsByTerminal = (
    params: { terminal_name?: string; start_date?: number; end_date?: number } = {}
  ) => {
    return useQuery({
      queryKey: ['admin', 'transactionsByTerminal', params],
      queryFn: () => adminApi.getTransactionsByTerminal(params),
    });
  };

  // Contacts
  const useAdminContacts = () => {
    return useQuery({
      queryKey: ['admin', 'contacts'],
      queryFn: adminApi.getContacts,
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
    useTransactionsByTerminal,

    // Contacts
    useAdminContacts,
  };
};
