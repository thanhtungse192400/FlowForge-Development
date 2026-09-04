# FlowForge API - Tài Liệu & Tổng Quan Các Endpoint

Hệ thống FlowForge sử dụng kiến trúc RESTful API cho phép tương tác giữa Frontend (React) và Backend (Spring Boot). Hệ thống bảo mật dựa trên **JWT (JSON Web Token)** để bảo vệ các tài nguyên nhạy cảm.

Dưới đây là tài liệu tổng quan toàn bộ các API hiện có, cấu trúc dữ liệu yêu cầu (Request/Response), tác dụng và hướng dẫn sử dụng cho từng tính năng.

---

## 🔑 1. Authentication API (`/api/v1/auth`)

Quản lý đăng ký, đăng nhập, phân quyền, cấp mới token và đăng xuất.

| Phương thức | Endpoint | Yêu cầu Auth | Tác dụng / Mô tả chi tiết |
| :--- | :--- | :---: | :--- |
| **POST** | `/register` | ❌ Không | **Đăng ký tài khoản mới**: Nhận thông tin đăng ký và tạo tài khoản người dùng mới. |
| **POST** | `/login` | ❌ Không | **Đăng nhập**: Xác thực tài khoản, ghi nhận phiên đăng nhập thiết bị và trả về Access Token & Refresh Token. |
| **POST** | `/refresh` | ❌ Không | **Cấp lại Access Token**: Dùng Refresh Token cũ để lấy Access Token mới mà không cần đăng nhập lại. |
| **POST** | `/logout` | ❌ Không | **Đăng xuất**: Hủy hiệu lực của Refresh Token hiện tại trên hệ thống. |

### 💡 Hướng dẫn sử dụng & Cấu trúc dữ liệu

#### 🔹 Đăng ký tài khoản (`POST /api/v1/auth/register`)
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123",
  "name": "john_doe",
  "fullName": "John Doe",
  "phone": "0987654321"
}
```
- **Response:** Trả về đối tượng `ApiResponse` thành công hoặc thông báo lỗi nếu email đã tồn tại.

#### 🔹 Đăng nhập (`POST /api/v1/auth/login`)
- **Header đặc biệt:** 
  - `Device-Name`: Tên thiết bị (ví dụ: `Chrome - Windows 11`)
  - `User-Agent`: Thông tin trình duyệt
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```
- **Response Data:**
```json
{
  "status": 200,
  "message": "Login success",
  "data": {
    "userId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "7bcf9b82-ec6d-4952-ba78-756184518bc2",
    "role": "USER"
  }
}
```

---

## 📁 2. Project API (`/api/projects`)

Quản lý dự án (Project). Tự động bảo mật thông tin bằng cách trích xuất trực tiếp `userId` từ Access Token ở Backend.

> [!IMPORTANT]
> **Quy tắc tạo Project:**
> Khi gọi API tạo Project, Frontend **không được** gửi kèm ID dự án (`projectId`) hay ID người dùng (`userId`) lên body. Backend sẽ tự động sinh UUID cho dự án, trích xuất người dùng từ Token JWT và gán vai trò **OWNER** cho người đó.

| Phương thức | Endpoint | Yêu cầu Auth | Tác dụng / Mô tả chi tiết |
| :--- | :--- | :---: | :--- |
| **POST** | `/` | 🔐 Có | **Tạo dự án mới**: Khởi tạo dự án, tự động gán user hiện tại làm Owner. |
| **GET** | `/` | 🔐 Có | **Lấy toàn bộ dự án**: Truy vấn danh sách toàn bộ các dự án trên hệ thống. |
| **GET** | `/{id}` | 🔐 Có | **Lấy dự án theo ID**: Truy cập thông tin chi tiết của dự án qua UUID. |
| **PUT** | `/{id}` | 🔐 Có | **Cập nhật dự án**: Thay đổi tên hoặc mô tả của dự án. |
| **DELETE** | `/{id}` | 🔐 Có | **Xóa dự án**: Xóa dự án và toàn bộ các quan hệ thành viên/công việc đi kèm. |
| **GET** | `/user/{userId}` | 🔐 Có | **Lấy dự án của User**: Lấy danh sách dự án mà một User cụ thể đang tham gia. |
| **GET** | `/my-projects` | 🔐 Có | **Lấy dự án bản thân**: Lấy danh sách dự án của chính người dùng đang đăng nhập. |

