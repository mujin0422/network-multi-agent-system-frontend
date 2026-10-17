# Feature-based architecture

Thư mục `src/features` tổ chức mã nguồn theo từng module nghiệp vụ. Mỗi route chính có một feature riêng.

## Cấu trúc chuẩn

```text
src/features/devices/
├── page.tsx
├── components/
│   ├── DevicesTable.tsx
│   ├── DeviceStats.tsx
│   └── DeviceForm.tsx
├── constants/
│   └── devices.constants.ts
├── hooks/
│   └── use-devices-data.ts
├── mocks/
│   └── devices.mock.ts
├── types/
│   └── devices.type.ts
└── utils/
    └── devices.util.ts
```

## Trách nhiệm của từng nhánh

- `page.tsx`: entry point của route. File này nên ngắn, chỉ compose hoặc render component cấp cao nhất của feature.
- `components/`: UI chỉ thuộc feature. Component bảng dùng hậu tố `Table`; thống kê, panel, selector và form phải là component riêng, không dồn toàn bộ JSX vào một file.
- `constants/`: cấu hình và giá trị bất biến của feature như tiêu đề, route, giới hạn hoặc key.
- `mocks/`: mock data riêng của feature trong giai đoạn thiết kế. Mỗi entity/dataset đặt trong một file riêng; không import dữ liệu từ file mock khác.
- `hooks/`: logic, state và side effect của feature. Custom hook phải bắt đầu bằng `use`.
- `types/`: type và interface thuộc phạm vi feature. Mỗi type/interface đặt trong một file riêng; type phụ thuộc import trực tiếp file cần dùng.
- `utils/`: hàm thuần chỉ phục vụ feature, không chứa JSX hoặc state.

## Quy tắc import

1. Dùng alias `@/` khi import ngoài feature.
2. Dùng relative import khi import giữa các nhánh trong cùng feature.
3. Feature không import component nội bộ của feature khác. Nếu nhiều feature cùng dùng, chuyển phần đó vào `src/components/shared`.
4. Router chỉ import `page.tsx` của feature.

```tsx
import DevicesPage from "@/features/devices/page"
```

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
- File trong `mocks`, `types`, `constants`, `utils`: lần lượt dùng hậu tố `.mock.ts`, `.type.ts`, `.constants.ts`, `.util.ts`; không dùng barrel `index.ts`.

## Lưu ý

- Không thêm lại `src/pages`.
- Không đặt mock data trực tiếp trong component.
- Không đặt JSX trong hook.
- Giữ `page.tsx` nhẹ để module dễ kiểm thử và bảo trì.
