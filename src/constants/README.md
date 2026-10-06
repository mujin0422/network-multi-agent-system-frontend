# Application constants

Thư mục `src/constants` chứa các cấu hình và giá trị bất biến có phạm vi toàn ứng dụng, không thuộc riêng một feature.

## Cấu trúc hiện tại

```text
src/constants/
├── components.ts
└── sidebar.ts
```

- `components.ts`: cấu hình dùng chung cho form, status, stat card và language switcher.
- `sidebar.ts`: cấu hình nhóm điều hướng và danh sách workspace của application sidebar.

## Quy tắc

1. Tách constant theo phạm vi, ví dụ `sidebar.ts`; không dồn mọi giá trị vào một file `index.ts` lớn.
2. Dùng `UPPER_SNAKE_CASE` cho constant được export.
3. Constant chỉ thuộc một feature phải đặt trong `src/features/<feature>/constants`.
4. Giá trị chỉ dùng nội bộ một component nên đặt gần component đó thay vì đưa vào đây.
5. Không đặt dữ liệu thay đổi theo runtime hoặc dữ liệu trả về từ API trong thư mục này.