### 💡 Hướng dẫn sử dụng & Cấu trúc dữ liệu

#### 🔹 Tạo mới Project (`POST /api/projects`)
- **Request Body:**
```json
{
  "name": "Hệ thống Quản lý FlowForge",
  "description": "Dự án phát triển công cụ theo dõi tiến độ công việc"
}
```
- **Response Data:**
```json
{
  "projectId": "a32d1e08-9df2-4a0b-8d01-e6e788e364bf",
  "projectName": "Hệ thống Quản lý FlowForge",
  "description": "Dự án phát triển công cụ theo dõi tiến độ công việc"
}
```

---

## 👥 3. Project Member API (`/api/projects`)

Quản lý thành viên và phân quyền vai trò (`OWNER`, `LEADER`, `MEMBER`) trong từng dự án cụ thể.

| Phương thức | Endpoint | Yêu cầu Auth | Tác dụng / Mô tả chi tiết |
| :--- | :--- | :---: | :--- |
| **POST** | `/{projectId}/members/{userId}` | 🔐 Có | **Thêm thành viên**: Đưa một user vào dự án với vai trò được chỉ định. |
| **GET** | `/{projectId}/members` | 🔐 Có | **Xem danh sách thành viên**: Lấy thông tin tất cả mọi người trong dự án. |
| **PUT** | `/{projectId}/members/{userId}` | 🔐 Có | **Thay đổi vai trò**: Nâng/hạ quyền của thành viên (Ví dụ: Leader -> Member). |
| **DELETE** | `/{projectId}/members/{userId}` | 🔐 Có | **Xóa thành viên**: Trục xuất thành viên ra khỏi dự án. |
| **GET** | `/members/user/{userId}` | 🔐 Có | **Mối quan hệ dự án của User**: Lấy các dự án kèm vai trò tương ứng của User đó. |

### 💡 Hướng dẫn sử dụng & Cấu trúc dữ liệu

#### 🔹 Thêm / Cập nhật vai trò thành viên (`POST` hoặc `PUT /api/projects/{projectId}/members/{userId}`)
- **Request Body:**
```json
{
  "role": "LEADER" 
}
```
*(Các giá trị hợp lệ của `role`: `OWNER`, `LEADER`, `MEMBER`)*

- **Response Data:**
```json
{
  "projectMemberId": "e58129d2-7fb2-47a3-ba09-5a1e8e29a99a",
  "projectId": "a32d1e08-9df2-4a0b-8d01-e6e788e364bf",
  "projectName": "Hệ thống Quản lý FlowForge",
  "userId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "userName": "john_doe",
  "userEmail": "user@example.com",
  "role": "LEADER",
  "joinedAt": "2026-06-06T13:00:00"
}
```

---

## 📝 4. Task API (`/api/v1/tasks`)

Quản lý các công việc (Task) trong hệ thống FlowForge. Tích hợp kiểm tra quyền hạn của người gọi API dựa trên vai trò trong dự án.

| Phương thức | Endpoint | Yêu cầu Auth | Tác dụng / Mô tả chi tiết |
| :--- | :--- | :---: | :--- |
| **POST** | `/` | 🔐 Có | **Tạo công việc mới**: Khởi tạo task trong dự án và gán cho người dùng cụ thể. |
| **GET** | `/` | 🔐 Có | **Lấy toàn bộ công việc**: Lấy tất cả task liên quan tới người dùng. |
| **GET** | `/project/{projectId}` | 🔐 Có | **Công việc theo dự án**: Lấy danh sách task của riêng một dự án. |
| **GET** | `/{id}` | 🔐 Có | **Chi tiết công việc**: Truy vấn chi tiết thông tin của một task. |
| **PUT** | `/{id}` | 🔐 Có | **Cập nhật công việc**: Thay đổi nội dung, trạng thái kéo thả hoặc người thực hiện task. |
| **DELETE** | `/{id}` | 🔐 Có | **Xóa công việc**: Xóa vĩnh viễn task khỏi hệ thống. |

