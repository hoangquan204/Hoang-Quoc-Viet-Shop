import React from 'react';
import { Zap, Phone } from 'lucide-react';

export default function MobileStickyBar({ onBuyNow, siteInfo }) {
  const hotline = siteInfo?.hotline || '0988.456.789';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-2 sm:hidden shadow-2xl">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        
        {/* Call / Chat Button */}
        <a
          href={`tel:${hotline}`}
          className="flex flex-col items-center justify-center w-14 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 transition active:scale-95 border border-slate-200 dark:border-slate-700"
          title="Gọi tư vấn"
        >
          <Phone size={18} className="text-rose-600" />
          <span className="text-[9px] font-bold mt-0.5">Tư vấn</span>
        </a>

        {/* Add to Cart / Order CTA */}
        <a
          href="#order-form"
          onClick={onBuyNow}
          className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 active:scale-95 transition"
        >
          <Zap size={18} className="fill-white" />
          <div className="text-left leading-tight">
            <span className="block text-xs uppercase tracking-wider">MUA NGAY - FREESHIP</span>
            <span className="block text-[10px] text-yellow-300 font-bold">Giá chỉ từ 25.000đ</span>
          </div>
        </a>

      </div>
    </div>
  );
}
