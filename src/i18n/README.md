# Internationalization

Thư mục `src/i18n` cấu hình đa ngôn ngữ, lưu resource dịch và cung cấp helper định dạng theo locale.

## Cấu trúc

```text
src/i18n/
├── index.ts
├── use-locale.ts
└── locales/
    ├── en.ts
    └── vi.ts
```

## Trách nhiệm

- `index.ts`: khởi tạo i18next, đăng ký ngôn ngữ hỗ trợ và đồng bộ thuộc tính `lang` của document.
- `use-locale.ts`: cung cấp ngôn ngữ hiện tại, locale, hàm đổi ngôn ngữ và định dạng ngày.
- `locales/`: chứa cây bản dịch cho từng ngôn ngữ.

## Quy tắc

1. Mọi chuỗi hiển thị cho người dùng phải lấy qua `t`, trừ dữ liệu do API trả về.
2. Khi thêm key mới, cập nhật đầy đủ cả `en.ts` và `vi.ts` với cùng cấu trúc.
3. Dùng key theo phạm vi, ví dụ `common.saveChanges` hoặc `navigation.dashboard`.
4. Không dùng câu tiếng Anh hoàn chỉnh làm translation key.
5. Dùng `useLocale` cho định dạng phụ thuộc locale thay vì hard-code `en-US` hoặc `vi-VN` trong feature.

## Thêm ngôn ngữ mới

1. Tạo file resource trong `locales/`.
2. Thêm mã ngôn ngữ vào `supportedLanguages`.
3. Đăng ký resource trong cấu hình i18next.
4. Cập nhật type và lựa chọn ngôn ngữ trong giao diện.

