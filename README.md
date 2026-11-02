# Network Multi-Agent System — Frontend

Giao diện quản trị cho hệ thống đa tác tử mạng, được xây dựng bằng React, TypeScript và Vite. Ứng dụng cung cấp dashboard, trò chuyện với AI agent, quản lý tác vụ, thiết bị, danh mục thiết bị, thông tin xác thực, nhật ký kiểm toán, benchmark, người dùng và phân quyền.

> **Trạng thái hiện tại:** frontend đã tích hợp REST API của backend FastAPI cho các module nghiệp vụ chính. Các màn hình dùng dữ liệu trả về từ backend thông qua các service theo domain trong `src/service/`. Một số tệp mock còn nằm trong mã nguồn, nhưng không phản ánh nguồn dữ liệu chính của các màn hình đã kết nối API.

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
| `/login`           | Đăng nhập                  |
| `/`                | Dashboard tổng quan        |
| `/chat`            | Trò chuyện với agent       |
| `/tasks`           | Quản lý tác vụ             |
| `/device-catalog`  | Danh mục thiết bị          |
| `/devices`         | Quản lý thiết bị           |
| `/credentials`     | Quản lý thông tin xác thực |
| `/audit-logs`      | Nhật ký kiểm toán          |
| `/benchmarks`      | Quản lý benchmark          |
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
│   │   ├── layout/         # Layout ứng dụng
│   │   ├── shared/         # Component nghiệp vụ tái sử dụng
│   │   └── ui/             # UI primitives
│   ├── features/           # Các module/màn hình nghiệp vụ
│   ├── hooks/              # Hook dùng chung
│   ├── i18n/               # Bản dịch tiếng Việt/tiếng Anh
│   ├── lib/                # Hàm tiện ích
│   ├── service/            # Axios client, contract, REST API theo domain
│   ├── styles/             # CSS toàn cục
│   └── types/              # Types dùng chung
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

Frontend **đã gọi REST API thực tế** của [Network Multi-Agent System Backend](https://github.com/mujin0422/network-multi-agent-system-backend), không còn chỉ là giao diện mock. Các API nghiệp vụ dùng prefix `/api/v1`.

### Cấu hình môi trường

Tạo file `.env` từ mẫu đã có trong repository:

```bash
cp .env.example .env
```

Giá trị mặc định trong `.env.example`:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

`src/service/api.ts` sử dụng giá trị này làm Axios `baseURL` (fallback về `http://localhost:8000/api/v1` khi không thiết lập). Backend cần chạy và cho phép origin của Vite trong `CORS_ORIGINS`, ví dụ `http://localhost:5173`.

### Các module đã kết nối API

| Module | Client/service | Chức năng chính |
| --- | --- | --- |
| Authentication | `auth.api.ts` | Đăng nhập, lấy người dùng hiện tại, refresh và logout |
| Conversation / Chatbot | `conversation.api.ts` | Danh sách hội thoại, gửi tin nhắn, tạo hội thoại từ tin nhắn đầu tiên, đổi tiêu đề |
| Dashboard | `inventory.api.ts`, `execution.api.ts` | Tổng hợp dữ liệu thiết bị, tác vụ và hoạt động từ API |
| Tasks / Execution | `execution.api.ts` | Danh sách/chi tiết task, operation, activity events và phê duyệt |
| Devices / Device Catalog | `inventory.api.ts` | Thiết bị, thương hiệu, danh mục và thông tin xác thực thiết bị |
| Users / Roles / Access Control | `identity.api.ts` | Quản lý người dùng, vai trò và quyền |
| Audit Logs | `audit.api.ts` | Lấy nhật ký kiểm toán và hỗ trợ xuất CSV trên giao diện |
| Benchmarks | `benchmark.api.ts` | Quản lý scenario, benchmark run và cleanup |
| Profile | `auth.api.ts`, `identity.api.ts` | Hiển thị và cập nhật thông tin tài khoản |

Các màn hình gọi API thông qua hook trong từng `src/features/<feature>/hooks/`. Phần `Settings` quản lý các tùy chọn giao diện/ngôn ngữ trên trình duyệt; không phải module API nghiệp vụ.

### Cơ chế xác thực và xử lý dữ liệu

- `src/service/api.ts`: Axios client dùng chung, bearer token, chuẩn hóa lỗi và interceptor xử lý HTTP `401`.
- `src/service/token-storage.ts`: lưu cặp access/refresh token trong `localStorage` và đồng bộ thay đổi phiên đăng nhập.
- Khi access token hết hạn, interceptor thử refresh token và gửi lại request ban đầu một lần; các request đồng thời chia sẻ một refresh promise.
- `src/service/contracts.ts`: các kiểu request/response dùng khi giao tiếp với backend.
- `src/service/*.api.ts`: nhóm hàm gọi endpoint theo domain; UI không cần gọi Axios trực tiếp.
- Chat hiện nhận trạng thái workflow bằng **HTTP polling** (`use-chat-messages.ts`). `src/service/websocket.ts` hiện chưa triển khai; không nên hiểu ứng dụng đang sử dụng Socket.IO để nhận sự kiện chat.

### Chạy cùng backend

1. Cài đặt và khởi chạy backend theo [README của backend](https://github.com/mujin0422/network-multi-agent-system-backend#readme), kiểm tra `http://localhost:8000/health` và Swagger tại `http://localhost:8000/docs`.
2. Thiết lập `.env` cho frontend như trên.
3. Chạy `npm ci` rồi `npm run dev` và đăng nhập bằng tài khoản hợp lệ của backend.

> Không commit `.env`, access token, mật khẩu, private key hoặc bất kỳ secret nào lên repository. Các tệp mock còn tồn tại không thay thế dữ liệu API thực tế.
