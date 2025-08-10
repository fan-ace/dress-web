# Disney Line Login Bypass

Script này giúp bạn bypass chức năng login bằng Line khi truy cập URL https://stg-disney.air-closet.com/login

## Cách sử dụng

### Bước 1: Đặt lại file auth.json về trạng thái trống (nếu cần)

```bash
npm run reset-auth
```

Lệnh này sẽ tạo lại file auth.json với trạng thái trống (không có cookies).

### Bước 2: Thực hiện đăng nhập thủ công và lưu trạng thái xác thực

```bash
npm run login-disney
```

Quá trình này:
1. Mở trình duyệt và chuyển đến trang đăng nhập Disney
2. Nhấp vào nút "LINE でログイン"
3. Trình duyệt sẽ tạm dừng để bạn đăng nhập thủ công bằng tài khoản Line
4. Sau khi đăng nhập thành công, script sẽ tự động lưu trạng thái xác thực vào file auth.json

### Bước 3: Sử dụng auth.json cho các test tiếp theo

Sau khi đã có file auth.json với thông tin đăng nhập, tất cả các test sẽ tự động sử dụng thông tin này mà không cần đăng nhập lại.

## Lưu ý

- Cookies sẽ hết hạn sau một thời gian. Khi đó, bạn cần thực hiện lại bước 2.
- File auth.json chứa thông tin xác thực nhạy cảm, đừng commit vào git.
