import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Star, ThumbsUp, CheckCircle, MessageSquare, Plus } from 'lucide-react';
import { api } from '../services/api';

export default function ReviewsSection({ reviews, productId, onReviewAdded }) {
  const [filter, setFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 5,
    variantPurchased: 'Nam - Bản Nâng Cấp Pro - Size 42',
    comment: '',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!showAddModal) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowAddModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAddModal]);

  const filterOptions = [
    { id: 'ALL', label: `Tất cả (${reviews.length})` },
    { id: 'WITH_IMAGE', label: 'Có hình ảnh' },
    { id: '5_STAR', label: '5 Sao (Cực tốt)' },
    { id: '4_STAR', label: '4 Sao (Hài lòng)' }
  ];

  const filteredReviews = reviews.filter(rev => {
    if (filter === 'WITH_IMAGE') return rev.images && rev.images.length > 0;
    if (filter === '5_STAR') return rev.rating === 5;
    if (filter === '4_STAR') return rev.rating === 4;
    return true;
  });

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview.userName.trim() || !newReview.comment.trim()) {
      alert('Vui lòng nhập tên và nội dung đánh giá!');
      return;
    }

    setIsSubmitting(true);
    const reviewPayload = {
      productId: productId || 'lot-giay-4d',
      userName: newReview.userName.trim(),
      rating: Number(newReview.rating),
      variantPurchased: newReview.variantPurchased,
      comment: newReview.comment.trim(),
      images: newReview.imageUrl.trim() ? [newReview.imageUrl.trim()] : [],
      likes: 1,
      verified: true
    };

    try {
      const res = await api.createReview(reviewPayload);
      if (res && res.success) {
        onReviewAdded(res.review);
        setShowAddModal(false);
        setNewReview({
          userName: '',
          rating: 5,
          variantPurchased: 'Nam - Bản Nâng Cấp Pro - Size 42',
          comment: '',
          imageUrl: ''
        });
      }
    } catch (err) {
      console.error('Error adding review:', err);
      onReviewAdded({
        id: 'rev-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...reviewPayload
      });
      setShowAddModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm">
        
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                Khách Hàng Đánh Giá
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">100% Đánh giá thực tế từ khách mua hàng</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Đánh Giá Sản Phẩm Tấm Lót Giày 4D#
            </h2>
          </div>

          {/* Rating Summary Box */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="text-center pr-4 border-r border-slate-200 dark:border-slate-800">
              <span className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-500">4.9</span>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase mt-0.5">trên 5 sao</p>
              <div className="flex text-amber-400 mt-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-current text-amber-400" />
                ))}
              </div>
            </div>

            <div className="text-xs space-y-1">
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">99%</strong> khách hàng khen ngợi độ êm
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">98%</strong> đánh giá dễ dàng cắt vừa giày
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">Dựa trên 3.840+ lượt mua</p>
            </div>
          </div>
        </div>

        {/* Action bar: Filter tags & Write Review button */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setFilter(opt.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition border ${
                  filter === opt.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow active:scale-95"
          >
            <Plus size={14} />
            <span>Viết Đánh Giá Của Bạn</span>
          </button>
        </div>

        {/* Reviews List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredReviews.length === 0 ? (
            <div className="py-12 text-center text-slate-600 dark:text-slate-400 text-xs">
              Chưa có đánh giá nào thuộc bộ lọc này.
            </div>
          ) : (
            filteredReviews.map(rev => (
              <div key={rev.id} className="py-5 flex flex-col gap-2.5">
                
                {/* User info & rating */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-sky-500 flex items-center justify-center font-bold text-white text-xs uppercase shadow-sm">
                      {rev.userName ? rev.userName.slice(0, 2) : 'KH'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {rev.userName}
                        </span>
                        {rev.verified && (
                          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded-full font-bold flex items-center gap-0.5">
                            <CheckCircle size={10} /> Đã Mua Hàng
                          </span>
                        )}
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} size={11} className="fill-current text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400">
                          {rev.date || '2026-10-30'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    Phân loại: {rev.variantPurchased}
                  </span>
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed mt-1">
                  {rev.comment}
                </p>

                {/* Review Images */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2 mt-1">
                    {rev.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Customer feedback photo"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition cursor-pointer"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://res.cloudinary.com/dldpfpp5/image/upload/v1793624516/Gemini_Generated_Image_kj8pblkj8pblkj8p_xumnxs.png';
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Shop Reply Box */}
                {rev.shopReply && (
                  <div className="mt-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <p className="font-bold text-sky-700 dark:text-sky-400 mb-0.5 flex items-center gap-1">
                      <MessageSquare size={12} /> Phản hồi từ Shop:
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      {rev.shopReply}
                    </p>
                  </div>
                )}

                {/* Helpful count */}
                <div className="flex items-center gap-4 text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                  <button className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition">
                    <ThumbsUp size={12} />
                    <span>Hữu ích ({rev.likes || 1})</span>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* Add Review Modal */}
      {showAddModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 dark:bg-black/85 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-md rounded-2xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Đánh Giá Sản Phẩm Lót Giày 4D#</h3>
            
            <form onSubmit={handleAddReview} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Tên hoặc nickname của bạn *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Tuấn hoặc Ngọc Mai"
                  value={newReview.userName}
                  onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Đánh giá số sao</label>
                <div className="flex gap-2">
                  {[5, 4, 3, 2, 1].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      className={`flex-1 py-1.5 rounded-lg border font-bold flex items-center justify-center gap-1 ${
                        newReview.rating === star
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <span>{star}</span>
                      <Star size={11} className="fill-current text-amber-300" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Phân loại bạn đã mua</label>
                <input
                  type="text"
                  value={newReview.variantPurchased}
                  onChange={(e) => setNewReview(prev => ({ ...prev, variantPurchased: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Nội dung đánh giá *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Chia sẻ cảm nhận về độ êm, đường cắt size, chất liệu PU Spandex..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">URL hình ảnh sản phẩm (Không bắt buộc)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newReview.imageUrl}
                  onChange={(e) => setNewReview(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
