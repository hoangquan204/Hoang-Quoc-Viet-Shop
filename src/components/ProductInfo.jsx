import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Flame, Clock, Ticket, Check, Scissors, AlertTriangle, Info, ChevronRight } from 'lucide-react';

export default function ProductInfo({ 
  product, 
  selectedVariant, 
  setSelectedVariant, 
  selectedSize, 
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  quantity,
  setQuantity,
  onOpenSizeGuide,
  onBuyNow
}) {
  // Countdown Timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const variants = product?.variants || [];
  const currentVariant = selectedVariant || variants[0] || {};

  // Available sizes and colors for current variant
  const currentSizes = currentVariant.sizes || (currentVariant.gender === 'Nam' 
    ? ['38', '39', '40', '41', '42', '43', '44', '45', '46', '47'] 
    : ['35', '36', '37', '38', '39', '40', '41']);

  const currentColors = currentVariant.colors || ['Đen', 'Xám', 'Xanh Rêu'];

  const formatPrice = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num || 0) + 'đ';
  };

  const discountPercent = currentVariant.originalPrice 
    ? Math.round((1 - (currentVariant.price / currentVariant.originalPrice)) * 100) 
    : 45;

  return (
    <div className="flex flex-col gap-5 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
      
      {/* Product Title & Badge */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1">
            <Flame size={12} className="fill-white" /> SIÊU SALE HÔM NAY
          </span>
          <span className="bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[11px] font-bold px-2 py-0.5 rounded">
            Top #1 Bán Chạy Phụ Kiện Giày
          </span>
          <span className="text-slate-600 dark:text-slate-400 text-xs">Mã SP: 4D-INSOLE-2026</span>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
          {product?.name || 'Tấm lót giày 4D#'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
          {product?.tagline || 'Đệm Khí Tổ Ong Kháng Khuẩn Khử Mùi - Siêu Êm Giảm Đau Chân Đi Đứng Cả Ngày'}
        </p>

        {/* Rating and Sold Count */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm">
          <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
            <span>{product?.rating || 4.9}</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-current" />
              ))}
            </div>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-600 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white">{(product?.reviewCount || 3840).toLocaleString()}</strong> Đánh giá
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-600 dark:text-slate-300">
            <strong className="text-rose-600 dark:text-rose-400">{(product?.soldCount || 28650).toLocaleString()}+</strong> Đã bán
          </span>
        </div>
      </div>

      {/* Flash Sale Banner & Price Box */}
      <div className="bg-rose-50/70 dark:bg-slate-950/60 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-500 tracking-tight">
                {formatPrice(currentVariant.price || 35000)}
              </span>
              {currentVariant.originalPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(currentVariant.originalPrice)}
                </span>
              )}
              <span className="bg-rose-600 text-white text-[11px] font-black px-1.5 py-0.5 rounded">
                -{discountPercent}%
              </span>
            </div>
            
            {/* Price Ranges Note from Customer Request */}
            <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 flex flex-col gap-0.5">
              <div>
                <span className="font-bold text-sky-700 dark:text-sky-400">Lót giày nam:</span> 35.000 - 50.000đ (Size: 38-47)
              </div>
              <div>
                <span className="font-bold text-rose-700 dark:text-rose-300">Lót giày nữ:</span> 25.000 - 45.000đ (Size: 35-41)
              </div>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900 border border-rose-200 dark:border-slate-800 px-3 py-2 rounded-xl shadow-sm">
            <Clock size={16} className="text-rose-600 animate-pulse" />
            <div className="text-right">
              <p className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-bold tracking-wider">Ưu đãi kết thúc sau</p>
              <div className="flex items-center gap-1 text-xs font-mono font-black text-slate-900 dark:text-white">
                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>:
                <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>:
                <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sold progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
            <span className="font-semibold text-rose-600 dark:text-rose-400">🔥 Đang bán rất chạy hôm nay</span>
            <span>Đã bán 89%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-rose-600 h-full rounded-full w-[89%]" />
          </div>
        </div>
      </div>

      {/* Vouchers & FreeShip */}
      <div className="bg-slate-50 dark:bg-slate-950/80 rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
          <Ticket size={14} />
          <span>Voucher Ưu Đãi:</span>
        </div>
        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded font-bold">
          Miễn Phí Vận Chuyển 0đ
        </span>
        <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded font-bold">
          Giảm 10K Đơn từ 45K
        </span>
        <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded font-bold">
          Giảm 20K Đơn từ 90K
        </span>
      </div>

      {/* VARIANT SELECTION */}
      <div className="flex flex-col gap-4 pt-1">
        
        {/* Step 1: Chọn Phiên Bản / Phân loại (Nam/Nữ, Tiêu chuẩn/Pro) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              1. Chọn Phân Loại Sản Phẩm:
            </label>
            <span className="text-xs font-bold text-rose-600">
              {currentVariant.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {variants.map(v => {
              const isSelected = v.id === currentVariant.id;
              const isMale = v.gender === 'Nam';

              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVariant(v);
                    if (v.sizes && v.sizes.length > 0) {
                      setSelectedSize(v.sizes[0]);
                    }
                    if (v.colors && v.colors.length > 0) {
                      setSelectedColor(v.colors[0]);
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 shadow-md ring-1 ring-rose-500'
                      : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mb-1 ${
                        isMale 
                          ? 'bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800' 
                          : 'bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-800'
                      }`}>
                        {v.gender} • Size {isMale ? '38-47' : '35-41'}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {v.name}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {v.description}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                      {formatPrice(v.price)}
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">
                      Kho: {v.inStock || 999}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Chọn Kích Cỡ (Size) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              2. Kích cỡ (Size giày):
            </label>
            <button
              onClick={onOpenSizeGuide}
              className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Scissors size={12} />
              <span>Hướng dẫn cắt size vừa giày</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentSizes.map(size => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-11 h-10 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                    isSelected
                      ? 'bg-rose-600 text-white font-black shadow-md scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 flex items-center gap-1">
            <Info size={12} className="text-sky-500" />
            <span>Mặt dưới có sẵn vạch chia size chuẩn. Có thể dùng kéo tự cắt chỉnh theo form giày!</span>
          </p>
        </div>

        {/* Step 3: Chọn Màu Sắc */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            3. Màu sắc: <span className="text-rose-600 normal-case font-bold">{selectedColor}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {currentColors.map(color => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-50 dark:bg-slate-800 text-rose-700 dark:text-white border-rose-500 ring-1 ring-rose-500'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full border border-slate-400 ${
                    color.includes('Đen') ? 'bg-slate-950' :
                    color.includes('Hồng') ? 'bg-pink-400' :
                    color.includes('Xám') ? 'bg-slate-400' :
                    color.includes('Xanh') ? 'bg-emerald-600' :
                    color.includes('Vàng') ? 'bg-amber-400' :
                    color.includes('Be') ? 'bg-amber-100' : 'bg-slate-500'
                  }`} />
                  <span>{color}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Số lượng & Nút Mua */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Số lượng:
            </label>
            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center text-slate-700 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 rounded-l-xl transition"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-black text-slate-900 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center text-slate-700 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 rounded-r-xl transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Call-to-action button */}
          <div className="flex-1 flex gap-2">
            <a
              href="#order-form"
              onClick={onBuyNow}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3 px-6 rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 text-sm sm:text-base transition transform active:scale-98"
            >
              <span>MUA NGAY - FREESHIP HÔM NAY</span>
              <ChevronRight size={18} />
            </a>
          </div>
        </div>

      </div>

      {/* DETAILED SPECIFICATIONS ACCORDING TO USER PROMPT */}
      <div className="mt-3 pt-5 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Info size={16} className="text-sky-600 dark:text-sky-400" />
          <span>Thông Số Kỹ Thuật Chi Tiết (Chính Hãng)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Tên sản phẩm:</span>
            <span className="text-slate-900 dark:text-white font-bold text-right">{product?.name || 'Tấm lót giày 4D#'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Chất liệu:</span>
            <span className="text-slate-900 dark:text-white font-bold text-right">{product?.material || 'PU, Polyester, Spandex'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Lót giày Nam:</span>
            <span className="text-sky-600 dark:text-sky-400 font-bold text-right">{product?.malePriceRange || '35.000 - 50.000 (Size: 38-47)'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Lót giày Nữ:</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold text-right">{product?.femalePriceRange || '25.000 - 45.000 (Size: 35-41)'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Màu sắc:</span>
            <span className="text-slate-900 dark:text-white font-bold text-right">{product?.colors || 'Đa dạng'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Xuất xứ:</span>
            <span className="text-slate-900 dark:text-white font-bold text-right">{product?.origin || 'Trung Quốc'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Bảo quản:</span>
            <span className="text-slate-900 dark:text-white font-bold text-right">{product?.storage || 'Bảo quản nơi khô ráo'}</span>
          </div>

          <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-200 dark:border-red-900/60 flex justify-between">
            <span className="text-red-700 dark:text-red-400 font-medium flex items-center gap-1">
              <AlertTriangle size={12} className="text-red-500" /> Cảnh báo:
            </span>
            <span className="text-red-700 dark:text-red-300 font-bold text-right">{product?.warning || 'Tránh xa lửa; không sử dụng miếng lót với mục đích khác.'}</span>
          </div>
        </div>

        {/* Hướng Dẫn Sử Dụng Box */}
        <div className="mt-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
          <p className="text-xs text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white">Hướng dẫn sử dụng:</strong> {product?.instructions || 'Cắt và đặt vào giày theo kích cỡ.'}
          </p>
        </div>
      </div>

    </div>
  );
}
