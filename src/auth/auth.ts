import api from '../api/api';
import { LoginRequest, LoginResponse } from '../types/auth'; 
import { User } from '../types/user';

export const AuthService = {
    login: async (loginRequest: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post('/auth/login', loginRequest);
        return response.data;
    },
    updatePassword: async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
        const response = await api.put('/auth/update-password', { oldPassword, newPassword });
        return response.data;
    },
    /**
     * Get the current authenticated user token
     */
    getToken: (): string | null => {
        return localStorage.getItem('token')
    },
    /**
     * Save authentication token to localStorage
     */
    setToken: (token: string): void => {
        localStorage.setItem('token', token);
    },
    /**
     * Remove auth token and user data from storage
     */
    logout: (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('token');
        return !!token;
    },
    /**
     * Save user data to localStorage
     */
    setUser: (user: User): void => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    /**
     * Get user data from localStorage
    */
    getUser: (): User | null => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}
