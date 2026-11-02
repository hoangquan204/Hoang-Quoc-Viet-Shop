import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, Truck, Phone, X } from 'lucide-react';

export default function OrderSuccessModal({ order, onClose, siteInfo }) {
  useEffect(() => {
    if (!order) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [order, onClose]);

  if (!order) return null;

  const hotline = siteInfo?.hotline || '0971.250.891';

  const formatPrice = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num || 0) + 'đ';
  };

  const content = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 dark:bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header with success badge */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-center text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition"
          >
            <X size={16} />
          </button>

          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center mb-3 shadow-inner">
            <CheckCircle size={36} className="text-white" strokeWidth={2.5} />
          </div>

          <h3 className="text-xl sm:text-2xl font-black">ĐẶT HÀNG THÀNH CÔNG!</h3>
          <p className="text-xs text-emerald-100 mt-1">
            Cảm ơn bạn đã lựa chọn Tấm Lót Giày 4D# Chính Hãng!
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Mã đơn hàng chính hãng:</p>
              <p className="text-base font-black text-rose-600 font-mono">{order.id}</p>
            </div>
            <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold">
              Đã ghi nhận
            </span>
          </div>

          {/* Item details */}
          <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Sản phẩm:</span>
              <span className="text-slate-900 dark:text-white font-bold">{order.productName || 'Tấm lót giày 4D#'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Phân loại:</span>
              <span className="text-slate-800 dark:text-slate-200">{order.variantTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Kích thước & Màu:</span>
              <span className="text-slate-900 dark:text-white font-bold">Size {order.size} • Màu {order.color}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Số lượng:</span>
              <span className="text-slate-900 dark:text-white font-bold">{order.quantity} đôi</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-sm">
              <span className="text-slate-900 dark:text-white font-bold">Tổng thanh toán (COD):</span>
              <span className="text-rose-600 dark:text-rose-400 font-black text-base">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Shipping promise */}
          <div className="flex items-start gap-3 bg-sky-50 dark:bg-sky-950/30 p-3 rounded-xl border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300">
            <Truck size={18} className="shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold">Giao hàng toàn quốc</p>
              <p className="text-[11px] text-sky-700 dark:text-sky-400 mt-0.5">
                Nhân viên shop sẽ liên hệ xác nhận đơn qua số điện thoại <strong>{order.customerPhone}</strong> và gửi hàng nhanh.
              </p>
            </div>
          </div>

          {/* Contact shop note */}
          <div className="text-center pt-1 text-slate-500 dark:text-slate-400 text-xs">
            Cần hỗ trợ gấp? Gọi ngay hotline:{' '}
            <a href={`tel:${hotline}`} className="text-rose-600 dark:text-rose-400 font-bold hover:underline">
              {hotline}
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-center">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-2.5 rounded-xl transition"
          >
            Đóng Lại & Tiếp Tục Xem Hàng
          </button>
        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
}
