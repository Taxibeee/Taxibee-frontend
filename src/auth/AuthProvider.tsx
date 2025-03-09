import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthService } from '../auth/auth'
import { AuthState, LoginRequest } from '../types/auth';
import { User } from '../types/user';

// Initial Auth State
const initialState: AuthState = {
    user: null,
    token: null,
    loading: true,
    isAuthenticated: false,
    error: null,
};

// Auth action types
type  AuthAction = 
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'CLEAR_ERROR' }
    | { type: 'AUTH_CHECKED' };


// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: null,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        case 'AUTH_CHECKED':
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

// Auth context type 
interface AuthContextType extends AuthState {
    login: (loginRequest: LoginRequest) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

// Create auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for existing auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = AuthService.getToken();
            const user = AuthService.getUser(); 

            if (token && user) {
                dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
            } else {
                dispatch({ type: 'AUTH_CHECKED' });
            }
        };
        checkAuth();
    }, []);

    // Login function
    const login = async (credentials: LoginRequest) => {
        try {
            const response = await AuthService.login(credentials);
            const { access_token, user } = response;

            // Store auth data
            AuthService.setToken(access_token);
            AuthService.setUser(user);

            dispatch({ type: 'LOGIN_SUCCESS', payload: { token: access_token, user } });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Login failed. Please try again..';
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
        }
    }; 

    // Logout function
    const logout = () => {
        AuthService.logout();
        dispatch({ type: 'LOGOUT'})
    };

    // Clear error function
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR'})
    };

    // Context value
    const value = {
        ...state,
        login,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be use within an AuthProvider');
    }
    return context;
};