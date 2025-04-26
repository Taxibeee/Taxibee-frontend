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
  getDriverEarnings: async (startDate: string, endDate: string): Promise<DriverEarnings> => {
    const response = await api.get(`/driver/earnings?start_date=${startDate}&end_date=${endDate}`);
    return response.data;
  },

  // Orders
  getDriverOrders: async (
    params: { startDate: string; endDate: string; limit?: number; offset?: number }
  ): Promise<Order[]> => {
    const queryParams = new URLSearchParams();
    queryParams.append('start_date', params.startDate);
    queryParams.append('end_date', params.endDate);
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
