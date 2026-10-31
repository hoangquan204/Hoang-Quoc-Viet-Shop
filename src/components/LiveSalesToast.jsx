import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

export default function LiveSalesToast() {
  const sampleNotifications = [
    { name: 'Nguyễn Văn Minh', location: 'Hà Nội', text: 'vừa đặt 2 đôi Lót Giày Nam Pro Đệm Khí 4D', time: '1 phút trước' },
    { name: 'Trần Thị Thu Thảo', location: 'TP. Hồ Chí Minh', text: 'vừa đặt 1 đôi Lót Giày Nữ Siêu Êm 4D', time: '3 phút trước' },
    { name: 'Lê Hoàng Nam', location: 'Đà Nẵng', text: 'vừa đặt Combo 2 đôi Lót Nam Size 42', time: 'Vừa xong' },
    { name: 'Phạm Thu Trang', location: 'Hải Phòng', text: 'vừa đặt 2 đôi Lót Giày Nữ Hồng Sakura', time: '4 phút trước' },
    { name: 'Vũ Quốc Bảo', location: 'Cần Thơ', text: 'vừa đặt 1 đôi Lót Nam Size 43', time: '2 phút trước' }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showInterval = setInterval(() => {
      setIsVisible(true);
      setCurrentIdx(prev => (prev + 1) % sampleNotifications.length);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 12000);

    const initialTimer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
    }, 3000);

    return () => {
      clearInterval(showInterval);
      clearTimeout(initialTimer);
    };
  }, []);

  if (!isVisible) return null;

  const notif = sampleNotifications[currentIdx];

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 z-40 max-w-sm animate-bounce-subtle pointer-events-none">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white shrink-0 shadow">
          <ShoppingBag size={18} />
        </div>
        <div className="text-xs">
          <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>{notif.name}</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-normal">({notif.location})</span>
          </p>
          <p className="text-slate-700 dark:text-slate-300 line-clamp-1">
            {notif.text}
          </p>
          <span className="text-[10px] text-rose-600 dark:text-sky-400 font-semibold">{notif.time}</span>
        </div>
      </div>
    </div>
  );
}