### 💡 Hướng dẫn sử dụng & Cấu trúc dữ liệu

#### 🔹 Tạo / Cập nhật công việc (`POST` hoặc `PUT /api/v1/tasks`)
- **Request Body:**
```json
{
  "title": "Thiết kế giao diện Dashboard",
  "description": "Tạo giao diện Kanban và báo cáo thống kê tiến độ",
  "status": "TODO",
  "projectId": "a32d1e08-9df2-4a0b-8d01-e6e788e364bf",
  "assignedToId": "d290f1ee-6c54-4b01-90e6-d701748f0851"
}
```
*(Các trạng thái `status` hợp lệ: `BACKLOG`, `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`)*

- **Response Data:**
```json
{
  "taskId": "7a94f86d-f421-4f1b-a5d6-8ee8591ef522",
  "title": "Thiết kế giao diện Dashboard",
  "description": "Tạo giao diện Kanban và báo cáo thống kê tiến độ",
  "status": "TODO",
  "projectId": "a32d1e08-9df2-4a0b-8d01-e6e788e364bf",
  "assignedToId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "createdById": "3c01a2f1-6cf1-45a8-9d22-1aa9822a1012"
}
```

---

## 💬 5. Task Comment API (`/api/v1/tasks/{taskId}/comments`)

Hệ thống thảo luận trực tiếp dưới từng công việc. Cho phép các thành viên trao đổi tiến độ và phản hồi.

| Phương thức | Endpoint | Yêu cầu Auth | Tác dụng / Mô tả chi tiết |
| :--- | :--- | :---: | :--- |
| **POST** | `/` | 🔐 Có | **Bình luận mới**: Gửi nội dung thảo luận mới vào task. |
| **GET** | `/` | 🔐 Có | **Xem danh sách bình luận**: Lấy toàn bộ lịch sử bình luận của task đó. |

### 💡 Hướng dẫn sử dụng & Cấu trúc dữ liệu

#### 🔹 Gửi bình luận mới (`POST /api/v1/tasks/{taskId}/comments`)
- **Request Body:**
```json
{
  "content": "Tôi đã hoàn thành bản vẽ mockup, nhờ mọi người review giúp."
}
```
- **Response Data:**
```json
{
  "status": 200,
  "message": "Comment added successfully",
  "data": {
    "id": "e5d8a9e2-9b2f-410a-b32c-7b24e6c98aa2",
    "content": "Tôi đã hoàn thành bản vẽ mockup, nhờ mọi người review giúp.",
    "taskId": "7a94f86d-f421-4f1b-a5d6-8ee8591ef522",
    "userId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "userName": "john_doe",
    "createdAt": "2026-06-06T13:10:00"
  }
}
```

---

## 👤 6. Profile API (`/api/v1/profile`)

Quản lý thông tin cá nhân và cập nhật ảnh đại diện của người dùng đang đăng nhập.

| Phương thức | Endpoint | Yêu cầu Auth | Tác dụng / Mô tả chi tiết |
| :--- | :--- | :---: | :--- |
| **GET** | `/` | 🔐 Có | **Lấy hồ sơ cá nhân**: Hiển thị thông tin chi tiết của bản thân (email, tên, sđt, avatar...). |
| **PUT** | `/` | 🔐 Có | **Cập nhật thông tin**: Sửa tên hiển thị, họ tên đầy đủ, số điện thoại. |
| **POST** | `/avatar` | 🔐 Có | **Tải ảnh đại diện**: Upload hình ảnh lên Cloudinary làm avatar cá nhân. |

### 💡 Hướng dẫn sử dụng & Cấu trúc dữ liệu

