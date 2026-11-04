/**
 * HOÀNG QUỐC VIỆT SHOP - GOOGLE APPS SCRIPT GỬI EMAIL ĐƠN HÀNG TỰ ĐỘNG
 * Gửi trực tiếp đến: lamhoangquan12c1@gmail.com
 * (100% Máy chủ Google, Vĩnh viễn không lỗi, Không bao giờ bị Action Required)
 */

var TARGET_EMAIL = "lamhoangquan12c1@gmail.com";
var SHOP_NAME = "Hoàng Quốc Việt Shop";
var HOTLINE = "0971.250.891";
var ZALO = "0356.280.381";

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    service: "Hoàng Quốc Việt Shop - Email Webhook",
    recipient: TARGET_EMAIL
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { 
        data = JSON.parse(e.postData.contents); 
      } catch (err) { 
        data = e.parameter || {}; 
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var now = new Date();
    var timeStr = Utilities.formatDate(now, "GMT+7", "dd/MM/yyyy HH:mm:ss");
    var orderId = data.id || ("ORD-" + now.getTime().toString().slice(-6));
    var customerName = (data.customerName || "Khách mua lẻ").trim();
    var phone = (data.phone || "").trim();
    var address = (data.address || "").trim();
    var city = (data.city || "Toàn quốc").trim();
    var notes = (data.notes || "Không có").trim();

    var productName = data.productName || "Tấm lót giày 4D# Chính Hãng";
    var variantTitle = data.variantTitle || "Bản Tiêu Chuẩn 4D";
    var size = data.size || "39";
    var color = data.color || "Đen";
    var quantity = Number(data.quantity || 1);
    var unitPrice = Number(data.unitPrice || 35000);
    var totalAmount = Number(data.totalAmount || (unitPrice * quantity));
    var shippingFeeText = data.shippingFeeText || "LIÊN HỆ";

    function formatVND(num) {
      return Number(num).toLocaleString("vi-VN") + "đ";
    }

    // 1. Tự động ghi vào Google Sheet (nếu mở script từ bên trong Google Sheet)
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      if (ss) {
        var ws = ss.getActiveSheet();
        if (ws.getLastRow() === 0) {
          ws.appendRow([
            "Mã Đơn", "Thời Gian", "Tên Khách Hàng", "Số Điện Thoại",
            "Địa Chỉ", "Tỉnh Thành", "Sản Phẩm", "Phân Loại",
            "Size", "Màu Sắc", "Số Lượng", "Đơn Giá", "Tổng Tiền",
            "Phí Vận Chuyển", "Ghi Chú"
          ]);
        }
        ws.appendRow([
          orderId,
          timeStr,
          customerName,
          "'" + phone,
          address,
          city,
          productName,
          variantTitle,
          size,
          color,
          quantity,
          unitPrice,
          totalAmount,
          shippingFeeText,
          notes
        ]);
      }
    } catch (sheetErr) {
      // Bỏ qua nếu là Apps Script độc lập không gắn vào Sheet
    }

    // 2. Soạn email thông báo đơn hàng đẹp mắt
    var subject = "🔥 [ĐƠN HÀNG MỚI] #" + orderId + " - " + customerName + " (" + phone + ") - " + formatVND(totalAmount);

    var htmlBody = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:20px 10px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;">
  <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);border:1px solid #e2e8f0;">
    <div style="background:linear-gradient(135deg,#e11d48 0%,#be123c 100%);padding:28px 24px;text-align:center;color:#fff;">
      <div style="display:inline-block;background:rgba(255,255,255,0.2);padding:4px 14px;border-radius:20px;font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:8px;">
        ✨ Thông Báo Đơn Hàng Mới Từ Website
      </div>
      <h1 style="margin:0;font-size:22px;font-weight:900;">${SHOP_NAME}</h1>
      <p style="margin:6px 0 0;font-size:12px;opacity:0.9;">
        Mã đơn hàng: <strong style="background:#fff;color:#e11d48;padding:2px 8px;border-radius:6px;font-family:monospace;">${orderId}</strong>
      </p>
    </div>
    <div style="padding:22px 18px;">
      <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:12px 16px;margin-bottom:18px;color:#065f46;font-size:13px;font-weight:700;">
        📦 Khách hàng vừa đặt đơn mới! Vui lòng liên hệ xác nhận đơn hàng sớm nhất.
      </div>
      
      <!-- Thông tin khách hàng -->
      <div style="background:#f8fafc;border-radius:14px;padding:16px;border:1px solid #e2e8f0;margin-bottom:18px;">
        <h3 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;color:#64748b;font-weight:800;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">
          👤 Thông Tin Người Nhận
        </h3>
        <table style="width:100%;font-size:13px;border-collapse:collapse;">
          <tr><td style="padding:5px 0;color:#64748b;width:120px;">Khách hàng:</td><td style="padding:5px 0;font-weight:700;color:#0f172a;">${customerName}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Số điện thoại:</td><td style="padding:5px 0;"><a href="tel:${phone}" style="color:#e11d48;font-weight:900;font-size:15px;text-decoration:none;background:#ffe4e6;padding:3px 10px;border-radius:8px;display:inline-block;">📞 ${phone} (Bấm gọi ngay)</a></td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Địa chỉ giao:</td><td style="padding:5px 0;font-weight:600;">${address}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Tỉnh thành:</td><td style="padding:5px 0;font-weight:600;">${city}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Ghi chú shipper:</td><td style="padding:5px 0;color:#b45309;font-weight:600;font-style:italic;">${notes}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Thời gian đặt:</td><td style="padding:5px 0;color:#64748b;">${timeStr}</td></tr>
        </table>
      </div>

      <!-- Chi tiết đơn hàng -->
      <div style="background:#fff;border-radius:14px;padding:16px;border:1px solid #e2e8f0;margin-bottom:20px;">
        <h3 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;color:#64748b;font-weight:800;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">
          🛒 Chi Tiết Đơn Hàng
        </h3>
        <table style="width:100%;font-size:13px;border-collapse:collapse;">
          <tr style="background:#f1f5f9;color:#475569;"><th style="padding:8px;text-align:left;">Sản Phẩm</th><th style="padding:8px;text-align:center;">Size/Màu</th><th style="padding:8px;text-align:center;">SL</th><th style="padding:8px;text-align:right;">Thành Tiền</th></tr>
          <tr>
            <td style="padding:10px 8px;border-bottom:1px solid #f1f5f9;"><strong style="color:#0f172a;">${productName}</strong><div style="color:#e11d48;font-size:11px;font-weight:600;">${variantTitle}</div></td>
            <td style="padding:10px 8px;border-bottom:1px solid #f1f5f9;text-align:center;"><span style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-weight:600;">${size} • ${color}</span></td>
            <td style="padding:10px 8px;border-bottom:1px solid #f1f5f9;text-align:center;font-weight:700;">x${quantity}</td>
            <td style="padding:10px 8px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:700;">${formatVND(unitPrice * quantity)}</td>
          </tr>
        </table>
        <div style="margin-top:12px;padding-top:8px;border-top:1px dashed #e2e8f0;">
          <table style="width:100%;font-size:13px;border-collapse:collapse;">
            <tr><td style="padding:4px 0;color:#64748b;">Tiền hàng (${quantity} đôi):</td><td style="padding:4px 0;text-align:right;font-weight:600;">${formatVND(unitPrice * quantity)}</td></tr>
            <tr><td style="padding:4px 0;color:#64748b;">Phí vận chuyển:</td><td style="padding:4px 0;text-align:right;font-weight:800;color:#e11d48;">${shippingFeeText}</td></tr>
            <tr style="border-top:1px solid #e2e8f0;"><td style="padding:10px 0 2px;font-size:14px;font-weight:800;">TỔNG THANH TOÁN (COD):</td><td style="padding:10px 0 2px;text-align:right;font-size:18px;font-weight:900;color:#e11d48;">${formatVND(totalAmount)}</td></tr>
          </table>
        </div>
      </div>

      <!-- Nút gọi ngay -->
      <div style="text-align:center;margin:18px 0 5px;">
        <a href="tel:${phone}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:800;font-size:14px;">📞 Bấm Gọi Cho Khách Hàng Ngay</a>
      </div>
    </div>
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:14px;text-align:center;font-size:11px;color:#64748b;">
      ${SHOP_NAME} • Hotline: ${HOTLINE} • Zalo: ${ZALO}
    </div>
  </div>
</body>
</html>`;

    // 3. Gửi email trực tiếp từ máy chủ Google đến lamhoangquan12c1@gmail.com
    MailApp.sendEmail({
      to: TARGET_EMAIL,
      subject: subject,
      htmlBody: htmlBody
    });

    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      message: "Email sent successfully" 
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: err.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
