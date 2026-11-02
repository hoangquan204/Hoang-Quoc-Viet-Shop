import React from 'react';
import { CheckCircle, Truck, Phone, X } from 'lucide-react';

export default function OrderSuccessModal({ order, onClose, siteInfo }) {
  if (!order) return null;

  const hotline = siteInfo?.hotline || '0971.250.891';

  const formatPrice = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num || 0) + 'đ';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-fade-in">
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
              <span className="text-slate-900 dark:text-white font-semibold">Size {order.size} • {order.color}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Số lượng:</span>
              <span className="text-slate-900 dark:text-white font-semibold">{order.quantity} đôi</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Tổng thanh toán:</span>
              <span className="text-lg font-black text-rose-600 dark:text-rose-400">{formatPrice(order.finalAmount || order.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Hình thức:</span>
              <span className="text-slate-900 dark:text-white font-medium">
                {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản VietQR'}
              </span>
            </div>
          </div>

          {/* Shipping to */}
          <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-4">
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">Người nhận hàng:</p>
            <p className="text-slate-900 dark:text-white font-bold">{order.customerName} - {order.phone}</p>
            <p className="text-slate-700 dark:text-slate-300 text-xs">{order.address}, {order.city}</p>
          </div>

          {/* Delivery Note */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
            <Truck size={20} className="text-amber-500 shrink-0" />
            <p className="text-xs">
              Đơn hàng sẽ được đóng gói và giao đến bạn trong <strong className="text-slate-900 dark:text-white">1 - 3 ngày làm việc</strong>. Bạn được kiểm tra hàng trước khi thanh toán.
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-2">
          <a
            href={`tel:${hotline}`}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition border border-slate-200 dark:border-slate-700"
          >
            <Phone size={14} className="text-rose-600" />
            <span>Hotline: {hotline}</span>
          </a>

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow text-center"
          >
            Tiếp Tục Xem Sản Phẩm
          </button>
        </div>

      </div>
    </div>
  );
}
