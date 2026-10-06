# Static assets

Thư mục `src/assets` chứa tài nguyên tĩnh được import trực tiếp từ mã nguồn và được Vite xử lý trong quá trình build.

## Nội dung phù hợp

- Hình ảnh dùng trong giao diện như PNG, JPG, WebP hoặc AVIF.
- SVG không thuộc hệ thống icon component.
- Font hoặc tài nguyên tĩnh khác cần được bundle cùng ứng dụng.

## Quy tắc

1. Đặt tên file bằng `kebab-case` và mô tả rõ nội dung.
2. Tối ưu kích thước ảnh trước khi thêm vào repository.
3. Ưu tiên `lucide-react` cho icon giao diện thay vì thêm SVG trùng chức năng.
4. Tài nguyên chỉ thuộc một feature có thể đặt gần feature đó; chỉ đưa vào đây khi được dùng chung.
5. Không đặt component, dữ liệu mock hoặc file cấu hình trong thư mục này.

## Cách sử dụng

```tsx
import heroImage from "@/assets/hero.png"
```

