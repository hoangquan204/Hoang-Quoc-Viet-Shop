# HƯỚNG DẪN KÍCH HOẠT GOOGLE APPS SCRIPT ĐẶT HÀNG TỰ ĐỘNG

Hệ thống được thiết kế để:
1. **Tự động thêm đơn hàng mới** vào file Google Sheet của bạn:
   👉 [https://docs.google.com/spreadsheets/d/1besF2yiEShlWJWFEhdJnntWWex7llAXDeTC0-QO4fHk/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1besF2yiEShlWJWFEhdJnntWWex7llAXDeTC0-QO4fHk/edit?usp=sharing)
2. **Tự động gửi email thông báo chi tiết** (mẫu HTML cực đẹp, có nút gọi cho khách ngay) tới:
   📧 **lamhoangquan12c1@gmail.com**

---

## 🚀 CÁC BƯỚC THỰC HIỆN (CHỈ MẤT 1 PHÚT)

### Bước 1: Mở Apps Script trong Google Sheet
1. Mở trang Google Sheet của bạn: [Link Google Sheet](https://docs.google.com/spreadsheets/d/1besF2yiEShlWJWFEhdJnntWWex7llAXDeTC0-QO4fHk/edit?usp=sharing)
2. Trên thanh menu trên cùng, bấm chọn **Tiện ích mở rộng** (hoặc *Extensions*) ➔ Chọn **Apps Script**.

### Bước 2: Dán mã nguồn
1. Xóa toàn bộ đoạn code có sẵn trong khung soạn thảo.
2. Mở file [Code.gs](./Code.gs), sao chép toàn bộ nội dung và dán vào.
3. Bấm biểu tượng **💾 Lưu dự án** (hoặc nhấn phím `Ctrl + S`).

### Bước 3: Triển khai thành Web App (Deploy)
1. Ở góc trên cùng bên phải, bấm nút **Triển khai** (nút màu xanh *Deploy*) ➔ Chọn **Tùy chọn triển khai mới** (*New deployment*).
2. Tại mục bánh răng ⚙️ "Chọn loại", chọn **Ứng dụng web** (*Web app*).
3. Điền thông tin:
   * **Mô tả (*Description*)**: Đặt hàng Hoàng Quốc Việt Shop
   * **Thực thi dưới dạng (*Execute as*)**: **Tôi (*Me - lamhoangquan12c1@gmail.com*)**
   * **Ai có quyền truy cập (*Who has access*)**: **Bất kỳ ai (*Anyone*)** *(Bắt buộc chọn Bất kỳ ai để website có thể gửi thông tin đơn hàng lên Sheet)*
4. Bấm nút **Triển khai** (*Deploy*).

### Bước 4: Cấp quyền (Authorization - chỉ cần làm 1 lần đầu)
1. Google sẽ hiện hộp thoại yêu cầu cấp quyền ➔ Chọn **Ủy quyền truy cập** (*Authorize access*).
2. Chọn tài khoản Google của bạn (`lamhoangquan12c1@gmail.com`).
3. Nếu hiện cảnh báo *"Google chưa xác minh ứng dụng này"*, bấm vào dòng chữ nhỏ **Nâng cao** (*Advanced*) ở góc dưới ➔ Chọn tiếp **Đi tới ... (không an toàn)** (*Go to ... unsafe*).
4. Bấm **Cho phép** (*Allow*).

### Bước 5: Lấy URL và hoàn tất
1. Copy đường link **URL ứng dụng web** (*Web App URL*). Đường link có dạng:
   `https://script.google.com/macros/s/AKfycb.../exec`
2. Dán link này vào mục **Cài đặt Website** trong trang Quản trị (Admin) của website hoặc gửi lại cho tôi.
   Website sẽ ngay lập tức kết nối và đẩy mọi đơn hàng vào Google Sheet + gửi email tự động!
