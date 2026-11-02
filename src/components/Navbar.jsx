import React from 'react';
import { Phone, ShoppingBag, Sun, Moon } from 'lucide-react';

export default function Navbar({ siteInfo, onOpenAdmin, currentView, setCurrentView, theme, toggleTheme }) {
  const info = siteInfo || {
    siteName: 'Hoàng Quốc Việt Shop',
    mobileSiteName: 'HQV Shop',
    announcement: '✨ HOÀNG QUỐC VIỆT SHOP • PHÂN PHỐI TẤM LÓT GIÀY 4D# CHÍNH HÃNG • GIAO HÀNG TOÀN QUỐC • KIỂM TRA HÀNG KHI NHẬN',
    hotline: '0971.250.891',
    logoUrl: 'https://res.cloudinary.com/dldpfpp5/image/upload/v1793622192/Ho%C3%A0ng_Qu%E1%BB%91c_Vi%E1%BB%87t_Shop_L%C3%B3t_Gi%C3%A0y_Ch%E1%BA%A5t_L%C6%B0%E1%BB%A3ng_m63azn.png'
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-sky-600 text-white text-xs font-semibold py-1.5 px-3 overflow-hidden shadow-inner">
        <div className="flex items-center space-x-3 whitespace-nowrap animate-marquee">
          <span>{info.announcement}</span>
          <span className="mx-4 text-yellow-300">★ ★ ★ ★ ★</span>
          <span>{info.announcement}</span>
          <span className="mx-4 text-yellow-300">★ ★ ★ ★ ★</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Logo & Brand Name */}
          <div 
            onClick={() => setCurrentView('shop')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group"
          >
            <div className="shrink-0 flex items-center justify-center">
              {info.logoUrl ? (
                <img 
                  src={info.logoUrl} 
                  alt={info.siteName || 'Hoàng Quốc Việt Shop'} 
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://res.cloudinary.com/dldpfpp5/image/upload/v1793622192/Ho%C3%A0ng_Qu%E1%BB%91c_Vi%E1%BB%87t_Shop_L%C3%B3t_Gi%C3%A0y_Ch%E1%BA%A5t_L%C6%B0%E1%BB%A3ng_m63azn.png';
                  }}
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-base shadow-md">
                  HQV
                </div>
              )}
            </div>

            <div>
              {/* Hiển thị trên màn hình mobile: HQV Shop */}
              <span className="sm:hidden text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                {info.mobileSiteName || (info.siteName?.includes('Hoàng Quốc Việt') ? 'HQV Shop' : info.siteName)}
              </span>
              {/* Hiển thị trên màn hình desktop: Hoàng Quốc Việt Shop */}
              <span className="hidden sm:inline text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors line-clamp-1">
                {info.siteName || 'Hoàng Quốc Việt Shop'}
              </span>
            </div>
          </div>

          {/* Right Actions: Hotline, Sleek Sun/Moon Toggle, Order Button */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Hotline Link */}
            {info.hotline && (
              <a
                href={`tel:${info.hotline}`}
                className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 transition"
                title="Gọi hotline tư vấn"
              >
                <Phone size={14} className="text-rose-500" />
                <span>{info.hotline}</span>
              </a>
            )}

            {/* NEAT & SLEEK SUN / MOON TOGGLE SWITCH */}
            <button
              onClick={toggleTheme}
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 transition-colors duration-200 ease-in-out focus:outline-none shadow-inner"
              title={theme === 'dark' ? 'Chuyển sang chế độ Sáng (Light Mode)' : 'Chuyển sang chế độ Tối (Dark Mode)'}
            >
              <span className="sr-only">Chuyển đổi giao diện sáng tối</span>
              
              {/* Background Sun icon on left */}
              <span className="absolute left-1.5 text-amber-500 pointer-events-none flex items-center justify-center">
                <Sun size={13} strokeWidth={2.5} />
              </span>

              {/* Background Moon icon on right */}
              <span className="absolute right-1.5 text-slate-400 dark:text-slate-400 pointer-events-none flex items-center justify-center">
                <Moon size={13} strokeWidth={2.5} />
              </span>

              {/* Sliding Knob */}
              <span
                className={`${
                  theme === 'dark'
                    ? 'translate-x-[26px] bg-slate-900 text-sky-300 shadow-slate-950/50'
                    : 'translate-x-[3px] bg-white text-amber-500 shadow-slate-400/30'
                } pointer-events-none inline-flex h-6 w-6 transform items-center justify-center rounded-full shadow-md ring-0 transition duration-200 ease-in-out`}
              >
                {theme === 'dark' ? (
                  <Moon size={12} className="fill-current" />
                ) : (
                  <Sun size={12} className="fill-current" />
                )}
              </span>
            </button>

            {/* If currently viewing admin, show Back to Shop button */}
            {currentView === 'admin' && (
              <button
                onClick={() => setCurrentView('shop')}
                className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 transition shadow-sm"
              >
                <ShoppingBag size={14} />
                <span>Xem Website</span>
              </button>
            )}

            {/* Quick Order Button */}
            {currentView === 'shop' && (
              <a
                href="#order-form"
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl shadow-md active:scale-95 transition"
              >
                <ShoppingBag size={15} />
                <span>Đặt Mua Ngay</span>
              </a>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
