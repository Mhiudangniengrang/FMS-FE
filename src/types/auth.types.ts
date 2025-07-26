export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterFormData {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreement?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  email: string;
  phone: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

