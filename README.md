# Network Multi-Agent System — Frontend

Giao diện quản trị cho hệ thống đa tác tử mạng, được xây dựng bằng React, TypeScript và Vite. Ứng dụng hiện cung cấp các màn hình tổng quan, trò chuyện với agent, quản lý tác vụ, mạng, thiết bị, thông tin xác thực, nhật ký kiểm toán, người dùng và phân quyền.

> Trạng thái hiện tại: phần lớn màn hình đang sử dụng dữ liệu mẫu trong từng feature; `src/service/api.ts` và `src/service/websocket.ts` là vị trí dành cho lớp tích hợp backend.

## Công nghệ chính

- React 19 và React Router
- TypeScript
- Vite
- Tailwind CSS 4
- shadcn/ui và Base UI
- TanStack Query, TanStack Table
- Zustand
- Axios và Socket.IO Client
- Recharts
- React Hook Form và Zod

## Yêu cầu môi trường

- Node.js `20.19+` hoặc `22.12+` (yêu cầu của Vite 8)
- npm (dự án có commit `package-lock.json`)

Có thể kiểm tra phiên bản đang dùng bằng:

```bash
node --version
npm --version
```

## Cài đặt và chạy dự án

```bash
# 1. Cài đúng phiên bản dependency từ package-lock.json
npm ci

# 2. Khởi động máy chủ phát triển
npm run dev
```

Vite sẽ in địa chỉ truy cập trên terminal, mặc định thường là `http://localhost:5173`.

## Các lệnh npm

| Lệnh              | Mục đích                                                 |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Chạy môi trường phát triển với hot reload.               |
| `npm run build`   | Kiểm tra TypeScript và tạo bản production trong `dist/`. |
| `npm run lint`    | Kiểm tra mã nguồn bằng ESLint.                           |
| `npm run preview` | Chạy thử bản build production trên máy local.            |

Quy trình kiểm tra trước khi tạo commit:

```bash
npm run lint
npm run build
```

## Các route chính

| Đường dẫn          | Chức năng                  |
| ------------------ | -------------------------- |
| `/`                | Dashboard tổng quan        |
| `/chat`            | Trò chuyện với agent       |
| `/tasks`           | Quản lý tác vụ             |
| `/network`         | Theo dõi mạng              |
| `/devices`         | Quản lý thiết bị           |
| `/credentials`     | Quản lý thông tin xác thực |
| `/audit-logs`      | Nhật ký kiểm toán          |
| `/users`           | Quản lý người dùng         |
| `/access-control`  | Phân quyền truy cập        |
| `/settings/system` | Cài đặt hệ thống           |
| `/profile`         | Hồ sơ người dùng           |

Các đường dẫn không tồn tại sẽ hiển thị trang 404.

## Cấu trúc thư mục

```text
frontend/
├── public/                 # Tài nguyên tĩnh được phục vụ nguyên trạng
├── src/
│   ├── app/                # App gốc và cấu hình router
│   ├── assets/             # Ảnh và tài nguyên được bundle
│   ├── components/
│   │   ├── layout/         # Layout dùng chung
│   │   └── ui/             # Các UI primitive dùng lại
│   ├── features/           # Module nghiệp vụ theo từng màn hình
│   ├── hooks/              # Hook dùng chung toàn ứng dụng
│   ├── lib/                # Hàm tiện ích
│   └── service/            # Lớp API và WebSocket
├── components.json         # Cấu hình shadcn/ui
├── eslint.config.js        # Cấu hình ESLint
├── vite.config.ts          # Cấu hình Vite và alias @/
└── tsconfig*.json          # Cấu hình TypeScript
```

Mã nguồn được tổ chức theo feature. Quy ước chi tiết và hướng dẫn tạo feature mới nằm tại [`src/features/README.md`](src/features/README.md).

## Quy ước phát triển

- Dùng alias `@/` khi import từ `src`, ví dụ `@/components/ui/button`.
- Mỗi route nghiệp vụ đặt trong một thư mục riêng dưới `src/features`.
- `page.tsx` chỉ đóng vai trò entry point; UI, state, type và dữ liệu được tách vào đúng thư mục con.
- Component dùng chung toàn ứng dụng đặt trong `src/components`.
- Không commit secret hoặc tệp môi trường local. Nếu bổ sung biến môi trường, dùng tiền tố `VITE_` và tạo `.env.example` chỉ chứa giá trị mẫu.

## Build production

```bash
npm run build
npm run preview
```

Kết quả build nằm trong thư mục `dist/`. Khi triển khai, máy chủ cần fallback các URL của ứng dụng về `index.html` để React Router xử lý route phía client.

## Tích hợp backend

Hai tệp sau đã được dành sẵn cho lớp giao tiếp với backend:

- `src/service/api.ts`: cấu hình HTTP client và các lời gọi REST API.
- `src/service/websocket.ts`: cấu hình kết nối thời gian thực qua Socket.IO.

Khi thêm cấu hình môi trường, nên khai báo ví dụ trong `.env.example`:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000
```

Không đưa token, mật khẩu hoặc URL nội bộ nhạy cảm vào repository.
