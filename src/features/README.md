# Feature-based architecture

Thư mục `src/features` tổ chức mã nguồn theo từng module nghiệp vụ. Việc lắp ráp
feature thành page thuộc `src/app/routes`, không thuộc feature.

## Cấu trúc chuẩn

```text
src/features/devices/
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

- `components/`: UI chỉ thuộc feature. Component bảng dùng hậu tố `Table`; thống kê, panel, selector và form phải là component riêng, không dồn toàn bộ JSX vào một file.
- `constants/`: cấu hình và giá trị bất biến của feature như tiêu đề, route, giới hạn hoặc key.
- `mocks/`: mock data riêng của feature trong giai đoạn thiết kế. Mỗi entity/dataset đặt trong một file riêng; không import dữ liệu từ file mock khác.
- `hooks/`: logic, state và side effect của feature. Custom hook phải bắt đầu bằng `use`.
- `types/`: type và interface thuộc phạm vi feature. Mỗi type/interface đặt trong một file riêng; type phụ thuộc import trực tiếp file cần dùng.
- `utils/`: hàm thuần chỉ phục vụ feature, không chứa JSX hoặc state.

## Quy tắc import

1. Dùng alias `@/` khi import ngoài feature.
2. Dùng relative import khi import giữa các nhánh trong cùng feature.
3. Feature không import page hoặc layout từ `src/app`.
4. Route page trong `src/app/routes/app` chịu trách nhiệm lắp ráp feature.

```tsx
import { DevicesTable } from "@/features/devices/components/DevicesTable"
```

## Tạo feature mới

1. Tạo folder bằng tên kebab-case, ví dụ `device-groups`.
2. Tạo các nhánh cần thiết theo cấu trúc chuẩn phía trên.
3. Định nghĩa type trước, sau đó mock data, constants và hook.
4. Xây dựng UI trong `components/`.
5. Tạo page lắp ráp trong `src/app/routes/app` hoặc `src/app/routes/auth`.
6. Khai báo route trong `src/app/routes/index.tsx`.
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

- Không thêm lại `src/pages` hoặc `features/*/page.tsx`.
- Không đặt mock data trực tiếp trong component.
- Không đặt JSX trong hook.
- Giữ route page tập trung vào composition; logic nghiệp vụ vẫn nằm trong hook của feature.
