import api from '../api/api';
import { LoginRequest, UpdatePasswordRequest, LoginResponse, UserType } from '../types/auth.types';

const authService = {
  // Login function that works for both drvers and admins
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        username: request.username,
        password: request.password,
        role: request.role,
      });

      // If the response contains an error, return it
      if (response.data.error) {
        return response.data;
      }

      return response.data;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { detail?: string } } };
        return {
          access_token: '',
          user: {} as UserType,
          error: axiosError.response?.data?.detail || 'Invalid credentials',
        };
      }
      return {
        access_token: '',
        user: {} as UserType,
        error: 'Invalid credentials',
      };
    }
  },

  // Update password
  updatePassword: async (request: UpdatePasswordRequest) => {
    const response = await api.put('/auth/update-password', {
      old_password: request.oldPassword,
      new_password: request.newPassword,
    });
    return response.data;
  },
};

export default authService;
