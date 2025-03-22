export interface BaseUser {
  username: string;
  company_id: string;
  role: 'admin' | 'driver';
}

export interface AdminUser extends BaseUser {
  id: number | string;
  name: string;
  role: 'admin';
  email: string;
}

export interface DriverUser extends BaseUser {
  bolt_driver_uuid: string;
  taxibee_id: number;
  full_name: string;
  role: 'driver';
}

export type UserType = AdminUser | DriverUser;

export interface AuthState {
  token: string | null;
  user: UserType | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
  role: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  message: string;
}

export interface LoginResponse {
  access_token: string;
  user: UserType;
}

export interface ApiError {
  message: string;
  status?: number;
}
