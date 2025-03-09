export interface LoginRequest {
    username: string;
    password: string;
    role: string;
  }
  
  export interface LoginResponse {
    access_token: string;
    user: {
      username: string;
      bolt_driver_uuid: string;
      taxibee_id: number | null;
      full_name: string;
      company_id: number | null;
    };
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: {
      username?: string;
      bolt_driver_uuid?: string;
      taxibee_id?: number | null;
      full_name?: string;
      company_id?: number | null;
    } | null;
    loading: boolean;
    error: string | null;
  }