export interface UserType {
    id?: number | string
    name?: string
    full_name?: string
    username: string
    role: string
    email?: string
    company_id?: string
    bolt_driver_uuid?: string
    taxibee_id?: number
}

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
    old_password: string
    new_password: string
}

export interface LoginResponse {
    access_token: string
    user: UserType
}