import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('screenshots', exist_ok=True)
fonts_dir = os.path.join(os.environ.get('WINDIR', 'C:\\Windows'), 'Fonts')
font_bold_path = os.path.join(fonts_dir, 'segoeuib.ttf')
font_regular_path = os.path.join(fonts_dir, 'segoeui.ttf')

if not os.path.exists(font_bold_path):
    font_bold_path = os.path.join(fonts_dir, 'arialbd.ttf')
if not os.path.exists(font_regular_path):
    font_regular_path = os.path.join(fonts_dir, 'arial.ttf')

title_font = ImageFont.truetype(font_bold_path, 28)
sub_font = ImageFont.truetype(font_regular_path, 16)
header_font = ImageFont.truetype(font_bold_path, 18)
body_font = ImageFont.truetype(font_regular_path, 14)
small_font = ImageFont.truetype(font_regular_path, 12)
badge_font = ImageFont.truetype(font_bold_path, 13)

# -------------------------------------------------------------------------
# DIAGRAM 1: SPECIFICATIONS & VARIANTS
# -------------------------------------------------------------------------
def create_specs_diagram():
    w, h = 1000, 560
    img = Image.new('RGB', (w, h), color='#F8FAFC')
    draw = ImageDraw.Draw(img)

    # Header Bar
    draw.rectangle([(0, 0), (w, 80)], fill='#E11D48')
    draw.text((30, 18), "BẢNG THÔNG SỐ KỸ THUẬT & PHÂN LOẠI: TẤM LÓT GIÀY 4D#", fill='#FFFFFF', font=title_font)
    draw.text((30, 50), "Thông tin chính xác theo hồ sơ kỹ thuật sản phẩm & chính sách bán hàng", fill='#FECDD3', font=small_font)

    # 6 Grid Cards
    cards = [
        ("TÊN SẢN PHẨM & XUẤT XỨ", [("Tên gọi", "Tấm lót giày 4D#"), ("Thương hiệu", "4D Insole Official"), ("Xuất xứ", "Trung Quốc"), ("Bảo hành", "Độ đàn hồi không xẹp lún")], '#0284C7'),
        ("CHẤT LIỆU CAO CẤP", [("Chất liệu chính", "PU, Polyester, Spandex"), ("Đệm lót", "Cao su non PU đàn hồi 4D"), ("Bề mặt vải", "Polyester dệt lỗ tổ ong"), ("Sợi gia cố", "Spandex co giãn đa chiều")], '#10B981'),
        ("PHÂN LOẠI LÓT GIÀY NAM", [("Khoảng giá bán", "35.000đ - 50.000đ"), ("Dải kích cỡ (Size)", "Size 38 - 47"), ("Bản tiêu chuẩn", "35.000đ (Êm ái hàng ngày)"), ("Bản Pro đệm khí", "50.000đ (Thể thao, nâng vòm)")], '#E11D48'),
        ("PHÂN LOẠI LÓT GIÀY NỮ", [("Khoảng giá bán", "25.000đ - 45.000đ"), ("Dải kích cỡ (Size)", "Size 35 - 41"), ("Bản tiêu chuẩn", "25.000đ (Giảm mỏi gót chân)"), ("Bản Pro đệm khí", "45.000đ (Massage êm ái)")], '#EC4899'),
        ("MÀU SẮC & HƯỚNG DẪN SỬ DỤNG", [("Màu sắc", "Đa dạng (Đen, Xám, Xanh, Hồng, Vàng)"), ("Hướng dẫn sử dụng", "Cắt và đặt vào giày theo kích cỡ"), ("Đường rãnh cắt", "In sẵn vạch size chuẩn ở mặt đáy"), ("Khuôn đo", "Dùng lót giày cũ ướm lên lót 4D#")], '#8B5CF6'),
        ("BẢO QUẢN & CẢNH BÁO AN TOÀN", [("Bảo quản", "Bảo quản nơi khô ráo, thoáng mát"), ("Vệ sinh", "Giặt tay nhẹ với xà phòng pha loãng"), ("Cảnh báo an toàn", "Tránh xa lửa;"), ("Mục đích dùng", "Không sử dụng với mục đích khác")], '#F59E0B')
    ]

    for idx, (card_title, items, color) in enumerate(cards):
        col = idx % 2
        row = idx // 2
        x = 30 + col * 480
        y = 100 + row * 145

        # Card Background
        draw.rounded_rectangle([(x, y), (x + 460, y + 135)], radius=12, fill='#FFFFFF', outline='#E2E8F0', width=1)
        # Card Accent Bar
        draw.rounded_rectangle([(x, y), (x + 460, y + 32)], radius=12, fill=color)
        draw.rectangle([(x, y + 20), (x + 460, y + 32)], fill=color)
        draw.text((x + 15, y + 7), card_title, fill='#FFFFFF', font=badge_font)

        # Content lines
        line_y = y + 42
        for label, val in items:
            draw.text((x + 15, line_y), f"• {label}:", fill='#64748B', font=small_font)
            draw.text((x + 160, line_y), val, fill='#0F172A', font=small_font)
            line_y += 22

    # Save
    out_path = 'screenshots/diagram_specs.png'
    img.save(out_path, quality=95)
    print(f"Created {out_path}")

