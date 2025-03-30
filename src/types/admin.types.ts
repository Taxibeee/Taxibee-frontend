// Admin Profile types
export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  role: string;
}

export interface AdminProfileUpdate {
  name: string;
  email: string;
  phone: string;
  username: string;
}
