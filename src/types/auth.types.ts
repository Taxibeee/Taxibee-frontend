export interface AdminUser {
    id: number | string;
    name: string;
    username: string;
    role: 'admin',
    email: string;
    company_id: string;
}

export interface DriverUser {
    username: string;
    bolt_driver_uuid: string;
    taxibee_id: number;
    full_name: string;
    company_id: string;
    role: 'driver';
}

export type UserType = AdminUser | DriverUser;


export interface AuthState {
    token: string | null
    user: UserType | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
}

export interface LoginRequest {
    username: string
    password: string
    role: string
}

export interface UpdatePasswordRequest {
    oldPassword: string
    newPassword: string
}

export interface UpdatePasswordResponse {
    message: string
}

export interface LoginResponse {
    access_token: string
    user: UserType
}

export interface ApiError {
    message: string;
    status?: number;
}
