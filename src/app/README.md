# Application layer

`src/app` là composition root của frontend. Thư mục này sở hữu layout, route,
route guard và global provider; không chứa logic nghiệp vụ của từng feature.

## Cấu trúc hiện tại

```text
src/app/
├── layouts/
│   ├── AuthLayout.tsx
│   └── MainLayout.tsx
├── routes/
│   ├── app/
│   ├── auth/
│   ├── NotFoundPage.tsx
│   └── index.tsx
├── guards/
│   ├── ProtectedRoute.tsx
│   └── RoleGuard.tsx
├── App.tsx
└── provider.tsx
```

## Trách nhiệm

- `routes/app`: page yêu cầu xác thực và nơi lắp ráp các feature.
- `routes/auth`: page công khai thuộc luồng xác thực.
- `layouts`: bộ khung dùng chung cho từng nhánh route.
- `guards`: kiểm tra phiên đăng nhập và role trước khi vào route.
- `provider.tsx`: điểm tập trung các global provider.

## Quy tắc

1. Page chỉ tồn tại trong `src/app/routes`; không tạo `page.tsx` trong feature.
2. Page được phép lắp ráp component và hook từ một hoặc nhiều feature.
3. Layout dùng cho route tree đặt trong `src/app/layouts`.
4. Feature không import ngược page, layout hoặc router từ `src/app`.