# -------------------------------------------------------------------------
# DIAGRAM 2: 4-STEP CUTTING GUIDE
# -------------------------------------------------------------------------
def create_cut_guide_diagram():
    w, h = 1000, 360
    img = Image.new('RGB', (w, h), color='#FFFFFF')
    draw = ImageDraw.Draw(img)

    # Header
    draw.rectangle([(0, 0), (w, 65)], fill='#0F172A')
    draw.text((30, 15), "QUY TRÌNH 4 BƯỚC CẮT & SỬ DỤNG TẤM LÓT GIÀY 4D# CHUẨN XÁC", fill='#FFFFFF', font=header_font)
    draw.text((30, 40), "Đường rãnh vạch in sẵn dưới mặt đáy: Nam (Size 38-47), Nữ (Size 35-41)", fill='#94A3B8', font=small_font)

    steps = [
        ("BƯỚC 1", "Rút Lót Giày Cũ Ra", "Tháo miếng lót cũ nguyên bản\ntrong đôi giày của bạn ra ngoài\nđể làm khuôn đo mẫu chuẩn nhất.", '#E11D48'),
        ("BƯỚC 2", "Ướm Đo Lên Lót 4D#", "Đặt miếng lót cũ lên trên mặt đáy\ncủa tấm lót 4D#, căn chỉnh trùng\nkhớp hoàn toàn phần gót chân.", '#0284C7'),
        ("BƯỚC 3", "Cắt Theo Đường Viền", "Dùng kéo sắc cắt tỉa phần mũi\ntheo đường viền lót cũ hoặc theo\nvạch size dập sẵn ở mặt đáy.", '#F59E0B'),
        ("BƯỚC 4", "Đặt Vào Giày & Đi Thử", "Đặt tấm lót 4D# vào trong giày\nsao cho phẳng phiu, mặt vải tổ ong\nhướng lên trên và tận hưởng độ êm!", '#10B981')
    ]

    for idx, (step_num, step_title, desc, color) in enumerate(steps):
        x = 30 + idx * 240
        y = 85

        # Step card
        draw.rounded_rectangle([(x, y), (x + 225, y + 250)], radius=12, fill='#F8FAFC', outline='#E2E8F0', width=1)
        
        # Step Circle
        draw.ellipse([(x + 87, y + 15), (x + 137, y + 65)], fill=color)
        draw.text((x + 106, y + 27), str(idx + 1), fill='#FFFFFF', font=header_font)

        # Step title
        draw.text((x + 15, y + 80), step_num, fill=color, font=small_font)
        draw.text((x + 15, y + 98), step_title, fill='#0F172A', font=header_font)

        # Step description
        draw.text((x + 15, y + 135), desc, fill='#475569', font=body_font)

        # Arrow indicator between cards
        if idx < 3:
            draw.text((x + 230, y + 120), "➜", fill='#CBD5E1', font=title_font)

    out_path = 'screenshots/diagram_cut_guide.png'
    img.save(out_path, quality=95)
    print(f"Created {out_path}")

