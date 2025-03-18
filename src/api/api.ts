import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types/auth.types';

// Create axios instance for API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<never> => {
    const { response } = error;

    // if error is 401 unauthorized, log out the user
    if (response?.status === 401) {
      // Clear auth data

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (response.data && typeof response.data === 'object') {
        const data = response.data as { detail?: string };
        if ('detail' in data) {
          console.error('Unauthorized error detail:', data.detail);
        }
      }

      // Redirect to login
      window.location.href = '/login';
    }
    
    // Format error for consistent error handling
    const formattedError: ApiError = {
      message: (response?.data as { detail?: string })?.detail || 'An error occurred',
      status: response?.status
    };

    return Promise.reject(formattedError);

  }
);


export default api;

// Utility function to format Api errors consistently
export const formatApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return { 
      message: (axiosError.response?.data as { detail?: string })?.detail || axiosError.message || 'API request failed',
      status: axiosError.response?.status
    };
  }

  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred'
  }
}
