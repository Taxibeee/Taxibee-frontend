import { useQuery } from '@tanstack/react-query';
import driverApi from '../api/driverApi';

/**
 * Custom hook that provides React Query hooks for driver data fetching
 */
export const useDriverQueries = () => {
  // Profile query
  const useDriverProfile = () => {
    return useQuery({
      queryKey: ['driver', 'profile'],
      queryFn: driverApi.getDriverProfile,
    });
  };

  // Earnings query with period parameter
  const useDriverEarnings = (period: string = 'week') => {
    return useQuery({
      queryKey: ['driver', 'earnings', period],
      queryFn: () => driverApi.getDriverEarnings(period),
    });
  };

  // Orders query with parameters
  const useDriverOrders = (params: { period: string; limit?: number; offset?: number } = { period: 'week' }) => {
    return useQuery({
      queryKey: ['driver', 'orders', params],
      queryFn: () => driverApi.getDriverOrders(params),
    });
  };

  // Return all the query hooks
  return {
    useDriverProfile,
    useDriverEarnings,
    useDriverOrders,
  };
};