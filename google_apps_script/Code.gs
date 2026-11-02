/**
 * ==============================================================================
 * HOÀNG QUỐC VIỆT SHOP - GOOGLE APPS SCRIPT WEBHOOK ĐẶT HÀNG TỰ ĐỘNG
 * ==============================================================================
 * Chức năng:
 * 1. Tự động ghi thông tin đơn hàng mới vào Google Sheet:
 *    https://docs.google.com/spreadsheets/d/1besF2yiEShlWJWFEhdJnntWWex7llAXDeTC0-QO4fHk/edit
 * 2. Tự động gửi email thông báo chi tiết đơn hàng (HTML đẹp mắt, chuyên nghiệp)
 *    đến: lamhoangquan12c1@gmail.com
 * ==============================================================================
 */

// Cấu hình cố định
var CONFIG = {
  SHEET_ID: "1besF2yiEShlWJWFEhdJnntWWex7llAXDeTC0-QO4fHk",
  EMAIL_RECEIVER: "lamhoangquan12c1@gmail.com",
  SHOP_NAME: "Hoàng Quốc Việt Shop",
  SHOP_HOTLINE: "0971.250.891",
  SHOP_ZALO: "0356.280.381",
  SHEET_URL: "https://docs.google.com/spreadsheets/d/1besF2yiEShlWJWFEhdJnntWWex7llAXDeTC0-QO4fHk/edit?usp=sharing"
};

/**
 * Kiểm tra trạng thái Webhook khi mở bằng trình duyệt (GET)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "Webhook Hoàng Quốc Việt Shop đang hoạt động bình thường!",
    targetEmail: CONFIG.EMAIL_RECEIVER,
    sheetUrl: CONFIG.SHEET_URL,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Xử lý khi nhận đơn hàng gửi lên từ Website (POST)
 */
function doPost(e) {
  try {
    var rawData = {};
    if (e && e.postData && e.postData.contents) {
      try {
        rawData = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        rawData = e.parameter || {};
      }
    } else if (e && e.parameter) {
      rawData = e.parameter;
    }

    // Trích xuất các trường thông tin đơn hàng
    var now = new Date();
    var timeStr = Utilities.formatDate(now, "GMT+7", "dd/MM/yyyy HH:mm:ss");

    var orderId = rawData.id || ("ORD-" + now.getTime().toString().slice(-6));
    var customerName = (rawData.customerName || "Khách lẻ").trim();
    var phone = (rawData.phone || rawData.customerPhone || "").trim();
    var address = (rawData.address || rawData.customerAddress || "").trim();
    var city = (rawData.city || "Toàn quốc").trim();
    var notes = (rawData.notes || "Không có").trim();

    var productName = rawData.productName || "Tấm lót giày 4D# Chính Hãng";
    var variantTitle = rawData.variantTitle || "Bản Tiêu Chuẩn 4D";
    var size = rawData.size || "39";
    var color = rawData.color || "Đen";
    var quantity = Number(rawData.quantity || 1);
    var unitPrice = Number(rawData.unitPrice || 35000);
    var subtotal = Number(rawData.subtotal || (unitPrice * quantity));
    var totalAmount = Number(rawData.totalAmount || rawData.finalAmount || subtotal);
    var shippingFeeText = rawData.shippingFeeText || "LIÊN HỆ";
    var status = "Chờ xác nhận";

    // Format tiền tệ Việt Nam
    function formatVND(amount) {
      return Number(amount).toLocaleString("vi-VN") + "đ";
    }

    // -------------------------------------------------------------
    // 1. GHI THÔNG TIN VÀO GOOGLE SHEET
    // -------------------------------------------------------------
    var ss;
    try {
      ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    } catch (sheetErr) {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    var sheet = ss.getActiveSheet();

    // Nếu trang tính chưa có cột tiêu đề, tự động tạo tiêu đề đẹp mắt
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Mã Đơn Hàng",
        "Thời Gian Đặt",
        "Họ Tên Khách Hàng",
        "Số Điện Thoại",
        "Địa Chỉ Giao Hàng",
        "Tỉnh / Thành Phố",
        "Tên Sản Phẩm",
        "Phân Loại",
        "Size Giày",
        "Màu Sắc",
        "Số Lượng",
        "Đơn Giá",
        "Tổng Tiền",
        "Phí Vận Chuyển",
        "Ghi Chú Shipper",
        "Trạng Thái"
      ];
      sheet.appendRow(headers);

      // Định dạng dòng tiêu đề
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#e11d48"); // Đỏ Rose thương hiệu
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 35);
      sheet.setFrozenRows(1);
    }

    // Thêm dòng đơn hàng mới
    sheet.appendRow([
      orderId,
      timeStr,
      customerName,
      "'" + phone, // Dấu ' giúp giữ số 0 đầu số điện thoại
      address,
      city,
      productName,
      variantTitle,
      size,
      color,
      quantity,
      formatVND(unitPrice),
      formatVND(totalAmount),
      shippingFeeText,
      notes,
      status
    ]);

    // Định dạng dòng vừa thêm
    var newRow = sheet.getLastRow();
    sheet.setRowHeight(newRow, 28);
    sheet.getRange(newRow, 1, 1, 16).setVerticalAlignment("middle");
    sheet.getRange(newRow, 1).setFontWeight("bold").setFontColor("#e11d48"); // Mã đơn đỏ nổi bật
    sheet.getRange(newRow, 4).setHorizontalAlignment("left"); // Căn trái SĐT
    sheet.getRange(newRow, 11).setHorizontalAlignment("center"); // Căn giữa số lượng
    sheet.getRange(newRow, 13).setFontWeight("bold"); // Tổng tiền in đậm
    sheet.getRange(newRow, 16).setBackground("#fef3c7").setFontColor("#b45309").setFontWeight("bold").setHorizontalAlignment("center"); // Trạng thái nền vàng

    // -------------------------------------------------------------
    // 2. GỬI EMAIL THÔNG BÁO ĐƠN HÀNG MỚI ĐẾN lamhoangquan12c1@gmail.com
    // -------------------------------------------------------------
    var emailSubject = "🔥 [ĐƠN HÀNG MỚI] " + orderId + " - " + customerName + " (" + phone + ") - " + formatVND(totalAmount);
    
    var emailHtml = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thông Báo Đơn Hàng Mới</title>
