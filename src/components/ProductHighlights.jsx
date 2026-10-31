import React from 'react';
import { Layers, Wind, Footprints, Scissors, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ProductHighlights() {
  const highlights = [
    {
      icon: <Layers className="text-sky-600 dark:text-sky-400" size={24} />,
      title: "Chất Liệu PU Non 4D Đàn Hồi Cao",
      desc: "Lõi đệm cao su non PU thế hệ mới hấp thụ 95% lực chấn động khi tiếp đất, bảo vệ khớp gối và cột sống. Không lo xẹp lún sau 2 năm sử dụng.",
      tag: "Công Nghệ Đệm Khí 4D"
    },
    {
      icon: <Wind className="text-rose-600 dark:text-rose-400" size={24} />,
      title: "Vải Polyester & Spandex Thoáng Khí Tổ Ong",
      desc: "Bề mặt đan lưới siêu vi mô thấm hút mồ hôi siêu tốc, lưu thông không khí 360 độ, kháng khuẩn và khử mùi hôi chân hiệu quả.",
      tag: "Khử Mùi Tối Đa"
    },
    {
      icon: <Footprints className="text-amber-500" size={24} />,
      title: "Công Thái Học U-Cup Nâng Đỡ Vòm Bàn Chân",
      desc: "Thiết kế chén gót sâu (Deep Heel Cup) ôm chắc gót chân, chống lật cổ chân khi chạy nhảy, phân bổ đều trọng lượng toàn bộ bàn chân.",
      tag: "Hỗ Trợ Chống Mỏi"
    },
    {
      icon: <Scissors className="text-emerald-600 dark:text-emerald-400" size={24} />,
      title: "Vạch Cắt Size Chuẩn (Nam 38-47, Nữ 35-41)",
      desc: "Mặt đáy dập sẵn các đường rãnh size tỉ mỉ. Chỉ cần 1 chiếc kéo là bạn có thể dễ dàng cắt vừa mọi đôi sneaker, giày da, giày búp bê.",
      tag: "Vừa Mọi Loại Giày"
    }
  ];

  return (
    <section className="py-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm">
          <Sparkles size={13} /> Vì Sao Hơn 28.000+ Khách Hàng Tin Dùng?
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
          Đột Phá Êm Ái Với Công Nghệ <span className="text-rose-600 dark:text-rose-500">Đệm Khí 4D</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
          Giải pháp toàn diện chấm dứt tình trạng đau mỏi gót chân, thốn lòng bàn chân khi đi bộ hoặc đứng làm việc cả ngày dài.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {highlights.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-5 rounded-2xl transition duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 transition border border-slate-200 dark:border-slate-700 shadow-sm">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {item.tag}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 size={13} />
              <span>Chính Hãng 100%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
