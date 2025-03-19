import { createAsyncThunk, Store } from "@reduxjs/toolkit";
import { RootState } from "../..";
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
import { AxiosError } from "axios";



let store: Store<RootState>;

export const injectStore = (_store: Store<RootState>) => {
    store = _store;
};

/**
 * Login action creator
 * Handles authentication and stores user data in state and localStorage
 */

export const loginUser = createAsyncThunk(
    '/auth/login',
    async ({ username, password, role }: LoginRequest, { dispatch, rejectWithValue }) => {
        try {
            // Signal that auth actions is starting
            dispatch(authStart());

            // Call the auth service login method
            const response = await authService.login({ username, password, role });

            // If successful, update state with token and user data
            dispatch(loginSuccess({
                token: response.access_token,
                user: response.user
            }));

            return response;

        } catch (error: unknown) {
            let errorMessage = 'An error occurred during login.';

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'detail' in error.response.data) {
                errorMessage = error.response.data.detail as string;
            } else if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
                errorMessage = error.message;
            }


            
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
            const response = await authService.updatePassword({ oldPassword, newPassword });

            // If successful, update state with token and user data
            dispatch(updatePasswordSuccess());

            return response;
        } catch (error: unknown) {
            let errorMessage = 'An error occurred during password update.';

            if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'detail' in error.response.data) {
                errorMessage = error.response.data.detail as string;
            } else if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
                errorMessage = error.message;
            }



            dispatch(updatePasswordFailure(errorMessage));

            return rejectWithValue(errorMessage);
        }
    }
);

/**
 * Utility function to handle 401 (Unauthorized) errors globally 
 * Can be imported in API services to automatically logout on auth errors
 */

export const handleAuthError = (error: unknown) => {
    if (error && isAxiosError(error) && error.response?.status === 401 && store) {
        store.dispatch(logout());
        window.location.href = '/login';
    }
    return Promise.reject(error);
};

function isAxiosError(error: unknown): error is AxiosError {
    return error !== null && 
           typeof error === 'object' && 
           'isAxiosError' in error;
}
