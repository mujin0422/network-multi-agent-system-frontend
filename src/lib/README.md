# Shared utilities

Thư mục `src/lib` chứa các utility thuần, nhỏ và được dùng ở nhiều nơi trong ứng dụng.

## Cấu trúc hiện tại

```text
src/lib/
└── utils.ts
```

- `utils.ts`: export hàm `cn` để kết hợp và xử lý xung đột class CSS.

## Quy tắc

1. Utility phải độc lập với React component và logic nghiệp vụ của feature.
2. Hàm chỉ dùng trong một feature nên đặt gần feature đó.
3. Ưu tiên hàm thuần, có input và output rõ ràng, không tạo side effect ẩn.
4. Không biến `utils.ts` thành file tổng hợp quá lớn; tạo file theo chủ đề khi số utility tăng lên.
5. Dùng tên file `kebab-case` và export có tên để dễ tìm kiếm.