#### 🔹 Cập nhật thông tin chữ (`PUT /api/v1/profile`)
- **Request Body:**
```json
{
  "name": "john_doe_updated",
  "fullName": "John Doe Junior",
  "phone": "0912345678"
}
```

#### 🔹 Tải ảnh đại diện (`POST /api/v1/profile/avatar`)
- **Yêu cầu Headers:** `Content-Type: multipart/form-data`
- **Request Form-Data:**
  - `file`: Chọn một file ảnh (`png`, `jpg`, `jpeg`).
- **Tác dụng:** Backend sẽ upload ảnh này lên máy chủ đám mây **Cloudinary**, lấy đường dẫn an toàn (`https://res.cloudinary.com/...`) và tự động lưu vào thông tin của người dùng.

---

## 🔔 7. Notification API (`/api/v1/notifications`)

Hệ thống thông báo giúp người dùng cập nhật kịp thời các hoạt động quan trọng trong dự án (ví dụ: được giao task, nhắc nhở tiến độ).

| Phương thức | Endpoint | Yêu cầu Auth | Tác dụng / Mô tả chi tiết |
| :--- | :--- | :---: | :--- |
| **GET** | `/unread` | 🔐 Có | **Lấy thông báo chưa đọc**: Lấy toàn bộ các tin báo mới nhất chưa được xem. |
| **PUT** | `/{id}/read` | 🔐 Có | **Đánh dấu đã đọc**: Chuyển trạng thái thông báo thành đã xem dựa theo ID thông báo. |

### 💡 Hướng dẫn sử dụng & Cấu trúc dữ liệu

#### 🔹 Đánh dấu đã đọc thông báo (`PUT /api/v1/notifications/{id}/read`)
- **Cách sử dụng:** Khi người dùng click vào một thông báo cụ thể trên UI chuông thông báo, Frontend sẽ gọi API này để làm mờ/dọn dẹp thông báo đó.
- **Response:**
```json
{
  "status": 200,
  "message": "Notification marked as read",
  "data": null
}
```

---

## 🔍 8. User API (`/api/v1/users`)

Tính năng bổ trợ giúp quản trị và kết nối người dùng.

| Phương thức | Endpoint | Yêu cầu Auth | Tác dụng / Mô tả chi tiết |
| :--- | :--- | :---: | :--- |
| **GET** | `/search` | 🔐 Có | **Tìm kiếm người dùng**: Tra cứu danh sách tài khoản trong hệ thống theo từ khóa. |

### 💡 Hướng dẫn sử dụng & Cấu trúc dữ liệu

#### 🔹 Tìm kiếm người dùng (`GET /api/v1/users/search?keyword=john`)
- **Tác dụng:** Thường dùng cho chức năng *Autocomplete Search* khi thêm thành viên mới vào dự án hoặc gán người nhận việc.
- **Response Data:** Danh sách các tài khoản khớp từ khóa:
```json
{
  "status": 200,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
      "name": "john_doe",
      "fullName": "John Doe",
      "email": "user@example.com",
      "role": "USER",
      "joinedAt": "2026-06-05T10:00:00"
    }
  ]
}
```

---

## 🛡️ Hướng dẫn cách đính kèm token từ Frontend (React/Axios)

Tất cả các API có đánh dấu 🔐 **Yêu cầu Auth** bắt buộc phải đính kèm Header sau ở Frontend:

```http
Authorization: Bearer <Access_Token_Của_Bạn>
```

### ⚙️ Cách triển khai mẫu bằng Axios Interceptor ở React

Để tránh việc đính kèm thủ công ở từng API, bạn nên cấu hình một Axios Instance chung tự động đọc Token từ `Cookie` hoặc `localStorage` và đính kèm vào header:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Thay đổi địa chỉ Backend của bạn
  withCredentials: true // Hỗ trợ gửi cookie nếu cần
});

// Interceptor tự động thêm JWT Access Token vào mọi Request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // hoặc đọc từ Cookie
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```
