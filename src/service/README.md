# External services

Thư mục `src/service` là tầng kết nối ứng dụng với các dịch vụ bên ngoài như REST API và WebSocket.

## Cấu trúc hiện tại

```text
src/service/
├── api.ts
└── websocket.ts
```

## Trách nhiệm

- `api.ts`: cấu hình HTTP client, base URL, header, interceptor và xử lý lỗi dùng chung.
- `websocket.ts`: khởi tạo, quản lý vòng đời và cấu hình kết nối WebSocket.

Hai file hiện là khung để triển khai khi backend được tích hợp.

## Quy tắc

1. Chỉ đặt cấu hình kết nối và primitive giao tiếp dùng chung tại đây.
2. Hàm gọi endpoint theo nghiệp vụ nên được tổ chức theo feature hoặc module service riêng, không dồn toàn bộ vào `api.ts`.
3. Base URL và thông tin môi trường phải lấy từ biến môi trường của Vite.
4. Không hard-code token, mật khẩu hoặc thông tin nhạy cảm trong mã nguồn.
5. Kết nối WebSocket phải có cơ chế cleanup, xử lý reconnect và tránh đăng ký listener trùng lặp.
6. Chuẩn hóa lỗi tại tầng service để feature không phụ thuộc trực tiếp vào cấu trúc lỗi của thư viện transport.

