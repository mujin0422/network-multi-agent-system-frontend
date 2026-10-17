# Shared hooks

Thư mục `src/hooks` chứa custom hook có thể dùng lại ở nhiều feature hoặc component dùng chung.

## Cấu trúc hiện tại

```text
src/hooks/
└── use-mobile.ts
```

## Trách nhiệm

- `use-mobile.ts`: theo dõi viewport để xác định giao diện mobile.

## Quy tắc

1. Tên hook phải bắt đầu bằng `use` và file dùng `kebab-case`.
2. Hook dùng chung không phụ thuộc vào type hoặc state riêng của một feature.
3. Hook chỉ phục vụ một feature phải đặt trong `src/features/<feature>/hooks`.
4. Dọn dẹp event listener, timer và subscription trong cleanup của effect.
5. Không trả về JSX từ hook; hook chỉ quản lý state, side effect và logic tái sử dụng.

