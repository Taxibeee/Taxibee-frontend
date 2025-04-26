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
  const useDriverEarnings = (startDate: string, endDate: string) => {
    return useQuery<DriverEarnings, Error>({
      queryKey: ['driver', 'earnings', startDate, endDate],
      queryFn: () => driverApi.getDriverEarnings(startDate, endDate),
    });
  };

  // Orders query with parameters 
  const useDriverOrders = (
    params: { startDate: string; endDate: string, limit?: number; offset?: number } = { startDate: '', endDate: '', limit: 5, offset: 0 }
  ) => {
    return useQuery<Order[], Error>({
      queryKey: ['driver', 'orders', params],
      queryFn: () => {
        const { startDate, endDate, ...rest } = params;
        const period = `${startDate}-${endDate}`;
        return driverApi.getDriverOrders({ period, ...rest });
      },
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
