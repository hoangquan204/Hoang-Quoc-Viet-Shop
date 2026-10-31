import React from 'react';
import { X, Scissors, ShieldCheck, Footprints, Flame } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
              <Scissors size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Hướng Dẫn Cắt & Sử Dụng Tấm Lót Giày 4D#</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Dễ dàng cắt vừa khít mọi loại giày trong 2 phút</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
          
          {/* 4 Steps Walkthrough */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">1</span>
                <span>Rút miếng lót cũ ra</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Tháo miếng lót cũ nguyên bản trong đôi giày của bạn ra ngoài để làm khuôn đo chuẩn xác nhất.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">2</span>
                <span>Ướm đo lên lót 4D#</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Đặt miếng lót cũ lên trên mặt đáy của tấm lót 4D#, căn chỉnh trùng khớp phần gót chân.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">3</span>
                <span>Cắt theo đường viền</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Dùng kéo sắc cắt phần mũi lót 4D# theo đường viền mẫu của lót cũ hoặc theo vạch size in sẵn ở mặt đáy.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">4</span>
                <span>Đặt vào giày & Đi thử</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Đặt tấm lót 4D# vào trong giày sao cho phẳng phiu, mặt vải hướng lên trên và tận hưởng độ êm ái!
              </p>
            </div>

          </div>

          {/* Size Table */}
          <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Footprints size={14} className="text-rose-600 dark:text-sky-400" />
              <span>Bảng Phân Loại Kích Thước (Size Giày)</span>
            </h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    <th className="pb-2">Phân loại</th>
                    <th className="pb-2">Khoảng Size Chuẩn</th>
                    <th className="pb-2">Chiều dài (cm)</th>
                    <th className="pb-2">Giá ưu đãi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  <tr>
                    <td className="py-2.5 font-bold text-sky-700 dark:text-sky-400">Lót Giày Nam</td>
                    <td className="py-2.5 text-slate-900 dark:text-white font-bold">Size 38 - 47</td>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300">24.5cm - 29.5cm</td>
                    <td className="py-2.5 text-rose-600 font-bold">35.000 - 50.000đ</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-pink-700 dark:text-pink-400">Lót Giày Nữ</td>
                    <td className="py-2.5 text-slate-900 dark:text-white font-bold">Size 35 - 41</td>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300">22.5cm - 26.0cm</td>
                    <td className="py-2.5 text-rose-600 font-bold">25.000 - 45.000đ</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 italic">
              * Khuyến cáo: Nếu phân vân giữa 2 size, quý khách nên chọn size lớn hơn một chút rồi dùng kéo cắt tỉa dần cho vừa khít với form mũi giày.
            </p>
          </div>

          {/* Cảnh Báo & Bảo Quản Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 p-3 rounded-xl">
              <h5 className="font-bold text-amber-700 dark:text-amber-400 text-xs flex items-center gap-1.5 mb-1">
                <ShieldCheck size={14} /> Bảo Quản Sản Phẩm
              </h5>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Bảo quản nơi khô ráo, thoáng mát. Có thể giặt nhẹ bằng tay với xà phòng pha loãng và phơi trong bóng râm.
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/30 p-3 rounded-xl">
              <h5 className="font-bold text-red-700 dark:text-red-400 text-xs flex items-center gap-1.5 mb-1">
                <Flame size={14} /> Cảnh Báo An Toàn
              </h5>
              <p className="text-xs text-red-700 dark:text-red-300">
                Tránh xa lửa; không sử dụng miếng lót với mục đích khác. Để xa tầm tay trẻ sơ sinh.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition"
          >
            Đã Hiểu & Đóng Lại
          </button>
        </div>

      </div>
    </div>
  );
}
