import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../index';
import { AuthState, UserType } from '../../../types/auth.types';

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: localStorage.getItem('token') ? true : false,
  loading: false,
  buttonLoading: false,
  error: null,
};

// Create the auth slice with reducers
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Start loading state for any auth action
    authStart: state => {
      state.buttonLoading = true;
      state.error = null;
    },

    // Handle successfull login
    loginSuccess: (state, action: PayloadAction<{ token: string; user: UserType }>) => {
      const { token, user } = action.payload;

      // Update localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update state
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.buttonLoading = false;
      state.error = null;
    },

    // Handle login failure
    loginFailure: (state, action: PayloadAction<string>) => {
      state.buttonLoading = false;
      state.error = action.payload;
    },

    // Handle password update Success
    updatePasswordSuccess: state => {
      state.buttonLoading = false;
      state.error = null;
    },

    // Handle password update failure
    updatePasswordFailure: (state, action: PayloadAction<string>) => {
      state.buttonLoading = false;
      state.error = action.payload;
    },

    // Handle logout
    logout: state => {
      // Remove localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Update state
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.buttonLoading = false;
      state.error = null;
    },

    // Clear any error messages
    clearErrors: state => {
      state.error = null;
    },
  },
});

// Export the actions
export const {
  authStart,
  loginSuccess,
  loginFailure,
  updatePasswordSuccess,
  updatePasswordFailure,
  logout,
  clearErrors,
} = authSlice.actions;

// Export the reducer
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectButtonLoading = (state: RootState) => state.auth.buttonLoading;
export const selectError = (state: RootState) => state.auth.error;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