</head>
<body style="margin: 0; padding: 20px 10px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
    
    <!-- HEADER BANNER -->
    <div style="background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); padding: 30px 24px; text-align: center; color: #ffffff;">
      <div style="display: inline-block; background-color: rgba(255,255,255,0.2); padding: 5px 16px; border-radius: 30px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
        ✨ Thông Báo Đơn Hàng Mới Từ Website
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">
        ${CONFIG.SHOP_NAME}
      </h1>
      <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">
        Mã đơn hàng: <strong style="background-color: #ffffff; color: #e11d48; padding: 2px 8px; border-radius: 6px; font-family: monospace;">${orderId}</strong>
      </p>
    </div>

    <!-- MAIN BODY -->
    <div style="padding: 24px 20px;">
      
      <!-- STATUS ALERT -->
      <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 12px 16px; margin-bottom: 22px; display: flex; align-items: center;">
        <span style="font-size: 18px; margin-right: 8px;">📦</span>
        <span style="color: #065f46; font-size: 13px; font-weight: 700;">
          Có 01 đơn hàng mới đang chờ bạn xác nhận và đóng gói gửi hàng!
        </span>
      </div>

      <!-- SECTION: THÔNG TIN KHÁCH HÀNG -->
      <div style="background-color: #f8fafc; border-radius: 14px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #64748b; font-weight: 800; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
          👤 Thông Tin Người Nhận
        </h3>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 130px; vertical-align: top;">Họ & Tên khách:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 700; font-size: 14px;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Số điện thoại:</td>
            <td style="padding: 6px 0;">
              <a href="tel:${phone}" style="color: #e11d48; font-weight: 900; font-size: 16px; text-decoration: none; background-color: #ffe4e6; padding: 3px 10px; border-radius: 8px; display: inline-block;">
                📞 ${phone} (Bấm để gọi ngay)
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Địa chỉ giao hàng:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${address}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Tỉnh / Thành phố:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${city}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Ghi chú giao hàng:</td>
            <td style="padding: 6px 0; color: #b45309; font-weight: 600; font-style: italic;">${notes}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Thời gian đặt:</td>
            <td style="padding: 6px 0; color: #64748b;">${timeStr}</td>
          </tr>
        </table>
      </div>

      <!-- SECTION: CHI TIẾT SẢN PHẨM ĐẶT MUA -->
      <div style="background-color: #ffffff; border-radius: 14px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 22px;">
        <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #64748b; font-weight: 800; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
          🛒 Chi Tiết Đơn Hàng
        </h3>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background-color: #f1f5f9; color: #475569; text-align: left;">
              <th style="padding: 10px; border-radius: 8px 0 0 8px;">Sản Phẩm & Phân Loại</th>
              <th style="padding: 10px; text-align: center;">Size / Màu</th>
              <th style="padding: 10px; text-align: center;">SL</th>
              <th style="padding: 10px; text-align: right; border-radius: 0 8px 8px 0;">Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; vertical-align: middle;">
                <strong style="color: #0f172a; font-size: 13px;">${productName}</strong>
                <div style="color: #e11d48; font-size: 12px; margin-top: 3px; font-weight: 600;">
                  ${variantTitle}
                </div>
              </td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; text-align: center; vertical-align: middle;">
                <span style="background-color: #f1f5f9; padding: 3px 8px; border-radius: 6px; font-weight: 600;">
                  ${size} • ${color}
                </span>
              </td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; text-align: center; vertical-align: middle; font-weight: 700;">
                x${quantity}
              </td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; text-align: right; vertical-align: middle; font-weight: 700; color: #0f172a;">
                ${formatVND(unitPrice * quantity)}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- TÍNH TOÁN TIỀN -->
        <div style="margin-top: 14px; padding-top: 10px; border-top: 2px dashed #e2e8f0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Tiền hàng (${quantity} đôi):</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 600; color: #0f172a;">${formatVND(subtotal)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Phí vận chuyển:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 800; color: #e11d48;">${shippingFeeText}</td>
            </tr>
            <tr style="border-top: 1px solid #e2e8f0;">
              <td style="padding: 12px 0 4px; font-size: 15px; font-weight: 800; color: #0f172a;">TỔNG THANH TOÁN:</td>
              <td style="padding: 12px 0 4px; text-align: right; font-size: 20px; font-weight: 900; color: #e11d48;">
                ${formatVND(totalAmount)}
              </td>
            </tr>
          </table>
        </div>
      </div>

      <!-- CTA BUTTONS -->
      <div style="text-align: center; margin: 26px 0 10px;">
        <table style="margin: 0 auto; border-collapse: separate; border-spacing: 10px 0;">
          <tr>
            <td>
              <a href="tel:${phone}" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 12px; font-weight: 800; font-size: 13px; box-shadow: 0 4px 10px rgba(5,150,105,0.3);">
                📞 Gọi Cho Khách Ngay
              </a>
            </td>
            <td>
              <a href="${CONFIG.SHEET_URL}" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 12px; font-weight: 800; font-size: 13px; box-shadow: 0 4px 10px rgba(2,132,199,0.3);">
                📊 Mở Google Sheet Quản Lý
              </a>
            </td>
          </tr>
        </table>
      </div>

    </div>

    <!-- FOOTER -->
    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 20px; text-align: center; font-size: 12px; color: #64748b;">
      <p style="margin: 0 0 4px 0; font-weight: 700; color: #334155;">
        ${CONFIG.SHOP_NAME} • Hotline: ${CONFIG.SHOP_HOTLINE} • Zalo: ${CONFIG.SHOP_ZALO}
      </p>
      <p style="margin: 0; font-size: 11px;">
        Email thông báo này được gửi tự động ngay khi khách hàng nhấn nút Đặt Hàng Ngay trên website.
      </p>
    </div>

  </div>
</body>
</html>
    `;

    MailApp.sendEmail({
      to: CONFIG.EMAIL_RECEIVER,
      subject: emailSubject,
      htmlBody: emailHtml
    });

    // Trả về JSON thành công
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Đơn hàng đã được lưu vào Google Sheet và gửi email thành công!",
      orderId: orderId,
      customerName: customerName,
      totalAmount: totalAmount
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
