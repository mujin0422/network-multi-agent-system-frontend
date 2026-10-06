# Application setup

Thư mục `src/app` chứa phần khởi tạo ứng dụng và cấu hình ở cấp toàn cục. Đây là nơi kết nối router với React, không chứa giao diện hoặc logic nghiệp vụ của từng feature.

## Cấu trúc hiện tại

```text
src/app/
├── App.tsx
└── router.tsx
```

## Trách nhiệm

- `App.tsx`: component gốc, gắn các provider cấp ứng dụng như router, query client hoặc theme provider.
- `router.tsx`: khai báo route, layout và ánh xạ route tới `page.tsx` của từng feature.

## Quy tắc

1. Chỉ import entry point của feature, không import component nội bộ của feature vào router.
2. Giữ `App.tsx` nhẹ; logic nghiệp vụ phải nằm trong `src/features`.
3. Layout dùng chung cho nhiều route được đặt trong `src/components/layout`.
4. Provider mới chỉ nên thêm tại đây khi có phạm vi toàn ứng dụng.