# -------------------------------------------------------------------------
# DIAGRAM 3: STOREFRONT UI MOCKUP COMPOSITION
# -------------------------------------------------------------------------
def create_storefront_mockup():
    w, h = 1000, 680
    img = Image.new('RGB', (w, h), color='#F8FAFC')
    draw = ImageDraw.Draw(img)

    # Top Announcement Bar
    draw.rectangle([(0, 0), (w, 32)], fill='#E11D48')
    draw.text((30, 8), "🔥 SIÊU SALE HÔM NAY: GIẢM ĐẾN 50% + MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC CHO ĐƠN TỪ 50K!", fill='#FFFFFF', font=small_font)

    # Navbar
    draw.rectangle([(0, 32), (w, 95)], fill='#FFFFFF', outline='#E2E8F0', width=1)
    draw.rounded_rectangle([(30, 42), (72, 84)], radius=8, fill='#E11D48')
    draw.text((38, 50), "4D#", fill='#FFFFFF', font=header_font)
    draw.text((85, 53), "4D INSOLE - TỔNG KHO LÓT GIÀY CHÍNH HÃNG", fill='#0F172A', font=header_font)

    # Navbar Action buttons: Hotline, Sleek Sun/Moon Toggle, Order Button
    draw.rounded_rectangle([(650, 48), (765, 78)], radius=8, fill='#F1F5F9', outline='#CBD5E1', width=1)
    draw.text((662, 54), "📞 0988.456.789", fill='#0F172A', font=small_font)

    # Sleek Toggle Pill (Sun / Moon)
    draw.rounded_rectangle([(785, 48), (845, 78)], radius=15, fill='#E2E8F0', outline='#CBD5E1', width=1)
    draw.ellipse([(788, 51), (814, 75)], fill='#FFFFFF', outline='#CBD5E1', width=1)
    draw.text((795, 55), "☀️", fill='#F59E0B', font=small_font)
    draw.text((823, 55), "🌙", fill='#64748B', font=small_font)

    draw.rounded_rectangle([(865, 46), (970, 80)], radius=8, fill='#E11D48')
    draw.text((878, 54), "ĐẶT MUA NGAY", fill='#FFFFFF', font=badge_font)

    # Main Left: Product Showcase & Gallery (Image inserted)
    draw.rounded_rectangle([(30, 115), (450, 520)], radius=16, fill='#FFFFFF', outline='#E2E8F0', width=1)
    
    # Try inserting the main product image
    if os.path.exists('screenshots/product_main.jpg'):
        p_img = Image.open('screenshots/product_main.jpg').resize((400, 260))
        img.paste(p_img, (40, 125))

    # Media Thumbnails Row
    thumb_labels = ["Video SP", "Ảnh 1", "Ảnh 2", "Ảnh 3", "Ảnh 4"]
    for i, label in enumerate(thumb_labels):
        tx = 40 + i * 80
        draw.rounded_rectangle([(tx, 400), (tx + 72, 455)], radius=8, fill='#F8FAFC', outline='#E11D48' if i == 0 else '#CBD5E1', width=2 if i == 0 else 1)
        draw.text((tx + 12, 420), label, fill='#E11D48' if i == 0 else '#64748B', font=small_font)

    # 3 Specs Pills Under Media
    draw.rounded_rectangle([(40, 470), (160, 505)], radius=8, fill='#F1F5F9')
    draw.text((50, 480), "PU • Spandex", fill='#0F172A', font=small_font)
    draw.rounded_rectangle([(175, 470), (305, 505)], radius=8, fill='#F1F5F9')
    draw.text((185, 480), "Cắt Size 35-47", fill='#0284C7', font=small_font)
    draw.rounded_rectangle([(320, 470), (440, 505)], radius=8, fill='#F1F5F9')
    draw.text((330, 480), "Đệm Khí 4D", fill='#10B981', font=small_font)

    # Main Right: Product Details & Variant Selection
    draw.rounded_rectangle([(470, 115), (970, 650)], radius=16, fill='#FFFFFF', outline='#E2E8F0', width=1)
    draw.text((495, 135), "TẤM LÓT GIÀY 4D# (CHÍNH HÃNG)", fill='#0F172A', font=title_font)
    draw.text((495, 172), "Đệm Khí Tổ Ong Kháng Khuẩn Khử Mùi - Siêu Êm Giảm Đau Chân Đi Đứng Cả Ngày", fill='#475569', font=small_font)
    draw.text((495, 195), "⭐ 4.9 (3.840 đánh giá)  |  Đã bán: 28.650+ đôi  |  100% Chính hãng", fill='#F59E0B', font=small_font)

    # Price Box
    draw.rounded_rectangle([(495, 225), (945, 305)], radius=12, fill='#FFF1F2', outline='#FECDD3', width=1)
    draw.text((515, 238), "25.000đ - 50.000đ", fill='#E11D48', font=title_font)
    draw.text((750, 245), "-46% FLASH SALE", fill='#FFFFFF', font=badge_font)
    draw.text((515, 275), "• Lót Nam: 35.000 - 50.000đ (Size: 38-47)   • Lót Nữ: 25.000 - 45.000đ (Size: 35-41)", fill='#475569', font=small_font)

    # Variant Selector
    draw.text((495, 320), "1. CHỌN PHÂN LOẠI:", fill='#0F172A', font=badge_font)
    draw.rounded_rectangle([(495, 342), (710, 395)], radius=10, fill='#FFF1F2', outline='#E11D48', width=2)
    draw.text((510, 350), "Lót Nam - Nâng Cấp Pro 4D", fill='#E11D48', font=body_font)
    draw.text((510, 372), "50.000đ  |  Size 38-47", fill='#64748B', font=small_font)

    draw.rounded_rectangle([(725, 342), (945, 395)], radius=10, fill='#F8FAFC', outline='#CBD5E1', width=1)
    draw.text((740, 350), "Lót Nữ - Nâng Cấp Pro 4D", fill='#0F172A', font=body_font)
    draw.text((740, 372), "45.000đ  |  Size 35-41", fill='#64748B', font=small_font)

    # Size selector
    draw.text((495, 410), "2. CHỌN SIZE GIÀY (VẠCH CẮT LINH HOẠT):", fill='#0F172A', font=badge_font)
    sizes = ["38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]
    for i, sz in enumerate(sizes):
        sx = 495 + i * 45
        draw.rounded_rectangle([(sx, 432), (sx + 38, 467)], radius=6, fill='#E11D48' if sz == "42" else '#F1F5F9', outline='#CBD5E1', width=1)
        draw.text((sx + 10, 442), sz, fill='#FFFFFF' if sz == "42" else '#0F172A', font=small_font)

    # Big CTA Button
    draw.rounded_rectangle([(495, 490), (945, 545)], radius=12, fill='#E11D48')
    draw.text((620, 507), "MUA NGAY - FREESHIP HÔM NAY ➔", fill='#FFFFFF', font=header_font)

    # Quick Checkout info snippet
    draw.rectangle([(495, 565), (945, 630)], fill='#F8FAFC', outline='#E2E8F0', width=1)
    draw.text((515, 575), "⚡ ĐẶT HÀNG NHANH 1-CLICK: Nhập Họ tên + Số điện thoại + Địa chỉ", fill='#0F172A', font=body_font)
    draw.text((515, 600), "✓ Kiểm tra hàng trước khi thanh toán (COD)   ✓ Miễn phí vận chuyển toàn quốc 0đ", fill='#10B981', font=small_font)

    out_path = 'screenshots/ui_mockup_storefront.png'
    img.save(out_path, quality=95)
    print(f"Created {out_path}")

# -------------------------------------------------------------------------
# DIAGRAM 4: ADMIN PANEL MOCKUP
# -------------------------------------------------------------------------
def create_admin_mockup():
    w, h = 1000, 620
    img = Image.new('RGB', (w, h), color='#F8FAFC')
    draw = ImageDraw.Draw(img)

    # Admin Header
    draw.rectangle([(0, 0), (w, 65)], fill='#0F172A')
    draw.rounded_rectangle([(30, 15), (65, 50)], radius=8, fill='#E11D48')
    draw.text((36, 21), "4D#", fill='#FFFFFF', font=badge_font)
    draw.text((80, 20), "HỆ THỐNG QUẢN TRỊ WEBSITE BÁN HÀNG (ADMIN PANEL)", fill='#FFFFFF', font=header_font)
    draw.text((800, 22), "Tài khoản: admin (Administrator)", fill='#94A3B8', font=small_font)

    # 4 KPI Cards
    kpis = [
        ("TỔNG DOANH THU", "1.250.000đ", "Từ đơn đặt hàng trên web", '#E11D48'),
        ("ĐƠN HÀNG MỚI", "18 Đơn", "3 đơn chờ xác nhận", '#0284C7'),
        ("SẢN PHẨM ĐANG BÁN", "1 Sản phẩm", "4 phân loại Nam / Nữ", '#10B981'),
        ("ĐÁNH GIÁ KHÁCH HÀNG", "4.9 ⭐ (3.840)", "100% đánh giá hài lòng", '#F59E0B')
    ]
    for idx, (title, val, note, col) in enumerate(kpis):
        x = 30 + idx * 240
        draw.rounded_rectangle([(x, 80), (x + 225, y_end := 160)], radius=10, fill='#FFFFFF', outline='#E2E8F0', width=1)
        draw.text((x + 15, 92), title, fill='#64748B', font=small_font)
        draw.text((x + 15, 110), val, fill=col, font=header_font)
        draw.text((x + 15, 137), note, fill='#94A3B8', font=small_font)

    # 4 Tabs Bar
    tabs = ["1. Cập Nhật Website & Logo", "2. Quản Lý Sản Phẩm & Media", "3. Quản Lý Đơn Hàng (18)", "4. Quản Lý Đánh Giá"]
    for idx, tab_name in enumerate(tabs):
        tx = 30 + idx * 235
        is_active = (idx == 1 or idx == 2)
        draw.rounded_rectangle([(tx, 175), (tx + 225, 210)], radius=8, fill='#E11D48' if idx == 1 else '#FFFFFF', outline='#E11D48' if idx == 1 else '#CBD5E1', width=1)
        draw.text((tx + 18, 186), tab_name, fill='#FFFFFF' if idx == 1 else '#0F172A', font=badge_font)

    # Tab Content Mockup: Product & Media Management
    draw.rounded_rectangle([(30, 225), (970, 595)], radius=12, fill='#FFFFFF', outline='#E2E8F0', width=1)
    draw.text((50, 245), "CẬP NHẬT THÔNG TIN SẢN PHẨM & MEDIA (HÌNH ẢNH / VIDEO)", fill='#0F172A', font=header_font)
    
    # Form Mockup Lines
    form_fields = [
        ("Tên sản phẩm:", "Tấm lót giày 4D#", "Chất liệu:", "PU, Polyester, Spandex"),
        ("Giá Nam (Size 38-47):", "35.000 - 50.000đ", "Giá Nữ (Size 35-41):", "25.000 - 45.000đ"),
        ("Màu sắc:", "Đa dạng (Đen, Xám, Xanh, Hồng, Vàng)", "Xuất xứ:", "Trung Quốc"),
        ("Hướng dẫn sử dụng:", "Cắt và đặt vào giày theo kích cỡ", "Bảo quản:", "Bảo quản nơi khô ráo"),
        ("Cảnh báo:", "Tránh xa lửa; không sử dụng miếng lót với mục đích khác", "URL Video:", "https://assets.mixkit.co/...mp4")
    ]

    fy = 280
    for l1, v1, l2, v2 in form_fields:
        draw.text((50, fy), l1, fill='#64748B', font=small_font)
        draw.rounded_rectangle([(180, fy - 4), (500, fy + 22)], radius=6, fill='#F8FAFC', outline='#CBD5E1', width=1)
        draw.text((190, fy), v1, fill='#0F172A', font=small_font)

        draw.text((520, fy), l2, fill='#64748B', font=small_font)
        draw.rounded_rectangle([(650, fy - 4), (940, fy + 22)], radius=6, fill='#F8FAFC', outline='#CBD5E1', width=1)
        draw.text((660, fy), v2, fill='#0F172A', font=small_font)
        fy += 36

    # Images Library Strip in Admin
    draw.text((50, 470), "Thư Viện URL Hình Ảnh Sản Phẩm (Xem trước & Xóa 1-click):", fill='#0F172A', font=badge_font)
    for i in range(5):
        ix = 50 + i * 110
        draw.rounded_rectangle([(ix, 495), (ix + 95, 570)], radius=8, fill='#F1F5F9', outline='#CBD5E1', width=1)
        draw.text((ix + 25, 525), f"Ảnh #{i+1}", fill='#64748B', font=small_font)

    # Save button
    draw.rounded_rectangle([(800, 525), (940, 565)], radius=8, fill='#E11D48')
    draw.text((820, 537), "💾 LƯU THAY ĐỔI", fill='#FFFFFF', font=badge_font)

    out_path = 'screenshots/ui_mockup_admin.png'
    img.save(out_path, quality=95)
    print(f"Created {out_path}")

create_specs_diagram()
create_cut_guide_diagram()
create_storefront_mockup()
create_admin_mockup()
print("All diagrams generated successfully.")

