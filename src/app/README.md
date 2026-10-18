# Application setup

Thư mục `src/app` chứa phần khởi tạo ứng dụng, cấu hình ở cấp toàn cục và các màn hình thuộc vòng đời của ứng dụng thay vì một nghiệp vụ cụ thể.

## Cấu trúc hiện tại

```text
src/app/
├── App.tsx
├── not-found.tsx
└── router.tsx
```

## Trách nhiệm

- `App.tsx`: component gốc, gắn các provider cấp ứng dụng như router, query client hoặc theme provider.
- `router.tsx`: khai báo route, layout và ánh xạ route tới `page.tsx` của từng feature.
- `not-found.tsx`: fallback cho route không tồn tại; đặt ở cấp ứng dụng vì không thuộc module nghiệp vụ nào.

## Quy tắc

1. Chỉ import entry point của feature, không import component nội bộ của feature vào router.
2. Giữ `App.tsx` nhẹ; logic nghiệp vụ phải nằm trong `src/features`.
3. Layout dùng chung cho nhiều route được đặt trong `src/components/layout`.
4. Provider mới chỉ nên thêm tại đây khi có phạm vi toàn ứng dụng.

