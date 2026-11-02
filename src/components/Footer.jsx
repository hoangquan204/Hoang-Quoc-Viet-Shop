import React from 'react';
import { ShieldCheck, RotateCcw, Truck, Lock, Phone, MapPin } from 'lucide-react';

export default function Footer({ siteInfo, onOpenAdmin }) {
  const info = siteInfo || {
    siteName: 'Hoàng Quốc Việt Shop',
    hotline: '0988.456.789',
    address: 'Hoàng Quốc Việt Shop - Tổng Kho Phụ Kiện Giày - Hà Nội & TP. Hồ Chí Minh',
    logoUrl: 'https://res.cloudinary.com/dldpfpp5/image/upload/v1793622192/Ho%C3%A0ng_Qu%E1%BB%91c_Vi%E1%BB%87t_Shop_L%C3%B3t_Gi%C3%A0y_Ch%E1%BA%A5t_L%C6%B0%E1%BB%A3ng_m63azn.png'
  };

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs pt-12 pb-24 sm:pb-12 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-rose-600 shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">100% CHÍNH HÃNG</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Đệm khí 4D đàn hồi cao</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-sky-600 shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">GIAO HỎA TỐC</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Miễn phí ship toàn quốc</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-amber-500 shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
              <RotateCcw size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">ĐỔI TRẢ 7 NGÀY</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Miễn phí nếu lỗi sản phẩm</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-600 shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
              <Phone size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">TƯ VẤN 24/7</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Hotline: {info.hotline}</p>
            </div>
          </div>
        </div>

        {/* Footer Main Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-b border-slate-200 dark:border-slate-800">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {info.logoUrl ? (
                <img 
                  src={info.logoUrl} 
                  alt={info.siteName || 'Hoàng Quốc Việt Shop'} 
                  className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-0.5 shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://res.cloudinary.com/dldpfpp5/image/upload/v1793622192/Ho%C3%A0ng_Qu%E1%BB%91c_Vi%E1%BB%87t_Shop_L%C3%B3t_Gi%C3%A0y_Ch%E1%BA%A5t_L%C6%B0%E1%BB%A3ng_m63azn.png';
                  }}
                />
              ) : (
                <span className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center font-black text-white text-xs shadow-sm">
                  HQV
                </span>
              )}
              <span className="text-sm font-black text-slate-900 dark:text-white">{info.siteName}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Gian hàng chính hãng phân phối tấm lót giày 4D# công thái học cao cấp với chất liệu PU đàn hồi, sợi Spandex và vải lưới Polyester thoáng khí, khử mùi hôi chân.
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin size={13} className="text-rose-500 shrink-0" />
              <span>{info.address}</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Chính Sách & Cam Kết
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>• Kiểm tra hàng thoải mái trước khi thanh toán tiền (Đồng kiểm)</li>
              <li>• Bảo hành độ đàn hồi đệm khí 4D không xẹp lún</li>
              <li>• Hướng dẫn đo cắt size tỉ mỉ vừa form giày 100%</li>
              <li>• Bảo mật tuyệt đối thông tin cá nhân khách hàng</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">
              Kênh Bán Hàng & Quản Trị
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
              Kênh phân phối chính hãng toàn quốc. Dành cho ban quản trị và đối tác:
            </p>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-rose-600 dark:hover:bg-rose-600 text-slate-700 dark:text-slate-300 hover:text-white px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-rose-600 transition text-xs font-bold shadow-sm"
            >
              <Lock size={13} />
              <span>Đăng Nhập Trang Admin</span>
            </button>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600 dark:text-slate-400">
          <p>© 2026 {info.siteName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Official E-Commerce Store</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
