# Hướng dẫn đưa ứng dụng Khảo thí Tin học lên Vercel

Dự án đã được cấu hình sẵn tệp `vercel.json` và Vercel Serverless Function (`/api/index.ts`) để hỗ trợ triển khai trực tiếp lên Vercel chỉ với vài thao tác đơn giản.

---

## 🚀 Cách 1: Triển khai qua GitHub (Khuyên dùng)

### Bước 1: Đẩy mã nguồn lên GitHub
1. Tải toàn bộ mã nguồn dự án về máy (hoặc Export ra GitHub/ZIP từ menu ứng dụng).
2. Tạo một Repository mới trên GitHub (Ví dụ: `app-khao-thi-tin-hoc`).
3. Đẩy mã nguồn lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/<user-cua-ban>/app-khao-thi-tin-hoc.git
   git push -u origin main
   ```

### Bước 2: Kết nối & Import vào Vercel
1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Bấm nút **"Add New..."** -> chọn **"Project"**.
3. Tìm và chọn Repository `app-khao-thi-tin-hoc` vừa tạo -> Bấm **"Import"**.

### Bước 3: Cấu hình Environment Variables (Biến môi trường)
Tại mục **Environment Variables** trong trang thiết lập dự án Vercel, thêm biến sau:
- **`GEMINI_API_KEY`**: Nhập API Key Google Gemini của bạn (ví dụ: `AIzaSy...`).

### Bước 4: Hoàn tất Triển khai
1. Giữ nguyên các thiết lập mặc định (Framework Preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`).
2. Bấm **"Deploy"**.
3. Chờ 1–2 phút để Vercel xây dựng. Sau khi hoàn tất, bạn sẽ nhận được đường dẫn dạng `https://your-app-name.vercel.app`.

---

## ⚡ Cách 2: Triển khai nhanh bằng Vercel CLI (Từ máy tính)

1. Cài đặt Vercel CLI trên máy tính (nếu chưa có):
   ```bash
   npm install -g vercel
   ```
2. Mở thư mục dự án và chạy lệnh:
   ```bash
   vercel
   ```
3. Làm theo hướng dẫn trên màn hình:
   - Đăng nhập tài khoản Vercel.
   - Chọn project name và bấm **Enter** nhận cấu hình mặc định.
4. Triển khai lên bản chính thức (Production):
   ```bash
   vercel --prod
   ```

---

## 🛠️ Cấu hình kỹ thuật sẵn có trong dự án

- **`vercel.json`**:
  - Điều hướng các API Endpoint (`/api/...`) về Serverless Function (`/api/index.ts`).
  - Điều hướng các trang frontend SPA về `index.html`.
- **`/api/index.ts`**: Express Serverless Handler xử lý toàn bộ các API backend (Xác thực tài khoản, Gọi Gemini AI, Đọc tài liệu Docx,...).
- **Lưu trữ tài khoản**: Hỗ trợ tự động fallback lưu dữ liệu danh sách tài khoản/mã kích hoạt vào `/tmp/accounts.json` khi chạy trên môi trường Serverless.
