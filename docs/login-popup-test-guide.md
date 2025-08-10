# Hướng dẫn chạy test Login Popup từ nhiều nguồn

## Cấu trúc thư mục và tái sử dụng test

Cấu trúc test của Login Popup được thiết kế để có thể tái sử dụng các test case trên nhiều màn hình khác nhau:

```
├── fixtures/
│   └── login-popup.fixture.ts      # Fixture tùy chỉnh cho Login Popup
├── pom/
│   ├── components/
│   │   └── LoginPopup.ts           # Class đại diện cho Login Popup
│   ├── navigation/
│   │   └── LoginPopupNavigator.ts  # Class hỗ trợ điều hướng đến Login Popup từ nhiều màn hình
├── tests/
│   ├── shared/
│   │   └── login-popup-functionality.spec.ts  # Test case chung cho mọi nguồn
│   └── sources/
│       ├── fashion-diagnosis-login.spec.ts    # Test đặc thù cho nguồn Fashion Diagnosis
│       └── top-page-login.spec.ts             # Test đặc thù cho nguồn Top Page
```

## Cách chạy test

### 1. Chạy toàn bộ test Login Popup

```bash
npx playwright test tests/shared/login-popup-functionality.spec.ts
```

### 2. Chạy test từ nguồn cụ thể

```bash
# Chạy từ nguồn Fashion Diagnosis
LOGIN_POPUP_SOURCE=fashion-diagnosis npx playwright test tests/shared/login-popup-functionality.spec.ts

# Chạy từ nguồn Top Page
LOGIN_POPUP_SOURCE=top-page npx playwright test tests/shared/login-popup-functionality.spec.ts
```

### 3. Chạy test đặc thù cho từng nguồn

```bash
# Chạy test đặc thù cho Fashion Diagnosis
npx playwright test tests/sources/fashion-diagnosis-login.spec.ts

# Chạy test đặc thù cho Top Page
npx playwright test tests/sources/top-page-login.spec.ts
```

## Thêm nguồn mới

Để thêm một nguồn mới (ví dụ: MyPage), cần làm các bước sau:

1. Cập nhật `LoginPopupSource` trong file `fixtures/login-popup.fixture.ts`
2. Thêm phương thức điều hướng mới trong `LoginPopupNavigator`
3. Tạo file test đặc thù cho nguồn mới trong `tests/sources/`

## Mở rộng test case

Để thêm test case mới cho Login Popup:

1. Thêm phương thức vào `LoginPopup.ts`
2. Thêm test mới vào `login-popup-functionality.spec.ts`

## Lưu ý

- Tất cả các test sẽ được chạy với Fixture tùy chỉnh từ `login-popup.fixture.ts`
- Để debug nhanh, có thể chạy test cụ thể với cờ `--headed`
- Sử dụng tags trong test để lọc khi chạy: `npx playwright test --grep "@authentication"`
