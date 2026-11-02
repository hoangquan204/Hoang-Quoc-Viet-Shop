export const initialData = {
  siteInfo: {
    siteName: "Hoàng Quốc Việt Shop",
    mobileSiteName: "HQV Shop",
    tagline: "Lót Giày Chất Lượng - Siêu Êm Giảm Đau Mỏi Chân",
    logoUrl: "https://res.cloudinary.com/dldpfpp5/image/upload/v1793622192/Ho%C3%A0ng_Qu%E1%BB%91c_Vi%E1%BB%87t_Shop_L%C3%B3t_Gi%C3%A0y_Ch%E1%BA%A5t_L%C6%B0%E1%BB%A3ng_m63azn.png",
    announcement: "🔥 SIÊU SALE HÔM NAY: GIẢM ĐẾN 50% + MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC CHO ĐƠN TỪ 50K! ĐẶT HÀNG NHẬN QUÀ NGAY",
    hotline: "0988.456.789",
    zalo: "0988456789",
    address: "Hoàng Quốc Việt Shop - Tổng Kho Phụ Kiện Giày - Hà Nội & TP. Hồ Chí Minh",
    guaranteeText: "Cam kết chính hãng 100% • Đổi trả 7 ngày miễn phí • Kiểm tra hàng trước khi thanh toán",
    vouchers: [
      { id: "v1", code: "FREESHIP50K", name: "Freeship Toàn Quốc", desc: "Miễn phí vận chuyển toàn quốc cho đơn từ 50k", discount: 25000, minSpend: 50000, type: "freeship" },
      { id: "v2", code: "SALE10K", name: "Voucher Giảm 10K", desc: "Giảm ngay 10.000đ cho đơn từ 45.000đ", discount: 10000, minSpend: 45000, type: "cash" },
      { id: "v3", code: "SALE20K", name: "Voucher Giảm 20K", desc: "Giảm ngay 20.000đ cho đơn từ 90.000đ", discount: 20000, minSpend: 90000, type: "cash" }
    ]
  },
  products: [
    {
      id: "lot-giay-4d",
      name: "Tấm lót giày 4D#",
      tagline: "Đệm Khí Tổ Ong Kháng Khuẩn Khử Mùi - Siêu Êm Giảm Đau Chân Đi Đứng Cả Ngày",
      brand: "4D Insole Official",
      rating: 4.9,
      reviewCount: 3840,
      soldCount: 28650,
      category: "Phụ kiện giày dép",
      material: "PU, Polyester, Spandex",
      instructions: "Cắt và đặt vào giày theo kích cỡ. Mặt dưới của miếng lót có in sẵn các đường vạch chuẩn theo từng size giày (Nam từ 38 đến 47, Nữ từ 35 đến 41). Quý khách có thể rút lót giày cũ của mình ra để ướm đo hoặc dùng kéo cắt trực tiếp theo đường rãnh size phù hợp.",
      storage: "Bảo quản nơi khô ráo, thoáng mát. Tránh ngâm nước nóng hoặc phơi trực tiếp dưới ánh nắng gay gắt quá lâu để đảm bảo tuổi thọ đàn hồi của đệm PU.",
      colors: "Đa dạng (Đen cá tính, Xám thể thao, Xanh rêu năng động, Cam nhiệt huyết, Hồng pastel)",
      warning: "Tránh xa lửa; không sử dụng miếng lót với mục đích khác.",
      origin: "Trung Quốc",
      malePriceRange: "35.000 - 50.000 (Size: 38-47)",
      femalePriceRange: "25.000 - 45.000 (Size: 35-41)",
      images: [
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1000&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1000&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1000&auto=format&fit=crop&q=80"
      ],
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-athlete-putting-on-his-running-shoes-42999-large.mp4",
      highlights: [
        "Công nghệ đàn hồi 4D phân tán lực tác động, êm gấp 3 lần lót thông thường",
        "Chất liệu PU non nguyên khối không lo bị xẹp lún sau thời gian dài sử dụng",
        "Bề mặt vải Polyester pha Spandex dệt lỗ thoáng khí tổ ong, thấm hút mồ hôi, ngăn mùi khó chịu",
        "Thiết kế công thái học ôm sát hõm chân (Arch Support), nâng đỡ vòm bàn chân chống mỏi",
        "Mặt đáy có sẵn đường vạch cắt linh hoạt từ size 35 đến 47, dễ dàng vừa vặn mọi đôi giày"
      ],
      variants: [
        {
          id: "nam-tieuchuan",
          gender: "Nam",
          name: "Lót Giày Nam - Bản Tiêu Chuẩn 4D",
          price: 35000,
          originalPrice: 65000,
          sizes: ["38", "39", "40", "41", "42", "43", "44", "45", "46", "47"],
          colors: ["Đen Cá Tính", "Xám Thể Thao", "Xanh Rêu"],
          description: "Êm ái hàng ngày, giảm đau gót chân, vạch cắt từ size 38 đến 47",
          inStock: 999
        },
        {
          id: "nam-pro",
          gender: "Nam",
          name: "Lót Giày Nam - Bản Nâng Cấp Pro Đệm Khí 4D",
          price: 50000,
          originalPrice: 95000,
          sizes: ["38", "39", "40", "41", "42", "43", "44", "45", "46", "47"],
          colors: ["Đen Pro", "Vàng Thể Thao Sport", "Xanh Navy Năng Động"],
          description: "Đệm khí tổ ong cao cấp trợ lực gót + U-Cup ôm sát gót chân chống lật cổ chân khi chạy bộ",
          inStock: 820
        },
        {
          id: "nu-tieuchuan",
          gender: "Nữ",
          name: "Lót Giày Nữ - Bản Tiêu Chuẩn 4D",
          price: 25000,
          originalPrice: 50000,
          sizes: ["35", "36", "37", "38", "39", "40", "41"],
          colors: ["Hồng Pastel", "Đen", "Be Tự Nhiên"],
          description: "Mềm mại như dẫm trên mây, chống thốn gót, vừa vặn giày sneaker & búp bê",
          inStock: 950
        },
        {
          id: "nu-pro",
          gender: "Nữ",
          name: "Lót Giày Nữ - Bản Nâng Cấp Pro Siêu Êm 4D",
          price: 45000,
          originalPrice: 85000,
          sizes: ["35", "36", "37", "38", "39", "40", "41"],
          colors: ["Hồng Sakura", "Tím Lavender", "Đen Tuyền"],
          description: "Chất liệu PU Foam đàn hồi chậm + Đệm massage vòm bàn chân, đi bộ 10.000 bước không mỏi",
          inStock: 760
        }
      ]
    }
  ],
  reviews: [
    {
      id: "rev-1",
      productId: "lot-giay-4d",
      userName: "hoang_minh_sneaker",
      rating: 5,
      date: "2026-10-28",
      variantPurchased: "Nam - Bản Nâng Cấp Pro - Size 42 - Đen Pro",
      verified: true,
      comment: "Lót giày siêu êm luôn mn ơi! Mình đi bộ và chạy bộ hàng ngày chân bị đau gót kinh khủng, thay cái lót zin của đôi Nike bằng tấm lót 4D này xong êm như dẫm trên đệm mút. Cắt theo size 42 rất dễ, vừa khít. Giao hàng cực nhanh, đóng gói cẩn thận!",
      images: [
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80"
      ],
      likes: 124,
      shopReply: "Dạ Shop cảm ơn anh Minh rất nhiều ạ! Chúc anh luôn có những bước chân êm ái và thoải mái nhất với Tấm lót giày 4D#!"
    },
    {
      id: "rev-2",
      productId: "lot-giay-4d",
      userName: "ngoc_anh_98",
      rating: 5,
      date: "2026-10-29",
      variantPurchased: "Nữ - Bản Nâng Cấp Pro - Size 37 - Hồng Sakura",
      verified: true,
      comment: "Xịn xò lắm nha! Màu hồng xinh xỉu, chất PU đàn hồi tốt ấn vào nảy lên ngay. Mình mang đi làm đứng quầy cả ngày 8 tiếng mà chân không bị mỏi hay tê như trước nữa. Giá rẻ hơn cả cốc trà sữa mà mang bền.",
      images: [
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&auto=format&fit=crop&q=80"
      ],
      likes: 89,
      shopReply: "Cảm ơn chị Ngọc Ánh đã tin tưởng ủng hộ shop! Đứng cả ngày chị nhớ tháo lót để nơi khô ráo để lót luôn thông thoáng nhé ạ."
    },
    {
      id: "rev-3",
      productId: "lot-giay-4d",
      userName: "tran_thanh_tuan",
      rating: 5,
      date: "2026-10-30",
      variantPurchased: "Nam - Bản Tiêu Chuẩn 4D - Size 41 - Xám Thể Thao",
      verified: true,
      comment: "Đúng mô tả: PU, Polyester, Spandex chuẩn đét. Dưới có vạch chia size chuẩn, cắt bén ngọt không bị tưa mép. Hàng đóng gói cẩn thận, có tem bảo hành chính hãng 100%. Đã đặt thêm 3 đôi cho cả nhà.",
      images: [],
      likes: 47,
      shopReply: "Shop chân thành cảm ơn anh Tuấn! Sự hài lòng của anh là động lực to lớn cho shop phát triển hơn nữa ạ."
    },
    {
      id: "rev-4",
      productId: "lot-giay-4d",
      userName: "phuong_thao_lee",
      rating: 5,
      date: "2026-10-31",
      variantPurchased: "Nữ - Bản Tiêu Chuẩn 4D - Size 36 - Be Tự Nhiên",
      verified: true,
      comment: "Rất êm chân, không có mùi cao su nồng, vải lưới bên trên thấm hút mồ hôi tốt chân không bị trơn trượt khi mang tất lười. Giá 25k quá hời so với chất lượng!",
      images: [],
      likes: 35,
      shopReply: "Cảm ơn bạn Phương Thảo nhiều nè! Rất vui vì bạn ưng ý sản phẩm."
    }
  ],
  orders: [
    {
      id: "ORD-8921",
      customerName: "Nguyễn Văn Hùng",
      phone: "0912345678",
      address: "Số 45 Ngõ 120 Hoàng Quốc Việt, Cầu Giấy",
      city: "Hà Nội",
      productName: "Tấm lót giày 4D#",
      variantTitle: "Lót Giày Nam - Bản Nâng Cấp Pro Đệm Khí 4D",
      gender: "Nam",
      size: "42",
      color: "Đen Pro",
      quantity: 2,
      unitPrice: 50000,
      totalAmount: 100000,
      discountAmount: 25000,
      finalAmount: 75000,
      paymentMethod: "COD",
      notes: "Giao giờ hành chính giúp em nhé shop",
      status: "Chờ xác nhận",
      createdAt: "2026-10-31 16:45:00"
    },
    {
      id: "ORD-8920",
      customerName: "Trần Thị Mai Lan",
      phone: "0987654321",
      address: "Căn hộ B12 Chung cư Sunrise City, Quận 7",
      city: "TP. Hồ Chí Minh",
      productName: "Tấm lót giày 4D#",
      variantTitle: "Lót Giày Nữ - Bản Nâng Cấp Pro Siêu Êm 4D",
      gender: "Nữ",
      size: "37",
      color: "Hồng Sakura",
      quantity: 1,
      unitPrice: 45000,
      totalAmount: 45000,
      discountAmount: 10000,
      finalAmount: 35000,
      paymentMethod: "COD",
      notes: "Gọi trước khi giao 15 phút",
      status: "Đang giao hàng",
      createdAt: "2026-10-31 14:20:00"
    }
  ]
};
