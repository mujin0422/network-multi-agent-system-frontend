# Feature-based architecture

Thư mục `src/features` tổ chức mã nguồn theo từng module nghiệp vụ. Mỗi route chính có một feature riêng.

## Cấu trúc chuẩn

```text
src/features/devices/
├── page.tsx
├── components/
│   └── DevicesContent.tsx
├── constants/
│   └── index.ts
├── data/
│   └── index.ts
├── hooks/
│   └── use-devices-data.ts
└── types/
    └── index.ts
```

## Trách nhiệm của từng nhánh

- `page.tsx`: entry point của route. File này nên ngắn, chỉ compose hoặc render component cấp cao nhất của feature.
- `components/`: UI chỉ thuộc feature. Tách component khi một khối có trách nhiệm riêng, được lặp lại, hoặc làm `page.tsx` khó đọc.
- `constants/`: cấu hình và giá trị bất biến của feature như tiêu đề, route, giới hạn hoặc key.
- `data/`: mock data dùng trong giai đoạn thiết kế. Không đặt lời gọi API hoặc state thay đổi tại đây.
- `hooks/`: logic, state và side effect của feature. Custom hook phải bắt đầu bằng `use`.
- `types/`: type và interface thuộc phạm vi feature.

## Quy tắc import

1. Dùng alias `@/` khi import ngoài feature.
2. Dùng relative import khi import giữa các nhánh trong cùng feature.
3. Feature không import component nội bộ của feature khác. Nếu nhiều feature cùng dùng, chuyển phần đó vào `_shared` hoặc `src/components`.
4. Router chỉ import `page.tsx` của feature.

```tsx
import DevicesPage from "@/features/devices/page"
```

## Shared feature

`_shared/resource` chứa giao diện và logic danh sách dùng chung cho các module quản trị. Mỗi module vẫn sở hữu config, mock data, hook và component kết nối riêng; `_shared` chỉ loại bỏ phần UI lặp lại.

Không đặt logic nghiệp vụ riêng của một module vào `_shared`.

## Tạo feature mới

1. Tạo folder bằng tên kebab-case, ví dụ `device-groups`.
2. Tạo đủ sáu phần theo cấu trúc chuẩn phía trên.
3. Định nghĩa type trước, sau đó mock data, constants và hook.
4. Xây dựng UI trong `components/`.
5. Export page mặc định từ `page.tsx`.
6. Khai báo route trong `src/app/router.tsx`.
7. Chạy kiểm tra:

```bash
npm run build
npm run lint
```

## Quy ước đặt tên

- Folder feature: `kebab-case`.
- Component và type: `PascalCase`.
- Hook: `useCamelCase`.
- Constant: `UPPER_SNAKE_CASE`.
- Mock data: tên mô tả rõ nội dung, ví dụ `MOCK_DEVICES`.

## Lưu ý

- Không thêm lại `src/pages`.
- Không đặt mock data trực tiếp trong component.
- Không đặt JSX trong hook.
- Giữ `page.tsx` nhẹ để module dễ kiểm thử và bảo trì.
