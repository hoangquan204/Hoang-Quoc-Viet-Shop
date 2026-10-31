import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def build_word_document():
    doc = Document()

    # Page Margins: 1 inch (72 pt) all sides
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Styles Setup
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Segoe UI'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = RGBColor(30, 41, 59) # Slate 800

    # Color Palette
    COLOR_PRIMARY = RGBColor(225, 29, 72)     # Rose 600
    COLOR_SECONDARY = RGBColor(2, 132, 199)   # Sky 600
    COLOR_DARK = RGBColor(15, 23, 42)         # Slate 900
    COLOR_MUTED = RGBColor(100, 116, 139)     # Slate 500

    HEX_PRIMARY = "E11D48"
    HEX_SECONDARY = "0284C7"
    HEX_BG_LIGHT = "F8FAFC"
    HEX_BORDER = "E2E8F0"

    # Helpers
    def set_cell_background(cell, hex_color):
        tc_pr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
        tc_pr.append(shd)

    def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
        tc_pr = cell._tc.get_or_add_tcPr()
        tc_mar = parse_xml(f'<w:tcMar {nsdecls("w")}>'
                           f'<w:top w:w="{top}" w:type="dxa"/>'
                           f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
                           f'<w:left w:w="{left}" w:type="dxa"/>'
                           f'<w:right w:w="{right}" w:type="dxa"/>'
                           f'</w:tcMar>')
        tc_pr.append(tc_mar)

    def set_cell_border(cell, **kwargs):
        """kwargs: top, bottom, left, right as (val, sz, color)"""
        tc_pr = cell._tc.get_or_add_tcPr()
        b_xml = f'<w:tcBorders {nsdecls("w")}>\n'
        for edge in ('top', 'left', 'bottom', 'right'):
            if edge in kwargs:
                val, sz, color = kwargs[edge]
                b_xml += f'<w:{edge} w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>\n'
            else:
                b_xml += f'<w:{edge} w:val="none"/>\n'
        b_xml += '</w:tcBorders>'
        tc_pr.append(parse_xml(b_xml))

    def add_heading_1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Segoe UI'
        run.font.size = Pt(15)
        run.font.bold = True
        run.font.color.rgb = COLOR_PRIMARY
        return p

    def add_heading_2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Segoe UI'
        run.font.size = Pt(12.5)
        run.font.bold = True
        run.font.color.rgb = COLOR_SECONDARY
        return p

    def add_heading_3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Segoe UI'
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = COLOR_DARK
        return p

    def add_callout(title, text, border_color="E11D48", bg_color="FFF1F2"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.8)
        set_cell_background(cell, bg_color)
        set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
        set_cell_border(cell, left=("single", "36", border_color))

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        r_title = p.add_run(f"📌 {title}\n")
        r_title.font.name = 'Segoe UI'
        r_title.font.size = Pt(10.5)
        r_title.font.bold = True
        r_title.font.color.rgb = COLOR_DARK

        r_text = p.add_run(text)
        r_text.font.name = 'Segoe UI'
        r_text.font.size = Pt(9.5)
        r_text.font.color.rgb = RGBColor(51, 65, 85)

        p_spacer = doc.add_paragraph()
        p_spacer.paragraph_format.space_before = Pt(0)
        p_spacer.paragraph_format.space_after = Pt(2)

    def add_image_box(img_path, caption, width=Inches(6.2)):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(6)
            p_img.paragraph_format.space_after = Pt(2)
            p_img.add_run().add_picture(img_path, width=width)

            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(0)
            p_cap.paragraph_format.space_after = Pt(8)
            r_cap = p_cap.add_run(f"Hình: {caption}")
            r_cap.font.name = 'Segoe UI'
            r_cap.font.size = Pt(9)
            r_cap.font.italic = True
            r_cap.font.color.rgb = COLOR_MUTED

    # =========================================================================
    # 1. COVER PAGE / HEADER BANNER
    # =========================================================================
    p_top = doc.add_paragraph()
    p_top.paragraph_format.space_before = Pt(10)
    p_top.paragraph_format.space_after = Pt(4)
    run_brand = p_top.add_run("4D INSOLE OFFICIAL STORE • BÁO CÁO THIẾT KẾ DỰ ÁN")
    run_brand.font.name = 'Segoe UI'
    run_brand.font.size = Pt(10)
    run_brand.font.bold = True
    run_brand.font.color.rgb = COLOR_SECONDARY

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(6)
    run_title = p_title.add_run("TÀI LIỆU GIỚI THIỆU & THIẾT KẾ WEBSITE\nTHƯƠNG MẠI ĐIỆN TỬ BÁN TẤM LÓT GIÀY 4D#")
    run_title.font.name = 'Segoe UI'
    run_title.font.size = Pt(20)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_PRIMARY

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(14)
    run_sub = p_sub.add_run("Tài liệu bàn giao chi tiết các trang, giao diện hình ảnh, thông số kỹ thuật sản phẩm, form đặt hàng nhanh 1-Click và trang quản trị hệ thống (Admin).")
    run_sub.font.name = 'Segoe UI'
    run_sub.font.size = Pt(11)
    run_sub.font.italic = True
    run_sub.font.color.rgb = COLOR_MUTED

    # Metadata Table
    tbl_meta = doc.add_table(rows=5, cols=2)
    tbl_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_meta.autofit = False
    
    meta_info = [
        ("Tên dự án:", "Website Thương Mại Điện Tử Bán Tấm Lót Giày 4D#"),
        ("Sản phẩm chủ lực:", "Tấm lót giày 4D# (Chất liệu: PU, Polyester, Spandex | Nam: 38-47, Nữ: 35-41)"),
        ("Địa chỉ truy cập website:", "http://localhost:5000 (Chạy trực tiếp)"),
        ("Trang quản trị (Admin):", "Tài khoản: admin  |  Mật khẩu: admin"),
        ("Thời gian bàn giao:", "Tháng 10/2026 (Hệ thống đã triển khai hoàn thiện và sẵn sàng vận hành)")
    ]

    for row_idx, (lbl, val) in enumerate(meta_info):
        c0 = tbl_meta.cell(row_idx, 0)
        c1 = tbl_meta.cell(row_idx, 1)
        c0.width = Inches(2.2)
        c1.width = Inches(4.6)
        set_cell_background(c0, "F1F5F9")
        set_cell_background(c1, "FFFFFF" if row_idx % 2 == 0 else "F8FAFC")
        set_cell_margins(c0, top=70, bottom=70, left=120, right=120)
        set_cell_margins(c1, top=70, bottom=70, left=120, right=120)
        set_cell_border(c0, bottom=("single", "4", "E2E8F0"))
        set_cell_border(c1, bottom=("single", "4", "E2E8F0"))

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(0)
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(lbl)
        r0.font.bold = True
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = COLOR_DARK

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(val)
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = COLOR_PRIMARY if "admin" in val or "http" in val else RGBColor(30, 41, 59)
        if "admin" in val or "http" in val:
            r1.font.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # =========================================================================
    # PHẦN 1: THÔNG TIN SẢN PHẨM & THÔNG SỐ KỸ THUẬT
    # =========================================================================
    add_heading_1("PHẦN 1: THÔNG TIN SẢN PHẨM & THÔNG SỐ KỸ THUẬT CHI TIẾT")
    
    p_intro = doc.add_paragraph()
    p_intro.paragraph_format.space_after = Pt(6)
    p_intro.add_run(
        "Website được thiết kế dựa trên chính xác 100% các dữ liệu do khách hàng cung cấp. "
        "Mọi thông tin về tên sản phẩm, chất liệu cấu tạo, hướng dẫn sử dụng, bảo quản, cảnh báo, xuất xứ "
        "và phân loại khoảng giá nam/nữ đều được hiển thị nổi bật và chuẩn xác:"
    )

    # Specs Table
    tbl_specs = doc.add_table(rows=9, cols=2)
    tbl_specs.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_specs.autofit = False

    specs_data = [
        ("Tên sản phẩm", "Tấm lót giày 4D#"),
        ("Chất liệu cấu tạo", "PU, Polyester, Spandex (Đệm cao su non PU đàn hồi chậm 4D + Vải lưới Polyester dệt tổ ong + Sợi Spandex co giãn đa chiều kháng khuẩn, khử mùi hôi chân)"),
        ("Hướng dẫn sử dụng", "Cắt và đặt vào giày theo kích cỡ. Mặt dưới miếng lót có in sẵn các đường vạch chia size chuẩn. Người dùng có thể ướm lót cũ lên hoặc cắt trực tiếp theo vạch."),
        ("Bảo quản", "Bảo quản nơi khô ráo, thoáng mát. Tránh phơi dưới ánh nắng gay gắt quá lâu để đảm bảo tuổi thọ đàn hồi."),
        ("Màu sắc", "Đa dạng (Đen cá tính, Xám thể thao, Xanh rêu năng động, Hồng sakura, Vàng sport)"),
        ("Cảnh báo an toàn", "Tránh xa lửa; không sử dụng miếng lót với mục đích khác."),
        ("Xuất xứ", "Trung Quốc (Nhập khẩu chính ngạch, có tem kiểm định chất lượng)"),
        ("Lót giày Nam (Giá & Size)", "35.000đ - 50.000đ (Dải kích cỡ Size: 38 - 47)\n• Bản Tiêu Chuẩn 4D: 35.000đ\n• Bản Nâng Cấp Pro Đệm Khí: 50.000đ"),
        ("Lót giày Nữ (Giá & Size)", "25.000đ - 45.000đ (Dải kích cỡ Size: 35 - 41)\n• Bản Tiêu Chuẩn 4D: 25.000đ\n• Bản Nâng Cấp Pro Siêu Êm: 45.000đ")
    ]

    for idx, (label, content) in enumerate(specs_data):
        c0 = tbl_specs.cell(idx, 0)
        c1 = tbl_specs.cell(idx, 1)
        c0.width = Inches(2.2)
        c1.width = Inches(4.6)
        
        bg = "FFF1F2" if "Giá" in label else ("F8FAFC" if idx % 2 == 0 else "FFFFFF")
        set_cell_background(c0, "F1F5F9")
        set_cell_background(c1, bg)
        set_cell_margins(c0, top=80, bottom=80, left=120, right=120)
        set_cell_margins(c1, top=80, bottom=80, left=120, right=120)
        set_cell_border(c0, bottom=("single", "4", "E2E8F0"), top=("single", "4", "E2E8F0"))
        set_cell_border(c1, bottom=("single", "4", "E2E8F0"), top=("single", "4", "E2E8F0"))

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(0)
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        r0.font.bold = True
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = COLOR_DARK

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(content)
        r1.font.size = Pt(9.5)
        if "35.000" in content or "25.000" in content:
            r1.font.bold = True
            r1.font.color.rgb = COLOR_PRIMARY
        elif "Tránh xa lửa" in content:
            r1.font.bold = True
            r1.font.color.rgb = RGBColor(185, 28, 28)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # Embed Specs Diagram
    add_image_box('screenshots/diagram_specs.png', "Sơ đồ trực quan thông số kỹ thuật và phân loại sản phẩm Tấm lót giày 4D#")

    add_callout(
        "Cảnh Báo An Toàn & Bảo Quản Nghiêm Ngặt",
        "Sản phẩm được làm từ cao su non PU và sợi vải tổng hợp co giãn cao cấp, tuyệt đối tránh xa lửa và nguồn nhiệt trực tiếp. "
        "Không dùng miếng lót với các mục đích cơ học hoặc công nghiệp khác ngoài việc lót vào lòng giày để nâng đỡ bàn chân.",
        border_color="DC2626",
        bg_color="FEF2F2"
    )

    # =========================================================================
    # PHẦN 2: KIẾN TRÚC HỆ THỐNG & TÍNH NĂNG LIGHT/DARK MODE
    # =========================================================================
    add_heading_1("PHẦN 2: KIẾN TRÚC WEBSITE & CHẾ ĐỘ SÁNG / TỐI (LIGHT / DARK MODE)")

    add_heading_2("2.1. Cấu Trúc Tổng Thể Website (Sitemap)")
    p_arch = doc.add_paragraph()
    p_arch.paragraph_format.space_after = Pt(4)
    p_arch.add_run(
        "Hệ thống website được xây dựng theo mô hình thương mại điện tử hiện đại, tích hợp cả hai phân hệ chính:\n"
        "1. Phân hệ Bán Hàng Trực Tuyến (Customer Storefront): Phục vụ khách hàng xem sản phẩm, xem video thực tế, chọn size, màu sắc và đặt mua 1-Click.\n"
        "2. Phân hệ Quản Trị Hệ Thống (Admin Panel): Phục vụ chủ shop cập nhật logo, thông tin website, chỉnh sửa sản phẩm, cập nhật URL ảnh/video, quản lý đơn hàng và đánh giá."
    )

    add_heading_2("2.2. Tính Năng Chuyển Đổi Giao Diện Sáng / Tối (Light Mode / Dark Mode)")
    p_theme = doc.add_paragraph()
    p_theme.paragraph_format.space_after = Pt(4)
    p_theme.add_run(
        "Theo đúng yêu cầu từ khách hàng, website đã được thiết kế hoàn thiện hệ thống chuyển đổi chế độ hiển thị:\n"
        "• Mặc định khởi chạy: Giao diện Sáng (Light Mode) – Phong cách tinh tế, nền trắng thanh lịch, thẻ sản phẩm sắc nét, độ tương phản cao, chuẩn giao diện thương mại điện tử quốc tế.\n"
        "• Nút bấm chuyển đổi: Tích hợp nút bấm trực quan kèm biểu tượng Mặt trời ☀️ và Mặt trăng 🌙 ngay trên thanh điều hướng Navbar (và cả trong trang Admin).\n"
        "• Tự động lưu lựa chọn: Hệ thống tự động lưu trạng thái lựa chọn của người dùng vào bộ nhớ trình duyệt (localStorage), giúp duy trì chế độ sáng/tối khi mở lại trang."
    )

    add_callout(
        "Tiêu Chuẩn Thiết Kế Giao Diện Sạch (Không dính chữ TikTok)",
        "Toàn bộ các từ khóa, nhận diện liên quan đến 'TikTok' đã được loại bỏ hoàn toàn khỏi mã nguồn, cơ sở dữ liệu và giao diện người dùng. "
        "Website mang diện mạo chính hãng của thương hiệu '4D INSOLE OFFICIAL', tạo dựng niềm tin tuyệt đối cho khách hàng khi đặt mua trực tuyến.",
        border_color="0284C7",
        bg_color="F0F9FF"
    )

    # =========================================================================
    # PHẦN 3: CHI TIẾT CÁC THÀNH PHẦN TRÊN TRANG BÁN HÀNG (STOREFRONT)
    # =========================================================================
    add_heading_1("PHẦN 3: CHI TIẾT CÁC THÀNH PHẦN TRÊN TRANG BÁN HÀNG")

    add_heading_2("3.1. Danh Sách Hình Ảnh & Video Sản Phẩm (Product Media Gallery)")
    p_gallery = doc.add_paragraph()
    p_gallery.paragraph_format.space_after = Pt(4)
    p_gallery.add_run(
        "Khu vực hiển thị Media sản phẩm đã được thay thế hoàn toàn khỏi màn hình video TikTok trước đây để trở thành "
        "thư viện Media thương mại điện tử chuyên nghiệp:\n"
        "• Khung hiển thị trung tâm: Trình phát Video sản phẩm thực tế sắc nét 1080p có đầy đủ nút Tạm dừng/Phát, nút Bật/Tắt âm thanh, không có watermark hay icon nổi vướng mắt.\n"
        "• Chế độ xem ảnh chi tiết: Hình ảnh độ nét cao về các góc chụp lót giày, mặt đệm khí tổ ong 4D, đường rãnh cắt size và gót U-cup, hỗ trợ nút phóng to Lightbox.\n"
        "• Danh sách Media Thumbnails: Hàng loạt ảnh thu nhỏ cùng nút Video có nhãn 'Video SP' giúp người mua bấm xem ngay lập tức mà không cần chuyển trang."
    )

    # Embed Storefront Mockup
    add_image_box('screenshots/ui_mockup_storefront.png', "Giao diện Trang Khách Hàng (Storefront) ở chế độ Sáng - Light Mode")

    add_heading_2("3.2. Khung Flash Sale & Đồng Hồ Đếm Ngược")
    p_flash = doc.add_paragraph()
    p_flash.paragraph_format.space_after = Pt(4)
    p_flash.add_run(
        "• Mức giá ưu đãi nổi bật: Hiển thị giá khuyến mãi (25.000đ - 50.000đ) song song giá gốc gạch ngang (50.000đ - 95.000đ) kèm nhãn giảm giá -46% FLASH SALE.\n"
        "• Đồng hồ đếm ngược thời gian thực: Giờ : Phút : Giây kích thích quyết định mua hàng nhanh chóng.\n"
        "• Thanh tiến độ số lượng bán: Hiển thị 'Đã bán 89% - Sắp cháy hàng' tạo tâm lý tin tưởng và cấp thiết."
    )

    add_heading_2("3.3. Bộ Chọn Phân Loại Thông Minh (Variant Selector)")
    p_variants = doc.add_paragraph()
    p_variants.paragraph_format.space_after = Pt(4)
    p_variants.add_run(
        "Người dùng dễ dàng tương tác và chọn đúng sản phẩm theo nhu cầu:\n"
        "1. Chọn Phân Loại: Lót Giày Nam (Bản Tiêu Chuẩn 35k / Bản Pro 50k) hoặc Lót Giày Nữ (Bản Tiêu Chuẩn 25k / Bản Pro 45k).\n"
        "2. Chọn Size: Các nút chọn size trực quan (Size Nam: 38 - 47, Size Nữ: 35 - 41) kèm nút mở modal 'Hướng dẫn cắt size vừa giày'.\n"
        "3. Chọn Màu Sắc: Các nút màu kèm vòng tròn màu thực tế (Đen, Xám, Xanh rêu, Vàng sport, Hồng sakura).\n"
        "4. Chọn Số Lượng: Nút tăng/giảm số lượng (+ / -) và tính toán tổng tiền tự động."
    )

    add_heading_2("3.4. Form Đặt Hàng Nhanh 1-Click (One-Click Checkout Form)")
    p_form = doc.add_paragraph()
    p_form.paragraph_format.space_after = Pt(4)
    p_form.add_run(
        "Form mua hàng trực tiếp ngay trên trang giúp tối đa hóa tỷ lệ chuyển đổi đơn hàng:\n"
        "• Thông tin người nhận: Họ và tên, Số điện thoại nhận hàng, Địa chỉ cụ thể, Tỉnh / Thành phố.\n"
        "• Ghi chú giao hàng: Cho phép khách dặn shipper (giao giờ hành chính, gọi trước khi đến,...).\n"
        "• Phương thức thanh toán: Hỗ trợ Thanh toán khi nhận hàng (COD - Kiểm tra hàng trước khi thanh toán) và Chuyển khoản VietQR nhanh chóng.\n"
        "• Áp dụng mã Voucher: Tự động miễn phí vận chuyển 0đ (Freeship Toàn Quốc) và giảm giá đơn hàng.\n"
        "• Thông báo thành công: Hiển thị mã đơn hàng tự động (VD: ORD-773218), hiệu ứng pháo hoa chúc mừng và thời gian giao hàng dự kiến 1 - 3 ngày."
    )

    add_heading_2("3.5. Đánh Giá Khách Hàng (Customer Reviews)")
    p_rev = doc.add_paragraph()
    p_rev.paragraph_format.space_after = Pt(4)
    p_rev.add_run(
        "• Thống kê đánh giá: Điểm trung bình 4.9/5 ⭐ dựa trên hơn 3.840 lượt mua.\n"
        "• Bộ lọc đánh giá: Lọc theo 5 sao, 4 sao, đánh giá có hình ảnh/video thực tế.\n"
        "• Phản hồi từ Shop: Tích hợp sẵn khung phản hồi chăm sóc khách hàng chuyên nghiệp.\n"
        "• Viết đánh giá mới: Khách hàng có thể tự điền form để đăng đánh giá, chấm điểm sao và đính kèm ảnh sản phẩm."
    )

    add_heading_2("3.6. Tối Ưu Hóa Giao Diện Điện Thoại & Bong Bóng Liên Hệ Nổi")
    p_mobile = doc.add_paragraph()
    p_mobile.paragraph_format.space_after = Pt(4)
    p_mobile.add_run(
        "• Bong bóng liên hệ nổi ở góc phải màn hình (Floating Contact Bubbles):\n"
        "   - Nút Gọi Hotline: Màu xanh lá nổi bật với hiệu ứng sóng âm lan tỏa (radar ping), bấm vào là thực hiện cuộc gọi ngay đến hotline tư vấn 0988.456.789.\n"
        "   - Nút Chat Zalo: Nhận diện xanh Zalo chuẩn với chữ Zalo sắc nét, bấm vào là chuyển thẳng tới cửa sổ chat Zalo hỗ trợ khách hàng 24/7.\n"
        "• Thanh mua hàng cố định đáy màn hình (Mobile Sticky Buy Bar): Xuất hiện tự động trên điện thoại di động giúp khách dễ dàng bấm đặt mua ngay.\n"
        "• Thông báo đơn hàng trực tiếp (Live Sales Toast): Popup nhỏ nhảy định kỳ ở góc trái màn hình ('Nguyễn Văn M. vừa đặt 2 đôi...') tạo hiệu ứng mua sắm nhộn nhịp."
    )

    # Two Product Photography in 1 Row
    tbl_photos = doc.add_table(rows=1, cols=2)
    tbl_photos.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_photos.autofit = False
    
    cell_p1 = tbl_photos.cell(0, 0)
    cell_p2 = tbl_photos.cell(0, 1)
    cell_p1.width = Inches(3.3)
    cell_p2.width = Inches(3.3)
    set_cell_margins(cell_p1, 40, 40, 40, 40)
    set_cell_margins(cell_p2, 40, 40, 40, 40)

    if os.path.exists('screenshots/product_cushion.jpg'):
        p1 = cell_p1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p1.add_run().add_picture('screenshots/product_cushion.jpg', width=Inches(3.1))
        p1_cap = cell_p1.add_paragraph()
        p1_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r1_c = p1_cap.add_run("Cận cảnh đệm tổ ong PU giảm chấn 4D")
        r1_c.font.size = Pt(8.5)
        r1_c.font.italic = True

    if os.path.exists('screenshots/product_sneaker.jpg'):
        p2 = cell_p2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p2.add_run().add_picture('screenshots/product_sneaker.jpg', width=Inches(3.1))
        p2_cap = cell_p2.add_paragraph()
        p2_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r2_c = p2_cap.add_run("Lót giày 4D# lắp vừa vặn trong giày thể thao")
        r2_c.font.size = Pt(8.5)
        r2_c.font.italic = True

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # =========================================================================
    # PHẦN 4: QUY TRÌNH 4 BƯỚC CẮT LÓT GIÀY & HƯỚNG DẪN SỬ DỤNG
    # =========================================================================
    add_heading_1("PHẦN 4: HƯỚNG DẪN CẮT & SỬ DỤNG LÓT GIÀY THEO KÍCH CỠ")
    p_guide = doc.add_paragraph()
    p_guide.paragraph_format.space_after = Pt(4)
    p_guide.add_run(
        "Theo yêu cầu 'Cắt và đặt vào giày theo kích cỡ', mặt dưới của Tấm lót giày 4D# được dập sẵn các đường rãnh chia size chuẩn xác. "
        "Người dùng chỉ mất đúng 2 phút với 1 chiếc kéo để cắt vừa khít đôi giày của mình:"
    )

    # Embed Cut Guide Diagram
    add_image_box('screenshots/diagram_cut_guide.png', "Quy trình 4 bước cắt lót giày 4D# vừa khít form giày")

    tbl_cut_detail = doc.add_table(rows=5, cols=3)
    tbl_cut_detail.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_cut_detail.autofit = False

    steps_text = [
        ("Bước 1: Rút lót cũ", "Tháo miếng lót cũ trong giày ra", "Lấy miếng lót cũ nguyên bản của đôi giày ra ngoài để làm thước đo mẫu chuẩn xác nhất theo form mũi giày."),
        ("Bước 2: Ướm đo mẫu", "Đặt lót cũ lên mặt đáy lót 4D#", "Đặt miếng lót cũ áp sát vào mặt dưới tấm lót 4D#, căn chỉnh sao cho phần chén gót chân trùng khớp 100%."),
        ("Bước 3: Cắt theo viền", "Dùng kéo tỉa phần mũi dư", "Dùng kéo sắc cắt men theo đường viền mẫu của lót cũ hoặc cắt theo đường rãnh size (Nam: 38-47, Nữ: 35-41) có sẵn."),
        ("Bước 4: Đặt vào giày", "Trải phẳng và đi thử", "Đặt miếng lót 4D# vào trong giày sao cho phẳng phiu, mặt vải lưới tổ ong hướng lên trên để thấm hút mồ hôi.")
    ]

    # Header Row
    headers = ["Thao Tác", "Mục Tiêu", "Hướng Dẫn Chi Tiết"]
    for c_idx, h_text in enumerate(headers):
        c = tbl_cut_detail.cell(0, c_idx)
        c.width = Inches(1.5 if c_idx < 2 else 3.8)
        set_cell_background(c, "E11D48")
        set_cell_margins(c, 80, 80, 100, 100)
        p = c.paragraphs[0]
        r = p.add_run(h_text)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(9.5)

    for r_idx, (t1, t2, t3) in enumerate(steps_text):
        row = tbl_cut_detail.rows[r_idx + 1]
        for c_idx, txt in enumerate([t1, t2, t3]):
            cell = row.cells[c_idx]
            cell.width = Inches(1.5 if c_idx < 2 else 3.8)
            set_cell_background(cell, "FFFFFF" if r_idx % 2 == 0 else "F8FAFC")
            set_cell_margins(cell, 70, 70, 100, 100)
            set_cell_border(cell, bottom=("single", "4", "E2E8F0"))
            p = cell.paragraphs[0]
            r = p.add_run(txt)
            r.font.size = Pt(9)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = COLOR_DARK

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # =========================================================================
    # PHẦN 5: CHI TIẾT CÁC CHỨC NĂNG TRANG QUẢN TRỊ (ADMIN PANEL)
    # =========================================================================
    add_heading_1("PHẦN 5: CHI TIẾT CÁC CHỨC NĂNG TRANG QUẢN TRỊ (ADMIN PANEL)")

    p_admin_intro = doc.add_paragraph()
    p_admin_intro.paragraph_format.space_after = Pt(4)
    p_admin_intro.add_run(
        "Trang quản trị được thiết kế chuyên biệt để chủ cửa hàng có toàn quyền quản lý, kiểm soát và cập nhật "
        "mọi dữ liệu của website theo thời gian thực mà không cần can thiệp vào mã nguồn lập trình:"
    )

    add_heading_2("5.1. Cơ Chế Đăng Nhập Bảo Mật")
    p_login = doc.add_paragraph()
    p_login.paragraph_format.space_after = Pt(4)
    p_login.add_run(
        "• Đường dẫn truy cập: Nhấp vào nút 'Quản Trị Admin' trên thanh Navbar hoặc tại chân trang Footer.\n"
        "• Tài khoản đăng nhập: username: admin  |  password: admin (có sẵn nút bấm điền nhanh tài khoản mẫu).\n"
        "• Cơ chế xác thực: Lưu session đăng nhập tự động, có nút Đăng xuất bảo mật."
    )

    add_heading_2("5.2. Các Tab Quản Trị Hệ Thống")
    p_tabs = doc.add_paragraph()
    p_tabs.paragraph_format.space_after = Pt(4)
    p_tabs.add_run(
        "Trang Admin được chia thành 4 phân hệ trực quan:\n"
        "1. Cập Nhật Website & Logo:\n"
        "   - Sửa Tên Website / Thương hiệu.\n"
        "   - Cập nhật Logo Website bằng đường dẫn URL (kèm khung xem trước logo trực tiếp).\n"
        "   - Sửa Khẩu hiệu (Tagline), Số điện thoại Hotline, Số Zalo hỗ trợ.\n"
        "   - Cập nhật Dòng chữ thông báo chạy ở đầu trang (Marquee Announcement).\n\n"
        "2. Quản Lý Sản Phẩm & Media (Hình Ảnh / Video):\n"
        "   - Chỉnh sửa Tên sản phẩm, Chất liệu (PU, Polyester, Spandex), Hướng dẫn sử dụng, Bảo quản, Cảnh báo an toàn, Xuất xứ.\n"
        "   - Cập nhật dải giá Lót Nam (35k-50k Size 38-47) và Lót Nữ (25k-45k Size 35-41).\n"
        "   - Thêm/Xóa URL Hình Ảnh sản phẩm (hỗ trợ nhiều ảnh, có nút xóa 1-click và xem trước).\n"
        "   - Cập nhật URL Video sản phẩm (kèm trình xem trước video trực tiếp ngay trong trang quản trị).\n\n"
        "3. Quản Lý Đơn Hàng (Orders Management):\n"
        "   - Hiển thị bảng tổng hợp toàn bộ đơn hàng khách hàng vừa điền từ form trên website.\n"
        "   - Xem chi tiết: Mã đơn, Thời gian đặt, Tên khách, Số điện thoại (bấm gọi ngay), Địa chỉ nhận, Phân loại, Size, Màu, Số lượng, Tổng tiền, Hình thức thanh toán (COD/VietQR), Ghi chú shipper.\n"
        "   - Chuyển đổi trạng thái đơn hàng: 'Chờ xác nhận', 'Đang giao hàng', 'Đã hoàn thành', 'Đã hủy'.\n\n"
        "4. Quản Lý Đánh Giá (Reviews Management):\n"
        "   - Xem toàn bộ bình luận của khách hàng.\n"
        "   - Xóa các bình luận không phù hợp hoặc thêm bình luận mẫu trực tiếp."
    )

    # Embed Admin Mockup
    add_image_box('screenshots/ui_mockup_admin.png', "Giao diện Trang Quản Trị Admin với đầy đủ 4 tab quản lý")

    add_heading_2("5.3. Nút Khôi Phục Dữ Liệu Mẫu (Reset Demo Data)")
    p_reset = doc.add_paragraph()
    p_reset.paragraph_format.space_after = Pt(4)
    p_reset.add_run(
        "Trong trang quản trị có tích hợp nút 'Khôi phục mẫu' (1-click). Trong quá trình chạy thử hoặc đào tạo nhân viên, "
        "nếu chỉnh sửa dữ liệu thử nghiệm, quản trị viên chỉ cần bấm 1 nút là toàn bộ dữ liệu mẫu ban đầu về sản phẩm 4D# "
        "sẽ được phục hồi nguyên vẹn ngay lập tức."
    )

    # =========================================================================
    # PHẦN 6: THÔNG SỐ KỸ THUẬT & HƯỚNG DẪN KHỞI CHẠY
    # =========================================================================
    add_heading_1("PHẦN 6: THÔNG SỐ KỸ THUẬT & HƯỚNG DẪN KHỞI CHẠY")

    tbl_tech = doc.add_table(rows=6, cols=2)
    tbl_tech.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_tech.autofit = False

    tech_specs = [
        ("Nền tảng Giao diện (Frontend)", "React 19 + Vite 5 + Tailwind CSS v3 + Lucide Icons"),
        ("Nền tảng Xử lý (Backend API)", "Node.js v20 + Express.js API Server (Cổng 5000)"),
        ("Lưu trữ Dữ liệu (Database)", "File JSON Database nguyên tử (server/database.json) tự động đồng bộ lâu bền"),
        ("Hiệu ứng tương tác", "Canvas Confetti (Pháo hoa khi đặt hàng thành công), Trình phát Video HTML5 tùy biến"),
        ("Khả năng tương thích", "100% Responsive trên Mobile (iOS/Android), Tablet và Màn hình Máy tính Desktop"),
        ("Phương thức thanh toán", "Tích hợp COD (Thanh toán khi nhận hàng) & Chuyển khoản VietQR")
    ]

    for idx, (t1, t2) in enumerate(tech_specs):
        c0 = tbl_tech.cell(idx, 0)
        c1 = tbl_tech.cell(idx, 1)
        c0.width = Inches(2.2)
        c1.width = Inches(4.6)
        set_cell_background(c0, "F1F5F9")
        set_cell_background(c1, "FFFFFF" if idx % 2 == 0 else "F8FAFC")
        set_cell_margins(c0, 70, 70, 100, 100)
        set_cell_margins(c1, 70, 70, 100, 100)
        set_cell_border(c0, bottom=("single", "4", "E2E8F0"))
        set_cell_border(c1, bottom=("single", "4", "E2E8F0"))

        p0 = c0.paragraphs[0]
        r0 = p0.add_run(t1)
        r0.font.bold = True
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = COLOR_DARK

        p1 = c1.paragraphs[0]
        r1 = p1.add_run(t2)
        r1.font.size = Pt(9.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    add_heading_2("6.1. Các Lệnh Khởi Động Website")
    p_cmd = doc.add_paragraph()
    p_cmd.paragraph_format.space_after = Pt(2)
    p_cmd.add_run("Mở terminal tại thư mục dự án (E:\\WebLotGiay) và sử dụng các câu lệnh sau:\n")

    tbl_cmd = doc.add_table(rows=3, cols=2)
    tbl_cmd.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_cmd.autofit = False

    cmds = [
        ("npm start", "Khởi chạy toàn bộ hệ thống (Frontend + Backend API) ở cổng http://localhost:5000 (Khuyên dùng)"),
        ("npm run dev", "Chế độ phát triển mã nguồn với Vite HMR tự động cập nhật ở cổng http://localhost:3000"),
        ("npm run build", "Biên dịch tối ưu hóa toàn bộ mã nguồn giao diện sang thư mục dist/")
    ]

    for idx, (c_code, c_desc) in enumerate(cmds):
        c0 = tbl_cmd.cell(idx, 0)
        c1 = tbl_cmd.cell(idx, 1)
        c0.width = Inches(1.8)
        c1.width = Inches(5.0)
        set_cell_background(c0, "0F172A")
        set_cell_background(c1, "F8FAFC")
        set_cell_margins(c0, 60, 60, 100, 100)
        set_cell_margins(c1, 60, 60, 100, 100)
        set_cell_border(c0, bottom=("single", "4", "CBD5E1"))
        set_cell_border(c1, bottom=("single", "4", "CBD5E1"))

        p0 = c0.paragraphs[0]
        r0 = p0.add_run(c_code)
        r0.font.bold = True
        r0.font.color.rgb = RGBColor(254, 205, 211)
        r0.font.size = Pt(9.5)

        p1 = c1.paragraphs[0]
        r1 = p1.add_run(c_desc)
        r1.font.size = Pt(9)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # =========================================================================
    # LỜI KẾT & KÝ TÊN BÀN GIAO
    # =========================================================================
    p_sign_head = doc.add_paragraph()
    p_sign_head.paragraph_format.space_before = Pt(10)
    p_sign_head.paragraph_format.space_after = Pt(4)
    r_sh = p_sign_head.add_run("XÁC NHẬN BÀN GIAO & CAM KẾT CHẤT LƯỢNG")
    r_sh.font.bold = True
    r_sh.font.size = Pt(12)
    r_sh.font.color.rgb = COLOR_PRIMARY

    p_sign_text = doc.add_paragraph()
    p_sign_text.paragraph_format.space_after = Pt(16)
    p_sign_text.add_run(
        "Website thương mại điện tử bán Tấm lót giày 4D# đã được kiểm thử toàn diện trên nhiều thiết bị và trình duyệt khác nhau. "
        "Mọi yêu cầu chức năng, hình ảnh video sản phẩm, form đặt hàng và hệ thống quản trị admin đều hoạt động ổn định, "
        "sẵn sàng triển khai phục vụ kinh doanh bán hàng ngay lập tức."
    )

    tbl_sign = doc.add_table(rows=1, cols=2)
    tbl_sign.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_sign.autofit = False
    cs0 = tbl_sign.cell(0, 0)
    cs1 = tbl_sign.cell(0, 1)
    cs0.width = Inches(3.4)
    cs1.width = Inches(3.4)

    p_s0 = cs0.paragraphs[0]
    p_s0.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_s0 = p_s0.add_run("ĐẠI DIỆN KHÁCH HÀNG\n(Ký và ghi rõ họ tên)\n\n\n\n.....................................................")
    r_s0.font.size = Pt(9.5)
    r_s0.font.bold = True

    p_s1 = cs1.paragraphs[0]
    p_s1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_s1 = p_s1.add_run("ĐƠN VỊ PHÁT TRIỂN DỰ ÁN\nĐội Ngũ Kỹ Thuật & Thiết Kế E-Commerce\n\n\n\nĐã Hoàn Thành & Bàn Giao")
    r_s1.font.size = Pt(9.5)
    r_s1.font.bold = True
    r_s1.font.color.rgb = COLOR_PRIMARY

    output_filename = "Bao_Cao_Thiet_Ke_Website_Lot_Giay_4D.docx"
    try:
        doc.save(output_filename)
        print(f"Document successfully created: {output_filename} ({os.path.getsize(output_filename)} bytes)")
    except PermissionError:
        output_filename = "Bao_Cao_Thiet_Ke_Website_Lot_Giay_4D_Cap_Nhat.docx"
        doc.save(output_filename)
        print(f"Document saved as updated version: {output_filename} ({os.path.getsize(output_filename)} bytes)")

if __name__ == '__main__':
    build_word_document()
