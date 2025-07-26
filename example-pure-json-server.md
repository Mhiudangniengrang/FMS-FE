# So sánh JSON Server thuần vs Custom Server

## 1. JSON Server thuần (chỉ db.json)

### Cách sử dụng:

```bash
npx json-server --watch db.json --port 3001
```

### Endpoints tự động:

- GET /users - Lấy tất cả users
- GET /users/1 - Lấy user có id = 1
- POST /users - Tạo user mới
- PUT /users/1 - Update toàn bộ user
- PATCH /users/1 - Update một phần user
- DELETE /users/1 - Xóa user

### Ưu điểm:

- ✅ Cực kỳ đơn giản
- ✅ CRUD tự động
- ✅ Filtering: /users?role=admin
- ✅ Sorting: /users?\_sort=name
- ✅ Pagination: /users?\_page=1&\_limit=10

### Nhược điểm:

- ❌ KHÔNG có authentication
- ❌ KHÔNG có JWT tokens
- ❌ KHÔNG có password validation
- ❌ KHÔNG có custom business logic
- ❌ KHÔNG có middleware
- ❌ Bất kỳ ai cũng có thể CRUD data

## 2. Custom Server (server.cjs)

### Các tính năng bổ sung:

- ✅ JWT Authentication
- ✅ Login/Register endpoints
- ✅ Password validation
- ✅ Protected routes
- ✅ Role-based access
- ✅ Custom validation logic
- ✅ Token verification middleware

### Ví dụ:

```javascript
// Với JSON Server thuần - ai cũng có thể xóa user:
DELETE /users/1 ✅ (không cần auth)

// Với Custom Server - cần authentication:
DELETE /users/1
Headers: Authorization: Bearer <token> ✅
Không có token: 401 Unauthorized ❌
```

## 3. Kết luận:

- Nếu chỉ cần CRUD đơn giản: **JSON Server thuần**
- Nếu cần authentication + security: **Custom Server** (như hiện tại)
