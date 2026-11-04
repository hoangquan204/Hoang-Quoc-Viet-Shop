import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Maximize2, Film, Sparkles, X } from 'lucide-react';

export default function ProductMediaGallery({ product }) {
  const images = product?.images && product.images.length > 0 ? product.images : [
    'https://res.cloudinary.com/dldpfpp5/image/upload/v1793624516/Gemini_Generated_Image_kj8pblkj8pblkj8p_xumnxs.png',
    'https://res.cloudinary.com/dldpfpp5/image/upload/v1793624440/Gemini_Generated_Image_4zqfx94zqfx94zqf_yoqzoi.png',
    'https://res.cloudinary.com/dldpfpp5/image/upload/v1793624486/Gemini_Generated_Image_xtcnzoxtcnzoxtcn_kbwnsr.png',
    'https://res.cloudinary.com/dldpfpp5/image/upload/v1793624504/Gemini_Generated_Image_xt9vc7xt9vc7xt9v_qzw6t8.png'
  ];

  const videoUrl = product?.videoUrl || 'https://res.cloudinary.com/dldpfpp5/video/upload/v1793807108/gemini_generated_video_57c3603f_go37p5.mp4';

  // Build media items list: Video first, then Images
  const mediaItems = [
    { type: 'video', url: videoUrl, title: 'Video Thực Tế Sản Phẩm', thumbnail: images[0] },
    ...images.map((img, idx) => ({ type: 'image', url: img, title: `Ảnh Chi Tiết #${idx + 1}`, thumbnail: img }))
  ];

  const [activeIndex, setActiveIndex] = useState(0); // Mặc định là Video (index 0) khi vừa vào web
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const videoRef = useRef(null);

  const activeMedia = mediaItems[activeIndex] || mediaItems[0];

  // Tự động phát video ngay khi vừa vào trang web không cần click nút play
  useEffect(() => {
    if (activeMedia.type === 'video' && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Trình duyệt chặn tự phát âm thanh -> video vẫn chạy ở chế độ im lặng (muted)
          });
      }
    }
  }, [activeIndex, activeMedia.type]);

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Lock body scroll and register keyboard listeners when lightbox is open
  useEffect(() => {
    if (!isLightboxOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, mediaItems.length]);

  return (
    <div className="flex flex-col gap-3">
      
      {/* Main Display Stage */}
      <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg group">
        
        {/* If Active is Video */}
        {activeMedia.type === 'video' ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              src={activeMedia.url}
              autoPlay
              loop
              muted={isMuted}
              defaultMuted
              playsInline
              preload="auto"
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            {/* Top Bar on Video */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
              <span className="bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                <Film size={12} className="text-rose-400" />
                <span>Video Thực Tế Sản Phẩm</span>
              </span>

              <button
                onClick={toggleMute}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition pointer-events-auto"
                title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
            </div>

            {/* Center Play Button indicator if paused */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl hover:scale-110 transition z-10"
              >
                <Play size={24} className="fill-white ml-1 text-white" />
              </button>
            )}

            {/* Bottom Video Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white z-10">
              <button
                onClick={togglePlay}
                className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg hover:bg-black/80 transition font-medium"
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} className="fill-white" />}
                <span>{isPlaying ? 'Tạm dừng' : 'Xem tiếp'}</span>
              </button>

              <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] text-slate-300">
                Độ nét cao 1080p
              </span>
            </div>
          </div>
        ) : (
          /* If Active is Image */
          <div className="relative w-full h-full bg-white dark:bg-slate-950 flex items-center justify-center">
            <img
              src={activeMedia.url}
              alt={activeMedia.title}
              onClick={() => setIsLightboxOpen(true)}
              className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://res.cloudinary.com/dldpfpp5/image/upload/v1793624516/Gemini_Generated_Image_kj8pblkj8pblkj8p_xumnxs.png';
              }}
            />

            {/* Badge on Image */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} /> Chính Hãng 100%
              </span>
            </div>

            {/* Zoom Button */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-black/70 backdrop-blur-md text-slate-700 dark:text-white flex items-center justify-center shadow hover:scale-110 transition"
              title="Phóng to ảnh"
            >
              <Maximize2 size={14} />
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
              {activeIndex} / {mediaItems.length - 1}
            </div>
          </div>
        )}

        {/* Previous / Next Arrow Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-800 dark:text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-white dark:hover:bg-black"
          title="Xem ảnh trước"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-800 dark:text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-white dark:hover:bg-black"
          title="Xem ảnh kế tiếp"
        >
          <ChevronRight size={18} />
        </button>

      </div>

      {/* DANH SÁCH HÌNH ẢNH & VIDEO SẢN PHẨM (Thumbnails List) */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>Danh Sách Hình Ảnh & Video ({mediaItems.length})</span>
          </span>
          <span className="text-[11px] text-slate-600 dark:text-slate-400">
            Bấm để xem chi tiết
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {mediaItems.map((item, idx) => {
            const isSelected = activeIndex === idx;
            const isVideo = item.type === 'video';

            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                  isSelected
                    ? 'border-rose-600 ring-2 ring-rose-500/30 scale-105 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://res.cloudinary.com/dldpfpp5/image/upload/v1793624516/Gemini_Generated_Image_kj8pblkj8pblkj8p_xumnxs.png';
                  }}
                />

                {isVideo ? (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                    <Play size={18} className="fill-rose-500 text-rose-500" />
                    <span className="text-[9px] font-bold mt-0.5">Video</span>
                  </div>
                ) : (
                  <span className="absolute bottom-1 right-1 bg-black/60 text-[9px] text-white px-1 rounded font-medium">
                    #{idx}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature chips */}
      <div className="grid grid-cols-3 gap-2 mt-1">
        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Chất Liệu</p>
          <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">PU • Spandex</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Đường Cắt Size</p>
          <p className="text-xs font-bold text-sky-600 dark:text-sky-400 mt-0.5">35 - 47 Chuẩn</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Độ Đàn Hồi</p>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Đệm Khí 4D</p>
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal (Rendered directly in document.body via Portal to bypass any stacking context) */}
      {isLightboxOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex flex-col justify-between bg-black/95 backdrop-blur-md p-3 sm:p-6 animate-fade-in select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLightboxOpen(false);
          }}
        >
          {/* Top Bar inside Lightbox */}
          <div className="flex items-center justify-between w-full max-w-6xl mx-auto z-10 py-1">
            <div className="flex items-center gap-3 text-white">
              <span className="font-bold text-sm sm:text-base">
                {activeMedia.title}
              </span>
              <span className="text-xs text-slate-400 bg-white/10 px-2.5 py-1 rounded-full">
                {activeIndex === 0 ? 'Video Sản Phẩm' : `Ảnh ${activeIndex} / ${mediaItems.length - 1}`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-slate-400">
                Nhấn ESC hoặc bấm ra ngoài để đóng
              </span>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-lg active:scale-90"
                title="Đóng (Esc)"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Central Image Viewport with Previous & Next navigation */}
          <div 
            className="flex-1 flex items-center justify-center w-full max-w-6xl mx-auto relative my-2 min-h-0"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsLightboxOpen(false);
            }}
          >
            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-1 sm:left-4 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 shadow-2xl transition hover:scale-110 active:scale-95"
              title="Xem ảnh trước (Phím mũi tên trái)"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Media Content */}
            <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
              {activeMedia.type === 'video' ? (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-w-full max-h-[75vh] rounded-2xl shadow-2xl bg-black"
                />
              ) : (
                <img
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl transition-transform duration-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://res.cloudinary.com/dldpfpp5/image/upload/v1793624516/Gemini_Generated_Image_kj8pblkj8pblkj8p_xumnxs.png';
                  }}
                />
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-1 sm:right-4 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 shadow-2xl transition hover:scale-110 active:scale-95"
              title="Xem ảnh kế tiếp (Phím mũi tên phải)"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="w-full max-w-2xl mx-auto flex items-center justify-center gap-2 overflow-x-auto py-2 z-10 no-scrollbar">
            {mediaItems.map((item, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(idx);
                  }}
                  className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                    isSelected
                      ? 'border-rose-500 ring-2 ring-rose-500 scale-105 shadow-lg'
                      : 'border-white/30 opacity-60 hover:opacity-100 hover:border-white'
                  }`}
                  title={item.title}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-rose-500">
                      <Play size={14} className="fill-current" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
