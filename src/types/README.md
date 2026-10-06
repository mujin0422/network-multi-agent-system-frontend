# Application types

Thư mục `src/types` chứa type và interface dùng chung ở cấp ứng dụng, không thuộc riêng một feature.

## Cấu trúc hiện tại

```text
src/types/
├── components.ts
└── sidebar.ts
```

- `components.ts`: props type và type dùng chung của các component cấp ứng dụng.
- `sidebar.ts`: định nghĩa cấu trúc item điều hướng, section và workspace của application sidebar.

## Quy tắc

1. Tách type theo phạm vi, ví dụ `sidebar.ts`; không dồn tất cả vào một file tổng hợp lớn.
2. Dùng `PascalCase` cho type và interface.
3. Type chỉ thuộc một feature phải đặt trong `src/features/<feature>/types`.
4. Type chỉ dùng nội bộ một component hoặc hook nên đặt gần nơi sử dụng.
5. Dùng `import type` khi import chỉ phục vụ TypeScript.
