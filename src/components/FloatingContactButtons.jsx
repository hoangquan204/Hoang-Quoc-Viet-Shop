import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingContactButtons({ siteInfo }) {
  const hotline = siteInfo?.hotline || '0988.456.789';
  const cleanPhone = hotline.replace(/[^0-9]/g, '');
  const zaloNumber = siteInfo?.zalo || cleanPhone || '0988456789';
  const zaloUrl = `https://zalo.me/${zaloNumber}`;

  return (
    <div className="fixed bottom-20 sm:bottom-8 right-3 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      
      {/* 1. ZALO CONTACT BUBBLE */}
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        title="Chat tư vấn qua Zalo"
      >
        {/* Hover Tooltip / Label */}
        <span className="hidden sm:inline-block absolute right-14 bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-bold text-xs py-1.5 px-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Chat Zalo Tư Vấn
        </span>

        {/* Outer Ripple Ping Effect */}
        <span className="absolute inline-flex h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#0068FF]/40 animate-ping opacity-75 pointer-events-none" />

        {/* Main Zalo Bubble */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#0052cc] to-[#0080ff] text-white flex flex-col items-center justify-center shadow-xl shadow-blue-500/30 border-2 border-white dark:border-slate-800 cursor-pointer overflow-hidden">
          {/* Custom Zalo Icon Graphic */}
          <div className="flex flex-col items-center justify-center font-black leading-none">
            <span className="text-[12px] sm:text-[14px] font-black tracking-tight font-sans">Zalo</span>
            <span className="text-[8px] opacity-90 font-medium">Chat</span>
          </div>
        </div>
      </a>

      {/* 2. PHONE CALL CONTACT BUBBLE */}
      <a
        href={`tel:${cleanPhone}`}
        className="group relative flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        title={`Gọi ngay hotline: ${hotline}`}
      >
        {/* Hover Tooltip / Label */}
        <span className="hidden sm:inline-block absolute right-14 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs py-1.5 px-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Gọi Hotline: {hotline}
        </span>

        {/* Outer Ripple Ping Effect */}
        <span className="absolute inline-flex h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-emerald-500/40 animate-ping opacity-75 pointer-events-none" />

        {/* Main Phone Bubble */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 border-2 border-white dark:border-slate-800 cursor-pointer">
          <Phone size={22} className="animate-bounce-subtle" />
        </div>
      </a>

    </div>
  );
}

