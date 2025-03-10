import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../../services/authService";
import {
    authStart,
    loginSuccess,
    loginFailure,
    updatePasswordSuccess,
    updatePasswordFailure,
    logout,
} from "./authSlice";
import { LoginRequest, UpdatePasswordRequest } from "../../../types/auth.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const injectStore = (_store: any) => {
    store = _store;
};

/**
 * Login action creator
 * Handles authentication and stores user data in state and localStorage
 */

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ username, password, role }: LoginRequest, {dispatch, rejectWithValue}) => {
        try {
            // Signal that auth actions is starting
            dispatch(authStart());

            // Call the auth service login method
            const response = await authService.login(username, password, role);

            // If successful, update state with token and user data
            dispatch(loginSuccess({
                token: response.access_token,
                user: response.user
            }));

            return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            // Handle API errors
            const errorMessage = error.response?.data?.detail || 'An error occurred during login.';
            dispatch(loginFailure(errorMessage));

            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Signup action creator
 * Registers a new user (primarily for admin users)
 */

/**
 * NOT YET FUNCTIONAL
 */

/**
 * Update password action creator
 * Changes the authenticated user's password
 */

export const updateUserPassword = createAsyncThunk(
    'auth/updatePassword',
    async ({ oldPassword, newPassword }: UpdatePasswordRequest, {dispatch, rejectWithValue}) => {
        try {
            // Signal that auth actions is starting
            dispatch(authStart());

            // Call the auth service update password method
            const response = await authService.updatePassword(oldPassword, newPassword);

            // If successful, update state with token and user data
            dispatch(updatePasswordSuccess());

            return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            // Handle API errors
            const errorMessage = error.response?.data?.detail || 'An error occurred during password update.';
            dispatch(updatePasswordFailure(errorMessage));

            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Utility function to handle 401 (Unauthorized) errors globally 
 * Can be imported in API services to automatically logout on auth errors
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleAuthError = (error: any) => {
    if (error.response && error.response.status === 401 && store) {
        // Dispatch logout action to clear auth state
        store.dispatch(logout());

        // Optionally redirect to login page
        // This approach avoids directly depending on react-router in this file
        window.location.href = '/login';
    }

    return Promise.reject(error);
}

