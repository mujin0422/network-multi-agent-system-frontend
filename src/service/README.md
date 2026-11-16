# Shared transport infrastructure

Thư mục `src/service` chỉ chứa hạ tầng giao tiếp dùng chung. Các endpoint nghiệp
vụ được đặt trong `src/features/<feature>/api` của feature sở hữu.

## Cấu trúc

```text
src/service/
├── api.ts
├── token-storage.ts
├── contracts.ts
├── index.ts
└── websocket.ts
```

## Trách nhiệm

- `api.ts`: Axios client, bearer token, refresh interceptor và lỗi dùng chung.
- `token-storage.ts`: quản lý access/refresh token theo contract backend hiện tại.
- `contracts.ts`: request/response types khớp OpenAPI.
- `websocket.ts`: khởi tạo, quản lý vòng đời và cấu hình kết nối WebSocket.

Ví dụ endpoint theo feature:

```text
src/features/auth/api/auth.api.ts
src/features/devices/api/devices.api.ts
src/features/tasks/api/tasks.api.ts
src/features/benchmark-runs/api/benchmark-runs.api.ts
```

Base URL được cấu hình bằng:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Backend phải thêm origin của frontend vào `CORS_ORIGINS`; cấu hình development
mặc định cho phép `http://localhost:5173` và `http://127.0.0.1:5173`.

Sau login, Axios tự thêm `Authorization: Bearer <access_token>`. Khi business
request nhận `401`, interceptor dùng refresh token để rotate session, lưu cặp
token mới và retry request ban đầu đúng một lần. Các request đồng thời dùng chung
một refresh promise để tránh dùng lại refresh token cũ nhiều lần.

## Quy tắc

1. Chỉ đặt cấu hình kết nối và primitive giao tiếp dùng chung tại đây.
2. Hàm gọi endpoint theo nghiệp vụ phải nằm trong thư mục `api` của feature sở hữu.
3. Base URL và thông tin môi trường phải lấy từ biến môi trường của Vite.
4. Không hard-code token, mật khẩu hoặc thông tin nhạy cảm trong mã nguồn.
5. Kết nối WebSocket phải có cơ chế cleanup, xử lý reconnect và tránh đăng ký listener trùng lặp.
6. Chuẩn hóa lỗi tại tầng service để feature không phụ thuộc trực tiếp vào cấu trúc lỗi của thư viện transport.
7. Credential không gửi `created_by` hoặc `last_updated_by`; backend lấy audit user từ JWT.

