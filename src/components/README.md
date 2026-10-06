# Shared components

Thư mục `src/components` chứa các component giao diện dùng chung ngoài phạm vi của một feature cụ thể.

## Cấu trúc

```text
src/components/
├── common/
├── layout/
└── ui/
```

## Trách nhiệm của từng nhánh

- `common/`: component kết hợp được tái sử dụng giữa nhiều feature, ví dụ pagination, toolbar, form sheet và menu thao tác.
- `layout/`: khung giao diện cấp ứng dụng như sidebar và main layout.
- `ui/`: primitive UI cơ bản, phần lớn dựa trên shadcn/ui và Base UI.

## Quy tắc

1. Component chỉ thuộc một nghiệp vụ phải đặt trong `src/features/<feature>/components`.
2. Component trong `common` không được phụ thuộc vào dữ liệu hoặc type riêng của một feature.
3. Hạn chế sửa API của component trong `ui`; ưu tiên truyền `className` hoặc compose tại tầng `common`.
4. Dùng `PascalCase` cho tên component và tên file ngoài thư mục `ui`.
5. Dùng `cn` khi cần kết hợp class có điều kiện.
6. Giữ accessibility khi thêm trigger, label, tooltip hoặc trạng thái disabled.

## Thêm component dùng chung

1. Xác nhận component được dùng bởi ít nhất hai feature hoặc thực sự thuộc layout toàn cục.
2. Chọn đúng nhánh `common`, `layout` hoặc `ui`.
3. Khai báo props rõ ràng và tránh gắn logic nghiệp vụ vào component.
4. Bổ sung bản dịch nếu component hiển thị văn bản cho người dùng.

