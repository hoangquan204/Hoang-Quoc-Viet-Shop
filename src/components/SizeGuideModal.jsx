import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Scissors, ShieldCheck, Footprints, Flame } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 dark:bg-black/85 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
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
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">2</span>
                <span>Áp vào lót giày 4D#</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Đặt miếng lót cũ đè lên mặt sau của miếng lót giày 4D#, căn gót cho bằng nhau.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">3</span>
                <span>Cắt theo vạch size định hình</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Dùng kéo cắt tỉa theo đường viền của lót cũ hoặc theo các đường rãnh vạch sẵn tương ứng với size giày của bạn.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">4</span>
                <span>Lắp vào giày & tận hưởng</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Cho miếng lót 4D# mới vào trong giày, căn chỉnh phẳng phiu và trải nghiệm cảm giác êm ái đàn hồi suốt cả ngày.
              </p>
            </div>

          </div>

          {/* Size Chart Comparison */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-2 flex items-center gap-2">
              <Footprints size={16} className="text-rose-500" />
              <span>Bảng Đo Size Tiêu Chuẩn (Chiều dài bàn chân)</span>
            </h4>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-center text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="py-2 px-3 text-left">Phân Loại</th>
                    <th className="py-2 px-2">Size EUR</th>
                    <th className="py-2 px-2">Chiều dài (cm)</th>
                    <th className="py-2 px-2">Phạm vi cắt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3 text-left font-bold text-rose-600">Nữ (Women)</td>
                    <td className="py-2 px-2 font-bold">35 – 41</td>
                    <td className="py-2 px-2">22.5 – 25.5 cm</td>
                    <td className="py-2 px-2 text-emerald-600 font-semibold">Tự do cắt theo vạch</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3 text-left font-bold text-sky-600">Nam (Men)</td>
                    <td className="py-2 px-2 font-bold">38 – 47</td>
                    <td className="py-2 px-2">24.0 – 29.5 cm</td>
                    <td className="py-2 px-2 text-emerald-600 font-semibold">Tự do cắt theo vạch</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
              * Lời khuyên: Nếu lỡ giữa 2 size, bạn nên chọn mua size lớn hơn để dễ dàng cắt bớt viền mũi cho vừa in đôi giày của mình.
            </p>
          </div>

          {/* Safety & Care Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 p-3 rounded-xl">
              <h5 className="font-bold text-amber-800 dark:text-amber-400 text-xs flex items-center gap-1.5 mb-1">
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

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
}
