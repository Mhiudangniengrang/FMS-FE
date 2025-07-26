# FMS Authentication API

## Cài đặt và Chạy Server

### 1. Cài đặt dependencies (nếu chưa có)

```bash
yarn add --dev @types/jsonwebtoken
```

### 2. Chạy Auth Server

```bash
yarn server
```

Server sẽ chạy tại: `http://localhost:3001`

### 3. Chạy JSON Server đơn giản (không có auth)

```bash
yarn json-server
```

## API Endpoints

### Authentication Endpoints

#### 1. Login

- **URL**: `POST /auth/login`
- **Body**:

```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

- **Response Success**:

```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "phone": "0123456789",
    "name": "Admin User",
    "role": "admin",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### 2. Register

- **URL**: `POST /auth/register`
- **Body**:

```json
{
  "email": "newuser@example.com",
  "phone": "0123456789",
  "password": "123456",
  "confirmPassword": "123456"
}
```

- **Response Success**:

```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": 3,
    "email": "newuser@example.com",
    "phone": "0123456789",
    "name": "newuser",
    "role": "user",
    "createdAt": "2025-07-25T00:00:00.000Z"
  }
}
```

#### 3. Verify Token

- **URL**: `POST /auth/verify`
- **Body**:

```json
{
  "token": "jwt_token_here"
}
```

- **Response Success**:

```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "phone": "0123456789",
    "name": "Admin User",
    "role": "admin",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Protected Routes

Tất cả các routes khác (ngoài `/auth/*`) đều yêu cầu JWT token trong header:

```
Authorization: Bearer your_jwt_token_here
```

## Tài khoản mẫu

### Admin

- Email: `admin@example.com`
- Password: `123456`

### User

- Email: `user@example.com`
- Password: `123456`

## Sử dụng trong React

### 1. Bọc App với AuthProvider

```tsx
import { AuthProvider } from "./hooks/useAuth";

function App() {
  return <AuthProvider>{/* Your app components */}</AuthProvider>;
}
```

### 2. Sử dụng hook useAuth

```tsx
import { useAuth } from '../hooks/useAuth';

function Login() {
  const { login, loading, user, isAuthenticated } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      // Login successful
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    // Your login form
  );
}
```

### 3. Sử dụng API trực tiếp

```tsx
import { authAPI, authStorage } from "../api/auth";

// Login
const loginUser = async () => {
  try {
    const response = await authAPI.login({
      email: "admin@example.com",
      password: "123456",
    });

    authStorage.setToken(response.access_token);
    authStorage.setUser(response.user);
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// Register
const registerUser = async () => {
  try {
    const response = await authAPI.register({
      email: "new@example.com",
      phone: "0123456789",
      password: "123456",
      confirmPassword: "123456",
    });

    authStorage.setToken(response.access_token);
    authStorage.setUser(response.user);
  } catch (error) {
    console.error("Registration failed:", error);
  }
};
```

## Features

- ✅ JWT Authentication
- ✅ Login/Register endpoints
- ✅ Token verification
- ✅ Protected routes middleware
- ✅ User management
- ✅ React hooks for authentication
- ✅ Local storage management
- ✅ Automatic token refresh handling
- ✅ TypeScript support

## Notes

- Tokens expire sau 1 giờ
- Passwords được lưu plain text (chỉ để demo, production nên hash)
- Server tự động tạo user mới khi register
- Tất cả API calls được log trong console
