# Hướng dẫn sử dụng LoginPopupAssertions

## Giới thiệu

`LoginPopupAssertions` là một class giúp tái sử dụng các assertion cho LoginPopup trên nhiều màn hình khác nhau. Class này được thiết kế để:

1. Đảm bảo tính nhất quán trong việc kiểm tra chức năng login
2. Giảm thiểu code trùng lặp và dễ bảo trì
3. Cho phép các tester không cần nhớ chi tiết các bước xác thực

## Cấu trúc

```
├── pom/
│   ├── components/
│   │   └── LoginPopup.ts             # Class đại diện cho Login Popup
│   ├── assertions/
│   │   └── LoginPopupAssertions.ts   # Class chứa các assertions
│   └── navigation/
│       └── LoginPopupNavigator.ts    # Class hỗ trợ điều hướng
├── tests/
│   ├── shared/
│   │   └── login-popup-functionality.spec.ts  # Test case chung
│   └── sources/
│       ├── fashion-diagnosis-login.spec.ts    # Nguồn cụ thể
│       ├── top-page-login.spec.ts             # Nguồn cụ thể 
│       └── mypage-login.spec.ts               # Nguồn mới
```

## Cách sử dụng cho màn hình mới

Khi dự án phát triển thêm màn hình mới có chứa LoginPopup, bạn có thể sử dụng `LoginPopupAssertions` để dễ dàng kiểm tra các chức năng login:

### Bước 1: Tạo file test mới

Tạo file test mới trong thư mục `tests/sources/` (ví dụ: `new-screen-login.spec.ts`).

### Bước 2: Định nghĩa hàm mở LoginPopup từ màn hình mới

```typescript
async function openLoginPopupFromNewScreen(page: Page): Promise<LoginPopup> {
    // Triển khai code để điều hướng từ màn hình mới đến LoginPopup
    // Ví dụ:
    const newScreen = new NewScreen(page);
    await newScreen.goto();
    await newScreen.clickLoginButton();
    return new LoginPopup(page);
}
```

### Bước 3: Tạo các test case sử dụng LoginPopupAssertions

```typescript
test.describe('Login Popup from New Screen', () => {
    test('should validate all login functionality', async ({ page }) => {
        const loginPopup = await openLoginPopupFromNewScreen(page);
        const assertions = new LoginPopupAssertions(loginPopup);
        
        // Chạy tất cả các assertions cơ bản
        await assertions.runBasicAssertions();
    });
    
    // Hoặc chạy từng assertion riêng lẻ
    test('should validate invalid email formats', async ({ page }) => {
        const loginPopup = await openLoginPopupFromNewScreen(page);
        const assertions = new LoginPopupAssertions(loginPopup);
        await assertions.verifyInvalidEmailFormats();
    });
});
```

### Bước 4: Thêm test case đặc thù cho màn hình mới

```typescript
test('should have new screen specific behavior', async ({ page }) => {
    const loginPopup = await openLoginPopupFromNewScreen(page);
    // Kiểm tra các hành vi đặc thù cho màn hình mới
});
```

## Các assertion có sẵn

`LoginPopupAssertions` cung cấp các phương thức assertion sau:

- `verifyPopupIsDisplayed()`: Xác minh popup hiển thị đúng
- `verifyInvalidEmailFormats()`: Kiểm tra xác thực email không hợp lệ
- `verifyNonExistentEmail()`: Kiểm tra đăng nhập với email không tồn tại
- `verifyInvalidUserCredentials()`: Kiểm tra đăng nhập với thông tin không hợp lệ
- `verifyForgotPasswordLink()`: Kiểm tra link quên mật khẩu
- `verifyRegisterLink()`: Kiểm tra link đăng ký
- `verifyTroubleLink()`: Kiểm tra link trợ giúp đăng nhập
- `verifySubmitButtonDisabled()`: Kiểm tra trạng thái nút submit
- `runBasicAssertions()`: Chạy tất cả các assertion cơ bản
- `runNavigationAssertions()`: Chạy tất cả các assertion điều hướng

## Thêm assertion mới

Nếu cần thêm assertion mới:

1. Mở file `pom/assertions/LoginPopupAssertions.ts`
2. Thêm phương thức mới theo mẫu hiện có
3. Cập nhật `runBasicAssertions()` nếu cần

## Lưu ý

- Các phương thức navigation như `verifyForgotPasswordLink()` sẽ điều hướng khỏi trang hiện tại, do đó nên chạy trong các test case riêng biệt.
- Khi cần mở rộng `LoginPopup` với chức năng mới, nhớ thêm assertion tương ứng vào `LoginPopupAssertions`.
