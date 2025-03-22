import { useQuery } from '@tanstack/react-query';
import driverApi from '../api/driverApi';
import { DriverProfile, DriverEarnings } from '../types/driver.types';
import { Order } from '../types/order.types';

/**
 * Custom hook that provides React Query hooks for driver data fetching
 */
export const useDriverQueries = () => {
  // Profile query
  const useDriverProfile = () => {
    return useQuery<DriverProfile, Error>({
      queryKey: ['driver', 'profile'],
      queryFn: driverApi.getDriverProfile,
    });
  };

  // Earnings query with period parameter
  const useDriverEarnings = (period: string = 'week') => {
    return useQuery<DriverEarnings, Error>({
      queryKey: ['driver', 'earnings', period],
      queryFn: () => driverApi.getDriverEarnings(period),
    });
  };

  // Orders query with parameters
  const useDriverOrders = (
    params: { period: string; limit?: number; offset?: number } = { period: 'week' }
  ) => {
    return useQuery<Order[], Error>({
      queryKey: ['driver', 'orders', params],
      queryFn: () => driverApi.getDriverOrders(params),
    });
  };

  // Contacts query
  const useDriverContacts = () => {
    return useQuery({
      queryKey: ['driver', 'contacts'],
      queryFn: driverApi.getContacts,
    });
  };

  // Return all the query hooks
  return {
    useDriverProfile,
    useDriverEarnings,
    useDriverOrders,

    // Contacts,
    useDriverContacts,
  };
};
