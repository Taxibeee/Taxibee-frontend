import api from './api';
import { Order } from '../types/order.types';
import { ContactResponse } from '../types/contact.types';
import { DriverEarnings, DriverProfile } from '../types/driver.types';

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
  getDriverOrders: async (
    params: { period: string; limit?: number; offset?: number } = { period: 'week' }
  ): Promise<Order[]> => {
    const queryParams = new URLSearchParams();
    queryParams.append('period', params.period);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const response = await api.get(`/driver/orders?${queryParams.toString()}`);
    return response.data;
  },

  // Contacts
  getContacts: async (): Promise<ContactResponse> => {
    const response = await api.get('/getContacts');
    return response.data;
  },
};

export default driverApi;
