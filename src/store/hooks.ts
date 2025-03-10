import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '.'
import {
    selectAuth,
    selectUser,
    selectIsAuthenticated,
    selectLoading,
    selectError,
    selectUserRole,
} from './slices/auth/authSlice';
import {
    loginUser,
    updateUserPassword
} from './slices/auth/authActions';
import { clearErrors, logout } from './slices/auth/authSlice';

// Use throughout app instead of plain useDispatch and useSelector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hook for all auth related functionality
export const useAuth = () => {
    const dispatch = useAppDispatch()
    const auth = useAppSelector(selectAuth)
    const currentUser = useAppSelector(selectUser)
    const isAuthenticated = useAppSelector(selectIsAuthenticated)
    const loading = useAppSelector(selectLoading)
    const error = useAppSelector(selectError)
    const userRole = useAppSelector(selectUserRole)

    // Login function
    const login = async (username: string, password: string, role: string) => {
        // eslint-disable-next-line no-useless-catch
        try {
            return await dispatch(loginUser(username, password, role)).unwrap()
        } catch(error) {
            throw error
        }
    }

    // Update password function
    const updatePassword = async (oldPassword: string, newPassword: string) => {
        // eslint-disable-next-line no-useless-catch
        try {
            return await dispatch(updateUserPassword(oldPassword, newPassword)).unwrap()
        } catch(error) {
            throw error
        }
    }

    // Logout function
    const handleLogout = () => {
        dispatch(logout())
    }

    // Clear errors
    const handleClearErrors = () => {
        dispatch(clearErrors())
    }

    // Check if user has a specific role
    const hasRole = (role: string) => {
        return userRole === role
    }

    return {
        //State
        auth,
        currentUser,
        userRole,
        isAuthenticated,
        loading,
        error,

        //Actions
        login,
        logout: handleLogout,
        updatePassword,
        clearErrors: handleClearErrors,
        hasRole,
    }
}