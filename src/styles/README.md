# Global styles

Thư mục `src/styles` chứa stylesheet có phạm vi toàn ứng dụng.

## Cấu trúc hiện tại

```text
src/styles/
└── globals.css
```

- `globals.css`: import Tailwind và font, khai báo design token, theme sáng/tối cùng các base style toàn cục.

## Quy tắc

1. Chỉ đặt style thực sự có phạm vi toàn ứng dụng trong `globals.css`.
2. Ưu tiên utility class của Tailwind cho style của component.
3. Style chỉ thuộc một component hoặc feature phải đặt gần nơi sử dụng.
4. Design token dùng chung phải được khai báo bằng CSS variable cho cả theme sáng và tối.
5. Không thêm lại CSS mẫu hoặc selector không còn được sử dụng.
