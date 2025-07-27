export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "manager" | "staff" | "user" | "supervisor" | "admin";
  createdAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "manager" | "staff" | "supervisor" ;
}

export interface UpdateUserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: "manager" | "staff" | "supervisor" ;
}

export interface CreateUserForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "supervisor" | "manager" | "staff" ;
} 